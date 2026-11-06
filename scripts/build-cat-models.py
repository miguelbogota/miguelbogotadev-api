"""Build editable voxel cats and portable GLB exports with Blender.

Run: blender -b --python scripts/build-cat-models.py
Each visible part remains a named mesh so props can be added in Blender later.
"""

from pathlib import Path
import random
import bpy

ROOT = Path(__file__).resolve().parents[1] / "assets" / "cats"
ROOT.mkdir(parents=True, exist_ok=True)

COLORS = {
    "june": {
        "coat": (0.055, 0.052, 0.058, 1),
        "coat_light": (0.105, 0.095, 0.105, 1),
        "coat_mid": (0.075, 0.070, 0.080, 1),
        "chest": (0.92, 0.89, 0.83, 1),
        "white": (0.98, 0.96, 0.91, 1),
        "eye": (0.10, 0.14, 0.10, 1),
        "nose": (0.67, 0.36, 0.38, 1),
        "inner_ear": (0.37, 0.26, 0.30, 1),
    },
    "brownie": {
        "coat": (0.36, 0.27, 0.19, 1),
        "coat_light": (0.52, 0.40, 0.27, 1),
        "coat_mid": (0.43, 0.33, 0.23, 1),
        "stripe": (0.17, 0.14, 0.12, 1),
        "chest": (0.67, 0.55, 0.39, 1),
        "white": (0.77, 0.67, 0.51, 1),
        "eye": (0.12, 0.16, 0.11, 1),
        "nose": (0.36, 0.22, 0.19, 1),
        "inner_ear": (0.52, 0.32, 0.29, 1),
    },
}

# Twelve columns by twelve rows, top to bottom. Each face pixel covers a 2×2
# group of the body's 24×24 material-colored quads. Dots show the coat texture.
FACE_PIXELS = {
    "june": (
        "............",
        "............",
        ".....WW.....",
        ".....WW.....",
        "...P.WW.P...",
        "...P.WW.P...",
        "...WWNNWW...",
        "...WWWWWW...",
        "....WWWW....",
        "....CCCC....",
        "...CCMMCC...",
        "..CCCCCCCC..",
    ),
    "brownie": (
        "............",
        "...S....S...",
        "....S..S....",
        ".....SS.....",
        "...P....P...",
        ".S.P.LL.P.S.",
        "...LLNNLL...",
        "...LLLLLL...",
        "....LLLL....",
        "....CCCC....",
        "...CCCCCC...",
        "..CCCCCCCC..",
    ),
}
FACE_MATERIALS = {
    "W": "white", "L": "white", "C": "chest", "S": "stripe",
    "P": "eye", "N": "nose", "M": "ink",
}


def material(name, color):
    mat = bpy.data.materials.new(name)
    mat.diffuse_color = color
    mat.use_nodes = True
    mat.node_tree.nodes.get("Principled BSDF").inputs["Base Color"].default_value = color
    mat.node_tree.nodes.get("Principled BSDF").inputs["Roughness"].default_value = 1
    return mat


def cube(name, position, size, mat):
    bpy.ops.mesh.primitive_cube_add(size=1, location=position)
    obj = bpy.context.object
    obj.name = name
    obj.dimensions = size
    bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)
    obj.data.materials.append(mat)
    return obj


