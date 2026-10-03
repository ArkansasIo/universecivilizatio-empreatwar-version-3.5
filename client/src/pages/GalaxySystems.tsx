import GameLayout from "@/components/layout/GameLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ChevronLeft,
  ChevronRight,
  Globe,
  Orbit,
  Star,
  LayoutGrid,
  List,
  Users,
  CircleDot,
  Moon,
  ScanSearch,
  MapPin,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { cn } from "@/lib/utils";
import { useLocation } from "wouter";
import { BACKGROUND_ASSETS, SHIP_ASSETS, MENU_ASSETS, OGAMEX_FEATURED_ASSETS } from "@shared/config";

const TEMP_THEME_IMAGE = "/theme-temp.png";

const GALAXY_COUNT = 30;
const SYSTEMS_PER_PAGE = 24;
const MAX_SYSTEM_POSITIONS = 50;

type SystemObjectType = "planet" | "asteroid" | "nebula" | "blackhole" | "station" | "empty" | "comet";

interface SystemPosition {
  position: number;
  type: SystemObjectType;
  name: string;
  owner?: string;
  alliance?: string;
  debris?: { metal: number; crystal: number };
  moon?: boolean;
  class?: string;
}

interface GalaxySystemRow {
  index: number;
  sector: number;
  system: number;
  systemName: string;
  star: { type: string; name: string };
  positions: SystemPosition[];
}

interface GalaxySystemsResponse {
  universe: string;
  galaxy: number;
  start: number;
  count: number;
  totalSystems: number;
  planetsPerSystem: number;
  systems: GalaxySystemRow[];
}

interface UniverseGalaxy {
  galaxy: number;
  name: string;
  starType: string;
  starName: string;
  systemsPerGalaxy: number;
  planetsPerSystem: number;
  players: number;
}

interface GalaxiesResponse {
  universe: string;
  galaxyCount: number;
  planetsPerSystem: number;
  galaxies: UniverseGalaxy[];
}

const STAR_COLOR: Record<string, string> = {
  O: "#9bb0ff",
  B: "#aabfff",
  A: "#cad7ff",
  F: "#f8f7ff",
  G: "#ffe4a0",
  K: "#ffa060",
  M: "#ff6040",
};

const STAR_LABEL: Record<string, string> = {
  O: "Blue Giant",
  B: "Blue-White",
  A: "White",
  F: "Yellow-White",
  G: "Yellow Dwarf",
  K: "Orange Dwarf",
  M: "Red Dwarf",
};

const PLANET_GRADIENT: Record<string, string> = {
  M: "from-blue-400 to-emerald-600",
  H: "from-yellow-500 to-orange-700",
  L: "from-lime-500 to-emerald-700",
  K: "from-red-700 to-stone-500",
  Y: "from-red-500 to-orange-900",
  D: "from-slate-400 to-stone-600",
  J: "from-amber-400 to-orange-700",
  T: "from-sky-300 to-indigo-600",
};

const getPlanetGradient = (cls?: string) =>
  cls && PLANET_GRADIENT[cls] ? PLANET_GRADIENT[cls] : "from-blue-500 to-purple-800";

