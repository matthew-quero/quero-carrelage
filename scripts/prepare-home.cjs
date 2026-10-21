// Keep homepage styles in the HTML to remove CSS request round trips on mobile.
// Shared CSS remains the source of truth; run after changing any stylesheet.
const fs=require('node:fs'),path=require('node:path');
const root=path.join(__dirname,'..'),files=['fonts.css','site.css','responsive.css'];
const css=files.map(name=>fs.readFileSync(path.join(root,'assets',name),'utf8')
 .replace(/url\((['"]?)\.\//g,(_,quote)=>'url('+quote+'./assets/')).join('\n');
const index=path.join(root,'index.html'),html=fs.readFileSync(index,'utf8');
const generated='<!-- home-styles:start -->\n<style data-home-styles>\n'+css+'\n</style>\n<!-- home-styles:end -->';
if(!html.includes('<!-- home-styles:start -->'))throw new Error('Missing homepage CSS markers');
fs.writeFileSync(index,html.replace(/<!-- home-styles:start -->[\s\S]*?<!-- home-styles:end -->/,generated));
