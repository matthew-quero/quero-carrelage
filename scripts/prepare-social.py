"""Render the site's existing tile and outlined local fonts into an Open Graph card."""
from pathlib import Path
from io import BytesIO
import base64
import fitz
from PIL import Image
from fontTools.ttLib import TTFont
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen
root = Path(__file__).resolve().parents[1]
fonts = {key: TTFont(root / f'assets/fonts/font-{n}.ttf') for key,n in [('title',3),('body',0)]}
def text(label, family, size, x, baseline, max_width, color='#1a1a1a'):
    font=fonts[family]; cmap=font.getBestCmap(); glyphs=font.getGlyphSet(); units=font['head'].unitsPerEm
    advance=sum(font['hmtx'].metrics[cmap[ord(c)]][0] for c in label)
    size=min(size,max_width*units/advance); scale=size/units; parts=[]
    for char in label:
        name=cmap[ord(char)]; pen=SVGPathPen(glyphs)
        glyphs[name].draw(TransformPen(pen,(scale,0,0,-scale,x,baseline)))
        parts.append(f'<path fill="{color}" d="{pen.getCommands()}"/>')
        x+=font['hmtx'].metrics[name][0]*scale
    return ''.join(parts)
texture=Image.open(root/'assets/photos/tile-surface-mobile.webp')
buffer=BytesIO();texture.save(buffer,'PNG')
encoded=base64.b64encode(buffer.getvalue()).decode()
svg=f'''<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="1200" height="630" viewBox="0 0 1200 630">
<rect width="1200" height="630" fill="white"/>
<image x="-120" y="105" width="420" height="420" transform="rotate(45 90 315)" xlink:href="data:image/png;base64,{encoded}"/>
{text('QUÉRO','title',100,460,248,650)}
{text('CARRELAGE','title',86,460,346,650)}
{text('Pascal Quéro · Carrelage et faïence','body',28,462,421,650)}
{text('Châtelaudren-Plouagat','body',28,462,510,650)}
{text('Côtes-d’Armor','body',24,462,548,650,'#4a4a4a')}
</svg>'''
document=fitz.open(stream=svg.encode(),filetype='svg')
pdf=fitz.open('pdf',document.convert_to_pdf())
png=pdf[0].get_pixmap(alpha=False).tobytes('png')
image=Image.open(BytesIO(png)).convert('RGB')
assert image.size==(1200,630)
output=root/'assets/social/quero-carrelage-1200x630.jpg';output.parent.mkdir(exist_ok=True)
image.save(output,'JPEG',quality=90,optimize=True)
print(output,output.stat().st_size,'bytes')
