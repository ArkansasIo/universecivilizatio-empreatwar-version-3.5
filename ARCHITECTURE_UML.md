# Universe Civilization: Empire at Wars — Architecture & UML Technical Specification

> **Document Version**: 3.2.0  
> **Target Environment**: React 18+ SPA / TypeScript Strict / Vite / Tailwind CSS  
> **Syntax**: Mermaid UML & Formatted ASCII Class / Sequence Architecture

---

## 1. System Architecture Overview

The application follows a modular, unidirectional state-driven architecture centered around React hooks, persistent local storage caches, an audio synthesis bus, and automated background execution crons.

```mermaid
graph TD
    subgraph UI Layer [React Presentation Components]
        App[App.tsx - Master Orchestrator]
        TopBar[Topbar.tsx - Global Status & Resources]
        NavBar[Navigation Bar & Route Switcher]
        
        DashboardView[DashboardView.tsx]
        PlanetsView[PlanetsView.tsx]
        IncomeView[IncomeView.tsx]
        MothershipView[MothershipView.tsx]
        StargateView[StargateView.tsx]
        UniverseView[UniverseView.tsx]
        CombatView[CombatView.tsx]
        TechTreeView[TechTreeView.tsx]
        ArmoryView[ArmoryView.tsx]
        CronCliView[CronCliView.tsx]
    end

    subgraph Business Logic & Engines [Core Services & Calculations]
        ColonyCalc[colonyCalculations.ts - Maintenance & Expansion]
        TurnEngine[Turn System & Natural Income Engine]
        CombatEngine[Tactical Combat & Fleet Simulator]
        StargateEngine[DHD Dialing & Subspace Wormhole Router]
        CronEngine[cronScheduler.ts - Background Daemon]
        SoundBus[sound.ts - Web Audio API Synthesizer]
    end

    subgraph Data & State Model [Types, Schemas & Persistence]
        StateTypes[types.ts - 1500+ Line Unified Domain Model]
        GameData[gameData.ts - Static Matrices, Units & Specs]
        CronData[cronData.ts - Crontab Rules & Action Registry]
        LocalStorage[(Browser LocalStorage Persistence)]
    end

    App --> TopBar
    App --> NavBar
    App --> DashboardView
    App --> PlanetsView
    App --> IncomeView
    App --> MothershipView
    App --> StargateView
    App --> UniverseView
    App --> CombatView
    App --> TechTreeView
    App --> ArmoryView
    App --> CronCliView

    PlanetsView --> ColonyCalc
    IncomeView --> ColonyCalc
    App --> TurnEngine
    App --> CronEngine
    App --> SoundBus
    
    ColonyCalc --> StateTypes
    TurnEngine --> GameData
    CronEngine --> CronData
    App --> LocalStorage
```

---

## 2. Domain Class & Entity Diagram (UML)

