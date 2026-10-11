// Writes the drill page to public/drill/: cards.json from the notes under content/, the
// bundled client, and KaTeX styles. Run after `quartz build`, which empties public/.
import { cpSync, mkdirSync, readdirSync, writeFileSync } from "node:fs"
import { toHtml } from "hast-util-to-html"
import rehypeKatex from "rehype-katex"
import remarkMath from "remark-math"
import remarkParse from "remark-parse"
import remarkRehype from "remark-rehype"
import { unified } from "unified"
import { build } from "esbuild"
import { scan } from "./cards"

const out = "public/drill"
const md = unified().use(remarkParse).use(remarkMath).use(remarkRehype).use(rehypeKatex)
const html = (text: string) => toHtml(md.runSync(md.parse(text)))

const { cards, errs } = scan("content")
if (errs.length) {
  console.error(errs.join("\n"))
  process.exit(1)
}

mkdirSync(`${out}/katex/fonts`, { recursive: true })
writeFileSync(
  `${out}/cards.json`,
  JSON.stringify(cards.map((c) => ({ ...c, front: html(c.front), back: html(c.back) }))),
)
await build({
  entryPoints: ["drill/page.ts"],
  bundle: true,
  minify: true,
  outfile: `${out}/page.js`,
})
cpSync("drill/index.html", `${out}/index.html`)
cpSync("drill/style.css", `${out}/style.css`)
const katex = "node_modules/katex/dist"
cpSync(`${katex}/katex.min.css`, `${out}/katex/katex.min.css`)
for (const f of readdirSync(`${katex}/fonts`).filter((f) => f.endsWith(".woff2")))
  cpSync(`${katex}/fonts/${f}`, `${out}/katex/fonts/${f}`)
console.log(`${cards.length} cards`)
