'use client'

import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

export default function MockupsIndex() {
  const mockups = [
    {
      id: 'uc3',
      title: 'UC-3: Band Coordinator Rider Management',
      description:
        'Lars (band coordinator) creates a rider, invites band members to contribute, shares with engineer, receives feedback via comments, and iterates.',
      personas: ['Band Coordinator', 'Band Members', 'Sound Engineer'],
      features: [
        'Real-time band member collaboration',
        'Contribution status tracking',
        'Engineer comment threads',
        'Role-based color coding',
        'Share & notification system',
      ],
      status: 'complete',
      color: 'from-blue-500 to-blue-600',
    },
    {
      id: 'uc2',
      title: 'UC-2: Quick Rider (ICP-2)',
      description:
        'Afke (non-technical musician) creates a simple rider in under 3 minutes: band name, instruments, contact info — no technical details needed.',
      personas: ['Non-Technical Musician', 'Weekend Band'],
      features: [
        '4-question wizard',
        '1-page PDF output',
        'Direct engineer contact info',
        'No technical jargon',
        'Completion time tracking',
      ],
      status: 'complete',
      color: 'from-green-500 to-green-600',
    },
    {
      id: 'uc5',
      title: 'UC-5: Band ↔ Engineer Technical Brief Communication',
      description:
        'The Rockers and engineer Michiel use a real-time technical brief system to decide on gear, mics, power, stage layout, and monitoring. Live summaries show what each party needs to bring or provide.',
      personas: ['Band Coordinator', 'Sound Engineer', 'All Band Members'],
      features: [
        'Generic brief item system (input, drums, backline, power, stage, monitoring)',
        'Band option types: specified / engineer choice / negotiable / question',
        'Real-time role-specific to-do lists',
        'Status tracking: pending / awaiting response / agreed',
        'Live communication with decision history',
      ],
      status: 'complete',
      color: 'from-orange-500 to-orange-600',
    },
    {
      id: 'uc4',
      title: 'UC-4: Engineer Receiving & Annotating Rider',
      description:
        'Michiel (sound engineer) receives rider link, views clean printable stage plot, comments on unclear sections, downloads PDF for prep.',
      personas: ['Sound Engineer', 'FOH Technician'],
      features: [
        'No-login magic link access',
        'Clean, printable PDF (B&W friendly)',
        'Section-specific comments',
        'Print preview',
        'Share tracking',
      ],
      status: 'planned',
      color: 'from-red-500 to-red-600',
    },
    {
      id: 'uc1',
      title: 'UC-1: Gear-Aware Musician Partial Specification',
      description:
        'Matthijs (gear-conscious guitarist) specifies his exact mic needs (SM57 on amp) while deferring other choices to engineer ("Ask Engineer" option).',
      personas: ['Technical Musician', 'Gear-Aware Player'],
      features: [
        'Partial gear specification',
        'Standard vs. Specified distinction',
        '"Ask Engineer" option',
        'Mic library dropdowns',
        'Confidence indicators',
      ],
      status: 'planned',
      color: 'from-purple-500 to-purple-600',
    },
  ]

  const completeColor = (color: string) => {
    return color
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">Miked.live MVP Mockups</h1>
          <p className="text-lg text-slate-600">
            Interactive prototypes showing all user journeys from the MVP-comm documentation
          </p>
        </div>
      </div>

      {/* Mockups Grid */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="space-y-6">
          {mockups.map((mockup) => (
            <Link key={mockup.id} href={`/mockups/${mockup.id}`}>
              <div className="bg-white rounded-lg border border-slate-200 overflow-hidden hover:border-slate-400 hover:shadow-lg transition group cursor-pointer">
                {/* Header with color gradient */}
                <div
                  className={`h-2 bg-gradient-to-r ${mockup.color}`}
                />

                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h2 className="text-2xl font-bold text-slate-900 mb-2 group-hover:text-blue-600 transition">
                        {mockup.title}
                      </h2>
                      <p className="text-slate-600">{mockup.description}</p>
                    </div>

                    {/* Status Badge */}
                    <div className="ml-4">
                      {mockup.status === 'complete' ? (
                        <span className="inline-block px-3 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full whitespace-nowrap">
                          ✓ Interactive
                        </span>
                      ) : (
                        <span className="inline-block px-3 py-1 bg-yellow-100 text-yellow-700 text-xs font-semibold rounded-full whitespace-nowrap">
                          Coming Soon
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Personas */}
                  <div className="mb-4">
                    <p className="text-xs font-semibold text-slate-600 mb-2 uppercase">Key Personas</p>
                    <div className="flex flex-wrap gap-2">
                      {mockup.personas.map((persona) => (
                        <span
                          key={persona}
                          className="inline-block px-3 py-1 bg-slate-100 text-slate-700 text-sm rounded-full"
                        >
                          {persona}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Features */}
                  <div className="mb-4">
                    <p className="text-xs font-semibold text-slate-600 mb-2 uppercase">Features</p>
                    <ul className="grid grid-cols-2 gap-2">
                      {mockup.features.map((feature) => (
                        <li key={feature} className="text-sm text-slate-600 flex items-center gap-2">
                          <span className="text-blue-600">•</span>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* CTA */}
                  {mockup.status === 'complete' && (
                    <div className="flex items-center gap-2 text-blue-600 font-medium mt-4 group-hover:gap-3 transition">
                      View Mockup
                      <ArrowRight size={18} />
                    </div>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Information Section */}
        <div className="mt-12 grid grid-cols-2 gap-6">
          <div className="bg-white rounded-lg border border-slate-200 p-6">
            <h3 className="text-lg font-bold text-slate-900 mb-3">📚 Based On</h3>
            <ul className="space-y-2 text-slate-600 text-sm">
              <li>
                <strong>docs/MVP-comm/ICP.md</strong>
                <br />
                Ideal Customer Profiles & Use Cases
              </li>
              <li>
                <strong>docs/MVP-comm/mvp-communication-prd.md</strong>
                <br />
                In-Rider Communication System PRD
              </li>
              <li>
                <strong>docs/MVP-BUILD plan.md</strong>
                <br />
                Phase-by-phase implementation roadmap
              </li>
            </ul>
          </div>

          <div className="bg-white rounded-lg border border-slate-200 p-6">
            <h3 className="text-lg font-bold text-slate-900 mb-3">🎯 MVP Goals</h3>
            <ul className="space-y-2 text-slate-600 text-sm">
              <li>✓ Enable direct band ↔ engineer communication</li>
              <li>✓ Tie feedback to specific rider sections</li>
              <li>✓ Create accountability (viewed timestamps)</li>
              <li>✓ Reduce email friction & miscommunication</li>
            </ul>
          </div>
        </div>

        {/* How to Use */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-bold text-blue-900 mb-3">💡 How to Use These Mockups</h3>
          <ul className="space-y-2 text-blue-800 text-sm">
            <li>
              <strong>Interact:</strong> Click tabs, buttons, and comments to see how the UI responds
            </li>
            <li>
              <strong>Understand Flow:</strong> Follow the user journey from creating to sharing to feedback
            </li>
            <li>
              <strong>Iterate:</strong> Use feedback from these mockups to refine implementation
            </li>
            <li>
              <strong>Reference:</strong> Compare mockups with PRD requirements to ensure alignment
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}
