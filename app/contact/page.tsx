import { Instagram } from 'lucide-react'
import { PageHeader } from '@/components/PageHeader'
import { Footer } from '@/components/Footer'

const XIcon = ({ size = 24 }: { size?: number }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M21.742 21.75l-7.563-11.179 7.056-8.321h-2.456l-5.691 6.714-4.54-6.714H2.359l7.29 10.776L2.25 21.75h2.456l6.035-7.118 4.818 7.118h6.191-.008zM7.739 3.818L18.81 20.182h-2.447L5.29 3.818h2.447z" />
  </svg>
)

export const metadata = {
  title: 'Contact - Miked.live',
  description: 'Get in touch with Miked.live',
  openGraph: {
    title: 'Contact - Miked.live',
    description: 'Get in touch with Miked.live',
    image: '/og-image.png',
    url: 'https://miked.live/contact',
    type: 'website',
  },
}

export default function ContactPage() {
  return (
    <div className="flex flex-col w-full min-h-screen bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 text-slate-100 relative">
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

      <div className="flex-1 max-w-4xl mx-auto w-full px-4 relative z-10 py-20">
        <PageHeader
          badge="Let's Connect"
          title="Get in Touch"
          description="Reach out with feedback, ideas, or just to say hello"
        />

        {/* Contact Block */}
        <div className="max-w-2xl mx-auto">
          <div className="mb-16 mt-0 flex gap-8 md:gap-8 gap-0 md:flex-row flex-col">
            <div className="hidden md:block w-24 flex-shrink-0"></div>
            <div className="flex-1">
            <div className="pt-8 border-t border-slate-800 bg-slate-900/50 backdrop-blur-sm rounded-2xl p-8 hover:border-indigo-500/30 transition-colors shadow-lg">
              <p className="text-sm text-slate-300 mb-4">I'm building this in public and I'd love your feedback!</p>
              <a
                href="https://chat.whatsapp.com/JW37b8r65X1AyAGYPRt1NG"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm font-medium text-indigo-300 hover:text-indigo-200 transition-colors bg-indigo-500/10 hover:bg-indigo-500/20 px-4 py-2 rounded-lg mb-4"
              >
                <span>Join the WhatsApp community</span>
                <span>↗</span>
              </a>
              <p className="text-xs text-slate-400 mb-4">Share ideas, feedback, and feature requests with me directly</p>
              <div className="flex items-center gap-3">
                <span className="text-xs text-slate-400">Or follow me:</span>
                <a
                  href="https://twitter.com/Woesnos"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 text-slate-400 hover:text-indigo-300 transition-colors"
                  title="X"
                >
                  <div className="sm:hidden">
                    <XIcon size={24} />
                  </div>
                  <div className="hidden sm:block">
                    <XIcon size={28} />
                  </div>
                </a>
                <a
                  href="https://instagram.com/woesnos"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 text-slate-400 hover:text-indigo-300 transition-colors"
                  title="Instagram"
                >
                  <Instagram size={24} className="sm:hidden" />
                  <Instagram size={28} className="hidden sm:block" />
                </a>
              </div>
            </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
