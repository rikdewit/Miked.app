export interface MarkdownNode {
  type: 'paragraph' | 'list' | 'heading'
  content: string | MarkdownInline[]
}

export interface MarkdownInline {
  type: 'text' | 'bold'
  content: string
}

function parseInline(text: string): MarkdownInline[] {
  const parts: MarkdownInline[] = []
  let remaining = text

  while (remaining.length > 0) {
    const boldMatch = remaining.match(/\*\*(.*?)\*\*/)
    if (boldMatch && boldMatch.index !== undefined) {
      if (boldMatch.index > 0) {
        parts.push({ type: 'text', content: remaining.slice(0, boldMatch.index) })
      }
      parts.push({ type: 'bold', content: boldMatch[1] })
      remaining = remaining.slice(boldMatch.index + boldMatch[0].length)
    } else {
      parts.push({ type: 'text', content: remaining })
      remaining = ''
    }
  }

  return parts
}

export function parseMarkdown(content: string): MarkdownNode[] {
  const lines = content.split('\n')
  const nodes: MarkdownNode[] = []
  let listItems: string[] = []

  for (const line of lines) {
    const trimmed = line.trim()

    // Handle headings
    const headingMatch = trimmed.match(/^(#{1,6})\s+(.+)$/)
    if (headingMatch) {
      if (listItems.length > 0) {
        nodes.push({
          type: 'list',
          content: listItems.map(item => parseInline(item))
        })
        listItems = []
      }
      nodes.push({
        type: 'heading',
        content: parseInline(headingMatch[2])
      })
      continue
    }

    if (trimmed.startsWith('- ')) {
      listItems.push(trimmed.slice(2))
    } else {
      if (listItems.length > 0) {
        nodes.push({
          type: 'list',
          content: listItems.map(item => parseInline(item))
        })
        listItems = []
      }

      if (trimmed.length > 0) {
        nodes.push({
          type: 'paragraph',
          content: parseInline(trimmed)
        })
      }
    }
  }

  if (listItems.length > 0) {
    nodes.push({
      type: 'list',
      content: listItems.map(item => parseInline(item))
    })
  }

  return nodes
}