def body_color(cat, face, col, row, rng):
    """Choose a material for one coplanar voxel tile of the body mesh."""
    base = rng.choices(("coat", "coat_mid", "coat_light"), (7, 2, 1))[0]
    if face == "front":
        pixel = FACE_PIXELS[cat][11 - row // 2][col // 2]
        return FACE_MATERIALS[pixel] if pixel != "." else base
    if cat == "brownie":
        if face == "top" and row in (4, 9, 14, 19) and 2 <= col <= 21:
            return "stripe"
        if face in ("left", "right") and row in (5, 10, 15, 20) and 2 <= col <= 21:
            return "stripe"
    return base


def tiled_body(cat, palette, ink):
    """A single closed block whose square faces carry the color texture."""
    count = 24
    # Width and height are both 1.53; depth is 2.34 for a longer side profile.
    x0, x1 = -0.765, 0.765
    y0, y1 = -1.17, 1.17
    z0, z1 = 0.34, 1.87
    verts, faces, colors = [], [], []
    rng = random.Random(23 if cat == "june" else 42)
    surfaces = ("front", "back", "left", "right", "top", "bottom")
    for surface in surfaces:
        for row in range(count):
            for col in range(count):
                u0, u1 = col / count, (col + 1) / count
                v0, v1 = row / count, (row + 1) / count
                if surface in ("front", "back"):
                    y = y0 if surface == "front" else y1
                    corners = [(x0 + (x1 - x0) * u, y, z0 + (z1 - z0) * v)
                               for u, v in ((u0, v0), (u1, v0), (u1, v1), (u0, v1))]
                elif surface in ("left", "right"):
                    x = x0 if surface == "left" else x1
                    corners = [(x, y0 + (y1 - y0) * u, z0 + (z1 - z0) * v)
                               for u, v in ((u0, v0), (u1, v0), (u1, v1), (u0, v1))]
                else:
                    z = z1 if surface == "top" else z0
                    corners = [(x0 + (x1 - x0) * u, y0 + (y1 - y0) * v, z)
                               for u, v in ((u0, v0), (u1, v0), (u1, v1), (u0, v1))]
                offset = len(verts)
                verts.extend(corners)
                faces.append(tuple(offset + i for i in ((3, 2, 1, 0) if surface in ("back", "left", "bottom") else (0, 1, 2, 3))))
                colors.append(body_color(cat, surface, col, row, rng))
    mesh = bpy.data.meshes.new(f"{cat} voxel mesh")
    mesh.from_pydata(verts, [], faces)
    mesh.update()
    obj = bpy.data.objects.new("Body and face | attach props to this", mesh)
    bpy.context.collection.objects.link(obj)
    materials = {**palette, "ink": ink}
    for mat in materials.values():
        mesh.materials.append(mat)
    indices = {key: index for index, key in enumerate(materials)}
    for polygon, color in zip(mesh.polygons, colors):
        polygon.material_index = indices[color]
    return obj


def build(name):
    bpy.ops.object.select_all(action="SELECT")
    bpy.ops.object.delete(use_global=False)
    for existing in list(bpy.data.materials):
        bpy.data.materials.remove(existing)
    palette = {key: material(f"{name} | {key}", value) for key, value in COLORS[name].items()}
    ink = material("pupil and mouth", (0.055, 0.045, 0.043, 1))
    coat = palette["coat"]

    # One flat-sided mesh forms the entire body, head, face and color texture.
    tiled_body(name, palette, ink)
    for side, label in ((-1, "left"), (1, "right")):
        x = side * 0.54
        cube(f"Ear {label}", (x, -0.81, 2.02), (0.31, 0.36, 0.31), coat)
        cube(f"Ear {label} inset", (x, -0.997, 2.04), (0.18, 0.014, 0.21), palette["inner_ear"])
        for front, y in ((True, -0.89), (False, 0.89)):
            cube(f"{'Front' if front else 'Back'} {label} square foot", (side * 0.48, y, 0.19),
                 (0.38, 0.38, 0.38), palette["white"] if name == "june" and front else coat)

    if name == "june":
        # June's facial markings live on the body mesh; front feet are white.
        tail_material = coat
    else:
        # Tabby bars and facial marks are coplanar color cells on the body.
        for side, label in ((-1, "left"), (1, "right")):
            cube(f"Front foot band {label}", (side * 0.48, -1.084, 0.25),
                 (0.38, 0.008, 0.08), palette["stripe"])
        tail_material = coat

    # The upper end meets the middle of the rear face; the tip points down.
    tail = cube("Diagonal centered tail pointing down", (0, 1.52, 0.83),
                (0.28, 0.28, 0.78), tail_material)
    tail.rotation_euler[0] = 0.72

    scene = bpy.context.scene
    scene.unit_settings.system = "METRIC"
    scene.render.engine = "BLENDER_EEVEE"
    scene.world.color = (0.8, 0.8, 0.8)
    bpy.context.preferences.filepaths.save_version = 0
    bpy.ops.wm.save_as_mainfile(filepath=str(ROOT / f"{name}.blend"))
    bpy.ops.export_scene.gltf(filepath=str(ROOT / f"{name}.glb"), export_format="GLB",
                              export_apply=True, export_yup=True)


for cat in ("june", "brownie"):
    build(cat)
