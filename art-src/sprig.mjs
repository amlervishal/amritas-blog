import sharp from 'sharp'
const src = sharp('art-src/sprig.png').extract({ left: 230, top: 370, width: 1080, height: 310 }).resize({ width: 900 })
const { data, info } = await src.raw().toBuffer({ resolveWithObject: true })
const bg = [246, 239, 227]
const out = Buffer.alloc(info.width * info.height * 4)
for (let i = 0, j = 0; i < data.length; i += 3, j += 4) {
  const d = Math.max(Math.abs(data[i] - bg[0]), Math.abs(data[i+1] - bg[1]), Math.abs(data[i+2] - bg[2]))
  const a = Math.min(1, Math.max(0, (d - 4) / 26))
  // un-premultiply against bg so edges do not halo
  for (let k = 0; k < 3; k++) out[j+k] = a > 0.02 ? Math.max(0, Math.min(255, Math.round(bg[k] + (data[i+k] - bg[k]) / a))) : data[i+k]
  out[j+3] = Math.round(a * 255)
}
const img = sharp(out, { raw: { width: info.width, height: info.height, channels: 4 } })
await img.clone().webp({ quality: 85, alphaQuality: 90 }).toFile('public/art/sprig.webp')
await img.clone().avif({ quality: 55 }).toFile('public/art/sprig.avif')
await img.clone().png({ compressionLevel: 9, palette: true, quality: 85 }).toFile('public/art/sprig.png')
console.log(info)
