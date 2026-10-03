import GameLayout from "@/components/layout/GameLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ArrowLeft,
  BarChart3,
  Battery,
  Boxes,
  Cog,
  FlaskConical,
  Hammer,
  HeartPulse,
  Layers,
  Orbit,
  Power,
  Rocket,
  Settings2,
  Shield,
  Sparkles,
  Swords,
  TrendingUp,
  Users,
  Zap,
} from "lucide-react";
import { useState } from "react";
import type { ReactNode } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Link, useLocation, useRoute } from "wouter";
import { useGame } from "@/lib/gameContext";
import {
  fetchMegastructureDetail,
  recomputeMegastructureProductionApi,
  tickMegastructureResourcesApi,
  installMegastructureModuleApi,
  uninstallMegastructureModuleApi,
  upgradeMegastructureLevelApi,
  upgradeMegastructureTierApi,
  setMegastructureOperationalApi,
  EFFECT_META,
  MODULE_EFFECT_META,
  type MegastructureDetailResponse,
  type MegastructureModuleView,
} from "@/lib/megastructureSubsystems";
import { getMegaStructureTemplateById, calculateConstructionCost } from "@/lib/megaStructures";
import { cn } from "@/lib/utils";
import { BACKGROUND_ASSETS } from "@shared/config";

const TEMP_THEME_IMAGE = "/theme-temp.png";

function StatCell({ label, value, icon, accent }: { label: string; value: string; icon: ReactNode; accent: string }) {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-slate-500">
          <span className={accent}>{icon}</span> {label}
        </div>
        <div className="mt-1 text-xl font-bold text-slate-900">{value}</div>
      </CardContent>
    </Card>
  );
}

