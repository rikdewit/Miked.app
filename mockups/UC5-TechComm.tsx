/**
 * UC-5 MOCKUP: Band ↔ Engineer Technical Brief Communication
 *
 * Scenario: The Rockers need to coordinate their technical setup with engineer Michiel
 * for a show at Paradiso. The band specifies their preferences (mics, gear, power) across
 * multiple categories. Michiel responds with confirmations, alternatives, or questions.
 * A live summary on the right shows actionable to-do lists and agreed items for each party.
 *
 * Key features:
 * - Generic "brief item" system works for any decision category
 * - Band preference types: specified / engineer_choice / negotiable / question
 * - Engineer response options: confirm / propose alternative / ask question
 * - Real-time role-specific summary (what band brings vs what engineer provides)
 * - Status color-coding per item (pending / engineer_responded / awaiting_band / agreed / queried)
 */

'use client'

import React, { useState } from 'react'
import {
  Plus, X, Check, AlertCircle, MessageCircle, Share2, ChevronDown, ChevronUp,
  Music, Users, Zap
} from 'lucide-react'

type Tab = 'band-setup' | 'engineer-view' | 'show-spec'
type ItemStatus = 'pending' | 'engineer_responded' | 'awaiting_band' | 'agreed' | 'queried'
type OptionType = 'specified' | 'engineer_choice' | 'negotiable' | 'question'
type Category = 'input' | 'drums' | 'backline' | 'monitoring' | 'stage' | 'power' | 'other'

interface BriefItem {
  id: string
  category: Category
  topic: string
  bandInput: string
  bandOptionType: OptionType
  engineerResponse?: string
  status: ItemStatus
  expandedInBand?: boolean
  expandedInEngineer?: boolean
}

const categoryIcons: Record<Category, React.ReactNode> = {
  input: <Music className="w-4 h-4" />,
  drums: <Music className="w-4 h-4" />,
  backline: <Music className="w-4 h-4" />,
  monitoring: <Volume2 className="w-4 h-4" />,
  stage: <Users className="w-4 h-4" />,
  power: <Zap className="w-4 h-4" />,
  other: <AlertCircle className="w-4 h-4" />,
}

const categoryLabels: Record<Category, string> = {
  input: 'Input',
  drums: 'Drums',
  backline: 'Backline',
  monitoring: 'Monitoring',
  stage: 'Stage',
  power: 'Power',
  other: 'Other',
}

// Mock data: pre-populated brief items
const mockItems: BriefItem[] = [
  {
    id: 'item_1',
    category: 'input',
    topic: 'Kick drum mic',
    bandInput: 'Prefer Beta52A, open to alternatives',
    bandOptionType: 'negotiable',
    engineerResponse: 'I can use D6 — no Beta52A available',
    status: 'awaiting_band',
  },
  {
    id: 'item_2',
    category: 'input',
    topic: 'Vocals',
    bandInput: 'Bringing own SM58',
    bandOptionType: 'specified',
    engineerResponse: 'Confirmed — I will provide stand',
    status: 'agreed',
  },
  {
    id: 'item_3',
    category: 'input',
    topic: 'Overheads',
    bandInput: 'Your choice for placement and mics',
    bandOptionType: 'engineer_choice',
    status: 'pending',
  },
  {
    id: 'item_4',
    category: 'input',
    topic: 'Bass DI',
    bandInput: 'Do you have a good passive DI?',
    bandOptionType: 'question',
    status: 'pending',
  },
  {
    id: 'item_5',
    category: 'drums',
    topic: 'Cymbals',
    bandInput: 'Bringing full Zildjian kit — no hi-hat stand',
    bandOptionType: 'specified',
    status: 'pending',
  },
  {
    id: 'item_6',
    category: 'drums',
    topic: 'Snare',
    bandInput: 'Own Ludwig snare, just need stand',
    bandOptionType: 'specified',
    status: 'pending',
  },
  {
    id: 'item_7',
    category: 'backline',
    topic: 'Guitar amp',
    bandInput: 'Bringing Mesa Boogie Mark V — need speaker cab',
    bandOptionType: 'specified',
    engineerResponse: 'Cab arranged — confirmed',
    status: 'agreed',
  },
  {
    id: 'item_8',
    category: 'backline',
    topic: 'Bass amp',
    bandInput: 'Is the venue Ampeg SVT available?',
    bandOptionType: 'question',
    status: 'pending',
  },
  {
    id: 'item_9',
    category: 'monitoring',
    topic: 'Vocalist',
    bandInput: 'Wedge preferred, or IEM if available',
    bandOptionType: 'negotiable',
    engineerResponse: 'IEM available — would that work for you?',
    status: 'awaiting_band',
  },
  {
    id: 'item_10',
    category: 'stage',
    topic: 'Stage width',
    bandInput: 'We need minimum 6m for all 5 people',
    bandOptionType: 'question',
    status: 'pending',
  },
  {
    id: 'item_11',
    category: 'power',
    topic: 'Stage power drops',
    bandInput: 'How many outlets available? We need 8 minimum',
    bandOptionType: 'question',
    status: 'pending',
  },
  {
    id: 'item_12',
    category: 'power',
    topic: 'Guitar amp power',
    bandInput: 'Mesa Boogie needs a dedicated 20A circuit',
    bandOptionType: 'specified',
    status: 'pending',
  },
]

