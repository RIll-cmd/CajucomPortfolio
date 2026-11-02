# Renders the human and robot hands reaching for each other, from Blender's CC0 Human Base Meshes hand.
# blender -b --disable-autoexec --factory-startup -P hands.py -- <bundle.blend> <out dir> <frames> <samples>
import bpy, sys, json, math
import numpy as np
from mathutils import Matrix, Vector
from bpy_extras.object_utils import world_to_camera_view
args = sys.argv[sys.argv.index('--') + 1:]
path, out, FRAMES, SAMPLES = args[0], args[1], int(args[2]), int(args[3])
bpy.ops.wm.read_factory_settings(use_empty=True)
with bpy.data.libraries.load(path, link=False) as (_, dst): dst.objects = ['Hand  - Realistic']
src = dst.objects[0]; scn = bpy.context.scene; scn.collection.objects.link(src)
for m in src.modifiers:
    if m.type == 'MULTIRES': m.levels = m.render_levels = m.total_levels; print('INFO multires', m.total_levels)
total = next((m.total_levels for m in src.modifiers if m.type == 'MULTIRES'), 0)
if total < 4: s = src.modifiers.new('sub', 'SUBSURF'); s.levels = s.render_levels = 4 - total
for p in src.data.polygons: p.use_smooth = True
dg = bpy.context.evaluated_depsgraph_get(); base = bpy.data.meshes.new_from_object(src.evaluated_get(dg)); scn.collection.objects.unlink(src)
n = len(base.vertices); rest = np.empty(n * 3); base.vertices.foreach_get('co', rest); rest = rest.reshape(-1, 3); rest -= rest.min(0) * [0, 0, 0] + np.array([rest[:, 0].mean(), rest[:, 1].mean(), 0])
normals = np.empty(n * 3); base.vertex_normals.foreach_get('vector', normals); normals = normals.reshape(-1, 3)
print('INFO verts', n)
X, Y, Z = rest[:, 0], rest[:, 1], rest[:, 2]

# ---------- Where the fingers are ----------
tip_thumb_x = X.max(); zmin, zmax = Z.min(), Z.max()
def clusters(z, gap=.0022, band=.0012):
    idx = np.where((np.abs(Z - z) < band) & (X < tip_thumb_x - .022))[0]
    if not len(idx): return []
    order = idx[np.argsort(X[idx])]; split = np.where(np.diff(X[order]) > gap)[0] + 1
    return np.split(order, split)
web, tracks = None, []
for z in np.arange(zmin + .012, zmax, .001):
    c = clusters(z)
    if len(c) == 4: tracks.append((z, [(X[g].mean(), Y[g].mean()) for g in c]))
    if tracks and len(c) < 4: web = z; break
print('INFO web', web, 'tracks', len(tracks))
zs = np.array([t[0] for t in tracks]); FIN = []
for i in range(4):  # pinky to index, as x rises
    xs = np.array([t[1][i][0] for t in tracks]); ys = np.array([t[1][i][1] for t in tracks]); line_x = np.polyfit(zs, xs, 1); line_y = np.polyfit(zs, ys, 1)
    near = np.abs(X - np.polyval(line_x, Z)) < .009; tip = Z[near & (Z < web)].min(); FIN.append(dict(lx=line_x, ly=line_y, tip=tip, mcp=web + .24 * (web - tip)))
print('INFO tips', [round(f['tip'], 3) for f in FIN], 'mcp', [round(f['mcp'], 3) for f in FIN])
spacing = abs(np.polyval(FIN[1]['lx'], web) - np.polyval(FIN[2]['lx'], web))
def smooth(a, b, v): t = np.clip((v - a) / (b - a), 0, 1); return t * t * (3 - 2 * t)
for f in FIN:
    f['F'] = f['mcp'] - f['tip']; f['s'] = (f['mcp'] - Z) / f['F']; f['dx'] = X - np.polyval(f['lx'], Z); f['dy'] = Y - np.polyval(f['ly'], Z)
    f['m'] = np.exp(-(np.abs(f['dx']) / (spacing * .56)) ** 4)
JOINTS = (0., .43, .72)
BAND = ((-.1, .07), (-.04, .04), (-.035, .035))

