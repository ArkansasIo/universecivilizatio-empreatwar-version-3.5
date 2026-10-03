import { Request, Response } from "express";
import { storage } from "./storage";
import {
  getMegastructureTemplateCatalog,
  constructMegastructureForPlayer,
  upgradeMegastructureLevelForPlayer,
  upgradeMegastructureTierForPlayer,
  setMegastructureOperationalState,
} from "./services/megastructureService";
import {
  getMegastructureDetailForPlayer,
  upgradeMegastructureSubsystemForPlayer,
  recomputeMegastructureProductionForPlayer,
  getDysonProgramSummary,
  getMegastructurePendingAccrual,
  tickMegastructureResourcesForPlayer,
} from "./services/megastructureSubsystemService";
import {
  installMegastructureModuleForPlayer,
  uninstallMegastructureModuleForPlayer,
  attachMegastructureModulesToDetail,
} from "./services/megastructureModuleService";

const isAuthenticated = (req: Request, res: Response, next: any) => {
  if (!req.session.userId) {
    return res.status(401).json({ message: "Not authenticated" });
  }
  next();
};

const getUserId = (req: Request): string => req.session.userId || "";

export function registerMegastructureRoutes(app: any) {
  app.get("/api/megastructures/templates", async (_req: Request, res: Response) => {
    try {
      const catalog = await getMegastructureTemplateCatalog();
      res.json({ categories: catalog });
    } catch (error: any) {
      res.status(500).json({ message: error?.message || "Failed to load megastructure templates" });
    }
  });

  app.get("/api/megastructures/player", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const userId = getUserId(req);
      const structures = await storage.getPlayerMegaStructures(userId);
      res.json({ structures });
    } catch (error: any) {
      res.status(500).json({ message: error?.message || "Failed to load player megastructures" });
    }
  });

  app.get("/api/megastructures/dyson", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const userId = getUserId(req);
      const summary = await getDysonProgramSummary(userId);
      res.json(summary);
    } catch (error: any) {
      res.status(500).json({ message: error?.message || "Failed to load Dyson program summary" });
    }
  });

  app.get("/api/megastructures/:id", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const userId = getUserId(req);
      const result = await getMegastructureDetailForPlayer(userId, req.params.id);
      if (!result.success) {
        return res.status(404).json({ message: "Megastructure not found" });
      }
      const withModules = attachMegastructureModulesToDetail(result as any, (result as any).structure);
      const accrual = getMegastructurePendingAccrual((result as any).structure);
      res.json({ ...withModules, accrual });
    } catch (error: any) {
      res.status(500).json({ message: error?.message || "Failed to load megastructure detail" });
    }
  });

  app.post("/api/megastructures/construct", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const userId = getUserId(req);
      const { templateId, name, level, tier, coordinates } = req.body || {};

      if (!templateId || typeof templateId !== "string") {
        return res.status(400).json({ message: "templateId is required" });
      }

      const result = await constructMegastructureForPlayer(userId, {
        templateId,
        name,
        level,
        tier,
        coordinates,
      });

      if (!result.success) {
        return res.status(400).json(result);
      }

      res.status(201).json(result);
    } catch (error: any) {
      res.status(500).json({ message: error?.message || "Failed to construct megastructure" });
    }
  });

  app.post("/api/megastructures/:id/upgrade-level", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const userId = getUserId(req);
      const structureId = req.params.id;
      const levels = Number(req.body?.levels ?? 1);

      const result = await upgradeMegastructureLevelForPlayer(userId, structureId, levels);
      if (!result.success) {
        return res.status(400).json(result);
      }

      res.json(result);
    } catch (error: any) {
      res.status(500).json({ message: error?.message || "Failed to upgrade megastructure level" });
    }
  });

  app.post("/api/megastructures/:id/upgrade-tier", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const userId = getUserId(req);
      const structureId = req.params.id;
      const tiers = Number(req.body?.tiers ?? 1);

      const result = await upgradeMegastructureTierForPlayer(userId, structureId, tiers);
      if (!result.success) {
        return res.status(400).json(result);
      }

      res.json(result);
    } catch (error: any) {
      res.status(500).json({ message: error?.message || "Failed to upgrade megastructure tier" });
    }
  });

  app.post("/api/megastructures/:id/operational", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const userId = getUserId(req);
      const structureId = req.params.id;
      const isOperational = Boolean(req.body?.isOperational);

      const updated = await setMegastructureOperationalState(userId, structureId, isOperational);
      res.json({ success: true, structure: updated });
    } catch (error: any) {
      res.status(500).json({ message: error?.message || "Failed to update operational state" });
    }
  });

  app.post("/api/megastructures/:id/subsystems/:subsystemId/upgrade", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const userId = getUserId(req);
      const result = await upgradeMegastructureSubsystemForPlayer(userId, req.params.id, req.params.subsystemId);
      if (!result.success) {
        return res.status(400).json(result);
      }
      res.json(result);
    } catch (error: any) {
      res.status(500).json({ message: error?.message || "Failed to upgrade megastructure subsystem" });
    }
  });

  app.post("/api/megastructures/:id/production/recompute", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const userId = getUserId(req);
      const result = await recomputeMegastructureProductionForPlayer(userId, req.params.id);
      if (!result.success) {
        return res.status(404).json({ message: "Megastructure not found" });
      }
      res.json(result);
    } catch (error: any) {
      res.status(500).json({ message: error?.message || "Failed to recompute production" });
    }
  });

  app.post("/api/megastructures/:id/tick", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const userId = getUserId(req);
      const result = await tickMegastructureResourcesForPlayer(userId, req.params.id);
      if (!result.success) {
        return res.status(400).json(result);
      }
      res.json(result);
    } catch (error: any) {
      res.status(500).json({ message: error?.message || "Failed to accrue megastructure production" });
    }
  });

  app.post("/api/megastructures/:id/modules/install", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const userId = getUserId(req);
      const moduleId = req.body?.moduleId;
      if (!moduleId || typeof moduleId !== "string") {
        return res.status(400).json({ message: "moduleId is required" });
      }
      const result = await installMegastructureModuleForPlayer(userId, req.params.id, moduleId);
      if (!result.success) {
        return res.status(400).json(result);
      }
      res.json(result);
    } catch (error: any) {
      res.status(500).json({ message: error?.message || "Failed to install megastructure module" });
    }
  });

  app.post("/api/megastructures/:id/modules/:moduleId/uninstall", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const userId = getUserId(req);
      const result = await uninstallMegastructureModuleForPlayer(userId, req.params.id, req.params.moduleId);
      if (!result.success) {
        return res.status(400).json(result);
      }
      res.json(result);
    } catch (error: any) {
      res.status(500).json({ message: error?.message || "Failed to uninstall megastructure module" });
    }
  });
}
