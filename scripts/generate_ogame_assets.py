#!/usr/bin/env python3
"""
Comprehensive OGame & Sci-Fi Game Asset Generator
Generates authentic OGame asset sets, OGameX paths, and game assets across:
- public/assets/ (buildings, ships, defense, research, resources, planets, backgrounds, menu)
- public/assets/ogamex/ (objects, content, backgrounds, headers, fleet, galaxy, layout, planets)
- public/ogame/ (standard OGame German/numeric structure: gebaeude, forschung, schiffe, verteidigung, offiziere, ressourcen)
- public/styles/theme/gow/ (legacy OGame 2Moons skin paths)
- public/img/ (standard web root image aliases)
"""

import os
import sys
import math
import random
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont, ImageFilter

if sys.stdout.encoding != 'utf-8':
    try:
        sys.stdout.reconfigure(encoding='utf-8')
    except Exception:
        pass

random.seed(42)

# Theme palettes (RGB tuples)
PALETTES = {
    "metal": {"bg1": (15, 20, 28), "bg2": (35, 45, 60), "primary": (180, 190, 205), "accent": (220, 230, 245), "glow": (100, 130, 170)},
    "crystal": {"bg1": (12, 22, 35), "bg2": (20, 50, 80), "primary": (56, 189, 248), "accent": (186, 230, 253), "glow": (14, 165, 233)},
    "deuterium": {"bg1": (20, 10, 30), "bg2": (50, 20, 75), "primary": (192, 132, 252), "accent": (243, 232, 255), "glow": (168, 85, 247)},
    "energy": {"bg1": (25, 20, 10), "bg2": (70, 50, 15), "primary": (251, 191, 36), "accent": (254, 243, 199), "glow": (245, 158, 11)},
    "dark_matter": {"bg1": (10, 5, 25), "bg2": (30, 10, 60), "primary": (236, 72, 153), "accent": (251, 207, 232), "glow": (219, 39, 119)},
    "building": {"bg1": (15, 23, 42), "bg2": (30, 41, 59), "primary": (59, 130, 246), "accent": (147, 197, 253), "glow": (37, 99, 235)},
    "factory": {"bg1": (24, 24, 27), "bg2": (63, 63, 70), "primary": (249, 115, 22), "accent": (253, 186, 116), "glow": (234, 88, 12)},
    "shipyard": {"bg1": (15, 23, 42), "bg2": (30, 58, 138), "primary": (96, 165, 250), "accent": (191, 219, 254), "glow": (37, 99, 235)},
    "research": {"bg1": (6, 30, 35), "bg2": (13, 74, 86), "primary": (45, 212, 191), "accent": (204, 251, 241), "glow": (20, 184, 166)},
    "ship": {"bg1": (24, 12, 15), "bg2": (69, 20, 28), "primary": (244, 63, 94), "accent": (254, 205, 211), "glow": (225, 29, 72)},
    "defense": {"bg1": (25, 20, 10), "bg2": (68, 50, 15), "primary": (234, 179, 8), "accent": (254, 240, 138), "glow": (202, 138, 4)},
    "shield": {"bg1": (10, 20, 40), "bg2": (20, 60, 110), "primary": (96, 165, 250), "accent": (219, 234, 254), "glow": (59, 130, 246)},
    "officer": {"bg1": (20, 15, 35), "bg2": (55, 35, 90), "primary": (167, 139, 250), "accent": (237, 233, 254), "glow": (139, 92, 246)},
    "planet": {"bg1": (10, 15, 30), "bg2": (25, 40, 70), "primary": (52, 211, 153), "accent": (209, 250, 229), "glow": (16, 185, 129)},
}

def draw_starfield(draw, width, height, num_stars=60):
    for _ in range(num_stars):
        x = random.randint(0, width - 1)
        y = random.randint(0, height - 1)
        brightness = random.randint(120, 255)
        size = random.choice([1, 1, 1, 2])
        color = (brightness, brightness, min(255, brightness + random.randint(0, 30)))
        if size == 1:
            draw.point((x, y), fill=color)
        else:
            draw.rectangle([x, y, x + 1, y + 1], fill=color)

def draw_gradient_background(width, height, c1, c2):
    base = Image.new("RGB", (width, height), c1)
    top = Image.new("RGB", (width, height), c2)
    mask = Image.new("L", (width, height))
    mask_draw = ImageDraw.Draw(mask)
    for y in range(height):
        ratio = y / max(1, height - 1)
        lum = int(255 * (0.3 + 0.7 * ratio))
        mask_draw.line([(0, y), (width, y)], fill=lum)
    return Image.composite(top, base, mask)

def draw_glow_circle(draw, center, radius, color, glow_color, steps=6):
    cx, cy = center
    for i in range(steps, 0, -1):
        r = radius + i * 3
        alpha = int(255 * (1 - i / (steps + 1)) * 0.4)
        c = (glow_color[0], glow_color[1], glow_color[2])
        draw.ellipse([cx - r, cy - r, cx + r, cy + r], outline=c, width=1)
    draw.ellipse([cx - radius, cy - radius, cx + radius, cy + radius], fill=color)