```mermaid
classDiagram
    class PlayerProfile {
        +string id
        +string name
        +Race race
        +Government government
        +number rank
        +number defconLevel
        +number overallScore
        +number militaryScore
        +number economyScore
        +number researchScore
    }

    class PlayerResources {
        +number naquadah
        +number bankedNaquadah
        +number metal
        +number crystal
        +number deuterium
        +number energy
        +number darkMatter
        +number untrainedUnits
        +number miners
        +number lifers
        +number attackTurns
    }

    class PlanetColony {
        +string id
        +string name
        +string coordinate
        +string biome
        +number level
        +number incomeBonus
        +number defenseBonus
        +number maintenanceCost
        +string moonName
        +number jumpGateLevel
        +boolean isHomeworld
        +string specialization
        +string taxPolicy
        +number fieldsUsed
        +number fieldsMax
        +PlanetaryLifeSupport lifeSupport
        +PlanetaryHazard[] hazards
    }

    class ColonyMaintenanceBreakdown {
        +number baseCost
        +number levelMultiplier
        +number homeworldDiscount
        +number logisticalStrain
        +number specializationModifier
        +number taxPolicyModifier
        +number totalMaintenanceCost
        +number grossIncome
        +number netIncome
        +number profitMarginPercent
        +boolean isDeficit
    }

    class MothershipTitan {
        +string id
        +string name
        +string flagshipClass
        +number level
        +number xp
        +number hull
        +number hullMax
        +number shield
        +number shieldMax
        +number powerGridMax
        +MothershipSubsystem[] subsystems
        +MothershipHardpoint[] hardpoints
        +CarrierSquadron[] squadrons
        +MothershipSortie[] activeSorties
    }

    class StargateNetworkNode {
        +string id
        +string gateName
        +string coordinate
        +string[] addressGlyphs
        +boolean hasIris
        +boolean isIrisClosed
        +boolean isWormholeActive
        +number wormholeDurationSeconds
    }

    class OGameFleetMission {
        +string id
        +string missionType
        +string originCoordinate
        +string targetCoordinate
        +Record~string, number~ ships
        +Record~string, number~ cargo
        +number departureTimestamp
        +number arrivalTimestamp
        +string status
    }

    PlayerProfile "1" *-- "1" PlayerResources : owns
    PlayerProfile "1" *-- "1..*" PlanetColony : rules
    PlanetColony ..> ColonyMaintenanceBreakdown : calculated via
    PlayerProfile "1" *-- "1" MothershipTitan : commands
    PlanetColony "1" o-- "0..1" StargateNetworkNode : houses
    PlayerProfile "1" *-- "0..*" OGameFleetMission : dispatches
```

---

## 3. Sequence Diagram: Turn Calculation & Colony Maintenance Upkeep

```mermaid
sequenceDiagram
    autonumber
    actor Player as Commander (User)
    participant UI as App / IncomeView
    participant Engine as Turn System Engine
    participant Calc as colonyCalculations.ts
    participant State as React State & LocalStorage
    participant Sound as sound.ts (Web Audio)

    Player->>UI: Triggers Next Turn / 30m Auto-Tick
    UI->>Engine: executeTurnStep(playerState)
    
    Engine->>Calc: getEmpireColonialSummary(planets)
    loop For each colonized world
        Calc->>Calc: calculateColonyMaintenance(planet, totalColonies)
        Note over Calc: Base = Lvl*2500 + Lvl^1.45*850<br/>Applies Homeworld, Strain, Spec & Tax mods
    end
    Calc-->>Engine: Returns { totalGross, totalMaintenance, netColonial }

    Engine->>Engine: Compute Base Gross = (Untrained*20) + (Workforce*80) + totalGross
    Engine->>Engine: Compute Net Base = max(0, Base Gross - totalMaintenance)
    Engine->>Engine: Apply Race Modifier (e.g. Tollan 1.25x)
    Engine->>Engine: Apply DEFCON Readiness Penalty (DEFCON 0-4)
    Engine-->>UI: Final Net Turn Revenue

    UI->>State: Update PlayerResources { naquadah += netTurn, attackTurns += 1 }
    UI->>Sound: sound.play('coin' | 'turn')
    UI-->>Player: Render updated HUD & Ledger Visuals
```

---

## 4. Sequence Diagram: Stargate DHD Dialing & Iris Engagement

```mermaid
sequenceDiagram
    autonumber
    actor Player as Commander
    participant DHD as StargateView UI
    participant SG as Stargate Network Router
    participant Iris as Iris Protective Grid
    participant Audio as sound.ts Audio Synthesizer

    Player->>DHD: Selects 7-Symbol Address Glyphs
    DHD->>Audio: sound.play('gate_chevron_lock')
    Note over DHD: Glyph 1 to 7 encoded sequentially
    Player->>DHD: Press Big Red DHD Activator
    
    DHD->>SG: establishWormhole(sourceCoord, targetCoord)
    SG->>SG: Verify Subspace Carrier Frequency
    SG->>Audio: sound.play('gate_kawoosh')
    SG-->>DHD: Wormhole Active (38-Minute Horizon)

    alt Hostile Incursion Detected
        Player->>Iris: toggleIrisLock(planetId, true)
        Iris->>Iris: Mechanical Titanium-Trinium Iris Deployed
        Iris->>Audio: sound.play('iris_close')
        Note over Iris: Incoming enemy matter pulverized on impact
    else Safe Outbound Transit
        Player->>SG: sendExplorationTeam(activeWormhole)
        SG-->>Player: Mission Report & Artifacts Retrieved
    end
```