# ---------- Masks ----------
ch = lambda f, sj, w: smooth(w * 1.25, w * .75, np.abs(f['s'] - sj) * f['F']) * smooth(.45, .6, f['m']) * (f['s'] > -.02)
groove, glow, nail, flush = [np.zeros(n) for _ in range(4)]
for i, f in enumerate(FIN):
    for sj in JOINTS: groove = np.maximum(groove, ch(f, sj + .015, .0013))
    groove = np.maximum(groove, ch(f, .43 + .1, .0005)); glow = np.maximum(glow, ch(f, .72 + .015, .0005) * .9)
    nail = np.maximum(nail, smooth(.82, .84, f['s']) * (f['dy'] < -.002) * (np.abs(f['dx']) < .0072) * (f['m'] > .5))
    flush = np.maximum(flush, np.exp(-((f['s'] - .43) / .05) ** 2) * (f['dy'] < 0) * .6 * (f['m'] > .4) + smooth(.84, 1, f['s']) * .5 * (f['m'] > .4))
tip_index = FIN[3]; glow = np.maximum(glow, smooth(.9, .93, tip_index['s']) * (tip_index['dy'] > .0005) * (tip_index['m'] > .5))
# Back of the hand: plates between the fingers, up to the wrist.
wrist = zmax - .07
for a, b in zip(FIN[:-1], FIN[1:]):
    mid = (np.polyval(a['lx'], Z) + np.polyval(b['lx'], Z)) / 2; groove = np.maximum(groove, smooth(.0011, .0006, np.abs(X - mid)) * (Z > web) * (Z < wrist - .002) * (Y < 0.004))
groove = np.maximum(groove, smooth(.0014, .0009, np.abs(Z - (wrist - .002)))); pass
# The forearm's rings and a seam down its length.
rings = smooth(.00045, .00028, np.abs(((Z - wrist) % .012) - .006)) * (Z > wrist + .008); groove = np.maximum(groove, rings); groove = np.maximum(groove, (Z > wrist + .008) * smooth(.001, .0005, np.abs(X - np.median(X[Z > wrist]))) * (Y < 0))

crease = np.zeros(n)
for f in FIN:
    for sj in (.45, .735): crease = np.maximum(crease, smooth(.0011, .0005, np.abs(f['s'] - sj) * f['F']) * smooth(.5, .7, f['m']) * (f['dy'] > .001))

def pose(p, robot, point=False):
    v = rest + normals * ((-.0011 * groove) if robot else (-.00018 * crease))[:, None]
    rel = [(2, 4, 3), (11, 15, 9), (18, 22, 12), (25, 27, 15)][::-1]  # pinky first, in reach
    far = [(17, 22, 14), (25, 30, 18), (32, 36, 20), (38, 40, 22)][::-1]
    if point: rel = far = [(1, 3, 2), (80, 62, 20), (82, 62, 20), (84, 62, 20)][::-1]
    for f, a, b in zip(FIN, far, rel):
        for j in (2, 1, 0):
            ang = math.radians(a[j] + (b[j] - a[j]) * p)
            w = f['m'] * smooth(JOINTS[j] + BAND[j][0], JOINTS[j] + BAND[j][1], f['s'])
            jz = f['mcp'] - JOINTS[j] * f['F']; pz, py = jz, np.polyval(f['ly'], jz) + .004
            t = ang * w; y, z = v[:, 1] - py, v[:, 2] - pz; c, s = np.cos(t), np.sin(t); v[:, 1], v[:, 2] = py + y * c - z * s, pz + y * s + z * c
    # The wrist runs on into a forearm.
    t = np.maximum(Z - wrist, 0); cx, cy = np.median(X[(Z > wrist)]), np.median(Y[Z > wrist]); widen = 1 + np.minimum(t * 6 / .4, 1) * .28
    v[:, 0] = cx + (v[:, 0] - cx) * np.where(t > 0, widen, 1); v[:, 1] = cy + (v[:, 1] - cy) * np.where(t > 0, widen, 1); v[:, 2] = v[:, 2] + t * 5
    return v
def index_tip(v):
    f = FIN[3]; i = np.where(f['m'] > .5, f['s'], -9).argmax(); return v[i]