def draw_hex(draw, center, radius, outline_color, fill_color=None, width=2):
    cx, cy = center
    points = []
    for i in range(6):
        angle = math.radians(60 * i - 30)
        px = cx + radius * math.cos(angle)
        py = cy + radius * math.sin(angle)
        points.append((px, py))
    if fill_color:
        draw.polygon(points, fill=fill_color)
    draw.polygon(points, outline=outline_color, width=width)

def draw_tech_frame(draw, width, height, primary_color, accent_color):
    # Corner brackets
    pad = 8
    arm = min(width, height) // 8
    # Top-Left
    draw.line([(pad, pad + arm), (pad, pad), (pad + arm, pad)], fill=accent_color, width=2)
    # Top-Right
    draw.line([(width - pad - arm, pad), (width - pad, pad), (width - pad, pad + arm)], fill=accent_color, width=2)
    # Bottom-Left
    draw.line([(pad, height - pad - arm), (pad, height - pad), (pad + arm, height - pad)], fill=accent_color, width=2)
    # Bottom-Right
    draw.line([(width - pad - arm, height - pad), (width - pad, height - pad), (width - pad, height - pad - arm)], fill=accent_color, width=2)
    # Outer thin border
    draw.rectangle([pad + 3, pad + 3, width - pad - 3, height - pad - 3], outline=(primary_color[0]//3, primary_color[1]//3, primary_color[2]//3), width=1)

def draw_building_icon(draw, cx, cy, size, pal):
    p, a, g = pal["primary"], pal["accent"], pal["glow"]
    # Base platform
    w = size * 0.7
    h = size * 0.12
    draw.polygon([(cx - w/2, cy + size*0.35), (cx + w/2, cy + size*0.35),
                  (cx + w*0.4, cy + size*0.35 + h), (cx - w*0.4, cy + size*0.35 + h)], fill=g, outline=a)
    # Central Tower/Structure
    tw = size * 0.35
    th = size * 0.55
    draw.rectangle([cx - tw/2, cy - th/2, cx + tw/2, cy + size*0.35], fill=(30, 45, 65), outline=p, width=2)
    # Tier levels
    for i in range(3):
        y_pos = cy - th/2 + (i + 1) * (th / 4)
        draw.line([(cx - tw/2, y_pos), (cx + tw/2, y_pos)], fill=a, width=1)
    # Antenna / Energy Beacon
    draw.line([(cx, cy - th/2), (cx, cy - th/2 - size*0.2)], fill=a, width=2)
    draw.ellipse([cx - 4, cy - th/2 - size*0.2 - 4, cx + 4, cy - th/2 - size*0.2 + 4], fill=a)

def draw_mine_icon(draw, cx, cy, size, pal):
    p, a, g = pal["primary"], pal["accent"], pal["glow"]
    # Subsurface cavern / crater
    draw.ellipse([cx - size*0.4, cy + size*0.1, cx + size*0.4, cy + size*0.4], fill=(15, 20, 30), outline=g, width=2)
    # Industrial Gantry / Derrick
    draw.polygon([(cx - size*0.3, cy + size*0.25), (cx + size*0.3, cy + size*0.25),
                  (cx + size*0.1, cy - size*0.35), (cx - size*0.1, cy - size*0.35)], fill=(35, 45, 60), outline=p, width=2)
    # Drill bit / Laser emitter
    draw.line([(cx, cy - size*0.2), (cx, cy + size*0.2)], fill=a, width=3)
    draw.ellipse([cx - 5, cy + size*0.2 - 5, cx + 5, cy + size*0.2 + 5], fill=a)

def draw_research_icon(draw, cx, cy, size, pal):
    p, a, g = pal["primary"], pal["accent"], pal["glow"]
    # Atomic orbit 1
    r_x, r_y = size * 0.4, size * 0.18
    # Draw angled ellipses
    draw.ellipse([cx - r_x, cy - r_y, cx + r_x, cy + r_y], outline=p, width=2)
    draw.ellipse([cx - r_y, cy - r_x, cx + r_y, cy + r_x], outline=g, width=2)
    # Center nucleus
    draw_glow_circle(draw, (int(cx), int(cy)), int(size * 0.12), a, p)
    # Orbiting electrons
    draw.ellipse([cx + r_x - 4, cy - 4, cx + r_x + 4, cy + 4], fill=a)
    draw.ellipse([cx - 4, cy + r_x - 4, cx + 4, cy + r_x + 4], fill=a)

def draw_ship_icon(draw, cx, cy, size, pal, ship_class="fighter"):
    p, a, g = pal["primary"], pal["accent"], pal["glow"]
    if ship_class == "fighter":
        # Swept delta fighter
        nose = (cx, cy - size * 0.4)
        wing_l = (cx - size * 0.35, cy + size * 0.3)
        engine_l = (cx - size * 0.15, cy + size * 0.2)
        engine_r = (cx + size * 0.15, cy + size * 0.2)
        wing_r = (cx + size * 0.35, cy + size * 0.3)
        draw.polygon([nose, wing_r, engine_r, (cx, cy + size * 0.15), engine_l, wing_l], fill=(45, 25, 30), outline=p, width=2)
        # Cockpit
        draw.polygon([(cx, cy - size * 0.2), (cx + 4, cy), (cx - 4, cy)], fill=a)
        # Thrusters
        draw.line([(cx - size * 0.1, cy + size * 0.2), (cx - size * 0.1, cy + size * 0.32)], fill=(255, 120, 50), width=3)
        draw.line([(cx + size * 0.1, cy + size * 0.2), (cx + size * 0.1, cy + size * 0.32)], fill=(255, 120, 50), width=3)
    elif ship_class == "deathstar":
        # Massive spherical dreadnought with superlaser dish
        r = int(size * 0.38)
        draw.ellipse([cx - r, cy - r, cx + r, cy + r], fill=(35, 35, 45), outline=p, width=2)
        # Equator trench
        draw.arc([cx - r, cy - r * 0.2, cx + r, cy + r * 0.2], 0, 360, fill=a, width=2)
        # Superlaser concavity dish
        dish_cx = int(cx + r * 0.35)
        dish_cy = int(cy - r * 0.35)
        dish_r = int(r * 0.32)
        draw.ellipse([dish_cx - dish_r, dish_cy - dish_r, dish_cx + dish_r, dish_cy + dish_r], fill=(20, 20, 30), outline=g, width=2)
        draw.ellipse([dish_cx - 4, dish_cy - 4, dish_cx + 4, dish_cy + 4], fill=(100, 255, 100))
    elif ship_class == "cargo":
        # Modular boxy cargo hauler
        w = size * 0.5
        h = size * 0.7
        draw.rectangle([cx - w/2, cy - h/2, cx + w/2, cy + h/2], fill=(30, 40, 50), outline=p, width=2)
        # Container grid
        for i in range(2):
            for j in range(3):
                bx = cx - w*0.4 + i * (w * 0.45)
                by = cy - h*0.35 + j * (h * 0.25)
                draw.rectangle([bx, by, bx + w*0.35, by + h*0.2], fill=(45, 60, 75), outline=a)
        # Front command cab
        draw.polygon([(cx, cy - h/2 - size*0.1), (cx + w/3, cy - h/2), (cx - w/3, cy - h/2)], fill=a)
    else:
        # Battleship / Cruiser / Heavy capital
        nose = (cx, cy - size * 0.45)
        draw.polygon([nose, (cx + size * 0.22, cy - size * 0.1), (cx + size * 0.32, cy + size * 0.35),
                      (cx, cy + size * 0.25), (cx - size * 0.32, cy + size * 0.35),
                      (cx - size * 0.22, cy - size * 0.1)], fill=(40, 20, 30), outline=p, width=2)
        # Armor plating lines
        draw.line([(cx, cy - size * 0.3), (cx, cy + size * 0.2)], fill=a, width=2)
        draw.line([(cx - size * 0.18, cy), (cx + size * 0.18, cy)], fill=g, width=2)
        # Weapon turrets
        draw.ellipse([cx - 8, cy - size * 0.05 - 3, cx - 2, cy - size * 0.05 + 3], fill=a)
        draw.ellipse([cx + 2, cy - size * 0.05 - 3, cx + 8, cy - size * 0.05 + 3], fill=a)

def draw_defense_icon(draw, cx, cy, size, pal, def_type="cannon"):
    p, a, g = pal["primary"], pal["accent"], pal["glow"]
    if def_type == "shield":
        # Shield dome with energy mesh
        r = int(size * 0.38)
        draw.arc([cx - r, cy - r, cx + r, cy + r], 180, 360, fill=a, width=3)
        draw.line([(cx - r, cy), (cx + r, cy)], fill=g, width=2)
        # Dome hex pattern
        for step in range(1, 4):
            sub_r = int(r * step / 3)
            draw.arc([cx - sub_r, cy - sub_r, cx + sub_r, cy + sub_r], 180, 360, fill=p, width=1)
        # Emitter base
        draw.rectangle([cx - size*0.12, cy - size*0.08, cx + size*0.12, cy + size*0.08], fill=a)
    elif def_type == "missile":
        # Missile Silo & vertical missile
        draw.rectangle([cx - size*0.25, cy + size*0.1, cx + size*0.25, cy + size*0.35], fill=(35, 35, 45), outline=p, width=2)
        # Rocket body
        draw.polygon([(cx, cy - size*0.35), (cx + size*0.08, cy - size*0.2), (cx + size*0.08, cy + size*0.15),
                      (cx - size*0.08, cy + size*0.15), (cx - size*0.08, cy - size*0.2)], fill=a, outline=g)
        # Fins
        draw.polygon([(cx - size*0.08, cy + size*0.05), (cx - size*0.18, cy + size*0.18), (cx - size*0.08, cy + size*0.15)], fill=p)
        draw.polygon([(cx + size*0.08, cy + size*0.05), (cx + size*0.18, cy + size*0.18), (cx + size*0.08, cy + size*0.15)], fill=p)
    else:
        # Heavy Turret / Gauss / Laser
        draw.rectangle([cx - size*0.3, cy + size*0.2, cx + size*0.3, cy + size*0.35], fill=(40, 35, 25), outline=p, width=2)
        draw.ellipse([cx - size*0.22, cy - size*0.05, cx + size*0.22, cy + size*0.2], fill=(50, 45, 30), outline=a, width=2)
        # Twin cannon barrels
        draw.rectangle([cx - size*0.12, cy - size*0.4, cx - size*0.04, cy], fill=a, outline=g)
        draw.rectangle([cx + size*0.04, cy - size*0.4, cx + size*0.12, cy], fill=a, outline=g)
        # Muzzle flashes
        draw.ellipse([cx - size*0.14, cy - size*0.45, cx - size*0.02, cy - size*0.35], fill=(255, 220, 100))
        draw.ellipse([cx + size*0.02, cy - size*0.45, cx + size*0.14, cy - size*0.45], fill=(255, 220, 100))

def draw_resource_icon(draw, cx, cy, size, pal, res_type="metal"):
    p, a, g = pal["primary"], pal["accent"], pal["glow"]
    if res_type == "crystal":
        # Radiant faceted crystal shard
        top = (cx, cy - size * 0.4)
        left = (cx - size * 0.28, cy)
        right = (cx + size * 0.28, cy)
        bottom = (cx, cy + size * 0.4)
        draw.polygon([top, right, bottom, left], fill=p, outline=a, width=2)
        draw.line([top, bottom], fill=a, width=2)
        draw.line([left, right], fill=a, width=1)
        draw.polygon([top, (cx, cy - size * 0.1), left], fill=a)
    elif res_type == "deuterium":
        # Pressurized isotope tank / canister with atomic vapor
        w, h = size * 0.4, size * 0.65
        draw.rectangle([cx - w/2, cy - h/2, cx + w/2, cy + h/2], fill=(45, 25, 65), outline=p, width=2)
        draw.ellipse([cx - w/2, cy - h/2 - w*0.2, cx + w/2, cy - h/2 + w*0.2], fill=a)
        draw.ellipse([cx - w/2, cy + h/2 - w*0.2, cx + w/2, cy + h/2 + w*0.2], fill=p)
        # Liquid level indicator
        draw.rectangle([cx - w*0.15, cy - h*0.2, cx + w*0.15, cy + h*0.3], fill=g)
    elif res_type == "energy":
        # Lightning bolt / plasma burst
        points = [(cx, cy - size * 0.4), (cx + size * 0.15, cy - size * 0.05),
                  (cx + size * 0.02, cy), (cx + size * 0.2, cy + size * 0.35),
                  (cx - size * 0.08, cy + size * 0.05), (cx + size * 0.05, cy - size * 0.02)]
        draw.polygon(points, fill=a, outline=g)
    elif res_type == "dark_matter":
        # Event horizon sphere with swirling gravitational distortion
        draw_glow_circle(draw, (int(cx), int(cy)), int(size * 0.3), (10, 5, 20), p, steps=8)
        draw.arc([cx - size*0.42, cy - size*0.15, cx + size*0.42, cy + size*0.15], 0, 360, fill=a, width=2)
    else:
        # Metal ingots / bars stacked
        bw, bh = size * 0.5, size * 0.18
        # Bottom ingot
        draw.rectangle([cx - bw/2, cy + size*0.1, cx + bw/2, cy + size*0.1 + bh], fill=(70, 75, 85), outline=p, width=2)
        # Top ingot
        draw.rectangle([cx - bw*0.35, cy - size*0.12, cx + bw*0.35, cy - size*0.12 + bh], fill=(120, 130, 145), outline=a, width=2)

def draw_planet_icon(draw, cx, cy, size, pal, planet_type="terran"):
    p, a, g = pal["primary"], pal["accent"], pal["glow"]
    r = int(size * 0.36)
    # Atmosphere glow
    draw.ellipse([cx - r - 4, cy - r - 4, cx + r + 4, cy + r + 4], outline=a, width=2)
    # Planet disc
    draw.ellipse([cx - r, cy - r, cx + r, cy + r], fill=pal["bg2"])
    # Continents / terrain bands
    draw.arc([cx - r, cy - r * 0.4, cx + r, cy + r * 0.4], 20, 160, fill=p, width=4)
    draw.arc([cx - r, cy, cx + r, cy + r * 0.8], 30, 150, fill=g, width=5)
    # Shadow crescent
    draw.arc([cx - r, cy - r, cx + r, cy + r], 270, 90, fill=(5, 10, 20), width=6)

def create_game_image(name, category, width=200, height=200, palette_key=None, sub_type=None):
    if not palette_key:
        if "mine" in name or "metal" in name: palette_key = "metal"
        elif "crystal" in name: palette_key = "crystal"
        elif "deuterium" in name: palette_key = "deuterium"
        elif "solar" in name or "energy" in name or "power" in name: palette_key = "energy"
        elif "dark_matter" in name or "graviton" in name: palette_key = "dark_matter"
        elif "ship" in category or "fighter" in name or "cruiser" in name or "destroyer" in name or "fleet" in category: palette_key = "ship"
        elif "defense" in category or "laser" in name or "cannon" in name or "turret" in name: palette_key = "defense"
        elif "shield" in name: palette_key = "shield"
        elif "research" in category or "tech" in name: palette_key = "research"
        elif "factory" in name or "nanite" in name: palette_key = "factory"
        elif "officer" in category or "admiral" in name or "commander" in name: palette_key = "officer"
        elif "planet" in category or "moon" in name: palette_key = "planet"
        else: palette_key = "building"

    pal = PALETTES.get(palette_key, PALETTES["building"])
    img = draw_gradient_background(width, height, pal["bg1"], pal["bg2"])
    draw = ImageDraw.Draw(img)

    # Stars background
    draw_starfield(draw, width, height, num_stars=min(80, width * height // 600))

    # Tech border / frame
    draw_tech_frame(draw, width, height, pal["primary"], pal["accent"])

    cx, cy = width // 2, height // 2 - 8
    icon_size = min(width, height) * 0.65

    # Draw specific icon by category & name
    if category in ["buildings", "gebaeude", "objects/buildings"]:
        if "mine" in name or "synthesizer" in name:
            draw_mine_icon(draw, cx, cy, icon_size, pal)
        else:
            draw_building_icon(draw, cx, cy, icon_size, pal)
    elif category in ["ships", "schiffe", "fleet"]:
        s_class = "deathstar" if "deathstar" in name or "rip" in name or name == "214" else ("cargo" if "cargo" in name or "colony" in name or "recycler" in name else "fighter")
        draw_ship_icon(draw, cx, cy, icon_size, pal, s_class)
    elif category in ["defense", "verteidigung"]:
        d_type = "shield" if "shield" in name or "dome" in name else ("missile" if "missile" in name or "silo" in name else "cannon")
        draw_defense_icon(draw, cx, cy, icon_size, pal, d_type)
    elif category in ["research", "forschung", "objects/research"]:
        draw_research_icon(draw, cx, cy, icon_size, pal)
    elif category in ["resources", "ressourcen"]:
        r_type = "crystal" if "crystal" in name else ("deuterium" if "deuterium" in name else ("energy" if "energy" in name else ("dark_matter" if "dark" in name else "metal")))
        draw_resource_icon(draw, cx, cy, icon_size, pal, r_type)
    elif category in ["planets", "planeten"]:
        draw_planet_icon(draw, cx, cy, icon_size, pal, name)
    elif category in ["offiziere", "officers"]:
        draw_glow_circle(draw, (int(cx), int(cy - icon_size * 0.1)), int(icon_size * 0.2), pal["accent"], pal["primary"])
        draw.polygon([(cx, cy + icon_size * 0.1), (cx + icon_size * 0.35, cy + icon_size * 0.45), (cx - icon_size * 0.35, cy + icon_size * 0.45)], fill=pal["primary"], outline=pal["accent"])
    else:
        # Default high-tech hex badge
        draw_hex(draw, (cx, cy), icon_size * 0.4, pal["accent"], fill_color=(pal["bg2"][0], pal["bg2"][1], pal["bg2"][2]))
        draw_glow_circle(draw, (int(cx), int(cy)), int(icon_size * 0.18), pal["primary"], pal["glow"])

    # Bottom Label Badge
    label_text = name.replace("_", " ").replace("-", " ").title()
    label_h = 24
    draw.rectangle([8, height - label_h - 6, width - 8, height - 6], fill=(10, 15, 25))
    draw.rectangle([8, height - label_h - 6, width - 8, height - 6], outline=pal["glow"], width=1)
    
    # Text
    try:
        # Simple font rendering
        font = ImageFont.load_default()
        bbox = font.getbbox(label_text)
        tw = bbox[2] - bbox[0]
        tx = max(10, (width - tw) // 2)
        ty = height - label_h
        draw.text((tx, ty), label_text, fill=(240, 245, 255), font=font)
    except Exception:
        pass

    return img

def main():
    root = Path(__file__).resolve().parent.parent
    public_dir = root / "public"

    print("🚀 Starting Complete OGame Image & Asset Generation...")
    print(f"Target Public Directory: {public_dir}")

    # =========================================================================
    # 1. Standard OGame Categories and Items
    # =========================================================================
    ogame_items = {
        "buildings": [
            ("metal_mine", 1), ("crystal_mine", 2), ("deuterium_synthesizer", 3),
            ("solar_plant", 4), ("fusion_reactor", 12), ("robotics_factory", 14),
            ("nanite_factory", 15), ("shipyard", 21), ("shipyard_facility", 21), ("metal_storage", 22),
            ("crystal_storage", 23), ("deuterium_tank", 24), ("research_lab", 31),
            ("terraformer", 33), ("alliance_depot", 34), ("lunar_base", 41),
            ("sensor_phalanx", 42), ("jump_gate", 43), ("missile_silo", 44),
            ("defense_cannon", 45), ("command_center", 46), ("power_plant", 47),
            ("spaceport", 48), ("trade_station", 49), ("space_dock", 50)
        ],
        "research": [
            ("espionage_tech", 106), ("espionage_technology", 106), ("computer_tech", 108), ("computer_technology", 108),
            ("weapons_tech", 109), ("kinetic_weapons", 109),
            ("shielding_tech", 110), ("shield_technology", 110), ("phase_shields", 110),
            ("armor_tech", 111), ("armor_technology", 111),
            ("energy_tech", 113), ("energy_science", 113), ("solar_energy", 113), ("fusion_energy", 113),
            ("antimatter_tech", 113), ("zero_point_energy", 113),
            ("hyperspace_tech", 114), ("hyperspace_technology", 114),
            ("combustion_drive", 115), ("chemical_propulsion", 115),
            ("impulse_drive", 117), ("ion_propulsion", 117),
            ("hyperspace_drive", 118), ("dimensional_propulsion", 118),
            ("laser_tech", 120), ("laser_technology", 120),
            ("ion_tech", 121), ("ion_technology", 121),
            ("plasma_tech", 122), ("plasma_technology", 122),
            ("research_network", 123), ("astrophysics", 124),
            ("graviton_tech", 199), ("basic_engineering", 101),
            ("mineral_processing", 102), ("deep_core_mining", 103), ("asteroid_mining", 104),
            ("quantum_computing", 125), ("artificial_intelligence", 126), ("stellar_engineering", 127)
        ],
        "ships": [
            ("small_cargo", 202), ("large_cargo", 203), ("light_fighter", 204),
            ("heavy_fighter", 205), ("cruiser", 206), ("battleship", 207),
            ("colony_ship", 208), ("recycler", 209), ("espionage_probe", 210),
            ("bomber", 211), ("solar_satellite", 212), ("destroyer", 213),
            ("deathstar", 214), ("battlecruiser", 215), ("crawler", 217),
            ("reaper", 218), ("pathfinder", 219), ("interceptor", 220),
            ("corvette", 221), ("frigate", 222), ("dreadnought", 223),
            ("titan", 224), ("titan_flagship", 224), ("carrier", 225), ("fleet_carrier", 225), ("mothership", 226),
            ("exploration_probe", 227), ("stealth_scout", 228), ("assault_corvette", 229),
            ("tactical_destroyer", 230), ("flagship", 232)
        ],
        "defense": [
            ("rocket_launcher", 401), ("light_laser", 402), ("heavy_laser", 403),
            ("gauss_cannon", 404), ("ion_cannon", 405), ("plasma_turret", 406),
            ("small_shield_dome", 407), ("large_shield_dome", 408),
            ("anti_ballistic_missile", 502), ("interplanetary_missile", 503),
            ("defense_platform", 504), ("orbital_defense_grid", 505)
        ],
        "megastructures": [
            ("dyson_swarm", 701), ("orbital_ring", 702), ("galactic_gateway", 703)
        ],

        "resources": [
            ("metal", 1), ("crystal", 2), ("deuterium", 3), ("energy", 4),
            ("dark_matter", 5), ("credits", 6), ("food", 7), ("water", 8),
            ("antimatter", 9), ("exotic_matter", 10)
        ],
        "planets": [
            ("desert", 1), ("jungle", 2), ("ice", 3), ("volcanic", 4), ("terran", 5),
            ("ocean", 6), ("gas_giant", 7), ("barren", 8), ("toxic", 9), ("lava", 10),
            ("dead", 11), ("gaia", 12), ("continental", 13), ("arctic", 14), ("normal_moon_view", 15)
        ],
        "offiziere": [
            ("commander", 601), ("admiral", 602), ("engineer", 603),
            ("geologist", 604), ("technocrat", 605)
        ]
    }

    # German mapping for classic OGame skins (gebaeude, schiffe, forschung, etc.)
    german_folder_map = {
        "buildings": "gebaeude",
        "ships": "schiffe",
        "research": "forschung",
        "defense": "verteidigung",
        "megastructures": "megastrukturen",
        "resources": "ressourcen",
        "planets": "planeten",
        "offiziere": "offiziere"
    }

    count = 0

    # 1. Generate in public/assets/{category} (200x200 PNG)
    for cat, items in ogame_items.items():
        cat_dir = public_dir / "assets" / cat
        cat_dir.mkdir(parents=True, exist_ok=True)
        for name, num in items:
            img = create_game_image(name, cat, width=200, height=200)
            img.save(cat_dir / f"{name}.png", "PNG")
            count += 1

    # 2. Generate in public/ogame/ & public/styles/theme/gow/ (Numeric & Named IDs in standard OGame layout)
    for cat, items in ogame_items.items():
        g_name = german_folder_map[cat]
        ogame_cat_dir = public_dir / "ogame" / g_name
        theme_cat_dir = public_dir / "styles" / "theme" / "gow" / g_name
        ogame_cat_dir.mkdir(parents=True, exist_ok=True)
        theme_cat_dir.mkdir(parents=True, exist_ok=True)

        for name, num in items:
            img = create_game_image(name, cat, width=200, height=200)
            # Save by numeric ID: e.g. 1.png, 204.png, 401.png
            img.save(ogame_cat_dir / f"{num}.png", "PNG")
            img.save(theme_cat_dir / f"{num}.png", "PNG")
            img.save(ogame_cat_dir / f"{num}.gif", "GIF")
            img.save(theme_cat_dir / f"{num}.gif", "GIF")
            # Save by name too: e.g. metal_mine.png
            img.save(ogame_cat_dir / f"{name}.png", "PNG")
            img.save(theme_cat_dir / f"{name}.png", "PNG")
            count += 6

    # 3. Generate OGameX specific paths in public/assets/ogamex/
    ogamex_dir = public_dir / "assets" / "ogamex"
    ogamex_subdirs = ["backgrounds", "content", "fleet", "galaxy", "headers/defense", "layout", "objects/buildings", "objects/research", "planets"]
    for sub in ogamex_subdirs:
        (ogamex_dir / sub).mkdir(parents=True, exist_ok=True)

    # OGameX Backgrounds
    bg_large = create_game_image("Command Background", "backgrounds", width=800, height=500, palette_key="building")
    bg_large.save(ogamex_dir / "backgrounds" / "background-large.jpg", "JPEG", quality=90)
    bg_large.save(ogamex_dir / "backgrounds" / "background-large.png", "PNG")

    # OGameX Content
    res_200 = create_game_image("Research Overview", "research", width=200, height=200, palette_key="research")
    res_200.save(ogamex_dir / "content" / "research_200.jpg", "JPEG", quality=90)
    res_200.save(ogamex_dir / "content" / "research_200.png", "PNG")

    ships_200 = create_game_image("Fleet Overview", "ships", width=200, height=200, palette_key="ship")
    ships_200.save(ogamex_dir / "content" / "ships_200.jpg", "JPEG", quality=90)
    ships_200.save(ogamex_dir / "content" / "ships_200.png", "PNG")

    def_80 = create_game_image("Defense Panel", "defense", width=80, height=80, palette_key="defense")
    def_80.save(ogamex_dir / "content" / "defense_80.png", "PNG")
    def_80.save(ogamex_dir / "content" / "defense_80.jpg", "JPEG", quality=90)

    sprite = create_game_image("Content Sprite", "ui", width=256, height=256, palette_key="building")
    sprite.save(ogamex_dir / "content" / "sprite.jpg", "JPEG", quality=90)
    sprite.save(ogamex_dir / "content" / "sprite.png", "PNG")

    # Layout sprites
    layout_detail = create_game_image("Detail Sprites", "ui", width=256, height=256, palette_key="crystal")
    layout_detail.save(ogamex_dir / "layout" / "detail-spriteset.png", "PNG")

    layout_ui = create_game_image("UI Elements", "ui", width=256, height=256, palette_key="energy")
    layout_ui.save(ogamex_dir / "layout" / "sprite_ui_elements.png", "PNG")

    # Fleet mission animations / gifs
    for mission_name, num in [("mission-attack", 1), ("mission-transport", 3), ("mission-spy", 6)]:
        m_img = create_game_image(mission_name, "fleet", width=64, height=64, palette_key="ship")
        m_img.save(ogamex_dir / "fleet" / f"{mission_name}.gif", "GIF")
        m_img.save(ogamex_dir / "fleet" / f"{mission_name}.png", "PNG")
        m_img.save(ogamex_dir / "fleet" / f"{num}.gif", "GIF")

    # Galaxy indicators
    act_img = create_game_image("activity", "ui", width=32, height=32, palette_key="energy")
    act_img.save(ogamex_dir / "galaxy" / "activity.gif", "GIF")
    act_img.save(ogamex_dir / "galaxy" / "activity.png", "PNG")

    ajax_img = create_game_image("ajax_indicator", "ui", width=32, height=32, palette_key="crystal")
    ajax_img.save(ogamex_dir / "galaxy" / "ajax_indicator.gif", "GIF")

    # Headers
    head_def = create_game_image("Defense Header", "defense", width=640, height=200, palette_key="defense")
    head_def.save(ogamex_dir / "headers" / "defense" / "defense.jpg", "JPEG", quality=90)
    head_def.save(ogamex_dir / "headers" / "defense" / "defense.png", "PNG")

    # OGameX Objects (buildings & research small previews)
    for b_name in ["metal_mine", "crystal_mine", "deuterium_synthesizer", "solar_plant", "fusion_reactor", "robotics_factory", "nanite_factory", "shipyard", "research_lab", "terraformer", "missile_silo"]:
        b_img = create_game_image(b_name, "buildings", width=120, height=120)
        b_img.save(ogamex_dir / "objects" / "buildings" / f"{b_name}_small.jpg", "JPEG", quality=90)
        b_img.save(ogamex_dir / "objects" / "buildings" / f"{b_name}_small.png", "PNG")

    for r_name in ["energy_technology", "hyperspace_drive", "laser_technology", "ion_technology", "plasma_technology", "combustion_drive", "impulse_drive", "espionage_technology", "computer_technology", "astrophysics", "weapons_technology", "shielding_technology", "armor_technology", "graviton_technology"]:
        r_img = create_game_image(r_name, "research", width=120, height=120)
        r_img.save(ogamex_dir / "objects" / "research" / f"{r_name}_small.jpg", "JPEG", quality=90)
        r_img.save(ogamex_dir / "objects" / "research" / f"{r_name}_small.png", "PNG")

    # Moon view
    moon_img = create_game_image("normal_moon_view", "planets", width=256, height=256, palette_key="planet")
    moon_img.save(ogamex_dir / "planets" / "normal_moon_view.jpg", "JPEG", quality=90)
    moon_img.save(ogamex_dir / "planets" / "normal_moon_view.png", "PNG")

    # 4. Backgrounds in public/assets/backgrounds/
    bg_dir = public_dir / "assets" / "backgrounds"
    bg_dir.mkdir(parents=True, exist_ok=True)
    for bg_name, pal_key in [("nebula", "crystal"), ("fleet_bg", "ship"), ("deep_space", "dark_matter"), ("galaxy", "energy")]:
        b = create_game_image(bg_name, "backgrounds", width=800, height=450, palette_key=pal_key)
        b.save(bg_dir / f"{bg_name}.png", "PNG")
        b.save(bg_dir / f"{bg_name}.jpg", "JPEG", quality=90)

    # 5. Menu Icons in public/assets/menu/
    menu_nav_dir = public_dir / "assets" / "menu" / "navigation"
    menu_status_dir = public_dir / "assets" / "menu" / "status"
    menu_actions_dir = public_dir / "assets" / "menu" / "actions"
    for d in [menu_nav_dir, menu_status_dir, menu_actions_dir]:
        d.mkdir(parents=True, exist_ok=True)

    for nav in ["home", "empire", "research", "military", "exploration", "economy", "diplomacy", "settings"]:
        n_img = create_game_image(nav, "ui", width=64, height=64, palette_key="crystal")
        n_img.save(menu_nav_dir / f"{nav}.png", "PNG")
        # Also simple SVG
        svg_content = f'''<svg width="64" height="64" xmlns="http://www.w3.org/2000/svg">
  <rect width="64" height="64" rx="8" fill="#1e293b"/>
  <circle cx="32" cy="32" r="20" fill="none" stroke="#38bdf8" stroke-width="2"/>
  <text x="32" y="37" font-family="Arial" font-size="10" fill="#f8fafc" text-anchor="middle">{nav.upper()}</text>
</svg>'''
        with open(menu_nav_dir / f"{nav}.svg", "w", encoding="utf-8") as f:
            f.write(svg_content)

    for status in ["healthy", "warning", "critical", "offline", "upgrading"]:
        s_img = create_game_image(status, "ui", width=32, height=32, palette_key="energy" if status == "warning" else ("defense" if status == "critical" else "planet"))
        s_img.save(menu_status_dir / f"{status}.png", "PNG")

    for act in ["attack", "defend", "transport", "colonize", "spy", "recycle", "build", "research"]:
        a_img = create_game_image(act, "ui", width=48, height=48, palette_key="ship" if act in ["attack", "defend"] else "crystal")
        a_img.save(menu_actions_dir / f"{act}.png", "PNG")

    # 6. Mirror to public/img/ for legacy XNova / OGame web servers
    img_root = public_dir / "img"
    img_root.mkdir(parents=True, exist_ok=True)
    for g_name in ["gebaeude", "schiffe", "forschung", "verteidigung", "ressourcen", "planeten", "offiziere"]:
        (img_root / g_name).mkdir(parents=True, exist_ok=True)
        src_cat = public_dir / "ogame" / g_name
        if src_cat.exists():
            for f in src_cat.iterdir():
                dest = img_root / g_name / f.name
                if not dest.exists():
                    dest.write_bytes(f.read_bytes())

    print(f"✅ Generated comprehensive OGame & Sci-Fi game assets successfully!")
    print(f"Total files created: {count}+ assets across public/assets, public/assets/ogamex, public/ogame, public/styles, and public/img!")

if __name__ == "__main__":
    main()
