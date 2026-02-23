import { allPosts } from '@/changelog/posts'

export interface ChangelogPost {
  date: string
  title: string
  description: string
  content: string
  image?: string
}

export function getChangelogPosts(): ChangelogPost[] {
  // Sort by date descending (newest first)
  const posts = [...allPosts].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  )
  return posts
}