export default function GalaxySystems() {
  const [, setLocation] = useLocation();
  const searchParams = typeof window !== "undefined" ? new URLSearchParams(window.location.search) : new URLSearchParams();
  const parsePositiveInt = (value: string | null, fallback: number, max?: number) => {
    const parsed = Number.parseInt(value ?? "", 10);
    if (!Number.isFinite(parsed) || parsed < 1) return fallback;
    return max ? Math.min(parsed, max) : parsed;
  };

  const [universe, setUniverse] = useState(searchParams.get("universe") || "uni1");
  const [galaxy, setGalaxy] = useState(parsePositiveInt(searchParams.get("galaxy"), 1, GALAXY_COUNT));
  const [gridStart, setGridStart] = useState(1);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    params.set("universe", universe);
    params.set("galaxy", String(galaxy));
    const nextUrl = `/galaxy-systems?${params.toString()}`;
    const currentUrl = `${window.location.pathname}${window.location.search}`;
    if (currentUrl !== nextUrl) {
      window.history.replaceState(null, "", nextUrl);
    }
  }, [universe, galaxy]);

  const { data: galaxiesData, isFetching: galaxiesFetching } = useQuery<GalaxiesResponse>({
    queryKey: ["universe-galaxies", universe],
    queryFn: async () => {
      const res = await fetch(`/api/universe/${universe}/galaxies`, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to load galaxy list");
      return res.json();
    },
    staleTime: 60_000,
  });

  const { data: systemsData, isFetching: systemsFetching } = useQuery<GalaxySystemsResponse>({
    queryKey: ["galaxy-systems", universe, galaxy, gridStart, SYSTEMS_PER_PAGE],
    queryFn: async () => {
      const res = await fetch(`/api/galaxy/${universe}/${galaxy}/systems?start=${gridStart}&count=${SYSTEMS_PER_PAGE}`, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to load galaxy systems");
      return res.json();
    },
    staleTime: 30_000,
  });

  const totalSystems = systemsData?.totalSystems || 8192;
  const gridEnd = Math.min(gridStart + SYSTEMS_PER_PAGE - 1, totalSystems);

  const changeGalaxy = (next: number) => {
    const clamped = Math.max(1, Math.min(next, GALAXY_COUNT));
    setGalaxy(clamped);
    setGridStart(1);
  };

  const activeGalaxy = galaxiesData?.galaxies.find((g) => g.galaxy === galaxy);

  const openSystem = (sys: GalaxySystemRow) => {
    setLocation(`/galaxy-systems/${galaxy}/${sys.index}?universe=${universe}`);
  };

  const renderPlanetPreview = (positions: SystemPosition[]) => {
    const planets = positions.filter((p) => p.type === "planet");
    return planets.slice(0, 8).map((p) => (
      <span
        key={p.position}
        title={`${p.name}${p.owner ? ` · ${p.owner}` : ""}`}
        className={cn(
          "w-3.5 h-3.5 rounded-full bg-gradient-to-br border border-slate-300 inline-block",
          getPlanetGradient(p.class),
          p.owner && "ring-2 ring-red-400",
        )}
      />
    ));
  };

  return (
    <GameLayout>
      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <section className="overflow-hidden rounded-2xl border border-slate-200 shadow-sm bg-cover bg-center" style={{ backgroundImage: `linear-gradient(rgba(15,23,42,0.78), rgba(15,23,42,0.92)), url(${BACKGROUND_ASSETS.GALAXY_MAP.path})` }}>
          <div className="p-5 lg:p-6 space-y-4 text-white">
            <div className="flex items-center gap-2">
              <img src={MENU_ASSETS.NAVIGATION.HOME.path} alt="Icon" className="w-8 h-8 rounded-lg border border-white/10 bg-white/10 p-1.5 object-contain" onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = TEMP_THEME_IMAGE; }} />
              <h1 className="text-2xl font-bold">Galaxy Systems List</h1>
            </div>
            <p className="text-sm leading-6 text-slate-300">OGame-style catalog of every galaxy and its systems. Pick a galaxy, then a system, to open its detail page.</p>
            <div className="flex flex-wrap gap-3">
              {[{ label: "System Catalog", image: SHIP_ASSETS.FIGHTERS.SCOUT.path }, { label: "Galaxy Survey", image: MENU_ASSETS.NAVIGATION.HOME.path }, { label: "Deep Space", image: OGAMEX_FEATURED_ASSETS.BACKGROUND.path }].map((item) => (
                <div key={item.label} className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-3 py-2">
                  <img src={item.image} alt={item.label} className="w-10 h-10 rounded-lg border border-white/10 bg-black/10 p-1.5 object-contain" onError={(event) => { event.currentTarget.onerror = null; event.currentTarget.src = TEMP_THEME_IMAGE; }} />
                  <div className="text-sm font-semibold">{item.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Breadcrumb */}
        <nav className="flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground">
          <span className="font-semibold text-slate-500 uppercase tracking-wider">Universe</span>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="font-semibold text-slate-500 uppercase tracking-wider">Galaxy {galaxy}</span>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="font-semibold text-primary">Systems {gridStart} – {gridEnd}</span>
        </nav>

        {/* Menu: Universe + Galaxy */}
        <div className="bg-white border border-slate-200 p-4 rounded-lg flex flex-wrap items-center gap-4 shadow-sm">
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground uppercase text-xs font-bold">Universe</span>
            <Select value={universe} onValueChange={(v) => { setUniverse(v); setGridStart(1); }}>
              <SelectTrigger className="w-[140px] bg-slate-50 border-slate-200 text-slate-900 h-8">
                <SelectValue placeholder="Select Universe" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="uni1">Nexus-Alpha</SelectItem>
                <SelectItem value="uni2">Cyborg-Beta</SelectItem>
                <SelectItem value="uni3">Quantum-Gamma</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="h-8 w-px bg-slate-200 hidden md:block" />

          <div className="flex items-center gap-2">
            <span className="text-muted-foreground uppercase text-xs font-bold">Galaxy</span>
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => changeGalaxy(galaxy - 1)} disabled={galaxy <= 1}>
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <Input
              className="w-14 h-8 text-center font-mono bg-slate-50 border-slate-200 text-slate-900"
              value={galaxy}
              onChange={(e) => changeGalaxy(parseInt(e.target.value) || 1)}
            />
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => changeGalaxy(galaxy + 1)} disabled={galaxy >= GALAXY_COUNT}>
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>

          <div className="ml-auto flex items-center gap-2 text-xs text-muted-foreground">
            <Globe className="w-3.5 h-3.5" />
            <span>
              {activeGalaxy?.name ?? `Galaxy ${galaxy}`}
              {activeGalaxy && <span className="text-slate-400"> · {STAR_LABEL[activeGalaxy.starType] ?? activeGalaxy.starType} · {activeGalaxy.players} players</span>}
            </span>
          </div>
        </div>

        {/* Galaxy menu (submenu strip) */}
        <div className="bg-white border border-slate-200 rounded-lg shadow-sm p-3">
          <div className="flex items-center gap-2 mb-2">
            <LayoutGrid className="w-4 h-4 text-primary" />
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Galaxy Menu</span>
            <span className="text-xs text-muted-foreground">Select a galaxy to browse its systems</span>
          </div>
          {galaxiesFetching && !galaxiesData ? (
            <div className="flex flex-wrap gap-1.5">
              {Array.from({ length: GALAXY_COUNT }).map((_, i) => (
                <Skeleton key={i} className="w-11 h-8 rounded-md" />
              ))}
            </div>
          ) : (
            <div className="flex flex-wrap gap-1.5 max-h-32 overflow-y-auto">
              {Array.from({ length: GALAXY_COUNT }).map((_, i) => {
                const g = i + 1;
                const meta = galaxiesData?.galaxies.find((entry) => entry.galaxy === g);
                const active = g === galaxy;
                return (
                  <Button
                    key={g}
                    size="sm"
                    variant={active ? "default" : "ghost"}
                    className={cn(
                      "h-8 min-w-11 px-2 font-mono text-xs border",
                      active
                        ? "border-primary"
                        : "border-slate-200 text-slate-600 hover:bg-blue-50 hover:text-primary",
                    )}
                    title={meta ? `${meta.name} · ${STAR_LABEL[meta.starType] ?? meta.starType}` : `Galaxy ${g}`}
                    onClick={() => changeGalaxy(g)}
                  >
                    {g}
                  </Button>
                );
              })}
            </div>
          )}
        </div>

        {/* Systems submenu (pagination) */}
        <div className="bg-white border border-slate-200 p-3 rounded-lg flex flex-wrap items-center gap-4 shadow-sm">
          <div className="flex items-center gap-2">
            <List className="w-4 h-4 text-primary" />
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Systems</span>
            <span className="text-xs text-muted-foreground">{totalSystems.toLocaleString()} in Galaxy {galaxy}</span>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setGridStart((g) => Math.max(1, g - SYSTEMS_PER_PAGE))} disabled={gridStart <= 1}>
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <Input className="w-20 h-8 text-center font-mono bg-slate-50 border-slate-200 text-slate-900" value={gridStart} onChange={(e) => setGridStart(Math.max(1, parseInt(e.target.value) || 1))} />
            <span className="text-xs text-muted-foreground font-mono">– {gridEnd}</span>
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setGridStart((g) => Math.min(totalSystems - SYSTEMS_PER_PAGE + 1, g + SYSTEMS_PER_PAGE))} disabled={gridEnd >= totalSystems}>
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* System cards */}
        {systemsFetching && !systemsData ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-36 rounded-xl" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
            {(systemsData?.systems ?? []).map((sys) => {
              const planets = sys.positions.filter((p) => p.type === "planet");
              const owned = planets.filter((p) => p.owner).length;
              const moons = planets.filter((p) => p.moon).length;
              const specials = sys.positions.filter((p) => p.type !== "planet" && p.type !== "empty");
              return (
                <button
                  key={sys.index}
                  type="button"
                  onClick={() => openSystem(sys)}
                  className="text-left group bg-white border border-slate-200 rounded-xl shadow-sm hover:shadow-md hover:border-primary/40 transition-all p-4 space-y-3"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <div
                        className="w-9 h-9 rounded-full flex-shrink-0"
                        style={{ background: `radial-gradient(circle at 35% 35%, white, ${STAR_COLOR[sys.star.type] ?? "#ffe4a0"})` }}
                      />
                      <div>
                        <div className="font-orbitron font-bold text-slate-900 leading-tight">{sys.systemName}</div>
                        <div className="font-mono text-[10px] text-muted-foreground">
                          G{galaxy} · S{String(sys.sector).padStart(2, "0")}:{String(sys.system).padStart(3, "0")} · #{sys.index}
                        </div>
                      </div>
                    </div>
                    <Badge variant="outline" className="border-slate-300 text-slate-500 font-mono">
                      {sys.star.type}
                    </Badge>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
                    <span className="flex items-center gap-1">
                      <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                      {sys.star.name}
                    </span>
                    <span className="text-slate-300">·</span>
                    <span className="flex items-center gap-1">
                      <Orbit className="w-3.5 h-3.5 text-blue-500" />
                      {planets.length} planets
                    </span>
                    <span className="text-slate-300">·</span>
                    <span className="flex items-center gap-1">
                      <Moon className="w-3.5 h-3.5 text-slate-400" />
                      {moons}
                    </span>
                    {owned > 0 && (
                      <>
                        <span className="text-slate-300">·</span>
                        <span className="flex items-center gap-1 text-red-600 font-semibold">
                          <Users className="w-3.5 h-3.5" />
                          {owned} colonized
                        </span>
                      </>
                    )}
                    {specials.length > 0 && (
                      <>
                        <span className="text-slate-300">·</span>
                        <span className="flex items-center gap-1 text-purple-600">
                          <ScanSearch className="w-3.5 h-3.5" />
                          {specials.length} anomaly{specials.length > 1 ? "s" : ""}
                        </span>
                      </>
                    )}
                  </div>

                  <div className="flex items-center gap-1.5 min-h-4">{renderPlanetPreview(planets)}</div>

                  <div className="flex items-center justify-between border-t border-slate-100 pt-2.5">
                    <span className="flex items-center gap-1 text-xs text-muted-foreground">
                      <MapPin className="w-3.5 h-3.5" />
                      {MAX_SYSTEM_POSITIONS} orbital slots
                    </span>
                    <span className="text-xs font-semibold text-primary group-hover:underline inline-flex items-center gap-1">
                      Open System <ChevronRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </button>
              );
            })}
            {systemsData && systemsData.systems.length === 0 && (
              <div className="col-span-full text-center py-12 text-muted-foreground border border-dashed border-slate-200 rounded-xl">
                <CircleDot className="w-10 h-10 mx-auto mb-2 text-slate-300" />
                No systems found in this range.
              </div>
            )}
          </div>
        )}
      </div>
    </GameLayout>
  );
}
