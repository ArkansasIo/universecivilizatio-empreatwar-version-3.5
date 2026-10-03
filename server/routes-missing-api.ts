import type { Express, Request, Response } from "express";
import { db, runTransaction } from "./db";
import { playerStates, users, marketOrders, messages } from "../shared/schema";
import { eq, and, desc } from "drizzle-orm";
import { isAuthenticated, isAdmin } from "./basicAuth";
import { logger, type LogLevel, type LogCategory } from "./logger";
import { storage } from "./storage";

const MARKET_RESOURCES = new Set(["metal", "crystal", "deuterium"]);

function normalizePositiveInt(value: unknown, fallback = 0): number {
  const parsed = Math.floor(Number(value));
  if (!Number.isFinite(parsed)) return fallback;
  return parsed;
}

export function registerMissingApiRoutes(app: Express) {
  // GET /api/market/orders - List market orders
  app.get("/api/market/orders", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const userId = (req as any).session?.userId;
      const { resource, type, limit: queryLimit } = req.query;
      const limitNum = parseInt(queryLimit as string) || 50;

      const conditions = [eq(marketOrders.status, "active")];
      if (resource) conditions.push(eq(marketOrders.resource, resource as string));
      if (type) conditions.push(eq(marketOrders.type, type as string));

      const orders = await db
        .select()
        .from(marketOrders)
        .where(and(...conditions))
        .orderBy(desc(marketOrders.createdAt))
        .limit(limitNum);

      res.json({ success: true, orders });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // POST /api/market/order - Create a market order
  app.post("/api/market/order", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const userId = (req as any).session?.userId;
      if (!userId) return res.status(401).json({ error: "Not authenticated" });

      const { type, resource, amount, pricePerUnit } = req.body;
      if (!type || !resource || !amount || !pricePerUnit) {
        return res.status(400).json({ error: "Missing required fields: type, resource, amount, pricePerUnit" });
      }

      if (!["buy", "sell"].includes(type)) {
        return res.status(400).json({ error: "Type must be 'buy' or 'sell'" });
      }

      if (!MARKET_RESOURCES.has(String(resource))) {
        return res.status(400).json({ error: "Resource must be one of: metal, crystal, deuterium" });
      }

      const normalizedAmount = normalizePositiveInt(amount);
      const normalizedPrice = normalizePositiveInt(pricePerUnit);
      if (normalizedAmount <= 0 || normalizedPrice <= 0) {
        return res.status(400).json({ error: "amount and pricePerUnit must be positive integers" });
      }

      const playerState = await db.query.playerStates.findFirst({
        where: eq(playerStates.userId, userId),
      });

      if (!playerState) return res.status(404).json({ error: "Player not found" });

      const resources = (playerState.resources as any) || {};

      if (type === "sell") {
        const resourceKey = resource === "metal" ? "metal" : resource === "crystal" ? "crystal" : "deuterium";
        if ((resources[resourceKey] || 0) < normalizedAmount) {
          return res.status(400).json({ error: "Insufficient resources" });
        }
        await db.update(playerStates).set({
          resources: { ...resources, [resourceKey]: resources[resourceKey] - normalizedAmount },
          updatedAt: new Date(),
        }).where(eq(playerStates.userId, userId));
      }

      const [order] = await db.insert(marketOrders).values({
        userId,
        type,
        resource,
        amount: normalizedAmount,
        pricePerUnit: normalizedPrice,
        status: "active",
      }).returning();

      res.json({ success: true, order });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // POST /api/market/buy - Buy from market
  app.post("/api/market/buy", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const userId = (req as any).session?.userId;
      if (!userId) return res.status(401).json({ error: "Not authenticated" });

      const { orderId, amount } = req.body;
      if (!orderId || !amount) {
        return res.status(400).json({ error: "Missing orderId or amount" });
      }

      const normalizedAmount = normalizePositiveInt(amount);
      if (normalizedAmount <= 0) {
        return res.status(400).json({ error: "amount must be a positive integer" });
      }

      const fail = (status: number, error: string, details?: Record<string, unknown>) => {
        const routeError = new Error(error) as Error & {
          status: number;
          payload: Record<string, unknown>;
        };
        routeError.status = status;
        routeError.payload = details ? { error, ...details } : { error };
        throw routeError;
      };

      const result = await runTransaction(async (tx) => {
        const [order] = await tx
          .select()
          .from(marketOrders)
          .where(eq(marketOrders.id, orderId))
          .limit(1);

        if (!order || order.status !== "active") {
          fail(404, "Order not found or inactive");
        }

        if (order.type !== "sell") {
          fail(400, "Only sell orders can be purchased with this endpoint");
        }

        if (order.userId === userId) {
          fail(400, "Cannot buy your own order");
        }

        if (normalizedAmount > order.amount) {
          fail(400, "Requested amount exceeds available order quantity", { available: order.amount });
        }

        const [buyerState] = await tx
          .select()
          .from(playerStates)
          .where(eq(playerStates.userId, userId))
          .limit(1);

        if (!buyerState) {
          fail(404, "Player not found");
        }

        const [sellerState] = await tx
          .select()
          .from(playerStates)
          .where(eq(playerStates.userId, order.userId))
          .limit(1);

        if (!sellerState) {
          fail(404, "Seller not found");
        }

        const totalCost = Math.floor(normalizedAmount * order.pricePerUnit);
        const buyerResources = (buyerState.resources as any) || {};
        const buyerCredits = Number(buyerResources.credits ?? buyerResources.metal ?? 0);
        if (buyerCredits < totalCost) {
          fail(400, "Insufficient credits", { required: totalCost, available: buyerCredits });
        }

        const resourceKey =
          order.resource === "metal" ? "metal" : order.resource === "crystal" ? "crystal" : "deuterium";

        const updatedBuyerResources = {
          ...buyerResources,
          credits: Number(buyerResources.credits || 0) - totalCost,
          [resourceKey]: (buyerResources[resourceKey] || 0) + normalizedAmount,
        };

        if (buyerResources.credits === undefined) {
          updatedBuyerResources.metal = (buyerResources.metal || 0) - totalCost;
        }

        const sellerResources = (sellerState.resources as any) || {};
        const updatedSellerResources = {
          ...sellerResources,
          credits: Number(sellerResources.credits || 0) + totalCost,
        };

        if (sellerResources.credits === undefined) {
          updatedSellerResources.metal = Number(sellerResources.metal || 0) + totalCost;
        }

        await tx
          .update(playerStates)
          .set({
            resources: updatedBuyerResources,
            updatedAt: new Date(),
          })
          .where(eq(playerStates.userId, userId));

        await tx
          .update(playerStates)
          .set({
            resources: updatedSellerResources,
            updatedAt: new Date(),
          })
          .where(eq(playerStates.userId, order.userId));

        const remaining = order.amount - normalizedAmount;
        const now = new Date();
        const updatedOrder =
          remaining <= 0
            ? await tx
                .update(marketOrders)
                .set({ status: "completed", amount: 0, completedAt: now })
                .where(
                  and(
                    eq(marketOrders.id, order.id),
                    eq(marketOrders.status, "active"),
                    eq(marketOrders.amount, order.amount),
                  ),
                )
                .returning({ id: marketOrders.id })
            : await tx
                .update(marketOrders)
                .set({ amount: remaining })
                .where(
                  and(
                    eq(marketOrders.id, order.id),
                    eq(marketOrders.status, "active"),
                    eq(marketOrders.amount, order.amount),
                  ),
                )
                .returning({ id: marketOrders.id });

        if (updatedOrder.length === 0) {
          fail(409, "Order changed while processing. Please retry.");
        }

        return {
          success: true,
          cost: totalCost,
          resource: order.resource,
          amount: normalizedAmount,
          remaining: Math.max(0, remaining),
        };
      });

      res.json(result);
    } catch (error: any) {
      if (typeof error?.status === "number") {
        return res.status(error.status).json(error.payload || { error: error.message });
      }
      res.status(500).json({ error: error.message });
    }
  });

  // POST /api/espionage/scan - Scan a target
  app.post("/api/espionage/scan", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const userId = (req as any).session?.userId;
      if (!userId) return res.status(401).json({ error: "Not authenticated" });

      const { targetUserId, scanType } = req.body;
      if (!targetUserId) return res.status(400).json({ error: "targetUserId is required" });

      if (targetUserId === userId) {
        return res.status(400).json({ error: "Cannot scan yourself" });
      }

      const SCAN_COOLDOWN_MS = 60 * 1000;
      const lastScanTime = await storage.getLastScanTime(userId);
      const now = Date.now();
      const timeSinceLastScan = now - lastScanTime;
      if (timeSinceLastScan < SCAN_COOLDOWN_MS) {
        const remainingSeconds = Math.ceil((SCAN_COOLDOWN_MS - timeSinceLastScan) / 1000);
        return res.status(429).json({ error: `Scan cooldown active. Try again in ${remainingSeconds} seconds.` });
      }

      const targetState = await db.query.playerStates.findFirst({
        where: eq(playerStates.userId, targetUserId),
      });

      if (!targetState) return res.status(404).json({ error: "Target not found" });

      const playerState = await db.query.playerStates.findFirst({
        where: eq(playerStates.userId, userId),
      });

      if (!playerState) return res.status(404).json({ error: "Player not found" });

      const research = (playerState.research as any) || {};
      const scanLevel = research.espionageTech || 1;
      const targetResearch = (targetState.research as any) || {};
      const targetCounterIntel = targetResearch.counterIntelligence || 1;

      const baseSuccessRate = 0.65 + scanLevel * 0.05;
      const targetDefensePenalty = targetCounterIntel * 0.02;
      const successRate = Math.max(0.1, Math.min(0.95, baseSuccessRate - targetDefensePenalty));
      const success = Math.random() < successRate;

      const detectionChance = success
        ? Math.max(0.05, 0.30 - scanLevel * 0.02 - targetCounterIntel * 0.01)
        : Math.min(0.80, 0.40 + targetCounterIntel * 0.03);
      const detected = Math.random() < detectionChance;

      const targetResources = (targetState.resources as any) || {};
      const scanResult: any = {
        scanType: scanType || "basic",
        success,
        detected,
        detectionChance: Math.round(detectionChance * 100),
        spyLevel: scanLevel,
        targetDefenseLevel: targetCounterIntel,
      };

      if (success) {
        scanResult.resources = {
          metal: Math.round(targetResources.metal * (0.8 + Math.random() * 0.2)),
          crystal: Math.round(targetResources.crystal * (0.8 + Math.random() * 0.2)),
          deuterium: Math.round(targetResources.deuterium * (0.8 + Math.random() * 0.2)),
        };
        if (scanType === "full") {
          scanResult.buildings = targetState.buildings;
          scanResult.units = targetState.units;
        }
      }

      await storage.createEspionageScan({
        playerId: userId,
        targetId: targetUserId,
        scanType: scanType || "basic",
        success,
        detected,
        scanData: scanResult,
      });

      if (detected) {
        const [attackerUser] = await db.select({ username: users.username })
          .from(users).where(eq(users.id, userId)).limit(1);

        const targetTravelLog = Array.isArray(targetState.travelLog) ? [...(targetState.travelLog as any[])] : [];
        targetTravelLog.unshift({
          id: `counterintel_scan_${Date.now()}`,
          type: "counter-intelligence",
          createdAt: new Date().toISOString(),
          attackerUserId: userId,
          attackerName: attackerUser?.username || "Unknown Commander",
          detected: true,
          scanType: scanType || "basic",
          summary: `Detected espionage scan from ${attackerUser?.username || "an unknown commander"}.`,
        });

        await db.update(playerStates)
          .set({ travelLog: targetTravelLog.slice(0, 50), updatedAt: new Date() })
          .where(eq(playerStates.userId, targetUserId));

        await db.insert(messages).values({
          fromUserId: userId,
          toUserId: targetUserId,
          from: "Counter-Intelligence Network",
          to: targetState.planetName || "Commander",
          subject: "Espionage Scan Detected",
          body: `${attackerUser?.username || "An unknown commander"} attempted to scan your empire. Counter-intelligence systems detected the probe.${success ? " Some intelligence may have been gathered." : " The scan was blocked."}`,
          type: "espionage",
        });
      }

      res.json({ success: true, scan: scanResult });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // POST /api/planets/colonize - Colonize a planet
  app.post("/api/planets/colonize", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const userId = (req as any).session?.userId;
      if (!userId) return res.status(401).json({ error: "Not authenticated" });

      const { planetId, sectorId } = req.body;
      if (!planetId) return res.status(400).json({ error: "planetId is required" });

      const playerState = await db.query.playerStates.findFirst({
        where: eq(playerStates.userId, userId),
      });

      if (!playerState) return res.status(404).json({ error: "Player not found" });

      const resources = (playerState.resources as any) || {};
      const colonizeCost = { metal: 5000, crystal: 2000, deuterium: 1000 };

      if (
        (resources.metal || 0) < colonizeCost.metal ||
        (resources.crystal || 0) < colonizeCost.crystal ||
        (resources.deuterium || 0) < colonizeCost.deuterium
      ) {
        return res.status(400).json({ error: "Insufficient resources for colonization", required: colonizeCost });
      }

      await db.update(playerStates).set({
        resources: {
          ...resources,
          metal: (resources.metal || 0) - colonizeCost.metal,
          crystal: (resources.crystal || 0) - colonizeCost.crystal,
          deuterium: (resources.deuterium || 0) - colonizeCost.deuterium,
        },
        updatedAt: new Date(),
      }).where(eq(playerStates.userId, userId));

      const colonyName = `Colony ${planetId}`;
      const colony = await storage.createPlayerColony({
        playerId: userId,
        planetId: typeof planetId === 'string' ? parseInt(planetId) || 0 : planetId,
        colonyName,
        colonyType: "standard",
        colonyLevel: 1,
      });

      res.json({ success: true, message: `Planet ${planetId} colonized`, cost: colonizeCost, colony });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // POST /api/planets/extract - Extract resources from a planet
  app.post("/api/planets/extract", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const userId = (req as any).session?.userId;
      if (!userId) return res.status(401).json({ error: "Not authenticated" });

      const { planetId, resource, amount } = req.body;
      if (!planetId || !resource || !amount) {
        return res.status(400).json({ error: "planetId, resource, and amount are required" });
      }

      if (!MARKET_RESOURCES.has(String(resource))) {
        return res.status(400).json({ error: "resource must be one of: metal, crystal, deuterium" });
      }

      const normalizedAmount = normalizePositiveInt(amount);
      if (normalizedAmount <= 0) {
        return res.status(400).json({ error: "amount must be a positive integer" });
      }

      const playerState = await db.query.playerStates.findFirst({
        where: eq(playerStates.userId, userId),
      });

      if (!playerState) return res.status(404).json({ error: "Player not found" });

      const resources = (playerState.resources as any) || {};
      const resourceKey = resource === "metal" ? "metal" : resource === "crystal" ? "crystal" : "deuterium";
      const extracted = Math.min(normalizedAmount, 1000);

      await db.update(playerStates).set({
        resources: { ...resources, [resourceKey]: (resources[resourceKey] || 0) + extracted },
        updatedAt: new Date(),
      }).where(eq(playerStates.userId, userId));

      res.json({ success: true, extracted, resource });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // GET /api/players - List players
  app.get("/api/players", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const limit = parseInt(req.query.limit as string) || 50;
      const offset = parseInt(req.query.offset as string) || 0;

      const players = await db
        .select({
          id: users.id,
          username: users.username,
          empireLevel: playerStates.empireLevel,
          tier: playerStates.tier,
          createdAt: playerStates.createdAt,
        })
        .from(playerStates)
        .innerJoin(users, eq(playerStates.userId, users.id))
        .orderBy(desc(playerStates.empireLevel))
        .limit(limit)
        .offset(offset);

      res.json({ success: true, players });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // GET /api/ships - Get player ships/fleet
  app.get("/api/ships", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const userId = (req as any).session?.userId;
      if (!userId) return res.status(401).json({ error: "Not authenticated" });

      const playerState = await db.query.playerStates.findFirst({
        where: eq(playerStates.userId, userId),
      });

      if (!playerState) return res.status(404).json({ error: "Player not found" });

      const units = (playerState.units as any) || {};
      const buildings = (playerState.buildings as any) || {};

      res.json({
        success: true,
        ships: units,
        shipyard: { level: buildings.shipyard || 0, active: buildings.shipyard > 0 },
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // GET /api/logs - Server logs (admin only)
  app.get("/api/logs", isAuthenticated, isAdmin, async (req: Request, res: Response) => {
    try {
      const level = req.query.level as LogLevel | undefined;
      const category = req.query.category as LogCategory | undefined;
      const limit = Math.min(parseInt(req.query.limit as string) || 100, 500);
      const offset = parseInt(req.query.offset as string) || 0;

      const allLogs = logger.getLogs(level, category);
      const total = allLogs.length;
      const logs = allLogs.slice(offset, offset + limit);

      const stats = logger.getStats();

      res.json({
        success: true,
        logs,
        total,
        offset,
        limit,
        stats,
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // GET /api/tech-tree - Get technology tree
  app.get("/api/tech-tree", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const userId = (req as any).session?.userId;
      if (!userId) return res.status(401).json({ error: "Not authenticated" });

      const playerState = await db.query.playerStates.findFirst({
        where: eq(playerStates.userId, userId),
      });

      if (!playerState) return res.status(404).json({ error: "Player not found" });

      const research = (playerState.research as any) || {};

      res.json({
        success: true,
        tree: research,
        totalTechs: Object.keys(research).length,
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });
}