# ---------- Materials ----------
def mix(nt, fac, a, b):
    m = nt.nodes.new('ShaderNodeMix'); m.data_type = 'RGBA'; nt.links.new(fac, m.inputs[0])
    for k, c in ((6, a), (7, b)):
        if isinstance(c, tuple): m.inputs[k].default_value = c
        else: nt.links.new(c, m.inputs[k])
    return m.outputs[2]
def rng(nt, fac, a, b):
    m = nt.nodes.new('ShaderNodeMapRange'); nt.links.new(fac, m.inputs[0]); m.inputs[3].default_value = a; m.inputs[4].default_value = b; return m.outputs[0]
def bump(nt, bsdf, scale, dist, strength=1.):
    tc = nt.nodes.new('ShaderNodeTexCoord'); no = nt.nodes.new('ShaderNodeTexNoise'); no.inputs['Scale'].default_value = scale; no.inputs['Detail'].default_value = 8; no.inputs['Roughness'].default_value = .6; nt.links.new(tc.outputs['Object'], no.inputs['Vector'])
    b = nt.nodes.new('ShaderNodeBump'); b.inputs['Distance'].default_value = dist; b.inputs['Strength'].default_value = strength; nt.links.new(no.outputs['Fac'], b.inputs['Height']); nt.links.new(b.outputs[0], bsdf.inputs['Normal'])
def skin():
    mt = bpy.data.materials.new('skin'); mt.use_nodes = True; nt = mt.node_tree; b = nt.nodes['Principled BSDF']; at = nt.nodes.new('ShaderNodeVertexColor'); at.layer_name = 'm'; sp = nt.nodes.new('ShaderNodeSeparateColor'); nt.links.new(at.outputs[0], sp.inputs[0])
    col = mix(nt, sp.outputs[1], (.52, .25, .14, 1), (.60, .21, .13, 1)); col = mix(nt, sp.outputs[0], col, (.60, .34, .27, 1)); col = mix(nt, sp.outputs[2], col, (.27, .10, .06, 1)); nt.links.new(col, b.inputs['Base Color'])
    nt.links.new(rng(nt, sp.outputs[0], .46, .16), b.inputs['Roughness'])
    b.inputs['Subsurface Weight'].default_value = .6; b.inputs['Subsurface Radius'].default_value = (1., .35, .18); b.inputs['Subsurface Scale'].default_value = .012
    b.inputs['Coat Weight'].default_value = .08; b.inputs['Coat Roughness'].default_value = .4; bump(nt, b, 1400, .00025, .55); return mt
def shell():
    mt = bpy.data.materials.new('shell'); mt.use_nodes = True; nt = mt.node_tree; b = nt.nodes['Principled BSDF']; at = nt.nodes.new('ShaderNodeVertexColor'); at.layer_name = 'm'; sp = nt.nodes.new('ShaderNodeSeparateColor'); nt.links.new(at.outputs[0], sp.inputs[0])
    nt.links.new(mix(nt, sp.outputs[0], (.84, .87, .90, 1), (.015, .018, .025, 1)), b.inputs['Base Color'])
    nt.links.new(rng(nt, sp.outputs[0], .2, .34), b.inputs['Roughness']); nt.links.new(rng(nt, sp.outputs[0], .0, .9), b.inputs['Metallic']); nt.links.new(rng(nt, sp.outputs[0], 1, 0), b.inputs['Coat Weight']); b.inputs['Coat Roughness'].default_value = .08
    b.inputs['Emission Color'].default_value = (.04, .95, .78, 1); nt.links.new(rng(nt, sp.outputs[1], 0, 16), b.inputs['Emission Strength']); return mt