const statusColors = {
  pending: 'bg-gray-100 border-gray-300',
  engineer_responded: 'bg-blue-50 border-blue-300',
  awaiting_band: 'bg-yellow-50 border-yellow-300',
  agreed: 'bg-green-50 border-green-300',
  queried: 'bg-red-50 border-red-300',
}

const statusBadges = {
  pending: { bg: 'bg-gray-200', text: '⬜ Pending' },
  engineer_responded: { bg: 'bg-blue-200', text: '🔵 Engineer OK' },
  awaiting_band: { bg: 'bg-yellow-200', text: '🟡 Your turn' },
  agreed: { bg: 'bg-green-200', text: '🟢 Agreed' },
  queried: { bg: 'bg-red-200', text: '🔴 Question' },
}

function Volume2({ className }: { className: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
      <path d="M15.54 8.46a7 7 0 0 1 0 9.9"></path>
    </svg>
  )
}

export default function UC5TechComm() {
  const [currentTab, setCurrentTab] = useState<Tab>('band-setup')
  const [items, setItems] = useState(mockItems)
  const [selectedCategory, setSelectedCategory] = useState<Category | 'all'>('all')
  const [showAddForm, setShowAddForm] = useState(false)
  const [engineerViewed, setEngineerViewed] = useState('12 min ago')

  // Form state for adding new item
  const [newItem, setNewItem] = useState({
    topic: '',
    category: 'input' as Category,
    optionType: 'specified' as OptionType,
    details: '',
  })

  const filteredItems = selectedCategory === 'all'
    ? items
    : items.filter(i => i.category === selectedCategory)

  const categoryCount = (cat: Category) => items.filter(i => i.category === cat).length
  const allCount = items.length

  const toggleItemExpand = (itemId: string, tab: Tab) => {
    if (tab === 'band-setup') {
      setItems(items.map(i => i.id === itemId ? { ...i, expandedInBand: !i.expandedInBand } : i))
    } else {
      setItems(items.map(i => i.id === itemId ? { ...i, expandedInEngineer: !i.expandedInEngineer } : i))
    }
  }

  const updateItemStatus = (itemId: string, newStatus: ItemStatus) => {
    setItems(items.map(i => i.id === itemId ? { ...i, status: newStatus } : i))
  }

  const updateEngineerResponse = (itemId: string, response: string) => {
    setItems(items.map(i => i.id === itemId ? { ...i, engineerResponse: response } : i))
  }

  const handleAddItem = () => {
    if (newItem.topic.trim()) {
      const item: BriefItem = {
        id: `item_${Date.now()}`,
        category: newItem.category,
        topic: newItem.topic,
        bandInput: newItem.details,
        bandOptionType: newItem.optionType,
        status: 'pending',
      }
      setItems([...items, item])
      setNewItem({ topic: '', category: 'input', optionType: 'specified', details: '' })
      setShowAddForm(false)
    }
  }

  // Role-specific summary data
  const bandSummary = {
    toSubmit: items.filter(i => i.status === 'awaiting_band'),
    agreed: items.filter(i => i.status === 'agreed'),
    pending: items.filter(i => i.status === 'pending'),
  }

  const engineerSummary = {
    toCommunicate: items.filter(i => i.status === 'pending'),
    awaitingBand: items.filter(i => i.status === 'awaiting_band'),
    agreed: items.filter(i => i.status === 'agreed'),
  }

  const bandBringItems = items.filter(i => i.bandOptionType === 'specified' && ['input', 'drums', 'backline'].includes(i.category))

  return (
    <div className="bg-gray-50">
      {/* Header */}
      <div className="sticky top-0 bg-white border-b border-gray-200 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">The Rockers @ Paradiso</h1>
              <p className="text-sm text-gray-700">15 March 2026 • Miked.live Technical Brief</p>
            </div>
            <div className="text-right text-sm text-gray-700">
              Engineer badge: {currentTab === 'engineer-view' ? '🔴 Engineer' : '🟢 Band'}
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-4">
            <button
              onClick={() => setCurrentTab('band-setup')}
              className={`px-4 py-2 font-medium border-b-2 transition ${
                currentTab === 'band-setup'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-700 hover:text-gray-900'
              }`}
            >
              Band Setup
            </button>
            <button
              onClick={() => setCurrentTab('engineer-view')}
              className={`px-4 py-2 font-medium border-b-2 transition ${
                currentTab === 'engineer-view'
                  ? 'border-red-600 text-red-600'
                  : 'border-transparent text-gray-700 hover:text-gray-900'
              }`}
            >
              Engineer View
            </button>
            <button
              onClick={() => setCurrentTab('show-spec')}
              className={`px-4 py-2 font-medium border-b-2 transition ${
                currentTab === 'show-spec'
                  ? 'border-green-600 text-green-600'
                  : 'border-transparent text-gray-700 hover:text-gray-900'
              }`}
            >
              Show Spec
            </button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 min-h-screen">
        <div className="flex gap-6">
          {/* Sidebar: Category filter */}
          <div className="w-1/5 flex-shrink-0">
            <div className="bg-white rounded-lg border border-gray-200 p-4 sticky top-24">
              <h3 className="font-semibold text-gray-900 mb-4">Categories</h3>
              <div className="space-y-2">
                <button
                  onClick={() => setSelectedCategory('all')}
                  className={`w-full text-left px-3 py-2 rounded text-sm transition ${
                    selectedCategory === 'all'
                      ? 'bg-blue-100 text-blue-900 font-medium'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  All ({allCount})
                </button>
                {(Object.keys(categoryLabels) as Category[]).map(cat => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`w-full text-left px-3 py-2 rounded text-sm transition flex items-center gap-2 ${
                      selectedCategory === cat
                        ? 'bg-blue-100 text-blue-900 font-medium'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    {categoryIcons[cat]}
                    {categoryLabels[cat]} ({categoryCount(cat)})
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Main panel: Item list / Show Spec */}
          <div className={currentTab === 'show-spec' ? 'flex-1 max-h-[calc(100vh-120px)] overflow-y-auto space-y-6 pr-4' : 'flex-1 space-y-4'}>
            {currentTab === 'band-setup' && (
              <>
                <button
                  onClick={() => setShowAddForm(!showAddForm)}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
                >
                  <Plus className="w-4 h-4" />
                  Add Item to Brief
                </button>

                {showAddForm && (
                  <div className="bg-white border border-gray-300 rounded-lg p-4 space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                      <select
                        value={newItem.category}
                        onChange={(e) => setNewItem({ ...newItem, category: e.target.value as Category })}
                        className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                      >
                        {(Object.keys(categoryLabels) as Category[]).map(cat => (
                          <option key={cat} value={cat}>{categoryLabels[cat]}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Topic</label>
                      <input
                        type="text"
                        placeholder="e.g., 'Kick drum mic'"
                        value={newItem.topic}
                        onChange={(e) => setNewItem({ ...newItem, topic: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Option type</label>
                      <select
                        value={newItem.optionType}
                        onChange={(e) => setNewItem({ ...newItem, optionType: e.target.value as OptionType })}
                        className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                      >
                        <option value="specified">Specified (we decided)</option>
                        <option value="engineer_choice">Engineer's choice (your call)</option>
                        <option value="negotiable">Negotiable (preference + open)</option>
                        <option value="question">Question (asking you)</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Details</label>
                      <textarea
                        placeholder="What's our preference or question?"
                        value={newItem.details}
                        onChange={(e) => setNewItem({ ...newItem, details: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                        rows={2}
                      />
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={handleAddItem}
                        className="flex-1 px-3 py-2 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 transition"
                      >
                        Add to brief
                      </button>
                      <button
                        onClick={() => setShowAddForm(false)}
                        className="flex-1 px-3 py-2 bg-gray-200 text-gray-700 rounded text-sm hover:bg-gray-300 transition"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}

            {/* Item cards */}
            {filteredItems.map(item => (
              <div
                key={item.id}
                className={`border-l-4 rounded-lg p-4 transition ${statusColors[item.status]}`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      {categoryIcons[item.category]}
                      <span className="text-sm font-medium text-gray-700">{categoryLabels[item.category]}</span>
                      <span className="text-gray-900 font-semibold">{item.topic}</span>
                    </div>
                    <p className="text-gray-700 text-sm mb-3">{item.bandInput}</p>

                    {/* Engineer response (for band view) */}
                    {currentTab === 'band-setup' && item.engineerResponse && (
                      <div className="bg-white bg-opacity-60 rounded p-2 text-sm text-gray-700 mb-2">
                        <span className="font-medium text-red-600">Engineer:</span> {item.engineerResponse}
                      </div>
                    )}

                    {/* Engineer response widget (for engineer view) */}
                    {currentTab === 'engineer-view' && (
                      <div className="mt-3 space-y-2">
                        {item.bandOptionType === 'specified' && (
                          <div className="flex gap-2">
                            <button
                              onClick={() => updateItemStatus(item.id, 'agreed')}
                              className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700 transition"
                            >
                              ✓ Confirmed
                            </button>
                            <button
                              onClick={() => toggleItemExpand(item.id, 'engineer-view')}
                              className="px-3 py-1 bg-gray-300 text-gray-700 text-sm rounded hover:bg-gray-400 transition"
                            >
                              Add note
                            </button>
                          </div>
                        )}

                        {item.bandOptionType === 'engineer_choice' && (
                          <div>
                            <input
                              type="text"
                              placeholder="Type your setup..."
                              className="w-full px-2 py-1 border border-gray-400 rounded text-sm mb-2"
                            />
                            <button
                              onClick={() => {
                                updateEngineerResponse(item.id, 'Setup planned')
                                updateItemStatus(item.id, 'engineer_responded')
                              }}
                              className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition"
                            >
                              Confirm response
                            </button>
                          </div>
                        )}

                        {item.bandOptionType === 'negotiable' && (
                          <div className="flex gap-2 flex-wrap">
                            <button
                              onClick={() => updateItemStatus(item.id, 'agreed')}
                              className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700 transition"
                            >
                              ✓ As requested
                            </button>
                            <input
                              type="text"
                              placeholder="Propose alternative..."
                              className="flex-1 min-w-[120px] px-2 py-1 border border-gray-400 rounded text-sm"
                              onChange={(e) => {
                                if (e.target.value) {
                                  updateEngineerResponse(item.id, e.target.value)
                                  updateItemStatus(item.id, 'awaiting_band')
                                }
                              }}
                            />
                          </div>
                        )}

                        {item.bandOptionType === 'question' && (
                          <div>
                            <input
                              type="text"
                              placeholder="Your answer..."
                              className="w-full px-2 py-1 border border-gray-400 rounded text-sm mb-2"
                            />
                            <button
                              onClick={() => updateItemStatus(item.id, 'engineer_responded')}
                              className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition"
                            >
                              Send answer
                            </button>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Band decision buttons (for awaiting_band status in band view) */}
                    {currentTab === 'band-setup' && item.status === 'awaiting_band' && (
                      <div className="flex gap-2 mt-3">
                        <button
                          onClick={() => updateItemStatus(item.id, 'agreed')}
                          className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700 transition"
                        >
                          ✓ Accept
                        </button>
                        <button
                          onClick={() => updateItemStatus(item.id, 'queried')}
                          className="px-3 py-1 bg-gray-400 text-white text-sm rounded hover:bg-gray-500 transition"
                        >
                          Need to discuss
                        </button>
                      </div>
                    )}
                  </div>

                  <div className={`px-2 py-1 rounded text-xs font-medium whitespace-nowrap ${statusBadges[item.status].bg}`}>
                    {statusBadges[item.status].text}
                  </div>
                </div>
              </div>
            ))}

            {filteredItems.length === 0 && (
              <div className="text-center py-8 text-gray-700">
                <p>No items in this category.</p>
              </div>
            )}

            {/* Show Specification */}
            {currentTab === 'show-spec' && (
              <div className="space-y-6">
                {/* Header */}
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-1">The Rockers @ Paradiso</h2>
                  <p className="text-gray-800">15 March 2026 • Technical Show Specification</p>
                  <div className="flex gap-8 mt-4 text-sm text-gray-700">
                    <span><strong>Soundcheck:</strong> 15:00</span>
                    <span><strong>Stage Time:</strong> 20:00 – 21:30</span>
                    <span><strong>Band arrival:</strong> 14:00</span>
                  </div>
                </div>

                {/* Microphones & Stands */}
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">🎤 Microphones & Stands</h3>
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-300">
                        <th className="text-left py-2 px-2 text-gray-700 font-semibold w-2/5">Item</th>
                        <th className="text-left py-2 px-2 text-gray-700 font-semibold">Mic / Stand</th>
                        <th className="text-right py-2 px-2 text-gray-700 font-semibold w-1/4">Source</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      <tr>
                        <td className="py-2 px-2 text-gray-700">Kick drum</td>
                        <td className="py-2 px-2 font-medium">Beta52A</td>
                        <td className="py-2 px-2 text-right text-xs bg-green-50 text-green-700 rounded">Confirmed</td>
                      </tr>
                      <tr>
                        <td className="py-2 px-2 text-gray-700">Snare top</td>
                        <td className="py-2 px-2 font-medium">SM57</td>
                        <td className="py-2 px-2 text-right text-xs bg-blue-50 text-blue-700 rounded">Band's own</td>
                      </tr>
                      <tr>
                        <td className="py-2 px-2 text-gray-700">OH Left</td>
                        <td className="py-2 px-2 font-medium">SM57</td>
                        <td className="py-2 px-2 text-right text-xs bg-yellow-50 text-yellow-700 rounded">Engineer</td>
                      </tr>
                      <tr>
                        <td className="py-2 px-2 text-gray-700">OH Right</td>
                        <td className="py-2 px-2 font-medium">SM57</td>
                        <td className="py-2 px-2 text-right text-xs bg-yellow-50 text-yellow-700 rounded">Engineer</td>
                      </tr>
                      <tr>
                        <td className="py-2 px-2 text-gray-700">Bass DI</td>
                        <td className="py-2 px-2 font-medium">Passive DI box</td>
                        <td className="py-2 px-2 text-right text-xs bg-yellow-50 text-yellow-700 rounded">Engineer</td>
                      </tr>
                      <tr>
                        <td className="py-2 px-2 text-gray-700">Vocals (lead)</td>
                        <td className="py-2 px-2 font-medium">SM58 + stand</td>
                        <td className="py-2 px-2 text-right text-xs bg-blue-50 text-blue-700 rounded">Band's own</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* Backline */}
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">🎸 Backline & Gear</h3>
                  <div className="space-y-2 text-sm">
                    <div className="text-gray-700"><strong>Drums:</strong> Band's full Zildjian kit (bringing cymbals, hi-hat stand provided by engineer)</div>
                    <div className="text-gray-700"><strong>Snare:</strong> Band's Ludwig snare (stand provided by engineer)</div>
                    <div className="text-gray-700"><strong>Bass amp:</strong> Ampeg SVT (venue provides)</div>
                    <div className="text-gray-700"><strong>Guitar amp:</strong> Band's Mesa Boogie Mark V + speaker cab (engineer arranges)</div>
                    <div className="text-gray-700"><strong>Keyboards:</strong> None this show</div>
                  </div>
                </div>

                {/* Power & Technical */}
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">⚡ Power & Technical</h3>
                  <div className="space-y-3 text-sm">
                    <div className="text-gray-700"><strong>Stage power drops:</strong> 6 outlets available (stage left, center, stage right)</div>
                    <div className="text-gray-700"><strong>Guitar amp power:</strong> Dedicated 20A circuit arranged</div>
                    <div className="text-gray-700"><strong>Monitor system:</strong> 4 wedge monitors (IEM available if needed)</div>
                    <div className="text-gray-700"><strong>Mixer:</strong> 32-channel Allen & Heath SQ-5</div>
                    <div className="text-gray-700"><strong>DI boxes:</strong> 4 available</div>
                  </div>
                </div>

                {/* Stage Setup */}
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">🎭 Stage Setup & Layout</h3>
                  <div className="space-y-3 text-sm">
                    <div className="text-gray-700"><strong>Stage dimensions:</strong> 8m wide × 6m deep (confirmed with venue)</div>
                    <div className="text-gray-700"><strong>Band positions:</strong>
                      <ul className="ml-4 mt-2 space-y-1 text-xs">
                        <li>• Drummer: Stage center-upstage</li>
                        <li>• Bassist (Rob): Stage left</li>
                        <li>• Guitarist (Tom): Stage right</li>
                        <li>• Vocalist (Lars): Center-downstage</li>
                      </ul>
                    </div>
                    <div className="text-gray-700"><strong>Monitors:</strong> Wedge left (guitar) • Center (vocals, bass click) • Right (drummer) • Side-fill (audience-right)</div>
                  </div>
                </div>

                {/* Timeline */}
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">⏰ Show Timeline</h3>
                  <table className="w-full text-sm">
                    <tbody className="divide-y divide-gray-200">
                      <tr>
                        <td className="py-2 px-2 font-medium text-gray-900 w-20">14:00</td>
                        <td className="py-2 px-2 text-gray-700">Band arrival / Load-in</td>
                      </tr>
                      <tr>
                        <td className="py-2 px-2 font-medium text-gray-900 w-20">14:30</td>
                        <td className="py-2 px-2 text-gray-700">Equipment check</td>
                      </tr>
                      <tr>
                        <td className="py-2 px-2 font-medium text-gray-900 w-20">15:00</td>
                        <td className="py-2 px-2 text-gray-700">Soundcheck (45 min)</td>
                      </tr>
                      <tr>
                        <td className="py-2 px-2 font-medium text-gray-900 w-20">15:45</td>
                        <td className="py-2 px-2 text-gray-700">Band break, final prep</td>
                      </tr>
                      <tr>
                        <td className="py-2 px-2 font-medium text-gray-900 w-20">19:45</td>
                        <td className="py-2 px-2 text-gray-700">Line check / 15 min call</td>
                      </tr>
                      <tr>
                        <td className="py-2 px-2 font-medium text-gray-900 w-20">20:00</td>
                        <td className="py-2 px-2 font-medium text-green-700">SHOW START</td>
                      </tr>
                      <tr>
                        <td className="py-2 px-2 font-medium text-gray-900 w-20">21:30</td>
                        <td className="py-2 px-2 text-gray-700">Load-out</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* Contact & Notes */}
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">📞 Key Contacts</h3>
                  <div className="space-y-2 text-sm">
                    <div className="text-gray-700"><strong>Band Lead (Lars):</strong> +31 6 12345678 / lars@therockers.nl</div>
                    <div className="text-gray-700"><strong>Engineer (Michiel):</strong> +31 6 87654321 / michiel@soundproduction.nl</div>
                    <div className="text-gray-700"><strong>Venue Contact:</strong> +31 20 XXXXXXX / paradiso@venue.nl</div>
                  </div>
                </div>

                {/* Notes */}
                <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                  <h3 className="text-lg font-bold text-green-900 mb-3">✓ All decisions confirmed & agreed</h3>
                  <p className="text-sm text-green-700">This specification is ready for show day. Both band and engineer have confirmed all technical details. Print or share this document with the venue for final reference.</p>
                </div>
              </div>
            )}
          </div>

          {/* Right panel: Role-specific summary */}
          <div className={currentTab === 'show-spec' ? 'w-1/5 flex-shrink-0' : 'w-1/5 flex-shrink-0'}>
            <div className="bg-white border border-gray-200 rounded-lg p-4 sticky top-24 max-h-[calc(100vh-120px)] overflow-y-auto">
              <h3 className="font-bold text-gray-900 mb-4">
                {currentTab === 'band-setup' ? 'MY TO-DO' : 'MY TO-DO'}
              </h3>

              {currentTab === 'band-setup' && (
                <div className="space-y-4 text-sm">
                  {/* Band: Bring list */}
                  <div>
                    <h4 className="font-semibold text-gray-700 mb-2">Bring list:</h4>
                    <ul className="space-y-1">
                      {bandBringItems.map(item => (
                        <li key={item.id} className="flex gap-2 text-gray-700">
                          <span className="flex-shrink-0">[ ]</span>
                          <span>{item.bandInput}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Band: Needs my decision */}
                  {bandSummary.toSubmit.length > 0 && (
                    <div>
                      <h4 className="font-semibold text-gray-700 mb-2">Needs my decision:</h4>
                      <ul className="space-y-1">
                        {bandSummary.toSubmit.map(item => (
                          <li key={item.id} className="flex gap-2 text-gray-700">
                            <span className="flex-shrink-0">[ ]</span>
                            <span>{item.topic}: {item.engineerResponse}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Agreed items */}
                  {bandSummary.agreed.length > 0 && (
                    <div>
                      <h4 className="font-semibold text-green-700 mb-2">Agreed:</h4>
                      <ul className="space-y-1">
                        {bandSummary.agreed.map(item => (
                          <li key={item.id} className="flex gap-2 text-green-600">
                            <span>✓</span>
                            <span>{item.topic}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Share section */}
                  <div className="border-t border-gray-200 pt-4 mt-4">
                    <h4 className="font-semibold text-gray-700 mb-2">Share</h4>
                    <div className="text-xs text-gray-700 space-y-2">
                      <p><span className="font-medium">Show:</span> Paradiso</p>
                      <p><span className="font-medium">Date:</span> 15 March</p>
                      <button className="w-full mt-2 px-3 py-1 bg-blue-600 text-white rounded text-xs hover:bg-blue-700">
                        Share with engineer
                      </button>
                      <p className="text-gray-700 text-xs pt-2">Engineer viewed: {engineerViewed}</p>
                    </div>
                  </div>
                </div>
              )}

              {currentTab === 'engineer-view' && (
                <div className="space-y-4 text-sm">
                  {/* Gear inventory */}
                  <div className="bg-gray-50 rounded p-2 mb-4">
                    <h4 className="font-semibold text-gray-700 mb-2 text-xs">Your gear</h4>
                    <ul className="text-xs text-gray-700 space-y-1">
                      <li>SM57 ×4, SM58 ×3</li>
                      <li>D6 ×1, MD421 ×2</li>
                      <li>Beta91A ×1</li>
                      <li>DI boxes: 4</li>
                      <li>Wedges: 4, Side-fill: 1</li>
                    </ul>
                  </div>

                  {/* Engineer: I need to provide */}
                  <div>
                    <h4 className="font-semibold text-gray-700 mb-2">I need to provide:</h4>
                    <ul className="space-y-1">
                      {items.filter(i => i.status !== 'pending' && i.status !== 'awaiting_band').map(item => (
                        <li key={item.id} className="flex gap-2 text-gray-700">
                          {item.status === 'agreed' ? '✓' : '[ ]'}
                          <span className="text-xs">{item.topic}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Awaiting band */}
                  {engineerSummary.awaitingBand.length > 0 && (
                    <div>
                      <h4 className="font-semibold text-yellow-700 mb-2">Awaiting band:</h4>
                      <ul className="space-y-1">
                        {engineerSummary.awaitingBand.map(item => (
                          <li key={item.id} className="flex gap-2 text-yellow-600 text-xs">
                            <span>⏳</span>
                            <span>{item.topic}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Agreed items */}
                  {engineerSummary.agreed.length > 0 && (
                    <div>
                      <h4 className="font-semibold text-green-700 mb-2">Agreed:</h4>
                      <ul className="space-y-1">
                        {engineerSummary.agreed.map(item => (
                          <li key={item.id} className="flex gap-2 text-green-600 text-xs">
                            <span>✓</span>
                            <span>{item.topic}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <button className="w-full mt-4 px-3 py-2 bg-red-600 text-white rounded text-sm hover:bg-red-700 transition font-medium">
                    Send responses to band
                  </button>
                </div>
              )}

              {currentTab === 'show-spec' && (
                <div className="space-y-4 text-sm">
                  <div>
                    <h4 className="font-semibold text-gray-700 mb-2">Quick Actions</h4>
                    <div className="space-y-2">
                      <button className="w-full px-3 py-2 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 transition">
                        🖨️ Print PDF
                      </button>
                      <button className="w-full px-3 py-2 bg-green-600 text-white text-xs rounded hover:bg-green-700 transition">
                        📧 Email Brief
                      </button>
                      <button className="w-full px-3 py-2 bg-gray-600 text-white text-xs rounded hover:bg-gray-700 transition">
                        📋 Copy Link
                      </button>
                    </div>
                  </div>
                  <div className="border-t border-gray-200 pt-3">
                    <p className="text-xs text-green-700 font-semibold">✓ All confirmed</p>
                    <p className="text-xs text-gray-600 mt-1">All technical decisions have been finalized and agreed upon by both band and engineer.</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
