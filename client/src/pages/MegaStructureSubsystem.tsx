import GameLayout from "@/components/layout/GameLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import {
  ArrowLeft,
  Check,
  ChevronRight,
  Coins,
  Cog,
  Layers,
  ListChecks,
  Sparkles,
  TrendingUp,
  X,
} from "lucide-react";
import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Link, useRoute } from "wouter";
import { useGame } from "@/lib/gameContext";
import {
  fetchMegastructureDetail,
  upgradeMegastructureSubsystemApi,
  EFFECT_META,
  type MegastructureDetailResponse,
} from "@/lib/megastructureSubsystems";
import { cn } from "@/lib/utils";
import { BACKGROUND_ASSETS } from "@shared/config";

function CostRow({ label, current, required, isEnergy }: { label: string; current: number; required: number; isEnergy?: boolean }) {
  const affordable = current >= required;
  return (
    <div className="flex items-center justify-between text-sm">
      <span className="text-slate-600">{label}</span>
      <span className={cn("font-mono", affordable ? "text-slate-900" : "font-bold text-red-600")}>
        {required.toLocaleString()}
        {isEnergy ? <span className="ml-1 text-xs text-yellow-600">⚡</span> : null}
      </span>
    </div>
  );
}

export default function MegaStructureSubsystem() {
  const [, params] = useRoute("/megastructures/:id/subsystems/:subsystemId");
  const structureId = params?.id || "";
  const subsystemId = params?.subsystemId || "";

  const { resources } = useGame();
  const queryClient = useQueryClient();
  const [isUpgrading, setIsUpgrading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { data, isLoading } = useQuery<MegastructureDetailResponse>({
    queryKey: ["megastructure-detail", structureId],
    queryFn: () => fetchMegastructureDetail(structureId),
    enabled: Boolean(structureId),
    staleTime: 15_000,
  });

  if (isLoading) {
    return (
      <GameLayout>
        <div className="flex items-center justify-center py-24 text-slate-500">Loading sub-system…</div>
      </GameLayout>
    );
  }

  const subsystem = data?.success
    ? data.subsystems.find((item) => item.id === subsystemId)
    : undefined;

  if (!subsystem || !data?.success) {
    return (
      <GameLayout>
        <div className="flex flex-col items-center justify-center py-24 text-slate-500">
          <p>Sub-system not found.</p>
          <Link href={`/megastructures/${structureId}`} className="mt-2 text-sm text-blue-600 hover:underline">
            Back to megastructure
          </Link>
        </div>
      </GameLayout>
    );
  }

  const structure = data.structure;
  const meta = EFFECT_META[subsystem.effect];
  const progressPercent = subsystem.maxed ? 100 : (subsystem.level / subsystem.maxLevel) * 100;
  const affordable =
    (resources?.metal ?? 0) >= subsystem.cost.metal &&
    (resources?.crystal ?? 0) >= subsystem.cost.crystal &&
    (resources?.deuterium ?? 0) >= subsystem.cost.deuterium &&
    (resources?.energy ?? 0) >= subsystem.cost.energy;

  const handleUpgrade = async () => {
    setIsUpgrading(true);
    setError(null);
    try {
      await upgradeMegastructureSubsystemApi(structureId, subsystemId);
      await queryClient.invalidateQueries({ queryKey: ["megastructure-detail", structureId] });
      await queryClient.invalidateQueries({ queryKey: ["megastructures"] });
    } catch (e: any) {
      setError(e?.message || "Upgrade failed");
    } finally {
      setIsUpgrading(false);
    }
  };

  return (
    <GameLayout>
      <div className="relative overflow-hidden rounded-2xl border border-slate-200 shadow-sm bg-cover bg-center mb-6" style={{ backgroundImage: `linear-gradient(rgba(15,23,42,0.78), rgba(15,23,42,0.92)), url(${BACKGROUND_ASSETS.NEBULA.path})` }}>
        <div className="p-6 sm:p-8">
          <Link href={`/megastructures/${structureId}`} className="inline-flex items-center gap-2 text-slate-300 text-sm hover:text-white mb-4">
            <ArrowLeft className="w-4 h-4" /> {structure.name}
          </Link>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-3xl">
                {meta.icon}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl font-orbitron font-bold text-white">{subsystem.name}</h1>
                  <Badge className="bg-violet-500 text-white">Lvl {subsystem.level}/{subsystem.maxLevel}</Badge>
                </div>
                <p className="text-slate-300 text-sm mt-1">
                  {subsystem.category} · {meta.label} · {structure.name}
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <Badge variant="secondary" className="text-sm">
                Contribution: {subsystem.contributionLabel}
              </Badge>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Cog className="w-5 h-5" /> {subsystem.function}</CardTitle>
              <CardDescription>{subsystem.description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="mb-2 text-xs uppercase tracking-widest text-slate-500">Sub-functions</div>
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                  {subsystem.subFunctions.map((subFunction, index) => (
                    <div key={index} className="flex items-start gap-2 rounded-lg border border-slate-200 bg-slate-50 p-3 text-sm text-slate-700">
                      <ChevronRight className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                      {subFunction}
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <div className="mb-2 flex items-center justify-between text-xs uppercase tracking-widest text-slate-500">
                  <span>Level Progress</span>
                  <span className="font-mono text-slate-700">{subsystem.level} / {subsystem.maxLevel}</span>
                </div>
                <Progress value={progressPercent} className="h-2.5" />
              </div>

              <Separator />

              <div>
                <div className="mb-2 flex items-center gap-2 text-xs uppercase tracking-widest text-slate-500">
                  <Sparkles className="h-3.5 w-3.5 text-primary" /> Bonus Scaling
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4">
                    <div className="text-xs uppercase tracking-widest text-emerald-600">Current Bonus</div>
                    <div className="mt-1 text-xl font-bold text-emerald-900">
                      {subsystem.bonus}{subsystem.bonusUnit.includes("%") ? "%" : ""}
                    </div>
                  </div>
                  <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
                    <div className="text-xs uppercase tracking-widest text-blue-600">Next Level</div>
                    <div className="mt-1 text-xl font-bold text-blue-900">
                      {subsystem.nextBonus}{subsystem.bonusUnit.includes("%") ? "%" : ""}
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                <div className="mb-2 flex items-center gap-2 text-xs uppercase tracking-widest text-slate-500">
                  <TrendingUp className="h-3.5 w-3.5 text-primary" /> Production Contribution
                </div>
                <div className="text-2xl font-bold text-slate-900">{subsystem.contributionLabel}</div>
                <div className="mt-1 text-xs text-slate-500">Applied to {meta.label} across the structure's {subsystem.effect} channel.</div>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-4">
            <Card className="border-amber-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base"><Coins className="w-5 h-5 text-amber-600" /> Upgrade Cost</CardTitle>
                <CardDescription>Level {subsystem.level} → {subsystem.level + 1}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <CostRow label="Metal" current={resources?.metal ?? 0} required={subsystem.cost.metal} />
                <CostRow label="Crystal" current={resources?.crystal ?? 0} required={subsystem.cost.crystal} />
                <CostRow label="Deuterium" current={resources?.deuterium ?? 0} required={subsystem.cost.deuterium} />
                <CostRow label="Energy" current={resources?.energy ?? 0} required={subsystem.cost.energy} isEnergy />
              </CardContent>
            </Card>

            {error && (
              <Card className="border-red-200 bg-red-50">
                <CardContent className="flex items-center gap-2 p-4 text-sm text-red-700">
                  <X className="h-4 w-4" /> {error}
                </CardContent>
              </Card>
            )}

            <Button
              className="w-full font-orbitron tracking-wider"
              disabled={subsystem.maxed || !affordable || isUpgrading}
              onClick={handleUpgrade}
            >
              {subsystem.maxed ? "MAX LEVEL REACHED" : affordable ? `UPGRADE TO LEVEL ${subsystem.level + 1}` : "INSUFFICIENT RESOURCES"}
            </Button>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base"><Layers className="w-5 h-5" /> Effect</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-slate-600">
                {meta.label} — this sub-system feeds the structure's {subsystem.effect} output channel. Higher levels raise its {subsystem.bonusUnit.includes("%") ? "percentage" : "raw"} contribution.
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base"><ListChecks className="w-5 h-5" /> Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="flex items-center gap-2 text-emerald-700"><Check className="h-4 w-4" /> Installed & integrated</div>
                <div className="flex items-center gap-2 text-slate-500"><Check className="h-4 w-4" /> No crew requirement</div>
                <div className="flex items-center gap-2 text-slate-500"><Check className="h-4 w-4" /> Auto-managed by control lattice</div>
              </CardContent>
            </Card>

            {subsystem.lore && (
              <Card className="bg-slate-50">
                <CardContent className="p-4 text-xs italic text-slate-500">
                  {subsystem.lore}
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </GameLayout>
  );
}
