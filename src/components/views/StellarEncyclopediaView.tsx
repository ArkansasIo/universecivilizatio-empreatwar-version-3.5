import React, { useState, useMemo } from 'react';
import {
  Globe,
  Moon,
  Maximize2,
  Compass,
  Search,
  Shield,
  Layers,
  BarChart2,
} from 'lucide-react';
import { sound } from '../../sound';
import {
  PlanetaryClassAZ,
  MoonClassAZ,
  PlanetarySizeScale,
  InterstellarCelestialObject,
} from '../../types';
import {
  PLANETARY_CLASSES_A_TO_Z,
  MOON_CLASSES_A_TO_Z,
  PLANETARY_SIZE_SCALES,
  INTERSTELLAR_OBJECTS,
} from '../../stellarEncyclopediaData';

export const StellarEncyclopediaView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'planets' | 'moons' | 'sizes' | 'interstellar'>('planets');
  const [selectedPlanetLetter, setSelectedPlanetLetter] = useState<string>('M');
  const [selectedMoonCode, setSelectedMoonCode] = useState<string>('MON-A');
  const [selectedSizeLevel, setSelectedSizeLevel] = useState<number>(5);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');

  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

  // Selected planet class
  const activePlanet = useMemo(() => {
    return (
      PLANETARY_CLASSES_A_TO_Z.find((p) => p.letter === selectedPlanetLetter) ||
      PLANETARY_CLASSES_A_TO_Z[0]
    );
  }, [selectedPlanetLetter]);

  // Selected moon class
  const activeMoon = useMemo(() => {
    return (
      MOON_CLASSES_A_TO_Z.find((m) => m.classCode === selectedMoonCode) ||
      MOON_CLASSES_A_TO_Z[0]
    );
  }, [selectedMoonCode]);

  // Filtered interstellar objects
  const filteredObjects = useMemo(() => {
    return INTERSTELLAR_OBJECTS.filter((obj) => {
      const matchesSearch =
        obj.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        obj.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        obj.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = categoryFilter === 'ALL' || obj.category.toUpperCase() === categoryFilter;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, categoryFilter]);

  return (
    <div id="stellar-encyclopedia-view" className="space-y-6">
      {/* Header Banner */}
      <div className="border border-[#dedede] bg-white p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="text-[9px] font-bold text-[#777777] tracking-[1.5px] uppercase mb-1">
            IMPERIAL ASTROPHYSICS & CARTOGRAPHY ARCHIVE
          </div>
          <h2 className="text-2xl font-bold text-[#111111] flex items-center gap-3">
            <span>Stellar Planetary & Lunar Encyclopedia</span>
            <span className="text-xs bg-[#111111] text-white px-2.5 py-0.5 font-mono uppercase">
              Classes A-Z · Sizes 1-9
            </span>
          </h2>
          <p className="text-sm text-[#666666] mt-1 max-w-3xl leading-relaxed">
            Exhaustive taxonomic database detailing all 26 Starfleet & Game Planetary Classes (A through Z), 
            Lunar Sub-Classes, the Standard 9-Tier Planetary Scale, and Deep-Space Interstellar Megastructures.
          </p>
        </div>

        <div className="flex gap-4 border border-[#dedede] bg-[#fafafa] p-3 text-right font-mono shrink-0">
          <div>
            <span className="text-[10px] text-[#777777] block uppercase font-bold">Taxa Indexed</span>
            <span className="text-lg font-bold text-[#111111]">61 Bodies</span>
          </div>
          <div className="border-l border-[#dedede] pl-4">
            <span className="text-[10px] text-[#777777] block uppercase font-bold">Standard Scale</span>
            <span className="text-lg font-bold text-cyan-700">1 to 9</span>
          </div>
        </div>
      </div>

      {/* Main Tab Navigation */}
      <div className="flex border-b border-[#dedede] gap-2 overflow-x-auto">
        <button
          type="button"
          onClick={() => {
            sound.play('click');
            setActiveTab('planets');
          }}
          className={`px-5 py-2.5 text-xs font-bold uppercase tracking-wider transition-colors border-b-2 flex items-center gap-2 cursor-pointer ${
            activeTab === 'planets'
              ? 'border-[#111111] text-[#111111] bg-white font-black'
              : 'border-transparent text-[#777777] hover:text-[#111111]'
          }`}
        >
          <Globe size={14} />
          <span>Planetary Classes (A - Z)</span>
        </button>

        <button
          type="button"
          onClick={() => {
            sound.play('click');
            setActiveTab('moons');
          }}
          className={`px-5 py-2.5 text-xs font-bold uppercase tracking-wider transition-colors border-b-2 flex items-center gap-2 cursor-pointer ${
            activeTab === 'moons'
              ? 'border-[#111111] text-[#111111] bg-white font-black'
              : 'border-transparent text-[#777777] hover:text-[#111111]'
          }`}
        >
          <Moon size={14} />
          <span>Lunar Classification System</span>
        </button>

        <button
          type="button"
          onClick={() => {
            sound.play('click');
            setActiveTab('sizes');
          }}
          className={`px-5 py-2.5 text-xs font-bold uppercase tracking-wider transition-colors border-b-2 flex items-center gap-2 cursor-pointer ${
            activeTab === 'sizes'
              ? 'border-[#111111] text-[#111111] bg-white font-black'
              : 'border-transparent text-[#777777] hover:text-[#111111]'
          }`}
        >
          <Maximize2 size={14} />
          <span>Planetary Size System (1 - 9)</span>
        </button>

        <button
          type="button"
          onClick={() => {
            sound.play('click');
            setActiveTab('interstellar');
          }}
          className={`px-5 py-2.5 text-xs font-bold uppercase tracking-wider transition-colors border-b-2 flex items-center gap-2 cursor-pointer ${
            activeTab === 'interstellar'
              ? 'border-[#111111] text-[#111111] bg-white font-black'
              : 'border-transparent text-[#777777] hover:text-[#111111]'
          }`}
        >
          <Compass size={14} />
          <span>Interstellar Megastructures & Anomalies</span>
        </button>
      </div>

      {/* ============================================================ */}
      {/* 1. PLANETARY CLASSES A TO Z */}
      {/* ============================================================ */}
      {activeTab === 'planets' && (
        <div className="space-y-6">
          {/* Alphabet Letter Selector */}
          <div className="border border-[#dedede] bg-white p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-bold text-[#777777] uppercase tracking-wider">
                Select Planetary Class Letter (A to Z)
              </span>
              <span className="text-[11px] font-mono text-[#111111] font-bold">
                Active: {activePlanet.className}
              </span>
            </div>
            <div className="grid grid-cols-13 sm:grid-cols-26 gap-1">
              {alphabet.map((letter) => {
                const isSelected = selectedPlanetLetter === letter;
                return (
                  <button
                    key={letter}
                    type="button"
                    onClick={() => {
                      sound.play('click');
                      setSelectedPlanetLetter(letter);
                    }}
                    className={`h-9 font-mono font-bold text-xs transition-colors border cursor-pointer flex items-center justify-center ${
                      isSelected
                        ? 'bg-[#111111] text-white border-[#111111]'
                        : 'bg-[#fafafa] text-[#555555] border-[#dedede] hover:border-[#111111] hover:text-[#111111]'
                    }`}
                  >
                    {letter}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Detailed Planet Class Dossier */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left: Hero Summary Card */}
            <div className="border border-[#dedede] bg-white p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-[#dedede] pb-3">
                <div>
                  <span className="text-[10px] font-mono font-bold uppercase text-[#777777]">
                    Imperial Classification
                  </span>
                  <h3 className="text-xl font-bold text-[#111111]">Class {activePlanet.letter} World</h3>
                </div>
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center font-black font-mono text-white text-base shadow-sm"
                  style={{ backgroundColor: activePlanet.colorHex || '#111111' }}
                >
                  {activePlanet.letter}
                </div>
              </div>

              <div className="space-y-2 text-xs font-mono">
                <div className="flex justify-between py-1 border-b border-[#eeeeee]">
                  <span className="text-[#777777]">Designation:</span>
                  <span className="font-bold text-[#111111]">{activePlanet.scientificDesignation}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-[#eeeeee]">
                  <span className="text-[#777777]">Category:</span>
                  <span className="font-bold text-[#111111]">{activePlanet.typeCategory}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-[#eeeeee]">
                  <span className="text-[#777777]">Average Diameter:</span>
                  <span className="font-bold text-[#111111]">{activePlanet.averageDiameterKm.toLocaleString()} km</span>
                </div>
                <div className="flex justify-between py-1 border-b border-[#eeeeee]">
                  <span className="text-[#777777]">Default Size Tier:</span>
                  <span className="font-bold text-[#111111]">Size {activePlanet.sizeRating}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-[#eeeeee]">
                  <span className="text-[#777777]">Surface Temperature:</span>
                  <span className="font-bold text-amber-700">{activePlanet.temperatureRange}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-[#777777]">Habitability Rating:</span>
                  <span
                    className={`font-bold ${
                      activePlanet.habitabilityScore >= 70
                        ? 'text-green-700'
                        : activePlanet.habitabilityScore >= 30
                        ? 'text-amber-700'
                        : 'text-red-700'
                    }`}
                  >
                    {activePlanet.habitabilityScore} / 100
                  </span>
                </div>
              </div>

              {/* Habitability Progress Bar */}
              <div className="space-y-1">
                <div className="flex justify-between text-[10px] font-mono text-[#777777]">
                  <span>Habitability Index</span>
                  <span>{activePlanet.habitabilityScore}%</span>
                </div>
                <div className="w-full h-2 bg-[#eeeeee] overflow-hidden">
                  <div
                    className={`h-full ${
                      activePlanet.habitabilityScore >= 70
                        ? 'bg-green-600'
                        : activePlanet.habitabilityScore >= 30
                        ? 'bg-amber-500'
                        : 'bg-red-600'
                    }`}
                    style={{ width: `${Math.max(activePlanet.habitabilityScore, 3)}%` }}
                  />
                </div>
              </div>

              <div className="p-3 bg-[#fafafa] border border-[#dedede] text-xs text-[#555555] leading-relaxed">
                {activePlanet.description}
              </div>
            </div>

            {/* Middle & Right: Composition & Yields */}
            <div className="lg:col-span-2 space-y-6">
              {/* Resource Multipliers Grid */}
              <div className="border border-[#dedede] bg-white p-6">
                <h4 className="text-xs font-bold text-[#111111] uppercase tracking-wider mb-4 flex items-center gap-2">
                  <BarChart2 size={14} />
                  <span>Planetary Resource & Energy Multipliers</span>
                </h4>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="border border-[#dedede] p-3 bg-[#fafafa]">
                    <span className="text-[10px] text-[#777777] uppercase block font-bold">Metal Yield</span>
                    <span className="text-lg font-bold font-mono text-[#111111]">
                      {activePlanet.metalMultiplier.toFixed(2)}x
                    </span>
                    <span className="text-[10px] text-[#888888] block mt-1">Mining Base</span>
                  </div>

                  <div className="border border-[#dedede] p-3 bg-[#fafafa]">
                    <span className="text-[10px] text-[#777777] uppercase block font-bold">Crystal Yield</span>
                    <span className="text-lg font-bold font-mono text-cyan-700">
                      {activePlanet.crystalMultiplier.toFixed(2)}x
                    </span>
                    <span className="text-[10px] text-[#888888] block mt-1">Silicate Matrix</span>
                  </div>

                  <div className="border border-[#dedede] p-3 bg-[#fafafa]">
                    <span className="text-[10px] text-[#777777] uppercase block font-bold">Deuterium Yield</span>
                    <span className="text-lg font-bold font-mono text-indigo-700">
                      {activePlanet.deuteriumMultiplier.toFixed(2)}x
                    </span>
                    <span className="text-[10px] text-[#888888] block mt-1">Heavy Isotope</span>
                  </div>

                  <div className="border border-[#dedede] p-3 bg-[#fafafa]">
                    <span className="text-[10px] text-[#777777] uppercase block font-bold">Solar & Thermal</span>
                    <span className="text-lg font-bold font-mono text-amber-600">
                      {activePlanet.energyMultiplier.toFixed(2)}x
                    </span>
                    <span className="text-[10px] text-[#888888] block mt-1">Power Output</span>
                  </div>
                </div>
              </div>

              {/* Atmospheric & Surface Analysis */}
              <div className="border border-[#dedede] bg-white p-6 space-y-4">
                <h4 className="text-xs font-bold text-[#111111] uppercase tracking-wider mb-2 flex items-center gap-2">
                  <Layers size={14} />
                  <span>Geological & Atmospheric Spectra</span>
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div className="border border-[#dedede] p-4 bg-[#fafafa]">
                    <span className="text-[10px] text-[#777777] uppercase font-bold block mb-1">
                      Atmospheric Chemistry
                    </span>
                    <p className="font-mono text-[#111111] leading-relaxed">
                      {activePlanet.atmosphereComposition}
                    </p>
                  </div>

                  <div className="border border-[#dedede] p-4 bg-[#fafafa]">
                    <span className="text-[10px] text-[#777777] uppercase font-bold block mb-1">
                      Crustal / Surface Composition
                    </span>
                    <p className="font-mono text-[#111111] leading-relaxed">
                      {activePlanet.surfaceComposition}
                    </p>
                  </div>
                </div>

                {/* Sub-Classes and Variants */}
                <div className="border-t border-[#eeeeee] pt-4">
                  <div className="text-[10px] text-[#777777] uppercase font-bold mb-2">
                    Known Geological Sub-Classes & Micro-Biomes
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {activePlanet.subClasses.map((sc, idx) => (
                      <span
                        key={idx}
                        className="px-2.5 py-1 text-xs bg-[#eeeeee] text-[#111111] font-mono border border-[#dedede]"
                      >
                        {sc}
                      </span>
                    ))}
                    {activePlanet.subTypes.map((st, idx) => (
                      <span
                        key={idx}
                        className="px-2.5 py-1 text-xs bg-white text-[#555555] font-mono border border-[#cccccc]"
                      >
                        Variant: {st}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* 2. LUNAR CLASSIFICATION SYSTEM */}
      {/* ============================================================ */}
      {activeTab === 'moons' && (
        <div className="space-y-6">
          {/* Moon Code Selector */}
          <div className="border border-[#dedede] bg-white p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] font-bold text-[#777777] uppercase tracking-wider">
                Select Lunar Satellite Taxonomy
              </span>
              <span className="text-[11px] font-mono text-[#111111] font-bold">
                Active: {activeMoon.className}
              </span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
              {MOON_CLASSES_A_TO_Z.map((moon) => {
                const isSelected = selectedMoonCode === moon.classCode;
                return (
                  <button
                    key={moon.classCode}
                    type="button"
                    onClick={() => {
                      sound.play('click');
                      setSelectedMoonCode(moon.classCode);
                    }}
                    className={`p-2.5 font-mono text-left text-xs transition-colors border cursor-pointer ${
                      isSelected
                        ? 'bg-[#111111] text-white border-[#111111]'
                        : 'bg-[#fafafa] text-[#555555] border-[#dedede] hover:border-[#111111] hover:text-[#111111]'
                    }`}
                  >
                    <span className="block font-bold text-[11px]">{moon.classCode}</span>
                    <span className="block text-[10px] truncate opacity-80">{moon.className}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Detailed Moon Dossier */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="border border-[#dedede] bg-white p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-[#dedede] pb-3">
                <div>
                  <span className="text-[10px] font-mono font-bold uppercase text-[#777777]">
                    Lunar Satellite Taxonomy
                  </span>
                  <h3 className="text-lg font-bold text-[#111111]">{activeMoon.className}</h3>
                </div>
                <div className="px-2.5 py-1 bg-[#111111] font-black font-mono text-white text-xs">
                  {activeMoon.classCode}
                </div>
              </div>

              <div className="space-y-2 text-xs font-mono">
                <div className="flex justify-between py-1 border-b border-[#eeeeee]">
                  <span className="text-[#777777]">Origin Type:</span>
                  <span className="font-bold text-[#111111] uppercase">{activeMoon.originType.replace('_', ' ')}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-[#eeeeee]">
                  <span className="text-[#777777]">Density:</span>
                  <span className="font-bold text-[#111111]">{activeMoon.densityGcm3} g/cm³</span>
                </div>
                <div className="flex justify-between py-1 border-b border-[#eeeeee]">
                  <span className="text-[#777777]">Surface Gravity:</span>
                  <span className="font-bold text-[#111111]">{activeMoon.surfaceGravityG} G</span>
                </div>
                <div className="flex justify-between py-1 border-b border-[#eeeeee]">
                  <span className="text-[#777777]">Max Fields:</span>
                  <span className="font-bold text-cyan-700">{activeMoon.fieldsMax} Building Slots</span>
                </div>
                <div className="flex justify-between py-1 border-b border-[#eeeeee]">
                  <span className="text-[#777777]">Size Tier:</span>
                  <span className="font-bold text-amber-700">Tier {activeMoon.lunarSizeRating}</span>
                </div>
              </div>

              <div className="p-3 bg-[#fafafa] border border-[#dedede] text-xs text-[#555555] leading-relaxed">
                {activeMoon.description}
              </div>
            </div>

            <div className="lg:col-span-2 space-y-6">
              {/* Tactical Bonuses Card */}
              <div className="border border-[#dedede] bg-white p-6">
                <h4 className="text-xs font-bold text-[#111111] uppercase tracking-wider mb-4 flex items-center gap-2">
                  <Shield size={14} />
                  <span>Lunar Base Tactical & Strategic Phalanx Buffs</span>
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="border border-[#dedede] p-4 bg-[#fafafa]">
                    <span className="text-[10px] text-[#777777] uppercase block font-bold">Phalanx Sensor Efficiency</span>
                    <span className="text-xl font-bold font-mono text-cyan-700">
                      {activeMoon.phalanxEfficiency}%
                    </span>
                    <span className="text-[10px] text-[#888888] block mt-1">Interstellar Detection Baseline</span>
                  </div>

                  <div className="border border-[#dedede] p-4 bg-[#fafafa]">
                    <span className="text-[10px] text-[#777777] uppercase block font-bold">Subspace Jump Gate Synergy</span>
                    <span className="text-xl font-bold font-mono text-green-700">
                      {activeMoon.jumpGateSynergy}%
                    </span>
                    <span className="text-[10px] text-[#888888] block mt-1">Conduit Charge Acceleration</span>
                  </div>
                </div>
              </div>

              {/* Surface & Structural Features */}
              <div className="border border-[#dedede] bg-white p-6 space-y-4">
                <h4 className="text-xs font-bold text-[#111111] uppercase tracking-wider mb-2">
                  Special Astronomical Property & Strategic Advantage
                </h4>
                <div className="border border-[#dedede] p-4 bg-[#fafafa] text-xs font-mono text-[#333333] leading-relaxed">
                  {activeMoon.specialFeature}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* 3. PLANETARY SIZE SYSTEM (1 TO 9) */}
      {/* ============================================================ */}
      {activeTab === 'sizes' && (
        <div className="space-y-6">
          <div className="border border-[#dedede] bg-white p-6">
            <h3 className="text-base font-bold text-[#111111] uppercase tracking-wider mb-1">
              9-Tier Universal Planetary Size Scale
            </h3>
            <p className="text-xs text-[#666666] mb-6">
              Standard imperial volumetric metric governing maximum surface building fields, defense grid saturation, 
              atmospheric gravity, and orbital space station capacity.
            </p>

            {/* Size Selector Buttons */}
            <div className="grid grid-cols-3 sm:grid-cols-9 gap-2 mb-6">
              {PLANETARY_SIZE_SCALES.map((scale) => {
                const isSelected = selectedSizeLevel === scale.sizeLevel;
                return (
                  <button
                    key={scale.sizeLevel}
                    type="button"
                    onClick={() => {
                      sound.play('click');
                      setSelectedSizeLevel(scale.sizeLevel);
                    }}
                    className={`p-3 text-center border cursor-pointer transition-colors ${
                      isSelected
                        ? 'bg-[#111111] text-white border-[#111111]'
                        : 'bg-[#fafafa] text-[#333333] border-[#dedede] hover:border-[#111111]'
                    }`}
                  >
                    <span className="block text-[10px] font-mono uppercase opacity-75">Scale</span>
                    <strong className="block text-lg font-bold font-mono">Tier {scale.sizeLevel}</strong>
                    <span className="block text-[9px] truncate mt-0.5">{scale.category}</span>
                  </button>
                );
              })}
            </div>

            {/* Active Size Detail */}
            {(() => {
              const activeScale =
                PLANETARY_SIZE_SCALES.find((s) => s.sizeLevel === selectedSizeLevel) ||
                PLANETARY_SIZE_SCALES[4];

              return (
                <div className="border border-[#dedede] p-6 bg-[#fafafa] space-y-6">
                  <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-[#dedede] pb-4 gap-2">
                    <div>
                      <span className="text-[10px] font-mono font-bold uppercase bg-[#111111] text-white px-2 py-0.5">
                        Tier {activeScale.sizeLevel} Planetary Scale
                      </span>
                      <h4 className="text-xl font-bold text-[#111111] mt-1">{activeScale.label}</h4>
                    </div>
                    <div className="text-sm font-mono text-[#666666]">
                      Diameter: <strong className="text-[#111111]">{activeScale.diameterRangeKm}</strong>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <div className="border border-[#dedede] p-4 bg-white">
                      <span className="text-[10px] text-[#777777] uppercase block font-bold">Building Fields</span>
                      <span className="text-lg font-bold font-mono text-[#111111]">
                        {activeScale.fieldsRange}
                      </span>
                      <span className="text-[10px] text-[#888888] block mt-1">Ground Infrastructure</span>
                    </div>

                    <div className="border border-[#dedede] p-4 bg-white">
                      <span className="text-[10px] text-[#777777] uppercase block font-bold">Max Capacity</span>
                      <span className="text-lg font-bold font-mono text-cyan-700">
                        {activeScale.maxBuildingCapacity} Max
                      </span>
                      <span className="text-[10px] text-[#888888] block mt-1">Surface Cap</span>
                    </div>

                    <div className="border border-[#dedede] p-4 bg-white">
                      <span className="text-[10px] text-[#777777] uppercase block font-bold">Defense Slots</span>
                      <span className="text-lg font-bold font-mono text-red-700">
                        {activeScale.defenseSlots} Units
                      </span>
                      <span className="text-[10px] text-[#888888] block mt-1">Turrets & Shield Domes</span>
                    </div>

                    <div className="border border-[#dedede] p-4 bg-white">
                      <span className="text-[10px] text-[#777777] uppercase block font-bold">Mass Scale</span>
                      <span className="text-xs font-bold font-mono text-amber-700 block mt-1">
                        {activeScale.massComparison}
                      </span>
                      <span className="text-[10px] text-[#888888] block mt-1">Earth Equivalents</span>
                    </div>
                  </div>

                  <div className="border border-[#dedede] p-4 bg-white text-xs font-mono text-[#333333]">
                    <strong className="text-[#111111] block mb-1">Strategic & Tactical Advantage:</strong>
                    {activeScale.tacticalAdvantage}
                  </div>
                </div>
              );
            })()}
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* 4. INTERSTELLAR MEGASTRUCTURES & ANOMALIES */}
      {/* ============================================================ */}
      {activeTab === 'interstellar' && (
        <div className="space-y-6">
          <div className="border border-[#dedede] bg-white p-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
              <div>
                <h3 className="text-base font-bold text-[#111111] uppercase tracking-wider mb-1">
                  Interstellar Megastructures, Relics & Anomalies
                </h3>
                <p className="text-xs text-[#666666]">
                  Cosmic phenomena, Dyson Swarms, Ringworlds, Quasars, and Ancient Stargate Relics across galaxies.
                </p>
              </div>

              {/* Search Bar */}
              <div className="relative w-full md:w-72">
                <Search size={14} className="absolute left-3 top-3 text-[#888888]" />
                <input
                  type="text"
                  placeholder="Search phenomena, relics..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs border border-[#dedede] bg-[#fafafa] font-mono focus:outline-none focus:border-[#111111]"
                />
              </div>
            </div>

            {/* Objects Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredObjects.map((obj) => (
                <div
                  key={obj.id}
                  className="border border-[#dedede] p-5 bg-[#fafafa] flex flex-col justify-between space-y-4 hover:border-[#111111] transition-colors"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono uppercase bg-[#111111] text-white px-2 py-0.5">
                        {obj.category.replace('_', ' ')}
                      </span>
                      <span className="text-xs font-mono font-bold text-amber-600">
                        {obj.radiationIndex}
                      </span>
                    </div>

                    <h4 className="text-base font-bold text-[#111111]">{obj.name}</h4>
                    <p className="text-xs text-[#666666] leading-relaxed">{obj.description}</p>

                    <div className="p-3 bg-white border border-[#eeeeee] text-xs font-mono space-y-1">
                      <div className="flex justify-between">
                        <span className="text-[#888888]">Resource Output:</span>
                        <strong className="text-cyan-700">{obj.resourceYield}</strong>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[#888888]">Tactical Effect:</span>
                        <strong className="text-green-700">{obj.tacticalEffect}</strong>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[#888888]">Coordinates:</span>
                        <strong className="text-[#111111]">{obj.coordinates}</strong>
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      sound.play('research');
                    }}
                    className="w-full py-2.5 bg-[#111111] text-white text-xs font-bold uppercase hover:bg-[#333333] transition-colors cursor-pointer"
                  >
                    Dispatch Deep Science Survey →
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
