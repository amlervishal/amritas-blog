import fs from 'fs'
const key = fs.readFileSync(process.env.HOME + '/.config/fal/key', 'utf8').trim()
const [name, quality, w, h, usd, ...p] = process.argv.slice(2)
const prompt = p.join(' ')
const r = await fetch('https://fal.run/openai/gpt-image-2', {
  method: 'POST',
  headers: { Authorization: 'Key ' + key, 'Content-Type': 'application/json' },
  body: JSON.stringify({ prompt, image_size: { width: +w, height: +h }, quality, num_images: 1, output_format: 'png' }),
})
const txt = await r.text()
let j; try { j = JSON.parse(txt) } catch { console.log(r.status, txt.slice(0, 500)); process.exit(1) }
fs.appendFileSync('/Users/vishal/Work/library-app/data/covers/spend.jsonl', JSON.stringify({ t: new Date().toISOString(), book: 'pds-redesign:' + name, endpoint: 'openai/gpt-image-2', usd: r.ok ? +usd : 0, ok: r.ok, status: r.status }) + '\n')
if (!r.ok) { console.log(r.status, txt.slice(0, 600)); process.exit(1) }
const url = j.images[0].url
fs.writeFileSync(name + '.png', Buffer.from(await (await fetch(url)).arrayBuffer()))
console.log('saved', name, j.images[0].width, j.images[0].height)
