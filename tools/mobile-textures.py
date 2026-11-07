"""Generate phone texture variants; retain the desktop originals unchanged."""
from pathlib import Path
from PIL import Image

root = Path(__file__).resolve().parent.parent
folders = [root / "textures", *(root / "models").glob("*/textures")]
before = after = 0
for folder in folders:
    target = folder / "mobile"
    target.mkdir(exist_ok=True)
    for source in folder.glob("*.jpg"):
        with Image.open(source) as image:
            image.thumbnail((512, 512), Image.Resampling.LANCZOS)
            output = target / source.name
            image.save(output, quality=78, optimize=True)
        before += source.stat().st_size
        after += output.stat().st_size
print(f"Phone textures: {before:,} -> {after:,} bytes ({1 - after / before:.0%} less)")