export default function MegaStructureDetail() {
  const [, setLocation] = useLocation();
  const [, params] = useRoute("/megastructures/:id");
  const structureId = params?.id || "";

  const { resources } = useGame();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("overview");
  const [isToggling, setIsToggling] = useState(false);
  const [isRecomputing, setIsRecomputing] = useState(false);
  const [isTicking, setIsTicking] = useState(false);
  const [isUpgradingLevel, setIsUpgradingLevel] = useState(false);
  const [isUpgradingTier, setIsUpgradingTier] = useState(false);
  const [pendingModule, setPendingModule] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  const { data, isLoading, isError } = useQuery<MegastructureDetailResponse>({
    queryKey: ["megastructure-detail", structureId],
    queryFn: () => fetchMegastructureDetail(structureId),
    enabled: Boolean(structureId),
    staleTime: 15_000,
  });

  const templateFallback = getMegaStructureTemplateById(structureId);

  if (isLoading) {
    return (
      <GameLayout>
        <div className="flex items-center justify-center py-24 text-slate-500">Loading megastructure…</div>
      </GameLayout>
    );
  }

  if (isError || !data?.success) {
    if (templateFallback) {
      const fallbackCost = calculateConstructionCost(templateFallback);
      return (
        <GameLayout>
          <div className="space-y-6">
            <Link href="/megastructures" className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-900">
              <ArrowLeft className="w-4 h-4" /> Back to Megastructures
            </Link>
            <Card className="border-amber-200 bg-amber-50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-amber-600" /> {templateFallback.name}
                  <Badge variant="outline" className="bg-amber-100 text-amber-800">Template Preview</Badge>
                </CardTitle>
                <CardDescription>
                  You do not own this structure yet. Review its template and begin construction from the Megastructures hub.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-slate-700">{templateFallback.description}</p>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                  <StatCell label="Type" value={templateFallback.type.replace(/_/g, " ")} icon={<Layers className="w-3.5 h-3.5" />} accent="text-slate-600" />
                  <StatCell label="Tier" value={String(templateFallback.tier)} icon={<TrendingUp className="w-3.5 h-3.5" />} accent="text-blue-600" />
                  <StatCell label="Function" value={templateFallback.specialAbility || "—"} icon={<Cog className="w-3.5 h-3.5" />} accent="text-violet-600" />
                  <StatCell label="Size" value={templateFallback.size} icon={<Orbit className="w-3.5 h-3.5" />} accent="text-emerald-600" />
                </div>
                <div className="rounded-lg border border-amber-200 bg-white p-3 text-sm">
                  <div className="mb-2 text-xs uppercase tracking-widest text-amber-700">Construction Cost</div>
                  <div className="space-y-1 text-slate-700">
                    <div className="flex justify-between"><span>Metal</span><span>{fallbackCost.metal.toLocaleString()}</span></div>
                    <div className="flex justify-between"><span>Crystal</span><span>{fallbackCost.crystal.toLocaleString()}</span></div>
                    <div className="flex justify-between"><span>Deuterium</span><span>{fallbackCost.deuterium.toLocaleString()}</span></div>
                  </div>
                </div>
                <Button className="font-orbitron tracking-wider" onClick={() => setLocation("/megastructures")}>
                  Go to Megastructures Hub
                </Button>
              </CardContent>
            </Card>
          </div>
        </GameLayout>
      );
    }

    return (
      <GameLayout>
        <div className="flex flex-col items-center justify-center py-24 text-slate-500">
          <p>Megastructure not found.</p>
          <Link href="/megastructures" className="mt-2 text-sm text-blue-600 hover:underline">Back to Megastructures</Link>
        </div>
      </GameLayout>
    );
  }

  const structure = data.structure;
  const template = data.template;
  const subsystems = data.subsystems;
  const production = data.production;

  const resourceProduction = production?.resourceProduction || structure.resourceProduction || {};
  const resourceStorage = production?.resourceStorage || structure.resourceStorage || {};
  const attributes = structure.attributes || {};
  const subAttributes = structure.subAttributes || {};
  const gameMechanics = structure.gameMechanics || {};

  const operational = Boolean(structure.isOperational);

  const toggleOperational = async () => {
    setIsToggling(true);
    setActionError(null);
    try {
      await setMegastructureOperationalApi(structure.id, !operational);
      await queryClient.invalidateQueries({ queryKey: ["megastructure-detail", structureId] });
    } catch (error: any) {
      setActionError(error?.message || "Failed to update operational state");
    } finally {
      setIsToggling(false);
    }
  };

  const handleRecompute = async () => {
    setIsRecomputing(true);
    setActionError(null);
    try {
      await recomputeMegastructureProductionApi(structure.id);
      await queryClient.invalidateQueries({ queryKey: ["megastructure-detail", structureId] });
    } catch (error: any) {
      setActionError(error?.message || "Recompute failed");
    } finally {
      setIsRecomputing(false);
    }
  };

  const handleTick = async () => {
    setIsTicking(true);
    setActionError(null);
    try {
      await tickMegastructureResourcesApi(structure.id);
      await queryClient.invalidateQueries({ queryKey: ["megastructure-detail", structureId] });
    } catch (error: any) {
      setActionError(error?.message || "Accrual failed");
    } finally {
      setIsTicking(false);
    }
  };

  const handleUpgradeLevel = async () => {
    setIsUpgradingLevel(true);
    setActionError(null);
    try {
      await upgradeMegastructureLevelApi(structure.id, 1);
      await queryClient.invalidateQueries({ queryKey: ["megastructure-detail", structureId] });
    } catch (error: any) {
      setActionError(error?.message || "Level upgrade failed");
    } finally {
      setIsUpgradingLevel(false);
    }
  };

  const handleUpgradeTier = async () => {
    setIsUpgradingTier(true);
    setActionError(null);
    try {
      await upgradeMegastructureTierApi(structure.id, 1);
      await queryClient.invalidateQueries({ queryKey: ["megastructure-detail", structureId] });
    } catch (error: any) {
      setActionError(error?.message || "Tier upgrade failed");
    } finally {
      setIsUpgradingTier(false);
    }
  };

  const handleInstallModule = async (moduleId: string) => {
    setPendingModule(moduleId);
    setActionError(null);
    try {
      await installMegastructureModuleApi(structure.id, moduleId);
      await queryClient.invalidateQueries({ queryKey: ["megastructure-detail", structureId] });
    } catch (error: any) {
      setActionError(error?.message || "Module install failed");
    } finally {
      setPendingModule(null);
    }
  };

  const handleUninstallModule = async (moduleId: string) => {
    setPendingModule(moduleId);
    setActionError(null);
    try {
      await uninstallMegastructureModuleApi(structure.id, moduleId);
      await queryClient.invalidateQueries({ queryKey: ["megastructure-detail", structureId] });
    } catch (error: any) {
      setActionError(error?.message || "Module uninstall failed");
    } finally {
      setPendingModule(null);
    }
  };

  return (
    <GameLayout>
      <div className="relative overflow-hidden rounded-2xl border border-slate-200 shadow-sm bg-cover bg-center mb-6" style={{ backgroundImage: `linear-gradient(rgba(15,23,42,0.78), rgba(15,23,42,0.92)), url(${BACKGROUND_ASSETS.NEBULA.path})` }}>
        <div className="p-6 sm:p-8">
          <Link href="/megastructures" className="inline-flex items-center gap-2 text-slate-300 text-sm hover:text-white mb-4">
            <ArrowLeft className="w-4 h-4" /> Megastructures
          </Link>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-white/10 bg-white/5">
                <Sparkles className="h-8 w-8 text-rose-300" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl font-orbitron font-bold text-white">{structure.name}</h1>
                  <Badge className={operational ? "bg-emerald-500 text-white" : "bg-slate-600 text-white"}>
                    {operational ? "OPERATIONAL" : "IDLE"}
                  </Badge>
                </div>
                <p className="text-slate-300 text-sm mt-1 capitalize">
                  {(structure.structureType || "").replace(/[_-]/g, " ")} · Level {structure.level} · {structure.coordinates}
                </p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button variant="secondary" size="sm" onClick={handleUpgradeLevel} disabled={isUpgradingLevel}>
                <TrendingUp className="w-4 h-4 mr-1" /> Level Up
              </Button>
              <Button variant="secondary" size="sm" onClick={handleUpgradeTier} disabled={isUpgradingTier}>
                <Sparkles className="w-4 h-4 mr-1" /> Tier Up
              </Button>
              <Button variant="secondary" size="sm" onClick={toggleOperational} disabled={isToggling}>
                <Power className="w-4 h-4 mr-1" /> {operational ? "Deactivate" : "Activate"}
              </Button>
              <Button variant="secondary" size="sm" onClick={handleRecompute} disabled={isRecomputing}>
                <TrendingUp className="w-4 h-4 mr-1" /> Recompute Production
              </Button>
            </div>
          </div>
          {actionError && (
            <div className="mt-4 rounded-lg border border-rose-200 bg-rose-50 px-4 py-2 text-sm text-rose-700">
              {actionError}
            </div>
          )}
        </div>
      </div>

      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4 xl:grid-cols-8">
          <StatCell label="Power" value={(structure.power ?? 0).toLocaleString()} icon={<Zap className="w-3.5 h-3.5" />} accent="text-yellow-600" />
          <StatCell label="Efficiency" value={`${Math.round(structure.efficiency ?? 0)}%`} icon={<Settings2 className="w-3.5 h-3.5" />} accent="text-emerald-600" />
          <StatCell label="Health" value={`${Math.round((structure.health ?? 0) / 1000)}k`} icon={<HeartPulse className="w-3.5 h-3.5" />} accent="text-rose-600" />
          <StatCell label="Attack" value={(structure.attack ?? 0).toLocaleString()} icon={<Swords className="w-3.5 h-3.5" />} accent="text-red-600" />
          <StatCell label="Defense" value={(structure.defense ?? 0).toLocaleString()} icon={<Shield className="w-3.5 h-3.5" />} accent="text-blue-600" />
          <StatCell label="Population" value={(structure.population ?? 0).toLocaleString()} icon={<Users className="w-3.5 h-3.5" />} accent="text-sky-600" />
          <StatCell label="Engineers" value={(structure.engineers ?? 0).toLocaleString()} icon={<Cog className="w-3.5 h-3.5" />} accent="text-violet-600" />
          <StatCell label="Scientists" value={(structure.scientists ?? 0).toLocaleString()} icon={<FlaskConical className="w-3.5 h-3.5" />} accent="text-indigo-600" />
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-5 w-full">
            <TabsTrigger value="overview"><Layers className="w-4 h-4 mr-1" /> Overview</TabsTrigger>
            <TabsTrigger value="subsystems"><Cog className="w-4 h-4 mr-1" /> Sub-systems ({subsystems.length})</TabsTrigger>
            <TabsTrigger value="modules"><Boxes className="w-4 h-4 mr-1" /> Modules ({data.modules?.installedCount ?? 0}/{data.modules?.slots ?? 0})</TabsTrigger>
            <TabsTrigger value="production"><BarChart3 className="w-4 h-4 mr-1" /> Production</TabsTrigger>
            <TabsTrigger value="crew"><Users className="w-4 h-4 mr-1" /> Crew & Systems</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-4 space-y-4">
            <Card className="bg-gradient-to-br from-indigo-50 to-indigo-100 border-indigo-200">
              <CardHeader>
                <CardTitle className="text-lg text-indigo-900">{template?.primaryFunction || "Megastructure Operations"}</CardTitle>
                <CardDescription className="text-indigo-700">
                  {structure.description || template?.description || "A colossal empire-scale structure."}
                </CardDescription>
              </CardHeader>
              <CardContent className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <div className="rounded-lg border border-indigo-200 bg-white p-4">
                  <div className="text-xs uppercase tracking-widest text-indigo-500">Primary Function</div>
                  <div className="mt-1 text-sm font-medium text-indigo-900">{template?.primaryFunction || "—"}</div>
                  {template && template.secondaryFunctions.length > 0 && (
                    <div className="mt-2 text-xs text-indigo-700">{template.secondaryFunctions.join(" · ")}</div>
                  )}
                </div>
                <div className="rounded-lg border border-indigo-200 bg-white p-4">
                  <div className="text-xs uppercase tracking-widest text-indigo-500">Attributes</div>
                  <div className="mt-1 grid grid-cols-2 gap-1 text-sm text-indigo-900">
                    <span>Durability</span><span className="text-right font-mono">{attributes.durability ?? 0}</span>
                    <span>Reliability</span><span className="text-right font-mono">{attributes.reliability ?? 0}</span>
                    <span>Adaptability</span><span className="text-right font-mono">{attributes.adaptability ?? 0}</span>
                    <span>Scalability</span><span className="text-right font-mono">{attributes.scalability ?? 0}</span>
                  </div>
                </div>
                <div className="rounded-lg border border-indigo-200 bg-white p-4">
                  <div className="text-xs uppercase tracking-widest text-indigo-500">Sub-attributes</div>
                  <div className="mt-1 grid grid-cols-2 gap-1 text-sm text-indigo-900">
                    <span>Maintenance</span><span className="text-right font-mono">{(subAttributes.maintenanceCost ?? 0).toLocaleString()}</span>
                    <span>Power Use</span><span className="text-right font-mono">{(subAttributes.powerConsumption ?? 0).toLocaleString()}</span>
                    <span>Repair Rate</span><span className="text-right font-mono">{(subAttributes.repairRate ?? 0).toLocaleString()}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><Boxes className="w-5 h-5" /> Game Mechanics</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-wrap gap-2">
                {(Object.entries(gameMechanics) as Array<[string, unknown]>)
                  .filter(([key]) => typeof gameMechanics[key] === "boolean")
                  .map(([key, value]) => (
                    <Badge key={key} variant={value ? "default" : "outline"} className="capitalize">
                      {value ? key : `${key}: no`}
                    </Badge>
                  ))}
                {(gameMechanics.effects || []).length > 0 && (
                  <Badge variant="outline" className="capitalize text-violet-700 bg-violet-50">
                    Effects: {(gameMechanics.effects as string[]).join(", ")}
                  </Badge>
                )}
              </CardContent>
            </Card>

            {template?.lore || structure.about ? (
              <Card>
                <CardHeader>
                  <CardTitle className="text-base text-slate-500 uppercase tracking-widest">Lore</CardTitle>
                </CardHeader>
                <CardContent className="text-sm italic text-slate-600">
                  {structure.about || template?.lore}
                </CardContent>
              </Card>
            ) : null}
          </TabsContent>

          <TabsContent value="subsystems" className="mt-4 space-y-4">
            <Card className="border-slate-200 bg-slate-50">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Installed Sub-systems</CardTitle>
                <CardDescription>
                  Detail systems installed inside this structure. Each has its own level, bonus, sub-functions, and upgrade cost. Click a sub-system to open its full sub-page.
                </CardDescription>
              </CardHeader>
              <CardContent className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                {subsystems.map((subsystem) => {
                  const meta = EFFECT_META[subsystem.effect];
                  return (
                    <Card key={subsystem.id} className="border-slate-200 bg-white shadow-sm">
                      <CardHeader className="pb-2">
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full border border-primary/20 bg-primary/10">
                              <span className="text-lg">{meta.icon}</span>
                            </div>
                            <div>
                              <CardTitle className="text-base text-slate-900">{subsystem.name}</CardTitle>
                              <div className="text-xs uppercase tracking-[0.18em] text-slate-500">
                                Lvl {subsystem.level}/{subsystem.maxLevel} · {subsystem.category}
                              </div>
                            </div>
                          </div>
                          <Badge variant="outline" className="bg-slate-50 text-slate-700">{meta.label}</Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <p className="text-sm text-slate-600">{subsystem.description}</p>
                        <Progress value={subsystem.maxed ? 100 : (subsystem.level / subsystem.maxLevel) * 100} className="h-2" />
                        <div className="flex justify-between text-xs text-slate-500">
                          <span>Current: <span className="font-semibold text-emerald-700">{subsystem.contributionLabel}</span></span>
                          <span>Next: <span className="font-semibold text-blue-700">{subsystem.nextBonus}</span></span>
                        </div>
                        <Button size="sm" variant="outline" className="w-full" asChild>
                          <Link href={`/megastructures/${structure.id}/subsystems/${subsystem.id}`}>
                            Open Sub-page
                          </Link>
                        </Button>
                      </CardContent>
                    </Card>
                  );
                })}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="modules" className="mt-4 space-y-4">
            <Card className="border-slate-200 bg-slate-50">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2"><Boxes className="w-5 h-5" /> Installed Modules</CardTitle>
                    <CardDescription>
                      {data.modules?.installedCount ?? 0} of {data.modules?.slots ?? 0} module sockets in use. Modules boost production, storage, research, or defense.
                    </CardDescription>
                  </div>
                  <Badge variant="outline" className="bg-white text-slate-700">
                    Sockets {data.modules?.installedCount ?? 0}/{data.modules?.slots ?? 0}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                {(data.modules?.installed ?? []).length === 0 ? (
                  <div className="rounded-lg border border-dashed border-slate-300 bg-white p-6 text-center text-sm text-slate-500">
                    No modules installed. Install one from the catalog below to boost this structure.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                    {(data.modules?.installed ?? []).map((module) => {
                      const catalogEntry = data.modules?.catalog?.find((item) => item.id === module.id);
                      const meta = MODULE_EFFECT_META[catalogEntry?.effect as keyof typeof MODULE_EFFECT_META] ?? MODULE_EFFECT_META.energy;
                      return (
                        <div key={module.instanceId} className="flex items-center justify-between rounded-lg border border-slate-200 bg-white px-4 py-3">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className={meta.colorClass}>{meta.icon}</span>
                              <span className="text-sm font-semibold text-slate-900">{catalogEntry?.name ?? module.id}</span>
                            </div>
                            <div className="mt-1 text-xs text-slate-500 capitalize">
                              {catalogEntry?.effectLabel ?? module.id} · installed {new Date(module.installedAt).toLocaleDateString()}
                            </div>
                          </div>
                          <Button size="sm" variant="outline" className="text-rose-600 hover:bg-rose-50" disabled={pendingModule !== null} onClick={() => handleUninstallModule(module.id)}>
                            Uninstall
                          </Button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><Boxes className="w-5 h-5" /> Module Catalog</CardTitle>
                <CardDescription>
                  Each module occupies one socket, has a primary function and sub-functions, and may be installed up to its max instance count.
                </CardDescription>
              </CardHeader>
              <CardContent className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                {(data.modules?.catalog ?? []).map((module: MegastructureModuleView) => {
                  const meta = MODULE_EFFECT_META[module.effect];
                  const atMax = module.installed >= module.maxInstances;
                  const noSlots = (data.modules?.installedCount ?? 0) >= (data.modules?.slots ?? 0);
                  const installDisabled = module.locked || atMax || noSlots || pendingModule !== null;
                  return (
                    <Card key={module.id} className="border-slate-200 bg-white shadow-sm">
                      <CardHeader className="pb-2">
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full border border-primary/20 bg-primary/10">
                              <span className="text-lg">{meta.icon}</span>
                            </div>
                            <div>
                              <CardTitle className="text-base text-slate-900">{module.name}</CardTitle>
                              <div className="text-xs uppercase tracking-[0.18em] text-slate-500">
                                {module.category} · Installed {module.installed}/{module.maxInstances}
                              </div>
                            </div>
                          </div>
                          <Badge variant="outline" className="bg-slate-50 text-slate-700">{meta.label}</Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <p className="text-sm text-slate-600">{module.description}</p>
                        <div className="flex items-center justify-between text-xs text-slate-500">
                          <span>Effect</span>
                          <span className="font-semibold text-emerald-700">
                            {module.effect === "defense"
                              ? `+${(module.effectValue * 1000).toLocaleString()} rating`
                              : `+${module.effectValue}% ${meta.label.toLowerCase()}`}
                          </span>
                        </div>
                        <div className="rounded-lg border border-slate-200 bg-slate-50 p-2 text-xs text-slate-500">
                          <span className="font-semibold text-slate-600">Sub-functions:</span> {module.subFunctions.slice(0, 2).join(" · ")}
                          {module.subFunctions.length > 2 ? " …" : ""}
                        </div>
                        <Button
                          size="sm"
                          className="w-full"
                          disabled={installDisabled}
                          onClick={() => handleInstallModule(module.id)}
                        >
                          {pendingModule === module.id
                            ? "Installing…"
                            : module.locked
                              ? module.lockReason || "Locked"
                              : atMax
                                ? "Max Instances"
                                : noSlots
                                  ? "No Free Sockets"
                                  : "Install Module"}
                        </Button>
                      </CardContent>
                    </Card>
                  );
                })}
              </CardContent>
            </Card>

            {production?.moduleBonuses && Object.values(production.moduleBonuses).some((value) => (value ?? 0) > 0) && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Module Bonus Breakdown</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 gap-3 md:grid-cols-3">
                  {Object.entries(production.moduleBonuses)
                    .filter(([, value]) => (value ?? 0) > 0)
                    .map(([key, value]) => (
                      <div key={key} className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 px-4 py-2">
                        <span className="text-sm capitalize text-slate-600">{key}</span>
                        <span className="font-mono text-sm font-bold text-emerald-700">
                          {key === "defense" ? `+${(Number(value) * 1000).toLocaleString()}` : `+${value}%`}
                        </span>
                      </div>
                    ))}
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="production" className="mt-4 space-y-4">
            <Card className="border-emerald-200 bg-emerald-50">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2"><Battery className="w-5 h-5" /> Stored Resources & Accrual</CardTitle>
                    <CardDescription className="text-emerald-700">
                      {data.accrual ? `${data.accrual.elapsedHours.toFixed(1)} hr since last tick · ${data.accrual.pendingTotal.toLocaleString()} pending` : "No accrual data yet."}
                    </CardDescription>
                  </div>
                  <Button size="sm" variant="outline" className="bg-white" onClick={handleTick} disabled={isTicking || !operational}>
                    <Zap className="w-4 h-4 mr-1" /> {isTicking ? "Ticking…" : "Accrue Production"}
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
                {Object.entries(structure.currentResources || {}).map(([key, value]) => {
                  const cap = Number(resourceStorage[key] ?? 0);
                  const accrued = Number(data.accrual?.accrued?.[key] ?? 0);
                  return (
                    <div key={key} className="rounded-lg border border-emerald-200 bg-white px-4 py-2">
                      <div className="flex items-center justify-between text-xs capitalize text-emerald-700">{key} <span className="text-slate-400">/ {(cap ?? 0).toLocaleString()}</span></div>
                      <div className="mt-1 font-mono text-sm font-bold text-emerald-900">{(value ?? 0).toLocaleString()}</div>
                      {accrued > 0 && <div className="mt-1 text-xs font-semibold text-emerald-600">+{accrued.toLocaleString()} pending</div>}
                    </div>
                  );
                })}
              </CardContent>
              {!operational && (
                <CardContent className="pb-4 text-xs text-slate-500">
                  Structure is idle — activate it to accrue production.
                </CardContent>
              )}
            </Card>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2"><TrendingUp className="w-5 h-5" /> Resource Production</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {Object.entries(resourceProduction).map(([key, value]) => (
                    <div key={key} className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 px-4 py-2">
                      <span className="text-sm capitalize text-slate-600">{key}</span>
                      <span className="font-mono text-sm font-bold text-slate-900">{(value ?? 0).toLocaleString()}/hr</span>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2"><Battery className="w-5 h-5" /> Storage & Multipliers</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {Object.entries(resourceStorage).map(([key, value]) => (
                    <div key={key} className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 px-4 py-2">
                      <span className="text-sm capitalize text-slate-600">{key} storage</span>
                      <span className="font-mono text-sm font-bold text-slate-900">{(value ?? 0).toLocaleString()}</span>
                    </div>
                  ))}
                  <Separator />
                  <div className="flex items-center justify-between rounded-lg border border-violet-200 bg-violet-50 px-4 py-2">
                    <span className="text-sm text-violet-700">Research Multiplier</span>
                    <span className="font-mono text-sm font-bold text-violet-900">×{Number(production?.substats?.researchMultiplier ?? 1).toFixed(2)}</span>
                  </div>
                  <div className="flex items-center justify-between rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-2">
                    <span className="text-sm text-emerald-700">Efficiency Rating</span>
                    <span className="font-mono text-sm font-bold text-emerald-900">{Math.round(production?.substats?.efficiencyRating ?? structure.efficiency ?? 0)}%</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            {production?.contributions && Object.values(production.contributions).some((value) => (value ?? 0) > 0) && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2"><Cog className="w-5 h-5" /> Sub-system Production Breakdown</CardTitle>
                  <CardDescription>How much of current output comes from installed sub-systems.</CardDescription>
                </CardHeader>
                <CardContent className="grid grid-cols-1 gap-3 md:grid-cols-3">
                  {Object.entries(production.contributions)
                    .filter(([, value]) => (value ?? 0) > 0)
                    .map(([key, value]) => (
                      <div key={key} className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 px-4 py-2">
                        <span className="text-sm capitalize text-slate-600">{key}</span>
                        <span className="font-mono text-sm font-bold text-slate-900">+{(value ?? 0).toLocaleString()}</span>
                      </div>
                    ))}
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="crew" className="mt-4 space-y-4">
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
              <StatCell label="Population" value={(structure.population ?? 0).toLocaleString()} icon={<Users className="w-3.5 h-3.5" />} accent="text-sky-600" />
              <StatCell label="Scientists" value={(structure.scientists ?? 0).toLocaleString()} icon={<FlaskConical className="w-3.5 h-3.5" />} accent="text-indigo-600" />
              <StatCell label="Engineers" value={(structure.engineers ?? 0).toLocaleString()} icon={<Cog className="w-3.5 h-3.5" />} accent="text-violet-600" />
              <StatCell label="Workers" value={(structure.workers ?? 0).toLocaleString()} icon={<Hammer className="w-3.5 h-3.5" />} accent="text-amber-600" />
              <StatCell label="Soldiers" value={(structure.soldiers ?? 0).toLocaleString()} icon={<Swords className="w-3.5 h-3.5" />} accent="text-red-600" />
              <StatCell label="Modules" value={(structure.modules?.length ?? 0).toString()} icon={<Boxes className="w-3.5 h-3.5" />} accent="text-emerald-600" />
              <StatCell label="Weapons" value={(structure.weapons?.length ?? 0).toString()} icon={<Swords className="w-3.5 h-3.5" />} accent="text-rose-600" />
              <StatCell label="Defenses" value={(structure.defenses?.length ?? 0).toString()} icon={<Shield className="w-3.5 h-3.5" />} accent="text-blue-600" />
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><Rocket className="w-5 h-5" /> Maintenance & Upkeep</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 gap-3 md:grid-cols-4">
                {template?.maintenanceCost
                  ? Object.entries(template.maintenanceCost).map(([key, value]) => (
                      <div key={key} className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 px-4 py-2">
                        <span className="text-sm capitalize text-slate-600">{key}</span>
                        <span className="font-mono text-sm font-bold text-slate-900">{(value ?? 0).toLocaleString()}</span>
                      </div>
                    ))
                  : <div className="col-span-full text-sm text-slate-500">No maintenance data available.</div>}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className={cn("text-right text-xs text-slate-400")}>
          {resources ? "Resource wallet synced" : ""}
        </div>
      </div>
    </GameLayout>
  );
}