---

## 5. State Transition Diagram: Flagship Combat Operations

```mermaid
stateDiagram-v2
    [*] --> StationedInOrbit : Flagship Built / Spawned
    
    StationedInOrbit --> SubsystemPowerConfig : Adjust Reactor MW Allocation
    SubsystemPowerConfig --> StationedInOrbit : Power Diverted
    
    StationedInOrbit --> SortieDeployment : Select Squadron & Target
    SortieDeployment --> SortieUnderway : Carrier Wings Launched
    SortieUnderway --> SortieCompleted : Timed Ticker Reaches Zero
    SortieCompleted --> StationedInOrbit : Collect Bounties & Salvage
    
    StationedInOrbit --> PlanetaryBombardment : Doomsday Lance Firing
    PlanetaryBombardment --> LanceCooldown : Discharge Orbital Particle Beam
    LanceCooldown --> StationedInOrbit : Capacitor Energy Restored
    
    StationedInOrbit --> CombatEngagement : Intercept Enemy Armada
    state CombatEngagement {
        [*] --> ShieldDeflection
        ShieldDeflection --> ArmorPlating : Shield Depleted
        ArmorPlating --> NaniteRepair : Hull Damaged
        NaniteRepair --> [*]
    }
    CombatEngagement --> StationedInOrbit : Victory / Repairs Completed
```

---

## 6. Component Hierarchy & Data Flow Diagram

```
[index.html]
    │
    ▼
[main.tsx]
    │
    ▼
[App.tsx] ◄── [sound.ts Audio Engine]
    ├── [Topbar.tsx] (Global Resources, Level, Turn Progress, Cron Activity)
    ├── [Sidebar / Navigation Menu] (20+ Command Views)
    │
    ├── [Views Layer]
    │     ├── [DashboardView.tsx] ──────► [colonyCalculations.ts]
    │     ├── [IncomeView.tsx] ─────────► [colonyCalculations.ts]
    │     ├── [PlanetsView.tsx] ────────► [colonyCalculations.ts]
    │     ├── [MothershipView.tsx] ─────► [gameData.ts]
    │     ├── [StargateView.tsx] ───────► [gameData.ts]
    │     ├── [UniverseView.tsx] ───────► [gameData.ts]
    │     ├── [TechTreeView.tsx] ───────► [gameData.ts]
    │     ├── [ArmoryView.tsx] ─────────► [gameData.ts]
    │     ├── [CombatView.tsx] ─────────► [gameData.ts]
    │     └── [CronCliView.tsx] ────────► [cronScheduler.ts]
    │
    └── [Persistence Layer] (LocalStorage: uc_profile, uc_resources, uc_planets, uc_crontab)
```

---

## 7. Mathematical Model Formalization

### 7.1 Multi-World Logistical Strain Function
Let $N$ be the total count of colonized worlds. The logistical strain multiplier $S(N)$ is defined as:

$$S(N) = \begin{cases} 
1.0 & \text{if } N \le 2 \\
1.0 + (N - 2) \times 0.08 & \text{if } N > 2 
\end{cases}$$

### 7.2 Colony Upgrade Cost Function
For a colony of current tier $L$, the Naquadah cost $C(L)$ to expand to tier $L+1$ is given by:

$$C(L) = L \times 35{,}000 + 20{,}000$$

### 7.3 Expansion Profitability Derivative
The incremental net profit per turn $\Delta P(L)$ upon upgrading a colony tier is:

$$\Delta P(L) = 6{,}500 - \Big(\text{Maintenance}(L+1) - \text{Maintenance}(L)\Big)$$

Where $\Delta P(L) > 0$ indicates a sustainable expansion step, while $\Delta P(L) \le 0$ indicates over-extension requiring immediate workforce or specialization mitigation.
