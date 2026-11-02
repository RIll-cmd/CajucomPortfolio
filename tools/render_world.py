# Renders the world behind the hands: server racks standing in the sky, on a mirror floor.
# blender -b --disable-autoexec --factory-startup -P world.py -- <out dir> <samples>
import bpy, bmesh, sys, math, random
from mathutils import Vector
args = sys.argv[sys.argv.index('--') + 1:]
out, SAMPLES = args[0], int(args[1])
bpy.ops.wm.read_factory_settings(use_empty=True); scn = bpy.context.scene; random.seed(7)
scn.render.engine = 'CYCLES'; scn.cycles.samples = SAMPLES; scn.cycles.use_denoising = True
prefs = bpy.context.preferences.addons['cycles'].preferences; prefs.compute_device_type = 'OPTIX'; prefs.get_devices()
for d in prefs.devices: d.use = d.type == 'OPTIX'
scn.cycles.device = 'GPU'; scn.view_settings.view_transform = 'Standard'; scn.view_settings.look = 'None'
scn.render.resolution_x, scn.render.resolution_y = 1680, 945; scn.render.image_settings.file_format = 'PNG'; scn.render.image_settings.color_mode = 'RGB'
HAZE = (.74, .90, .90, 1)
# ---------- Sky ----------
w = bpy.data.worlds.new('w'); w.use_nodes = True; nt = w.node_tree; L = nt.links; bg = nt.nodes['Background']
tc = nt.nodes.new('ShaderNodeTexCoord'); sep = nt.nodes.new('ShaderNodeSeparateXYZ'); L.new(tc.outputs['Generated'], sep.inputs[0])
# Clouds lie flat, so stretch the sky towards the horizon.
div = nt.nodes.new('ShaderNodeMath'); div.operation = 'ADD'; L.new(sep.outputs['Z'], div.inputs[0]); div.inputs[1].default_value = .12
vec = nt.nodes.new('ShaderNodeVectorMath'); vec.operation = 'SCALE'; L.new(tc.outputs['Generated'], vec.inputs[0]); inv = nt.nodes.new('ShaderNodeMath'); inv.operation = 'DIVIDE'; inv.inputs[0].default_value = 1; L.new(div.outputs[0], inv.inputs[1]); L.new(inv.outputs[0], vec.inputs['Scale'])
big = nt.nodes.new('ShaderNodeTexNoise'); big.inputs['Scale'].default_value = 1.5; big.inputs['Detail'].default_value = 12; big.inputs['Roughness'].default_value = .56; L.new(vec.outputs[0], big.inputs['Vector'])
cr = nt.nodes.new('ShaderNodeValToRGB'); cr.color_ramp.elements[0].position = .48; cr.color_ramp.elements[0].color = (0, 0, 0, 1); cr.color_ramp.elements[1].position = .6; cr.color_ramp.elements[1].color = (1, 1, 1, 1); L.new(big.outputs['Fac'], cr.inputs[0])
grad = nt.nodes.new('ShaderNodeValToRGB'); e = grad.color_ramp.elements; e[0].position = .0; e[0].color = HAZE; e[1].position = .3; e[1].color = (.06, .27, .62, 1); L.new(sep.outputs['Z'], grad.inputs[0])
m = nt.nodes.new('ShaderNodeMix'); m.data_type = 'RGBA'; L.new(cr.outputs[0], m.inputs[0]); L.new(grad.outputs[0], m.inputs[6]); m.inputs[7].default_value = (1, 1, 1, 1)
# The sun, up and to the right.
sunv = nt.nodes.new('ShaderNodeVectorMath'); sunv.operation = 'DOT_PRODUCT'; sunv.inputs[1].default_value = Vector((.48, .78, .4)).normalized(); L.new(tc.outputs['Generated'], sunv.inputs[0])
pw = nt.nodes.new('ShaderNodeMath'); pw.operation = 'POWER'; L.new(sunv.outputs['Value'], pw.inputs[0]); pw.inputs[1].default_value = 9; sc = nt.nodes.new('ShaderNodeMath'); sc.operation = 'MULTIPLY'; L.new(pw.outputs[0], sc.inputs[0]); sc.inputs[1].default_value = 2.2
add = nt.nodes.new('ShaderNodeMix'); add.data_type = 'RGBA'; add.blend_type = 'ADD'; add.inputs[0].default_value = 1; L.new(m.outputs[2], add.inputs[6]); L.new(sc.outputs[0], add.inputs[7]); L.new(add.outputs[2], bg.inputs[0]); bg.inputs[1].default_value = 1.0; scn.world = w
# ---------- Haze: everything fades to the horizon with distance ----------
def hazed(mt, near, far):
    nt = mt.node_tree; out_n = nt.nodes['Material Output']; old = out_n.inputs['Surface'].links[0].from_socket
    cd = nt.nodes.new('ShaderNodeCameraData'); mr = nt.nodes.new('ShaderNodeMapRange'); mr.inputs[1].default_value = near; mr.inputs[2].default_value = far; nt.links.new(cd.outputs['View Z Depth'], mr.inputs[0])
    em = nt.nodes.new('ShaderNodeEmission'); em.inputs[0].default_value = HAZE; em.inputs[1].default_value = 1.05; mx = nt.nodes.new('ShaderNodeMixShader'); nt.links.new(mr.outputs[0], mx.inputs[0]); nt.links.new(old, mx.inputs[1]); nt.links.new(em.outputs[0], mx.inputs[2]); nt.links.new(mx.outputs[0], out_n.inputs['Surface'])