# ---------- Stage ----------
scn.render.engine = 'CYCLES'; scn.cycles.samples = SAMPLES; scn.cycles.use_denoising = True; scn.render.film_transparent = True
prefs = bpy.context.preferences.addons['cycles'].preferences; prefs.compute_device_type = 'OPTIX'; prefs.get_devices()
for d in prefs.devices: d.use = d.type == 'OPTIX'
scn.cycles.device = 'GPU'; scn.view_settings.view_transform = 'AgX'; scn.view_settings.look = 'AgX - Medium High Contrast'
scn.render.resolution_x, scn.render.resolution_y = 1120, 800; scn.render.image_settings.file_format = 'PNG'; scn.render.image_settings.color_mode = 'RGBA'
w = bpy.data.worlds.new('w'); w.use_nodes = True; nt = w.node_tree; tc = nt.nodes.new('ShaderNodeTexCoord'); sep = nt.nodes.new('ShaderNodeSeparateXYZ'); nt.links.new(tc.outputs['Generated'], sep.inputs[0]); ramp = nt.nodes.new('ShaderNodeValToRGB'); ramp.color_ramp.elements[0].position = .3; ramp.color_ramp.elements[0].color = (.42, .6, .55, 1); ramp.color_ramp.elements[1].position = .75; ramp.color_ramp.elements[1].color = (.95, .98, 1, 1)
mr = nt.nodes.new('ShaderNodeMapRange'); mr.inputs[1].default_value = -1; mr.inputs[2].default_value = 1; nt.links.new(sep.outputs['Z'], mr.inputs[0]); nt.links.new(mr.outputs[0], ramp.inputs[0]); nt.links.new(ramp.outputs[0], nt.nodes['Background'].inputs[0]); nt.nodes['Background'].inputs[1].default_value = .5; scn.world = w
def area(name, loc, size, energy, color):
    a = bpy.data.lights.new(name, 'AREA'); a.size = size; a.energy = energy; a.color = color; o = bpy.data.objects.new(name, a); o.location = loc; scn.collection.objects.link(o); o.rotation_euler = (-Vector(loc)).to_track_quat('-Z', 'Y').to_euler()
area('key', (-.25, -.5, .55), .5, 5, (1, .96, .9)); area('rim', (.45, .35, .25), .4, 5, (.65, .95, 1)); area('under', (.1, -.25, -.45), .5, 1, (.6, 1, .9))
cam = bpy.data.cameras.new('c'); cam.lens = 85; co = bpy.data.objects.new('c', cam); scn.collection.objects.link(co); scn.camera = co; co.location = (0, -1.05, 0); co.rotation_euler = (math.pi / 2, 0, 0)

def rot(f, nm):
    f = Vector(f).normalized(); nm = Vector(nm); nm = (nm - f * nm.dot(f)).normalized(); x = nm.cross(-f); return Matrix((x, nm, -f)).transposed().to_4x4()
HANDS = {
    'robot': dict(r=rot((math.cos(math.radians(14)), 0, -math.sin(math.radians(14))), (.08, .86, -.5)), mirror=True, at=(.12, 0, .02)),
    'point': dict(r=rot((.02, 0, 1), (0, .96, -.1)), mirror=False, at=(0, 0, .085), point=True, robot=True),
    'human': dict(r=rot((-math.cos(math.radians(20)), 0, math.sin(math.radians(20))), (-.05, -.92, .38)), mirror=False, at=(-.12, 0, -.02)),
}
manifest = {}
for name, h in HANDS.items():
    robot = name != 'human'; me = base.copy(); ob = bpy.data.objects.new(name, me); scn.collection.objects.link(ob)
    m = me.color_attributes.new('m', 'FLOAT_COLOR', 'POINT'); col = np.ones((n, 4))
    col[:, 0], col[:, 1], col[:, 2] = (groove, glow, 0 * glow) if robot else (nail, flush, crease * .22); m.data.foreach_set('color', col.ravel())
    me.materials.clear(); me.materials.append(shell() if robot else skin())
    tip1 = index_tip(pose(1, robot, h.get('point', False))); S = Matrix.Diagonal((-1 if h['mirror'] else 1, 1, 1, 1))
    place = Matrix.Translation(Vector(h['at']) - (h['r'] @ S).to_3x3() @ Vector(tip1)); ob.matrix_world = place @ h['r'] @ S
    manifest[name] = []
    for fr in range(1 if h.get('point') else FRAMES):
        p = fr / max(1, FRAMES - 1); v = pose(p, robot, h.get('point', False)); me.vertices.foreach_set('co', v.ravel()); me.update()
        tip = ob.matrix_world @ Vector(index_tip(v)); bpy.context.view_layer.update(); uv = world_to_camera_view(scn, co, tip); manifest[name].append([round(uv.x, 4), round(1 - uv.y, 4)])
        scn.render.filepath = f'{out}/{name}-{fr:02d}.png'; bpy.ops.render.render(write_still=True); print('INFO rendered', name, fr, flush=True)
    bpy.data.objects.remove(ob)
json.dump(manifest, open(f'{out}/tips.json', 'w')); print('INFO done', manifest)
