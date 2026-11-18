import { marked } from 'marked'
import DOMPurify from 'dompurify'
import katex from 'katex'
import Prism from 'prismjs'
import 'prismjs/components/prism-python'
import 'prismjs/components/prism-javascript'
import 'prismjs/components/prism-typescript'
import 'prismjs/components/prism-java'
import 'prismjs/components/prism-c'
import 'prismjs/components/prism-sql'
import 'prismjs/components/prism-r'
import 'prismjs/components/prism-haskell'
import 'prismjs/components/prism-bash'

const LATEX_INLINE = /\$([^$]+?)\$/g
const LATEX_BLOCK = /\$\$([\s\S]+?)\$\$/g
const PLACEHOLDER_PREFIX = 'LATEXPLACEHOLDER'
const CODE_BLOCK_RE = /<pre><code class="language-(\w+)">([\s\S]*?)<\/code><\/pre>/g

export function renderMarkdown(raw: string): string {
  const placeholders: string[] = []

  // Protect block math first
  let text = raw.replace(LATEX_BLOCK, (_, formula: string) => {
    const idx = placeholders.length
    try {
      const html = katex.renderToString(formula.trim(), {
        displayMode: true,
        throwOnError: false,
      })
      placeholders.push(html)
    } catch {
      placeholders.push(`<pre>${escapeHtml(formula)}</pre>`)
    }
    return `${PLACEHOLDER_PREFIX}${idx}`
  })

  // Protect inline math
  text = text.replace(LATEX_INLINE, (_, formula: string) => {
    const idx = placeholders.length
    try {
      const html = katex.renderToString(formula.trim(), {
        displayMode: false,
        throwOnError: false,
      })
      placeholders.push(html)
    } catch {
      placeholders.push(`<code>${escapeHtml(formula)}</code>`)
    }
    return `${PLACEHOLDER_PREFIX}${idx}`
  })

  // Render markdown
  const rawHtml = marked.parse(text, { async: false }) as string

  // Highlight code blocks
  const highlighted = rawHtml.replace(
    CODE_BLOCK_RE,
    (_, lang: string, code: string) => {
      const decoded = decodeHtmlEntities(code)
      const grammar = Prism.languages[lang]
      if (grammar) {
        try {
          const highlighted = Prism.highlight(decoded, grammar, lang)
          return `<pre class="language-${lang}"><code class="language-${lang}">${highlighted}</code></pre>`
        } catch {
          // Fall through to unhighlighted
        }
      }
      return `<pre class="language-${lang}"><code class="language-${lang}">${code}</code></pre>`
    }
  )

  const sanitized = DOMPurify.sanitize(highlighted, { ADD_ATTR: ['target', 'class'] })

  // Restore LaTeX placeholders
  const result = sanitized.replace(
    new RegExp(`${PLACEHOLDER_PREFIX}(\\d+)`, 'g'),
    (_, idx: string) => placeholders[parseInt(idx)] || ''
  )

  return result
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

function decodeHtmlEntities(s: string): string {
  return s
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
}
