import { getChangelogPosts } from '@/lib/changelogLoader'
import { parseMarkdown } from '@/lib/parseMarkdown'
import Link from 'next/link'
import { Mic2 } from 'lucide-react'

export const metadata = {
  title: 'Changelog - Miked.live',
  description: 'Latest updates and improvements to Miked.live',
  openGraph: {
    title: 'Changelog - Miked.live',
    description: 'Latest updates and improvements to Miked.live',
    image: '/og-image.png',
    url: 'https://miked.live/changelog',
    type: 'website',
  },
}

export default function ChangelogPage() {
  const posts = getChangelogPosts()

  return (
    <div className="flex flex-col w-full bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 text-slate-100 relative">
      {/* Gradient orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 -right-32 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl"></div>
        <div className="absolute -top-40 -left-40 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/3 -left-48 w-96 h-96 bg-indigo-500/15 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 -right-64 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 -right-40 w-96 h-96 bg-purple-500/15 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 left-1/2 w-96 h-96 bg-indigo-500/15 rounded-full blur-3xl"></div>
      </div>
      <div className="flex-1 max-w-4xl mx-auto w-full px-4 relative z-10 py-8">
        {/* Page Title */}
        <div className="mb-16 mt-0 flex gap-8 md:gap-8 gap-0 md:flex-row flex-col">
          <div className="hidden md:block w-24 flex-shrink-0"></div>
          <div className="flex-1">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-indigo-400">Changelog</h1>
            <p className="text-slate-300 mb-8 text-lg">Latest updates and improvements to Miked.live</p>
            <div className="pt-8 border-t border-white/10 bg-white/5 backdrop-blur-sm rounded-xl p-6">
            <p className="text-sm text-slate-300 mb-4">I'm building this in public and I'd love your feedback!</p>
            <a
              href="https://chat.whatsapp.com/JW37b8r65X1AyAGYPRt1NG"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm font-medium text-indigo-300 hover:text-indigo-200 transition-colors bg-indigo-500/10 hover:bg-indigo-500/20 px-4 py-2 rounded-lg"
            >
              <span>Join the WhatsApp community</span>
              <span>↗</span>
            </a>
            <p className="text-xs text-slate-400 mt-3">Share ideas, feedback, and feature requests with me directly</p>
            </div>
          </div>
        </div>

        {/* Posts */}
        <div className="space-y-12 mb-24">
          {posts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-slate-400">No updates yet. Check back soon!</p>
            </div>
          ) : (
            posts.map((post, index) => {
              const date = new Date(post.date)
              const nextPost = posts[index + 1]
              const isNextPostSameDay = nextPost && nextPost.date === post.date
              const currentYear = new Date().getFullYear()
              const isCurrentYear = date.getFullYear() === currentYear

              return (
                <div key={post.date} className="relative flex gap-8">
                  {/* Sticky Date - Hidden on small screens */}
                  <div className="hidden md:block w-24 flex-shrink-0 sticky top-32 h-fit">
                    <div className="text-center">
                      <div className="text-xs font-bold text-indigo-300 mb-2 opacity-75">#{posts.length - index}</div>
                      <time className="text-lg font-bold text-indigo-400">{date.getDate()}</time>
                      <p className="text-xs text-slate-400 uppercase tracking-wide">
                        {date.toLocaleDateString('en-US', { month: 'short' })}
                        {!isCurrentYear && <span className="block text-xs mt-1 text-slate-500">{date.getFullYear()}</span>}
                      </p>
                    </div>
                  </div>

                  {/* Post Content */}
                  <article className="flex-1 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 pt-12 hover:border-indigo-500/30 transition-colors shadow-lg">
                    {/* Date and number for small screens */}
                    <div className="md:hidden flex items-center gap-4 mb-4 pb-4 border-b border-white/10">
                      <div className="text-center">
                        <div className="text-xs font-bold text-indigo-300 opacity-75">#{posts.length - index}</div>
                        <time className="text-sm font-bold text-indigo-400">{date.getDate()}</time>
                        <p className="text-xs text-slate-400 uppercase tracking-wide">
                          {date.toLocaleDateString('en-US', { month: 'short' })}
                          {!isCurrentYear && <span className="block text-xs text-slate-500">{date.getFullYear()}</span>}
                        </p>
                      </div>
                    </div>
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">{post.title}</h2>
                    <p className="text-slate-300 mb-6">{post.description}</p>
                    {post.image && (
                      <img
                        src={post.image}
                        alt={post.title}
                        className="w-full rounded-lg mb-8 border border-white/10"
                      />
                    )}
                  <div className="max-w-none text-slate-300 space-y-4">
                    {parseMarkdown(post.content).map((node, i) => {
                      if (node.type === 'paragraph') {
                        return (
                          <p key={i}>
                            {Array.isArray(node.content) &&
                              node.content.map((inline, j) =>
                                inline.type === 'bold' ? (
                                  <strong key={j} className="font-bold text-white">
                                    {inline.content}
                                  </strong>
                                ) : (
                                  <span key={j}>{inline.content}</span>
                                )
                              )}
                          </p>
                        )
                      } else if (node.type === 'heading') {
                        return (
                          <h3 key={i} className="text-xl font-bold text-white mt-6 mb-3">
                            {Array.isArray(node.content) &&
                              node.content.map((inline, j) =>
                                inline.type === 'bold' ? (
                                  <strong key={j} className="font-bold">
                                    {inline.content}
                                  </strong>
                                ) : (
                                  <span key={j}>{inline.content}</span>
                                )
                              )}
                          </h3>
                        )
                      } else if (node.type === 'list') {
                        return (
                          <ul key={i} className="list-disc list-inside space-y-2 ml-2">
                            {Array.isArray(node.content) &&
                              node.content.map((item, j) => (
                                <li key={j} className="text-slate-300">
                                  {Array.isArray(item) &&
                                    item.map((inline, k) =>
                                      inline.type === 'bold' ? (
                                        <strong key={k} className="font-bold text-white">
                                          {inline.content}
                                        </strong>
                                      ) : (
                                        <span key={k}>{inline.content}</span>
                                      )
                                    )}
                                </li>
                              ))}
                          </ul>
                        )
                      }
                      return null
                    })}
                  </div>
                  </article>
                </div>
              )
            })
          )}
        </div>
      </div>

      {/* Footer - Full Width */}
      <footer className="py-12 border-t border-slate-800 bg-slate-950 text-slate-400 text-sm">
        <div className="max-w-4xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="bg-slate-800 p-1 rounded">
              <Mic2 className="w-4 h-4 text-slate-200" />
            </div>
            <span className="font-semibold text-slate-200">
              Miked<span className="text-indigo-500">.live</span>
            </span>
          </div>
          <div className="flex gap-8">
            <a href="#" className="hover:text-white transition-colors">Privacy</a>
            <a href="#" className="hover:text-white transition-colors">Terms</a>
            <a href="#" className="hover:text-white transition-colors">Contact</a>
          </div>
          <div>&copy; {new Date().getFullYear()} Miked.live. All rights reserved.</div>
        </div>
      </footer>
    </div>
  )
}
