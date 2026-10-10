import sharp from 'sharp'
const o = 'public/art/'
const enc = async (img, name, w, q = {}) => {
  const p = () => img.clone().resize({ width: w })
  await p().avif({ quality: q.avif ?? 42, effort: 6 }).toFile(`${o}${name}.avif`)
  await p().webp({ quality: q.webp ?? 66 }).toFile(`${o}${name}.webp`)
  await p().jpeg({ quality: q.jpg ?? 68, mozjpeg: true }).toFile(`${o}${name}.jpg`)
}
const hero = sharp('art-src/hero.png')
await enc(hero, 'hero', 1792)
await enc(hero.clone().extract({ left: 760, top: 0, width: 1032, height: 1024 }), 'hero-m', 800)
const scene = sharp('art-src/scene.png')
await enc(scene, 'scene', 1792, { avif: 38, webp: 62, jpg: 62 })
await enc(scene.clone().extract({ left: 0, top: 0, width: 1100, height: 1024 }), 'scene-m', 800, { avif: 38, webp: 62, jpg: 62 })
const sp = sharp('art-src/sprig.png').extract({ left: 230, top: 370, width: 1080, height: 310 })
await enc(sp, 'sprig', 900, { avif: 50, webp: 80, jpg: 80 })
for (const n of ['hero','hero-m','scene','scene-m','sprig']) {
  const s = await sharp(o+n+'.avif').stats(); 
}
const px = async (f, x, y) => { const {data} = await sharp(f).extract({left:x,top:y,width:1,height:1}).raw().toBuffer({resolveWithObject:true}); return [...data] }
console.log('hero tl', await px('art-src/hero.png', 20, 500), 'sprig', await px('art-src/sprig.png', 20, 20), await px('art-src/sprig.png', 700, 900))
