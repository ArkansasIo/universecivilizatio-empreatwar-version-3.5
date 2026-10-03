import GameLayout from "@/components/layout/GameLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Globe,
  Map,
  Users,
  ArrowRight,
  Orbit,
  ChevronRight,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { BACKGROUND_ASSETS, SHIP_ASSETS, MENU_ASSETS, OGAMEX_FEATURED_ASSETS } from "@shared/config";

const TEMP_THEME_IMAGE = "/theme-temp.png";

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

const STAR_INFO: Record<string, { label: string; color: string }> = {
  O: { label: "Blue Giant",    color: "#9bb0ff" },
  B: { label: "Blue-White",    color: "#aabfff" },
  A: { label: "White Star",    color: "#cad7ff" },
  F: { label: "Yellow-White",  color: "#f8f7ff" },
  G: { label: "Yellow Dwarf",  color: "#ffe4a0" },
  K: { label: "Orange Dwarf",  color: "#ffa060" },
  M: { label: "Red Dwarf",     color: "#ff6040" },
};

export default function Universe() {
  const [, setLocation] = useLocation();
  const searchParams = typeof window !== "undefined" ? new URLSearchParams(window.location.search) : new URLSearchParams();
  const [universe, setUniverse] = useState(searchParams.get("universe") || "uni1");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    params.set("universe", universe);
    const nextUrl = `/universe?${params.toString()}`;
    const currentUrl = `${window.location.pathname}${window.location.search}`;
    if (currentUrl !== nextUrl) {
      window.history.replaceState(null, "", nextUrl);
    }
  }, [universe]);

  const { data: galaxyData, isFetching } = useQuery<GalaxiesResponse>({
    queryKey: ["universe-galaxies", universe],
    queryFn: async () => {
      const res = await fetch(`/api/universe/${universe}/galaxies`, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to load galaxy list");
      return res.json();
    },
    staleTime: 60_000,
  });

  const stats = useMemo(() => {
    const galaxies = galaxyData?.galaxies || [];
    const systems = galaxies.reduce((sum, g) => sum + g.systemsPerGalaxy, 0);
    const players = galaxies.reduce((sum, g) => sum + g.players, 0);
    return {
      galaxies: galaxyData?.galaxyCount || galaxies.length || 30,
      systems,
      players,
      planetsPerSystem: galaxyData?.planetsPerSystem || 50,
    };
  }, [galaxyData]);

  const openGalaxy = (galaxy: number) => {
    setLocation(`/galaxy?universe=${universe}&galaxy=${galaxy}`);
  };

  return (
    <GameLayout>
      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <section className="overflow-hidden rounded-2xl border border-slate-200 shadow-sm bg-cover bg-center" style={{ backgroundImage: `linear-gradient(rgba(15,23,42,0.78), rgba(15,23,42,0.92)), url(${BACKGROUND_ASSETS.GALAXY_MAP.path})` }}>
          <div className="p-5 lg:p-6 space-y-4 text-white">
            <div className="flex items-center gap-2">
              <img src={MENU_ASSETS.NAVIGATION.EMPIRE.path} alt="Icon" className="w-8 h-8 rounded-lg border border-white/10 bg-white/10 p-1.5 object-contain" onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = TEMP_THEME_IMAGE; }} />
              <h1 className="text-2xl font-bold">Universe Map</h1>
            </div>
            <p className="text-sm leading-6 text-slate-300">All 30 galaxies of the universe, OGame-style. Open a galaxy to sweep its systems.</p>
            <div className="flex flex-wrap gap-3">
              {[{ label: "Galaxy Survey", image: SHIP_ASSETS.CAPITALS.BATTLECRUISER.path }, { label: "System Scanner", image: MENU_ASSETS.BUILDINGS.SHIPYARD.path }, { label: "Deep Space", image: OGAMEX_FEATURED_ASSETS.BACKGROUND.path }].map((item) => (
                <div key={item.label} className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-3 py-2">
                  <img src={item.image} alt={item.label} className="w-10 h-10 rounded-lg border border-white/10 bg-black/10 p-1.5 object-contain" onError={(event) => { event.currentTarget.onerror = null; event.currentTarget.src = TEMP_THEME_IMAGE; }} />
                  <div className="text-sm font-semibold">{item.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Universe Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <Card className="bg-white border-slate-200">
            <CardContent className="pt-4 pb-3">
              <div className="flex items-center gap-2 text-xs uppercase text-slate-500 font-bold mb-1">
                <Orbit className="w-3 h-3" /> Galaxies
              </div>
              <div className="text-xl font-bold text-slate-900">{stats.galaxies}</div>
            </CardContent>
          </Card>
          <Card className="bg-white border-slate-200">
            <CardContent className="pt-4 pb-3">
              <div className="flex items-center gap-2 text-xs uppercase text-slate-500 font-bold mb-1">
                <Map className="w-3 h-3" /> Systems
              </div>
              <div className="text-xl font-bold text-slate-900">{stats.systems.toLocaleString()}</div>
            </CardContent>
          </Card>
          <Card className="bg-white border-slate-200">
            <CardContent className="pt-4 pb-3">
              <div className="flex items-center gap-2 text-xs uppercase text-slate-500 font-bold mb-1">
                <Globe className="w-3 h-3" /> Planets / System
              </div>
              <div className="text-xl font-bold text-green-700">{stats.planetsPerSystem}</div>
            </CardContent>
          </Card>
          <Card className="bg-white border-slate-200">
            <CardContent className="pt-4 pb-3">
              <div className="flex items-center gap-2 text-xs uppercase text-slate-500 font-bold mb-1">
                <Users className="w-3 h-3" /> Colonists
              </div>
              <div className="text-xl font-bold text-blue-700">{stats.players.toLocaleString()}</div>
            </CardContent>
          </Card>
        </div>

        {/* Navigation Bar */}
        <div className="bg-white border border-slate-200 p-4 rounded-lg flex flex-wrap justify-center items-center gap-4 shadow-sm">
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground uppercase text-xs font-bold">Universe</span>
            <Select value={universe} onValueChange={setUniverse}>
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

          <div className="h-8 w-px bg-slate-200 mx-2 hidden md:block" />

          <div className="flex items-center gap-2">
            <span className="text-muted-foreground uppercase text-xs font-bold">Galaxy Quick Jump</span>
            <div className="flex items-center">
              <Input
                className="w-20 h-8 text-center font-mono bg-slate-50 border-slate-200 text-slate-900"
                defaultValue="1"
                id="galaxy-jump"
              />
              <Button
                size="sm"
                className="h-8 ml-2 text-xs"
                onClick={() => {
                  const raw = (document.getElementById("galaxy-jump") as HTMLInputElement)?.value;
                  const next = Math.max(1, Math.min(parseInt(raw || "1", 10) || 1, 30));
                  openGalaxy(next);
                }}
              >
                Open <ArrowRight className="w-3 h-3 ml-1" />
              </Button>
            </div>
          </div>
        </div>

        {/* Galaxy List */}
        <div className="bg-white border border-slate-200 rounded-lg shadow-sm">
          <div className="max-h-[600px] overflow-y-auto">
            <Table>
              <TableHeader className="sticky top-0 bg-slate-50 z-10">
                <TableRow className="bg-slate-50 border-slate-200 hover:bg-slate-50">
                  <TableHead className="text-center w-[80px] text-slate-700">Galaxy</TableHead>
                  <TableHead className="text-slate-700">Name</TableHead>
                  <TableHead className="text-slate-700">Anchor Star</TableHead>
                  <TableHead className="text-right text-slate-700">Systems</TableHead>
                  <TableHead className="text-right text-slate-700">Planets</TableHead>
                  <TableHead className="text-right text-slate-700">Colonists</TableHead>
                  <TableHead className="text-right text-slate-700">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isFetching && !galaxyData && (
                  <TableRow><TableCell colSpan={7} className="text-center py-8 text-muted-foreground">Loading galaxy list...</TableCell></TableRow>
                )}
                {galaxyData?.galaxies.map((g) => {
                  const starInfo = STAR_INFO[g.starType];
                  return (
                    <TableRow key={g.galaxy} className="border-slate-100 hover:bg-slate-50 transition-colors cursor-pointer" onClick={() => openGalaxy(g.galaxy)}>
                      <TableCell className="text-center font-mono font-bold text-slate-800">{g.galaxy}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-slate-700">{g.name}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span
                            className="w-3 h-3 rounded-full inline-block shrink-0"
                            style={{ background: `radial-gradient(circle at 35% 35%, white, ${starInfo?.color ?? "#ffe4a0"})` }}
                          />
                          <span className="font-mono text-sm text-slate-600">{g.starName}</span>
                          {starInfo && <Badge variant="outline" className="border-slate-300 text-slate-500 text-[10px]">{starInfo.label}</Badge>}
                        </div>
                      </TableCell>
                      <TableCell className="text-right font-mono text-slate-600">{g.systemsPerGalaxy.toLocaleString()}</TableCell>
                      <TableCell className="text-right font-mono text-green-700">{(g.systemsPerGalaxy * g.planetsPerSystem).toLocaleString()}</TableCell>
                      <TableCell className="text-right font-mono text-blue-700">{g.players.toLocaleString()}</TableCell>
                      <TableCell className="text-right">
                        <Button size="sm" variant="outline" className="h-8 text-xs" onClick={(e) => { e.stopPropagation(); openGalaxy(g.galaxy); }}>
                          Open Galaxy <ChevronRight className="w-3 h-3 ml-1" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
                {galaxyData && galaxyData.galaxies.length === 0 && (
                  <TableRow><TableCell colSpan={7} className="text-center py-8 text-muted-foreground">No galaxies available.</TableCell></TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </GameLayout>
  );
}
