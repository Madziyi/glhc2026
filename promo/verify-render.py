"""Decode the full export and produce a private scene contact sheet for visual QA."""
import json
from pathlib import Path
import cv2
from PIL import Image, ImageDraw

root = Path(__file__).resolve().parent
video = root / 'out/glhc-full-promo.mp4'
capture = cv2.VideoCapture(str(video))
assert capture.isOpened(), f'Cannot open {video}'
fps = capture.get(cv2.CAP_PROP_FPS)
width, height = int(capture.get(3)), int(capture.get(4))
decoded = 0
while True:
    ok, frame = capture.read()
    if not ok:
        break
    decoded += 1
assert (decoded, fps, width, height) == (2250, 30, 1920, 1080)

times = [2.8, 6, 10, 14, 19, 27, 35, 43, 51, 58, 65, 73]
sheet = Image.new('RGB', (1440, 1200), '#18222a')
draw = ImageDraw.Draw(sheet)
for i, seconds in enumerate(times):
    capture.set(cv2.CAP_PROP_POS_MSEC, seconds * 1000)
    ok, frame = capture.read()
    assert ok
    image = Image.fromarray(cv2.cvtColor(frame, cv2.COLOR_BGR2RGB))
    image.save(root / f'out/scene-{seconds}.jpg')
    image.thumbnail((480, 270))
    x, y = (i % 3) * 480, (i // 3) * 300
    sheet.paste(image, (x, y))
    draw.text((x + 15, y + 279), f'{seconds}s', fill='white')
sheet.save(root / 'out/full-review.jpg')

# Compare decoded pixels against the separately approved opening.
opening = cv2.VideoCapture(str(root / 'out/glhc-opening.mp4'))
errors = []
for seconds in [1, 2.8, 6, 10, 14]:
    opening.set(cv2.CAP_PROP_POS_MSEC, seconds * 1000)
    capture.set(cv2.CAP_PROP_POS_MSEC, seconds * 1000)
    a_ok, a = opening.read()
    b_ok, b = capture.read()
    assert a_ok and b_ok
    error = cv2.absdiff(a, b).mean()
    errors.append(float(error))
assert max(errors) < 2, errors  # H264 encoding differences are expected.
result = dict(decoded_frames=decoded, fps=fps, dimensions=[width, height],
              duration_seconds=decoded / fps, opening_sample_mean_pixel_errors=errors)
(root / 'out/full-verification.json').write_text(json.dumps(result, indent=2))
print(json.dumps(result))
