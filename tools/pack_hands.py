# Packs the Blender renders for the page: trims the hands, fades the arms, grades the world, and makes the glass the intro is drawn on.
import os, sys, json
import numpy as np, cv2
from scipy.ndimage import gaussian_filter as blur
src, out = sys.argv[1], sys.argv[2]
os.makedirs(out, exist_ok=True)
for f in os.listdir(out): os.remove(os.path.join(out, f))
tips = json.load(open(os.path.join(src, 'tips.json')))
data = {}
def step(a, b, v): t = np.clip((v - a) / (b - a), 0, 1); return t * t * (3 - 2 * t)
for name, frames in tips.items():
    ims = [cv2.imread(os.path.join(src, f'{name}-{i:02d}.png'), cv2.IMREAD_UNCHANGED) for i in range(len(frames))]
    H, W = ims[0].shape[:2]; a = np.max([im[..., 3] for im in ims], axis=0); ys, xs = np.where(a > 3)
    x0, x1, y0, y1 = max(xs.min() - 2, 0), min(xs.max() + 3, W), max(ys.min() - 2, 0), min(ys.max() + 3, H)
    # The arm dissolves as it leaves, so it never ends in a hard edge.
    y, x = np.mgrid[0:H, 0:W].astype(np.float32)
    if name == 'robot': fade = step(.0, W * .2, x) * step(.0, H * .07, y)
    elif name == 'human': fade = step(W, W * .8, x) * step(H, H * .88, y)
    else: fade = step(H, H * .9, y)
    for i, im in enumerate(ims):
        o = im.astype(np.float32); o[..., 3] *= fade; c = o[y0:y1, x0:x1].astype(np.uint8)
        cv2.imwrite(os.path.join(out, f'{name}-{i:02d}.webp'), c, [cv2.IMWRITE_WEBP_QUALITY, 86])
    data[name] = dict(box=[round(x0 / W, 4), round(y0 / H, 4), round((x1 - x0) / W, 4), round((y1 - y0) / H, 4)], tips=frames)
    print(name, x1 - x0, 'x', y1 - y0, sum(os.path.getsize(os.path.join(out, f'{name}-{i:02d}.webp')) for i in range(len(frames))) // 1024, 'KB')
# The world, graded soft, with the blur a long lens would give its edges.
w = cv2.imread(os.path.join(src, 'world.png')).astype(np.float32) / 255; H, Wd = w.shape[:2]
y, x = np.mgrid[0:H, 0:Wd].astype(np.float32); d = np.hypot((x - Wd / 2) / (Wd * .62), (y - H * .45) / (H * .62))
soft = cv2.GaussianBlur(w, (0, 0), 9); m = step(.45, 1.05, d)[..., None]; w = w * (1 - m) + soft * m
glow = cv2.GaussianBlur(w, (0, 0), 34); w = 1 - (1 - w) * (1 - glow * .32)  # bloom
w = np.clip(w * .985 + .012, 0, 1)
cv2.imwrite(os.path.join(out, 'world.webp'), (w * 255).astype(np.uint8), [cv2.IMWRITE_WEBP_QUALITY, 80])
small = cv2.GaussianBlur(w, (0, 0), 30); small = cv2.resize(small, (560, 315), interpolation=cv2.INTER_AREA); small = small * .62 + .38
cv2.imwrite(os.path.join(out, 'veil.webp'), (np.clip(small, 0, 1) * 255).astype(np.uint8), [cv2.IMWRITE_WEBP_QUALITY, 74])
# The glass: frosted teal, with circuit traces frozen inside.
H, Wd = 900, 1600; r = np.random.default_rng(3); yy, xx = np.mgrid[0:H, 0:Wd].astype(np.float32)
def noise(scales):
    n = np.zeros((H, Wd), np.float32)
    for s, a in scales: f = blur(r.random((H, Wd), np.float32), s); n += a * (f - f.mean()) / (f.std() + 1e-6)
    return n
traces = np.zeros((H, Wd), np.uint8)
for _ in range(90):
    px, py = int(r.integers(0, Wd)), int(r.integers(0, H)); dirn = int(r.integers(0, 8)); pts = [(px, py)]
    for _ in range(int(r.integers(3, 8))):
        L = int(r.integers(40, 240)); dx, dy = [(1, 0), (1, 1), (0, 1), (-1, 1), (-1, 0), (-1, -1), (0, -1), (1, -1)][dirn]; px += dx * L; py += dy * L; pts.append((px, py)); dirn = (dirn + int(r.choice([-1, 1]))) % 8
    cv2.polylines(traces, [np.array(pts, np.int32)], False, 255, int(r.integers(1, 3)), cv2.LINE_AA)
    cv2.circle(traces, pts[-1], int(r.integers(3, 7)), 255, 1, cv2.LINE_AA); cv2.circle(traces, pts[0], 3, 255, -1, cv2.LINE_AA)
t = traces.astype(np.float32) / 255; depth = noise(((70, 1), (22, .6)))
t = t * step(-.6, 1.1, depth) + cv2.GaussianBlur(t, (0, 0), 5) * .7 * step(-.2, 1.2, depth)
cloud = step(-1.4, 1.8, noise(((110, 1), (42, .7), (14, .35), (4, .16)))); light = step(1.25, .1, np.hypot((xx - Wd * .5) / (Wd * .6), (yy - H * .85) / (H * .85)))
g = np.dstack([.33 + .24 * cloud + .3 * light, .44 + .2 * cloud + .28 * light, .26 + .16 * cloud + .24 * light]); g += t[..., None] * np.array([.26, .34, .22], np.float32)
g += noise(((.7, 1),))[..., None] * .012
cv2.imwrite(os.path.join(out, 'glass.webp'), (np.clip(g, 0, 1) * 255).astype(np.uint8), [cv2.IMWRITE_WEBP_QUALITY, 72])
print(json.dumps(data))
print('total KB', sum(os.path.getsize(os.path.join(out, f)) for f in os.listdir(out)) // 1024)