def mat(name, color, rough=.4, metal=0, emit=None, strength=0, near=9, far=60):
    mt = bpy.data.materials.new(name); mt.use_nodes = True; b = mt.node_tree.nodes['Principled BSDF']; b.inputs['Base Color'].default_value = color; b.inputs['Roughness'].default_value = rough; b.inputs['Metallic'].default_value = metal
    if emit: b.inputs['Emission Color'].default_value = emit; b.inputs['Emission Strength'].default_value = strength
    hazed(mt, near, far); return mt
# ---------- The floor: a mirror laid in tiles, with light in some seams ----------
fl = bpy.data.materials.new('floor'); fl.use_nodes = True; nt = fl.node_tree; b = nt.nodes['Principled BSDF']; b.inputs['Base Color'].default_value = (.5, .72, .74, 1); b.inputs['Metallic'].default_value = 1
tcf = nt.nodes.new('ShaderNodeTexCoord'); br = nt.nodes.new('ShaderNodeTexBrick'); br.offset = 0; br.squash = 1; br.inputs['Scale'].default_value = .5; br.inputs['Mortar Size'].default_value = .007; br.inputs['Mortar Smooth'].default_value = .2; br.inputs['Brick Width'].default_value = 1; br.inputs['Row Height'].default_value = .5; nt.links.new(tcf.outputs['Object'], br.inputs['Vector'])
rm = nt.nodes.new('ShaderNodeMapRange'); nt.links.new(br.outputs['Fac'], rm.inputs[0]); rm.inputs[3].default_value = .05; rm.inputs[4].default_value = .3; nt.links.new(rm.outputs[0], b.inputs['Roughness'])
b.inputs['Emission Color'].default_value = (.1, 1, .8, 1); em = nt.nodes.new('ShaderNodeMapRange'); nt.links.new(br.outputs['Fac'], em.inputs[0]); em.inputs[3].default_value = 0; em.inputs[4].default_value = .55; nt.links.new(em.outputs[0], b.inputs['Emission Strength'])
hazed(fl, 5, 42)
bpy.ops.mesh.primitive_plane_add(size=400); bpy.context.active_object.data.materials.append(fl)
# ---------- Racks ----------
frame = mat('frame', (.86, .89, .91, 1), .28); dark = mat('dark', (.02, .025, .035, 1), .3, .6); led = mat('led', (0, 0, 0, 1), .4, 0, (.08, 1, .82, 1), 9); amber = mat('amber', (0, 0, 0, 1), .4, 0, (1, .62, .22, 1), 7)
def cube(bm, c, s, mi):
    r = bmesh.ops.create_cube(bm, size=1);
    for v in r['verts']: v.co = Vector((v.co.x * s[0] + c[0], v.co.y * s[1] + c[1], v.co.z * s[2] + c[2]))
    for f in {f for v in r['verts'] for f in v.link_faces}: f.material_index = mi
