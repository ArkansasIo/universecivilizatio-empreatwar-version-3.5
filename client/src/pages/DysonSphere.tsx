import GameLayout from "@/components/layout/GameLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ArrowLeft,
  Boxes,
  ChevronRight,
  Coins,
  Layers,
  Orbit,
  Sparkles,
  Sun,
  Zap,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import {
  getDysonSubsystemCatalog,
  getSubsystemView,
  EFFECT_META,
  fetchDysonProgramSummary,
} from "@/lib/megastructureSubsystems";
import { getMegaStructureTemplateById, calculateConstructionCost } from "@/lib/megaStructures";
import { BACKGROUND_ASSETS } from "@shared/config";

const DYSON_TEMPLATE_ID = "mega-dyson-01";

export default function DysonSphere() {
  const catalog = getDysonSubsystemCatalog();

  const { data: program } = useQuery({
    queryKey: ["dyson-program"],
    queryFn: fetchDysonProgramSummary,
    staleTime: 30_000,
  });

  const template = getMegaStructureTemplateById(DYSON_TEMPLATE_ID);
  const templateCost = template ? calculateConstructionCost(template) : null;

  const baseline = catalog.map((definition) => ({
    definition,
    levelZero: getSubsystemView(definition, 0),
    levelOne: getSubsystemView(definition, 1),
  }));

  return (
    <GameLayout>
      <div className="relative overflow-hidden rounded-2xl border border-slate-200 shadow-sm bg-cover bg-center mb-6" style={{ backgroundImage: `linear-gradient(rgba(15,23,42,0.72), rgba(15,23,42,0.9)), url(${BACKGROUND_ASSETS.NEBULA.path})` }}>
        <div className="p-6 sm:p-8">
          <Link href="/megastructures" className="inline-flex items-center gap-2 text-slate-300 text-sm hover:text-white mb-4">
            <ArrowLeft className="w-4 h-4" /> Megastructures
          </Link>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-white/10 bg-white/5">
                <Sun className="h-8 w-8 text-amber-300" />
              </div>
              <div>
                <h1 className="text-2xl font-orbitron font-bold text-white">Dyson Program</h1>
                <p className="text-slate-300 text-sm mt-1">
                  Stellar harvesting at civilization scale · {catalog.length} detail sub-systems
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <Badge variant="secondary">Owned: {program?.ownedCount ?? 0}</Badge>
              {template && (
                <Button asChild variant="secondary" size="sm">
                  <Link href={`/megastructures/${DYSON_TEMPLATE_ID}`}>Template Preview</Link>
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-slate-500"><Layers className="h-4 w-4" /> Sub-systems</div>
              <div className="mt-1 text-2xl font-bold text-slate-900">{catalog.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-slate-500"><Sparkles className="h-4 w-4" /> Effects</div>
              <div className="mt-1 text-2xl font-bold text-slate-900">{new Set(catalog.map((c) => c.effect)).size}</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-slate-500"><Sun className="h-4 w-4" /> Stellar Capture</div>
              <div className="mt-1 text-2xl font-bold text-amber-700">Energy /h</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-slate-500"><Orbit className="h-4 w-4" /> Owned Spheres</div>
              <div className="mt-1 text-2xl font-bold text-emerald-700">{program?.ownedCount ?? 0}</div>
            </CardContent>
          </Card>
        </div>

        {program && program.owned.length > 0 && (
          <Card className="border-emerald-200 bg-emerald-50">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2"><Orbit className="w-5 h-5" /> Your Dyson Spheres</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 gap-3 md:grid-cols-2">
              {program.owned.map((owned) => (
                <Card key={owned.id} className="bg-white border-slate-200 shadow-sm">
                  <CardContent className="flex items-center justify-between p-4">
                    <div>
                      <div className="font-semibold text-slate-900">{owned.name}</div>
                      <div className="text-xs text-slate-500">
                        Lvl {owned.level} · {owned.coordinates} · {owned.isOperational ? "Operational" : "Idle"}
                      </div>
                    </div>
                    <Button size="sm" variant="outline" asChild>
                      <Link href={`/megastructures/${owned.id}`}>
                        Open <ChevronRight className="ml-1 h-4 w-4" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </CardContent>
          </Card>
        )}

        <Tabs defaultValue="subsystems" className="w-full">
          <TabsList className="grid grid-cols-2 w-full">
            <TabsTrigger value="subsystems"><Boxes className="w-4 h-4 mr-1" /> Sub-system Catalog</TabsTrigger>
            <TabsTrigger value="blueprint"><Coins className="w-4 h-4 mr-1" /> Blueprint & Cost</TabsTrigger>
          </TabsList>

          <TabsContent value="subsystems" className="mt-4 space-y-4">
            <Card className="border-slate-200 bg-slate-50">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Dyson Detail Sub-systems</CardTitle>
                <CardDescription>
                  Every Dyson Sphere exposes these sub-systems. Each has its own function, sub-functions, level curve, and production contribution.
                </CardDescription>
              </CardHeader>
              <CardContent className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                {baseline.map(({ definition, levelOne }) => {
                  const meta = EFFECT_META[definition.effect];
                  return (
                    <Card key={definition.id} className="border-slate-200 bg-white shadow-sm">
                      <CardHeader className="pb-2">
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full border border-amber-200 bg-amber-50">
                              <span className="text-lg">{levelOne.icon === "☀️" ? "☀️" : meta.icon}</span>
                            </div>
                            <div>
                              <CardTitle className="text-base text-slate-900">{definition.name}</CardTitle>
                              <div className="text-xs uppercase tracking-[0.18em] text-slate-500">
                                {definition.category} · Lvl 1 = {levelOne.contributionLabel}
                              </div>
                            </div>
                          </div>
                          <Badge variant="outline" className="bg-amber-50 text-amber-800">{meta.label}</Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <p className="text-sm text-slate-600">{definition.description}</p>
                        <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                          <div className="text-xs uppercase tracking-widest text-slate-500">Function</div>
                          <div className="mt-1 text-sm font-medium text-slate-900">{definition.function}</div>
                        </div>
                        <div className="space-y-1">
                          {definition.subFunctions.slice(0, 3).map((subFunction, index) => (
                            <div key={index} className="flex items-start gap-2 text-xs text-slate-600">
                              <ChevronRight className="mt-0.5 h-3 w-3 shrink-0 text-primary" />
                              {subFunction}
                            </div>
                          ))}
                        </div>
                        <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-xs">
                          <div className="mb-1 flex items-center gap-1 uppercase tracking-widest text-amber-700"><Zap className="h-3 w-3" /> Max {definition.maxLevel} levels</div>
                          <div className="flex justify-between text-slate-700">
                            <span>Cost growth</span><span className="font-mono">×{definition.costGrowth}/lvl</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="blueprint" className="mt-4 space-y-4">
            {template ? (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2"><Coins className="w-5 h-5" /> {template.name}</CardTitle>
                  <CardDescription>{template.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                    <div className="rounded-lg border border-slate-200 bg-slate-50 p-3"><div className="text-xs uppercase text-slate-500">Type</div><div className="mt-1 font-semibold capitalize">{template.type.replace(/_/g, " ")}</div></div>
                    <div className="rounded-lg border border-slate-200 bg-slate-50 p-3"><div className="text-xs uppercase text-slate-500">Tier</div><div className="mt-1 font-semibold">{template.tier}</div></div>
                    <div className="rounded-lg border border-slate-200 bg-slate-50 p-3"><div className="text-xs uppercase text-slate-500">Energy</div><div className="mt-1 font-semibold text-yellow-700">{template.stats.energyOutput.toLocaleString()}</div></div>
                    <div className="rounded-lg border border-slate-200 bg-slate-50 p-3"><div className="text-xs uppercase text-slate-500">Primary</div><div className="mt-1 font-semibold">{template.specialAbility}</div></div>
                  </div>
                  {templateCost && (
                    <div className="rounded-lg border border-amber-200 bg-amber-50 p-4">
                      <div className="mb-2 text-xs uppercase tracking-widest text-amber-700">Construction Cost</div>
                      <div className="grid grid-cols-2 gap-2 text-sm text-amber-900 sm:grid-cols-3">
                        <div>Metal: <span className="font-mono">{templateCost.metal.toLocaleString()}</span></div>
                        <div>Crystal: <span className="font-mono">{templateCost.crystal.toLocaleString()}</span></div>
                        <div>Deuterium: <span className="font-mono">{templateCost.deuterium.toLocaleString()}</span></div>
                      </div>
                    </div>
                  )}
                  <Button asChild className="font-orbitron tracking-wider">
                    <Link href={`/megastructures/${DYSON_TEMPLATE_ID}`}>View Full Template Preview</Link>
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="p-6 text-sm text-slate-600">Dyson template catalog unavailable.</CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </GameLayout>
  );
}
