/**
 * UC-2 MOCKUP: Quick Rider (ICP-2 - Non-Technical Musician)
 *
 * This mockup demonstrates the "Quick Rider" user journey:
 * Afke (non-technical weekend musician) creates a simple rider in under 3 minutes.
 *
 * Key features:
 * - Minimal form (only 4 questions)
 * - No technical jargon ("input channels", "DI", "phantom power" — all invisible)
 * - Direct engineer contact (phone + email)
 * - Single-page PDF output
 * - Very fast completion (target: < 3 minutes)
 *
 * This is OPPOSITE of UC-3 (band coordinator with collaboration).
 * UC-2 is for: "We have drums, bass, guitars, vocals — you figure out the rest"
 */

'use client'

import React, { useState } from 'react'
import { Check, ChevronRight, Download, Eye, Clock } from 'lucide-react'

type Step = 'mode-select' | 'step1' | 'step2' | 'step3' | 'step4' | 'preview' | 'done'

export default function UC2QuickRider() {
  const [currentStep, setCurrentStep] = useState<Step>('mode-select')
  const [bandName, setBandName] = useState('')
  const [contactPerson, setContactPerson] = useState('')
  const [contactEmail, setContactEmail] = useState('')
  const [contactPhone, setContactPhone] = useState('')
  const [instruments, setInstruments] = useState<Record<string, boolean>>({
    drums: false,
    bass: false,
    guitar1: false,
    guitar2: false,
    keyboards: false,
    vocals: false,
    horns: false,
  })
  const [venueContact, setVenueContact] = useState('')
  const [startTime, setStartTime] = useState<number | null>(null)

  // Track time for completion
  const completionTime = startTime ? Math.round((Date.now() - startTime) / 1000) : null

  const handleModeSelect = (mode: 'quick' | 'full') => {
    if (mode === 'quick') {
      setStartTime(Date.now())
      setCurrentStep('step1')
    } else {
      // In real app, would redirect to full wizard
      alert('Full Rider would redirect to complete 4-step wizard')
    }
  }

  const handleInstrumentChange = (key: string) => {
    setInstruments((prev) => ({
      ...prev,
      [key]: !prev[key],
    }))
  }

  const getSelectedInstruments = () => {
    return Object.entries(instruments)
      .filter(([_, selected]) => selected)
      .map(([key, _]) => {
        const map: Record<string, string> = {
          drums: 'Drums',
          bass: 'Bass',
          guitar1: 'Electric Guitar',
          guitar2: 'Electric Guitar',
          keyboards: 'Keyboards',
          vocals: 'Vocals',
          horns: 'Horns/Saxophones',
        }
        return map[key]
      })
      .filter((v, i, a) => a.indexOf(v) === i) // Remove duplicates
  }

  const progressPercentage = {
    'mode-select': 0,
    'step1': 25,
    'step2': 50,
    'step3': 75,
    'step4': 85,
    'preview': 90,
    'done': 100,
  }[currentStep]

  return (
    <div className="bg-gradient-to-br from-emerald-50 via-blue-50 to-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-2xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold text-slate-900">Quick Rider</h1>
            <div className="text-xs font-medium text-slate-600">
              {currentStep !== 'mode-select' && `${Math.round(progressPercentage)}% complete`}
            </div>
          </div>

          {/* Progress Bar */}
          {currentStep !== 'mode-select' && (
            <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-blue-500 to-emerald-500 transition-all duration-300"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-2xl mx-auto px-6 py-8">
        {/* MODE SELECT - Initial Choice */}
        {currentStep === 'mode-select' && (
          <div className="space-y-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-slate-900 mb-3">
                Create Your Technical Rider
              </h2>
              <p className="text-lg text-slate-600">
                Choose how detailed you want to get
              </p>
            </div>

            <div className="grid grid-cols-2 gap-6">
              {/* QUICK MODE - Recommended */}
              <div
                onClick={() => handleModeSelect('quick')}
                className="border-2 border-blue-300 bg-blue-50 rounded-xl p-6 cursor-pointer hover:shadow-lg transition hover:border-blue-400 ring-2 ring-blue-200"
              >
                <div className="mb-4">
                  <Clock className="text-blue-600" size={32} />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Quick Rider</h3>
                <p className="text-sm text-slate-600 mb-4">
                  Just tell us about your band and instruments. We'll do the rest.
                </p>
                <ul className="space-y-2 text-xs text-slate-600 mb-6">
                  <li>✓ 4 quick questions</li>
                  <li>✓ ~2 minutes total</li>
                  <li>✓ Perfect for smaller shows</li>
                  <li>✓ Direct engineer contact</li>
                </ul>
                <button className="w-full py-2.5 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition flex items-center justify-center gap-2">
                  Get Started <ChevronRight size={18} />
                </button>
                <div className="mt-3 text-xs font-semibold text-blue-600 text-center">
                  RECOMMENDED
                </div>
              </div>

              {/* FULL MODE */}
              <div
                onClick={() => handleModeSelect('full')}
                className="border-2 border-slate-300 bg-white rounded-xl p-6 cursor-pointer hover:shadow-lg transition hover:border-slate-400"
              >
                <div className="mb-4">
                  <Eye className="text-slate-400" size={32} />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Full Rider</h3>
                <p className="text-sm text-slate-600 mb-4">
                  Detailed stage plot, mic specs, power requirements — for technical venues.
                </p>
                <ul className="space-y-2 text-xs text-slate-600 mb-6">
                  <li>✓ Complete technical details</li>
                  <li>✓ ~15-20 minutes</li>
                  <li>✓ Stage plot drawing</li>
                  <li>✓ Specific microphone choices</li>
                </ul>
                <button className="w-full py-2.5 bg-slate-200 text-slate-700 font-semibold rounded-lg hover:bg-slate-300 transition">
                  Choose This
                </button>
              </div>
            </div>

            <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4 text-sm text-emerald-800">
              💡 <strong>Pro tip:</strong> Start with Quick Rider. You can always upgrade to Full
              Rider later if needed.
            </div>
          </div>
        )}

        {/* STEP 1: Band Name */}
        {currentStep === 'step1' && (
          <div className="space-y-6 max-w-md">
            <div>
              <div className="text-sm font-semibold text-slate-600 mb-1">Question 1 of 4</div>
              <h2 className="text-2xl font-bold text-slate-900">What's your band name?</h2>
            </div>

            <input
              type="text"
              placeholder="e.g., Blauw Lint"
              value={bandName}
              onChange={(e) => setBandName(e.target.value)}
              className="w-full px-4 py-3 border-2 border-slate-300 rounded-lg text-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              autoFocus
            />

            <button
              onClick={() => setCurrentStep('step2')}
              disabled={!bandName.trim()}
              className="w-full py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              Continue <ChevronRight size={20} />
            </button>
          </div>
        )}

        {/* STEP 2: Engineer Contact */}
        {currentStep === 'step2' && (
          <div className="space-y-6 max-w-md">
            <div>
              <div className="text-sm font-semibold text-slate-600 mb-1">Question 2 of 4</div>
              <h2 className="text-2xl font-bold text-slate-900">
                Who should the sound engineer contact?
              </h2>
              <p className="text-sm text-slate-600 mt-2">
                This person can answer technical questions about your setup.
              </p>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Your Name
                </label>
                <input
                  type="text"
                  placeholder="e.g., Afke"
                  value={contactPerson}
                  onChange={(e) => setContactPerson(e.target.value)}
                  className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  placeholder="afke@email.com"
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                  className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Phone Number (optional)
                </label>
                <input
                  type="tel"
                  placeholder="06-12345678"
                  value={contactPhone}
                  onChange={(e) => setContactPhone(e.target.value)}
                  className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <button
              onClick={() => setCurrentStep('step3')}
              disabled={!contactPerson.trim() || !contactEmail.trim()}
              className="w-full py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              Continue <ChevronRight size={20} />
            </button>
          </div>
        )}

        {/* STEP 3: Instruments */}
        {currentStep === 'step3' && (
          <div className="space-y-6 max-w-md">
            <div>
              <div className="text-sm font-semibold text-slate-600 mb-1">Question 3 of 4</div>
              <h2 className="text-2xl font-bold text-slate-900">What instruments does your band have?</h2>
              <p className="text-sm text-slate-600 mt-2">Select all that apply</p>
            </div>

            <div className="space-y-2">
              {[
                { key: 'drums', label: '🥁 Drums' },
                { key: 'bass', label: '🎸 Bass' },
                { key: 'guitar1', label: '🎸 Electric Guitar' },
                { key: 'guitar2', label: '🎸 Electric Guitar (2nd)' },
                { key: 'keyboards', label: '⌨️  Keyboards' },
                { key: 'vocals', label: '🎤 Vocals' },
                { key: 'horns', label: '🎺 Horns/Saxophones' },
              ].map(({ key, label }) => (
                <label key={key} className="flex items-center p-3 border border-slate-300 rounded-lg cursor-pointer hover:bg-slate-50 transition">
                  <input
                    type="checkbox"
                    checked={instruments[key] || false}
                    onChange={() => handleInstrumentChange(key)}
                    className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                  />
                  <span className="ml-3 font-medium text-slate-900">{label}</span>
                </label>
              ))}
            </div>

            <button
              onClick={() => setCurrentStep('step4')}
              disabled={getSelectedInstruments().length === 0}
              className="w-full py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              Continue <ChevronRight size={20} />
            </button>
          </div>
        )}

        {/* STEP 4: Venue Contact */}
        {currentStep === 'step4' && (
          <div className="space-y-6 max-w-md">
            <div>
              <div className="text-sm font-semibold text-slate-600 mb-1">Question 4 of 4</div>
              <h2 className="text-2xl font-bold text-slate-900">Venue contact (optional)</h2>
              <p className="text-sm text-slate-600 mt-2">
                Email or phone of the person booking you
              </p>
            </div>

            <textarea
              placeholder="Organizer name, email, phone..."
              value={venueContact}
              onChange={(e) => setVenueContact(e.target.value)}
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={3}
            />

            <button
              onClick={() => setCurrentStep('preview')}
              className="w-full py-3 bg-emerald-600 text-white font-semibold rounded-lg hover:bg-emerald-700 transition flex items-center justify-center gap-2"
            >
              Preview Rider <ChevronRight size={20} />
            </button>
          </div>
        )}

        {/* PREVIEW - Show what the PDF will look like */}
        {currentStep === 'preview' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 mb-2">Preview Your Rider</h2>
              <p className="text-slate-600">This is what the engineer will see</p>
            </div>

            {/* Mock PDF Preview */}
            <div className="bg-white rounded-lg border-2 border-slate-300 shadow-lg p-8 font-sans">
              {/* A4-like aspect ratio */}
              <div className="bg-white aspect-[8.5/11] flex flex-col">
                {/* Header */}
                <div className="border-b-2 border-slate-300 pb-4 mb-6">
                  <h1 className="text-3xl font-bold text-slate-900">{bandName}</h1>
                  <p className="text-sm text-slate-600 mt-1">Technical Rider</p>
                </div>

                {/* Main Content */}
                <div className="flex-1 space-y-6 text-sm">
                  {/* Contact Info */}
                  <div>
                    <h2 className="font-bold text-slate-900 mb-2">CONTACT</h2>
                    <div className="text-slate-700 space-y-1">
                      <p>
                        <strong>Contact Person:</strong> {contactPerson}
                      </p>
                      <p>
                        <strong>Email:</strong> {contactEmail}
                      </p>
                      {contactPhone && (
                        <p>
                          <strong>Phone:</strong> {contactPhone}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Instruments */}
                  <div>
                    <h2 className="font-bold text-slate-900 mb-2">INSTRUMENTS</h2>
                    <ul className="text-slate-700 list-disc list-inside space-y-1">
                      {getSelectedInstruments().map((inst) => (
                        <li key={inst}>{inst}</li>
                      ))}
                    </ul>
                  </div>

                  {/* Note */}
                  <div className="bg-blue-50 border border-blue-200 p-3 rounded text-slate-700">
                    <p>
                      <strong>Setup:</strong> Please contact {contactPerson} for specific technical
                      requirements. We're ready to work with your equipment and expertise.
                    </p>
                  </div>

                  {/* Footer */}
                  {venueContact && (
                    <div className="text-xs text-slate-600 border-t border-slate-200 pt-4">
                      <strong>Organizer:</strong> {venueContact}
                    </div>
                  )}
                </div>

                {/* Footer */}
                <div className="text-xs text-slate-500 text-center pt-4 border-t border-slate-200 mt-6">
                  Created with Miked.live • miked.live
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => setCurrentStep('step4')}
                className="py-3 border-2 border-slate-300 text-slate-700 font-semibold rounded-lg hover:bg-slate-50 transition"
              >
                Back
              </button>
              <button
                onClick={() => setCurrentStep('done')}
                className="py-3 bg-emerald-600 text-white font-semibold rounded-lg hover:bg-emerald-700 transition flex items-center justify-center gap-2"
              >
                <Download size={20} />
                Download PDF
              </button>
            </div>
          </div>
        )}

        {/* DONE - Completion Screen */}
        {currentStep === 'done' && (
          <div className="text-center space-y-6">
            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto">
              <Check className="text-emerald-600" size={32} />
            </div>

            <div>
              <h2 className="text-3xl font-bold text-slate-900 mb-2">Rider Complete! 🎉</h2>
              <p className="text-lg text-slate-600">
                Your {bandName} rider is ready to share
              </p>
            </div>

            {/* Completion Stats */}
            <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-6 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-slate-700">Time to complete:</span>
                <span className="font-semibold text-emerald-600">
                  {completionTime ? `${completionTime} seconds` : '—'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-700">Questions answered:</span>
                <span className="font-semibold text-emerald-600">4 of 4 ✓</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-700">PDF Pages:</span>
                <span className="font-semibold text-emerald-600">1</span>
              </div>
            </div>

            {/* Next Steps */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-left space-y-3">
              <h3 className="font-semibold text-slate-900">What's next?</h3>
              <ol className="space-y-2 text-sm text-slate-700">
                <li>
                  <strong>1. Download</strong> — Get your PDF rider
                </li>
                <li>
                  <strong>2. Share</strong> — Send to the event organizer
                </li>
                <li>
                  <strong>3. They'll share with engineer</strong> — Who can comment directly on the
                  rider
                </li>
                <li>
                  <strong>4. You get notifications</strong> — When engineer has questions, you'll be
                  contacted
                </li>
              </ol>
            </div>

            <div className="space-y-3">
              <button className="w-full py-3 bg-emerald-600 text-white font-semibold rounded-lg hover:bg-emerald-700 transition flex items-center justify-center gap-2">
                <Download size={20} />
                Download Rider PDF
              </button>
              <button className="w-full py-3 border-2 border-slate-300 text-slate-700 font-semibold rounded-lg hover:bg-slate-50 transition">
                Share Rider
              </button>
            </div>

            <div className="pt-4">
              <button
                onClick={() => {
                  setCurrentStep('mode-select')
                  setBandName('')
                  setContactPerson('')
                  setContactEmail('')
                  setContactPhone('')
                  setVenueContact('')
                  setInstruments({
                    drums: false,
                    bass: false,
                    guitar1: false,
                    guitar2: false,
                    keyboards: false,
                    vocals: false,
                    horns: false,
                  })
                  setStartTime(null)
                }}
                className="text-slate-600 hover:text-slate-900 font-medium"
              >
                Create another rider
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