def rack(x, y, ry=0, h=3.5, w=1.15, d=1.1, ruined=False):
    bm = bmesh.new(); ins = .07
    for sx in (-1, 1):
        for sy in (-1, 1): cube(bm, (sx * (w / 2 - ins / 2), sy * (d / 2 - ins / 2), h / 2), (ins, ins, h), 0)
    cube(bm, (0, 0, h + .06), (w + .12, d + .12, .12), 0); cube(bm, (0, 0, h + .17), (w + .02, d + .02, .1), 0); cube(bm, (0, 0, .05), (w + .14, d + .14, .1), 0); cube(bm, (0, 0, h / 2), (w - .12, d - .12, h - .1), 1)
    units = 15; uh = (h - .36) / units
    for u in range(units):
        z = .24 + (u + .5) * uh
        if ruined and u > units * .74 and random.random() < .5: continue
        cube(bm, (0, -d / 2 + .05, z), (w - .16, .03, uh * .84), 1)
        for k in range(random.randint(3, 9)): cube(bm, (-w / 2 + .17 + k * .066, -d / 2 + .03, z + uh * .17), (.032, .012, .032), 3 if random.random() < .86 else 4)
        cube(bm, (w / 2 - .2, -d / 2 + .03, z - uh * .13), (.14, .012, .022), 3)
    me = bpy.data.meshes.new('rack'); bm.to_mesh(me); bm.free()
    for mt in (frame, dark, frame, led, amber): me.materials.append(mt)
    for p in me.polygons:
        p.material_index = {0: 0, 1: 1, 3: 3, 4: 4}.get(p.material_index, 0)
    o = bpy.data.objects.new('rack', me); o.location = (x, y, 0); o.rotation_euler = (0, 0, ry); scn.collection.objects.link(o)
rack(-3.5, 4.2, .25, h=3.5); rack(3.7, 4.8, -.28, h=3.5, ruined=True)
for i, (x, y) in enumerate([(-8, 11), (8.6, 12), (-5.2, 22), (5.8, 24), (-12, 24), (13, 26), (-9, 40), (10, 42)]): rack(x, y, random.uniform(-.25, .25), h=random.choice((3.5, 3.5, 4.2)))
# Cables hanging in the air, looping off between racks.
def cable(a, b, sag, r=.012):
    cv = bpy.data.curves.new('c', 'CURVE'); cv.dimensions = '3D'; cv.bevel_depth = r; sp = cv.splines.new('BEZIER'); sp.bezier_points.add(2); mid = (Vector(a) + Vector(b)) / 2 - Vector((0, 0, sag))
    for p, c in zip(sp.bezier_points, (a, mid, b)): p.co = c; p.handle_left_type = p.handle_right_type = 'AUTO'
    cv.materials.append(dark); scn.collection.objects.link(bpy.data.objects.new('c', cv))
cable((-3.8, 4.3, 3.5), (-7.8, 11, 3.4), .9); cable((4, 4.9, 3.55), (8.3, 12, 3.4), 1.1)
# ---------- Light and lens ----------
sun = bpy.data.lights.new('s', 'SUN'); sun.energy = 2.6; sun.angle = .12; sun.color = (1, .96, .88); so = bpy.data.objects.new('s', sun); so.rotation_euler = (math.radians(58), 0, math.radians(30)); scn.collection.objects.link(so)
cam = bpy.data.cameras.new('c'); cam.lens = 34; cam.dof.use_dof = True; cam.dof.focus_distance = 9; cam.dof.aperture_fstop = 2.2; co = bpy.data.objects.new('c', cam); scn.collection.objects.link(co); scn.camera = co; co.location = (0, -6.2, 1.1); co.rotation_euler = (math.radians(92), 0, 0)
scn.render.filepath = f'{out}/world.png'; bpy.ops.render.render(write_still=True); print('INFO done', flush=True)
