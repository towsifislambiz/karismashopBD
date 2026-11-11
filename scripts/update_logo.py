import os
import base64
from PIL import Image
import numpy as np

src_logo = 'C:/Users/User/.gemini/antigravity/brain/858e7906-f1a8-4215-ae01-3bb23a820aa1/.user_uploaded/media_1794379757268_5e4c98aa.jpg'
src_text = 'C:/Users/User/.gemini/antigravity/brain/858e7906-f1a8-4215-ae01-3bb23a820aa1/.user_uploaded/media_1794379771289_6b291160.jpg'

brand_dir = 'C:/Users/User/.gemini/antigravity/scratch/karishma-shop/public/assets/brand'
os.makedirs(brand_dir, exist_ok=True)

# 1. Process logo mark
im = Image.open(src_logo)
# Bounding box crop: (40, 20, 425, 368)
crop = im.crop((40, 20, 425, 368))
arr = np.array(crop).astype(float)

r, g, b = arr[:,:,0], arr[:,:,1], arr[:,:,2]
mean_val = (r + g + b) / 3.0
color_diff = np.maximum(np.maximum(np.abs(r - g), np.abs(g - b)), np.abs(r - b))

darkness = 250.0 - mean_val
chroma = color_diff

strength = np.maximum(darkness / 24.0, chroma / 10.0)
alpha = np.clip(strength * 255.0, 0.0, 255.0)

rgba = np.dstack([arr[:,:,:3], alpha]).astype(np.uint8)
img_out = Image.fromarray(rgba, 'RGBA')

# Save PNG and WebP
png_path = os.path.join(brand_dir, 'ks-logo.png')
webp_path = os.path.join(brand_dir, 'ks-logo.webp')
logo_webp = os.path.join(brand_dir, 'logo.webp')
favicon_ico = 'C:/Users/User/.gemini/antigravity/scratch/karishma-shop/public/favicon.ico'

img_out.save(png_path, format='PNG')
img_out.save(webp_path, format='WEBP', quality=95)
img_out.save(logo_webp, format='WEBP', quality=95)

# Also generate favicon
fav = img_out.resize((64, 64), Image.Resampling.LANCZOS)
fav.save(favicon_ico, format='ICO')

# 2. Update ks-logo.svg with embedded base64
with open(png_path, 'rb') as f:
    b64 = base64.b64encode(f.read()).decode('utf-8')

svg_path = os.path.join(brand_dir, 'ks-logo.svg')
svg_content = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {img_out.width} {img_out.height}" width="{img_out.width}" height="{img_out.height}">
  <image href="data:image/png;base64,{b64}" width="{img_out.width}" height="{img_out.height}" />
</svg>'''

with open(svg_path, 'w', encoding='utf-8') as f:
    f.write(svg_content)

print(f"Saved logo mark: {img_out.size} to {png_path}, {webp_path}, {svg_path}")

# 3. Process typography banner
im_text = Image.open(src_text)
# Crop text: Y from 70 to 255, X from 140 to 965
text_crop = im_text.crop((140, 68, 965, 255))
text_arr = np.array(text_crop).astype(float)

tr, tg, tb = text_arr[:,:,0], text_arr[:,:,1], text_arr[:,:,2]
t_mean = (tr + tg + tb) / 3.0
t_darkness = 250.0 - t_mean
t_chroma = np.maximum(np.maximum(np.abs(tr - tg), np.abs(tg - tb)), np.abs(tr - tb))

t_strength = np.maximum(t_darkness / 24.0, t_chroma / 10.0)
t_alpha = np.clip(t_strength * 255.0, 0.0, 255.0)

t_rgba = np.dstack([text_arr[:,:,:3], t_alpha]).astype(np.uint8)
t_out = Image.fromarray(t_rgba, 'RGBA')

banner_png = os.path.join(brand_dir, 'brand_text_banner.png')
banner_webp = os.path.join(brand_dir, 'brand_text_banner.webp')
t_out.save(banner_png, format='PNG')
t_out.save(banner_webp, format='WEBP', quality=95)
print(f"Saved brand typography banner: {t_out.size} to {banner_webp}")
