/**
 * UC-3 MOCKUP: Band Coordinator Rider Management
 *
 * This mockup demonstrates the complete UC-3 scenario:
 * Lars (band coordinator) creates a rider, invites band members to contribute,
 * shares with engineer, receives feedback, and iterates.
 *
 * Key features shown:
 * - Real-time band member contribution status
 * - Interactive stage plot
 * - Comment system with engineer feedback (colored by role)
 * - Share & notification flow
 * - Collaborative editing indicators
 */

'use client'

import React, { useState } from 'react'
import {
  Users,
  MessageCircle,
  Share2,
  CheckCircle,
  Clock,
  AlertCircle,
  Music,
  MapPin,
  Mail,
  Phone,
  Plus,
  X,
  Reply,
  Check
} from 'lucide-react'

// MOCKUP DATA - Simulating UC-3 state
const mockRider = {
  id: 'rider_123',
  name: 'The Rockers @ The Blue Note',
  bandName: 'The Rockers',
  eventDate: '2026-03-15',
  venue: 'The Blue Note',

  // Band members with contribution status
  members: [
    {
      id: 'lars',
      name: 'Lars',
      role: 'Vocals',
      status: 'completed', // completed, pending, in-progress
      contributed: true,
      lastUpdated: '2026-02-25T10:30:00Z',
    },
    {
      id: 'piet',
      name: 'Piet',
      role: 'Drums',
      status: 'completed',
      contributed: true,
      lastUpdated: '2026-02-25T09:15:00Z',
    },
    {
      id: 'rob',
      name: 'Rob',
      role: 'Bass',
      status: 'in-progress', // Currently editing
      contributed: true,
      lastUpdated: '2026-02-25T11:45:00Z',
    },
    {
      id: 'tom',
      name: 'Tom',
      role: 'Guitar',
      status: 'pending', // Hasn't started yet
      contributed: false,
      invitationSent: true,
    },
  ],

  // Comments from engineer
  comments: [
    {
      id: 'comment_1',
      author: 'Michiel',
      role: 'engineer',
      avatar: '🔴',
      text: 'Monitor directions are unclear — which wedges face the band vs. the audience?',
      section: 'stage_plot',
      createdAt: '2026-02-25T14:30:00Z',
      resolved: false,
      replies: [
        {
          id: 'reply_1',
          author: 'Lars',
          role: 'band_lead',
          avatar: '🟢',
          text: 'Updated the stage plot — all wedges now face the band. Check the plot above.',
          createdAt: '2026-02-25T15:00:00Z',
        },
      ],
    },
    {
      id: 'comment_2',
      author: 'Michiel',
      role: 'engineer',
      avatar: '🔴',
      text: 'Do you have a drummer? Input list shows drums but no details.',
      section: 'input_list',
      createdAt: '2026-02-25T14:50:00Z',
      resolved: false,
      replies: [],
    },
  ],

  // Share log
  shares: [
    {
      id: 'share_1',
      email: 'michiel@engineer.com',
      name: 'Michiel (Engineer)',
      sharedAt: '2026-02-25T14:00:00Z',
      viewedAt: '2026-02-25T14:15:00Z',
      status: 'viewed',
    },
  ],
}

// Color schemes for roles
const roleColors = {
  engineer: { bg: 'bg-red-50', border: 'border-red-200', text: 'text-red-700', badge: 'bg-red-100' },
  band_lead: { bg: 'bg-green-50', border: 'border-green-200', text: 'text-green-700', badge: 'bg-green-100' },
  band_member: { bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-700', badge: 'bg-blue-100' },
  venue: { bg: 'bg-yellow-50', border: 'border-yellow-200', text: 'text-yellow-700', badge: 'bg-yellow-100' },
}

const getMemberStatusColor = (status: string) => {
  switch (status) {
    case 'completed':
      return 'text-green-600'
    case 'in-progress':
      return 'text-blue-600'
    case 'pending':
      return 'text-gray-400'
    default:
      return 'text-gray-400'
  }
}

const getMemberStatusLabel = (status: string) => {
  switch (status) {
    case 'completed':
      return '✓ Done'
    case 'in-progress':
      return '✎ Editing'
    case 'pending':
      return '○ Waiting'
    default:
      return 'Pending'
  }
}

export default function UC3BandCoordinatorRider() {
  const [activeTab, setActiveTab] = useState('overview') // overview, stage, input-list, comments, share
  const [expandedComment, setExpandedComment] = useState<string | null>('comment_1')
  const [showShareModal, setShowShareModal] = useState(false)
  const [replyText, setReplyText] = useState('')

  return (
    <div className="bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">{mockRider.bandName}</h1>
            <p className="text-sm text-slate-600">{mockRider.eventDate} • {mockRider.venue}</p>
          </div>
          <button
            onClick={() => setShowShareModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            <Share2 size={18} />
            Share with Engineer
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="border-t border-slate-200">
          <div className="max-w-7xl mx-auto px-6 flex gap-8">
            {[
              { id: 'overview', label: 'Overview', icon: Users },
              { id: 'stage', label: 'Stage Plot', icon: MapPin },
              { id: 'input-list', label: 'Input List', icon: Music },
              { id: 'comments', label: 'Comments', icon: MessageCircle },
            ].map((tab) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-3 border-b-2 transition ${
                    activeTab === tab.id
                      ? 'border-blue-600 text-blue-600 font-medium'
                      : 'border-transparent text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Icon size={18} />
                  {tab.label}
                  {tab.id === 'comments' && mockRider.comments.length > 0 && (
                    <span className="ml-1 px-2 py-0.5 bg-red-100 text-red-700 text-xs rounded-full font-medium">
                      {mockRider.comments.length}
                    </span>
                  )}
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* OVERVIEW TAB - Band Member Collaboration */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-3 gap-6">
            {/* Band Members - Left Column */}
            <div className="col-span-2">
              <div className="bg-white rounded-lg border border-slate-200 p-6">
                <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <Users size={20} />
                  Band Members
                </h2>

                <div className="space-y-3">
                  {mockRider.members.map((member) => (
                    <div
                      key={member.id}
                      className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-200 hover:border-slate-300 transition"
                    >
                      <div className="flex items-center gap-4 flex-1">
                        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold">
                          {member.name.charAt(0)}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-slate-900">{member.name}</h3>
                          <p className="text-sm text-slate-600">{member.role}</p>
                        </div>
                      </div>

                      {/* Status Indicator */}
                      <div className="flex items-center gap-3">
                        {member.status === 'completed' && (
                          <div className="flex items-center gap-1">
                            <CheckCircle className="text-green-600" size={20} />
                            <span className={`text-sm font-medium ${getMemberStatusColor(member.status)}`}>
                              {getMemberStatusLabel(member.status)}
                            </span>
                          </div>
                        )}
                        {member.status === 'in-progress' && (
                          <div className="flex items-center gap-1">
                            <Clock className="text-blue-600 animate-pulse" size={20} />
                            <span className={`text-sm font-medium ${getMemberStatusColor(member.status)}`}>
                              {getMemberStatusLabel(member.status)}
                            </span>
                          </div>
                        )}
                        {member.status === 'pending' && (
                          <div className="flex items-center gap-1">
                            <AlertCircle className="text-gray-400" size={20} />
                            <span className={`text-sm font-medium ${getMemberStatusColor(member.status)}`}>
                              {getMemberStatusLabel(member.status)}
                            </span>
                          </div>
                        )}

                        {/* Last Updated */}
                        {member.lastUpdated && (
                          <span className="text-xs text-slate-500">
                            {new Date(member.lastUpdated).toLocaleString()}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Add Member Button */}
                <button className="mt-4 w-full py-3 border-2 border-dashed border-slate-300 rounded-lg text-slate-600 hover:border-slate-400 hover:text-slate-700 transition flex items-center justify-center gap-2">
                  <Plus size={18} />
                  Invite Band Member
                </button>

                {/* Real-time Status */}
                <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-sm text-blue-700">
                    <Clock size={16} className="inline mr-2" />
                    <strong>Rob</strong> is currently editing his bass setup info
                  </p>
                </div>
              </div>
            </div>

            {/* Quick Stats - Right Column */}
            <div className="space-y-4">
              <div className="bg-white rounded-lg border border-slate-200 p-4">
                <div className="text-3xl font-bold text-green-600">3/4</div>
                <p className="text-sm text-slate-600">Members completed</p>
              </div>

              <div className="bg-white rounded-lg border border-slate-200 p-4">
                <div className="text-3xl font-bold text-red-600">2</div>
                <p className="text-sm text-slate-600">Engineer comments</p>
                <button
                  onClick={() => setActiveTab('comments')}
                  className="mt-3 w-full py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded transition"
                >
                  View Comments →
                </button>
              </div>

              <div className="bg-white rounded-lg border border-slate-200 p-4">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="text-green-600" size={18} />
                  <span className="text-sm font-medium text-slate-900">Shared</span>
                </div>
                <p className="text-xs text-slate-600">
                  Shared with Michiel (Engineer) at 2:00 PM
                </p>
                <p className="text-xs text-green-600 mt-1">✓ Viewed at 2:15 PM</p>
              </div>
            </div>
          </div>
        )}

        {/* STAGE PLOT TAB */}
        {activeTab === 'stage' && (
          <div className="bg-white rounded-lg border border-slate-200 p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-slate-900">Stage Plot</h2>
              <button className="px-4 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded transition">
                Edit Stage Plot
              </button>
            </div>

            {/* Mock Stage Plot */}
            <div className="bg-slate-100 rounded-lg p-8 aspect-video flex items-center justify-center border-2 border-dashed border-slate-300">
              <div className="w-full h-full relative bg-white border-2 border-slate-400 rounded-sm">
                {/* Simple top-down stage representation */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="grid grid-cols-2 gap-4 mb-8">
                      {/* Drums */}
                      <div className="text-center">
                        <div className="w-8 h-8 bg-blue-500 rounded flex items-center justify-center text-white text-xs font-bold">
                          🥁
                        </div>
                        <p className="text-xs mt-1 text-slate-600">Piet (Drums)</p>
                      </div>
                      {/* Bass */}
                      <div className="text-center">
                        <div className="w-8 h-8 bg-orange-500 rounded flex items-center justify-center text-white text-xs font-bold">
                          🎸
                        </div>
                        <p className="text-xs mt-1 text-slate-600">Rob (Bass)</p>
                      </div>
                    </div>
                    {/* Vocals & Guitars */}
                    <div className="grid grid-cols-3 gap-4">
                      <div className="text-center">
                        <div className="w-8 h-8 bg-red-500 rounded flex items-center justify-center text-white text-xs font-bold">
                          🎤
                        </div>
                        <p className="text-xs mt-1 text-slate-600">Lars (Vocals)</p>
                      </div>
                      <div className="text-center">
                        <div className="w-8 h-8 bg-purple-500 rounded flex items-center justify-center text-white text-xs font-bold">
                          🎸
                        </div>
                        <p className="text-xs mt-1 text-slate-600">Tom (Guitar)</p>
                      </div>
                    </div>

                    {/* Comment Indicator */}
                    <div className="mt-8 inline-block bg-red-100 border border-red-300 rounded px-3 py-2 text-xs font-medium text-red-700">
                      💬 Engineer commented on monitor directions
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Engineer Comment Preview */}
            <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-700">
                <strong>🔴 Michiel (Engineer):</strong> Monitor directions are unclear — which wedges face the band vs. the audience?
              </p>
              <p className="text-xs text-red-600 mt-2">Unresolved • 2 hours ago</p>
            </div>
          </div>
        )}

        {/* INPUT LIST TAB */}
        {activeTab === 'input-list' && (
          <div className="bg-white rounded-lg border border-slate-200 p-8">
            <h2 className="text-xl font-bold text-slate-900 mb-6">Input List</h2>

            {/* Input Table */}
            <div className="overflow-x-auto mb-6">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-slate-100 border-b border-slate-200">
                    <th className="px-4 py-3 text-left font-semibold text-slate-900">Instrument</th>
                    <th className="px-4 py-3 text-left font-semibold text-slate-900">Mic/DI</th>
                    <th className="px-4 py-3 text-left font-semibold text-slate-900">Notes</th>
                    <th className="px-4 py-3 text-left font-semibold text-slate-900">Status</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-slate-200 hover:bg-slate-50">
                    <td className="px-4 py-3">Kick Drum</td>
                    <td className="px-4 py-3">D112</td>
                    <td className="px-4 py-3">(standard)</td>
                    <td className="px-4 py-3">
                      <span className="text-xs font-medium text-green-600">✓ Piet added</span>
                    </td>
                  </tr>
                  <tr className="border-b border-slate-200 hover:bg-slate-50">
                    <td className="px-4 py-3">Snare</td>
                    <td className="px-4 py-3">SM57</td>
                    <td className="px-4 py-3">on top</td>
                    <td className="px-4 py-3">
                      <span className="text-xs font-medium text-green-600">✓ Piet added</span>
                    </td>
                  </tr>
                  <tr className="border-b border-slate-200 hover:bg-slate-50">
                    <td className="px-4 py-3">Bass</td>
                    <td className="px-4 py-3">DI + SM57</td>
                    <td className="px-4 py-3">2-track setup</td>
                    <td className="px-4 py-3">
                      <span className="text-xs font-medium text-blue-600">✎ Rob editing...</span>
                    </td>
                  </tr>
                  <tr className="border-b border-slate-200 hover:bg-slate-50">
                    <td className="px-4 py-3">Vocal</td>
                    <td className="px-4 py-3">SM58</td>
                    <td className="px-4 py-3">high stand</td>
                    <td className="px-4 py-3">
                      <span className="text-xs font-medium text-green-600">✓ Lars added</span>
                    </td>
                  </tr>
                  <tr className="border-b border-slate-200 hover:bg-slate-50">
                    <td className="px-4 py-3">Guitar</td>
                    <td className="px-4 py-3">—</td>
                    <td className="px-4 py-3">Waiting for Tom</td>
                    <td className="px-4 py-3">
                      <span className="text-xs font-medium text-gray-400">○ Pending</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Engineer Comment */}
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-700">
                <strong>🔴 Michiel (Engineer):</strong> Do you have a drummer? Input list shows drums but no details.
              </p>
              <p className="text-xs text-red-600 mt-2">Unresolved • 1 hour ago</p>
              <button className="mt-3 text-xs font-medium text-red-600 hover:text-red-700">
                Reply →
              </button>
            </div>
          </div>
        )}

        {/* COMMENTS TAB */}
        {activeTab === 'comments' && (
          <div className="grid grid-cols-3 gap-6">
            {/* Comments Thread - Main */}
            <div className="col-span-2 space-y-4">
              {mockRider.comments.map((comment) => (
                <div
                  key={comment.id}
                  className={`border rounded-lg p-6 cursor-pointer transition ${
                    expandedComment === comment.id
                      ? 'bg-white border-blue-300 shadow-md'
                      : 'bg-slate-50 border-slate-200 hover:border-slate-300'
                  }`}
                  onClick={() => setExpandedComment(expandedComment === comment.id ? null : comment.id)}
                >
                  {/* Comment Header */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3 flex-1">
                      <div className="text-2xl">{comment.avatar}</div>
                      <div>
                        <h3 className="font-semibold text-slate-900">
                          {comment.author} ({comment.role})
                        </h3>
                        <p className="text-xs text-slate-600">
                          {new Date(comment.createdAt).toLocaleString()} • {comment.section}
                        </p>
                      </div>
                    </div>
                    {comment.resolved ? (
                      <span className="text-xs font-medium text-green-600">✓ Resolved</span>
                    ) : (
                      <span className="text-xs font-medium text-red-600">Open</span>
                    )}
                  </div>

                  {/* Comment Text */}
                  <p className="text-slate-700 mb-4">{comment.text}</p>

                  {/* Expanded View */}
                  {expandedComment === comment.id && (
                    <div className="space-y-4 border-t border-slate-200 pt-4">
                      {/* Replies */}
                      {comment.replies.length > 0 && (
                        <div className="space-y-3 bg-slate-100 p-3 rounded">
                          {comment.replies.map((reply) => (
                            <div key={reply.id} className="pl-4 border-l-2 border-green-300">
                              <div className="text-sm font-medium text-slate-900">
                                🟢 {reply.author} (Band Lead)
                              </div>
                              <p className="text-sm text-slate-700 mt-1">{reply.text}</p>
                              <p className="text-xs text-slate-600 mt-1">
                                {new Date(reply.createdAt).toLocaleString()}
                              </p>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Reply Form */}
                      <div>
                        <textarea
                          placeholder="Type your reply..."
                          value={replyText}
                          onChange={(e) => setReplyText(e.target.value)}
                          className="w-full p-3 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                          rows={3}
                        />
                        <button className="mt-2 px-4 py-2 bg-green-600 text-white text-sm font-medium rounded hover:bg-green-700 transition flex items-center gap-2">
                          <Reply size={16} />
                          Reply
                        </button>
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2 pt-2 border-t border-slate-200">
                        <button className="text-xs font-medium text-slate-600 hover:text-slate-900">
                          Resolve
                        </button>
                        <button className="text-xs font-medium text-slate-600 hover:text-slate-900">
                          Pin
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Comments Sidebar */}
            <div className="bg-white rounded-lg border border-slate-200 p-4 h-fit">
              <h3 className="font-semibold text-slate-900 mb-4 flex items-center justify-between">
                <span>Comments Summary</span>
                <span className="bg-red-100 text-red-700 text-xs font-bold px-2 py-1 rounded">
                  {mockRider.comments.length}
                </span>
              </h3>

              <div className="space-y-3">
                {mockRider.comments.map((comment) => (
                  <button
                    key={comment.id}
                    onClick={() => setExpandedComment(comment.id)}
                    className={`w-full text-left p-3 rounded-lg border transition ${
                      expandedComment === comment.id
                        ? 'bg-blue-50 border-blue-300'
                        : 'bg-slate-50 border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <p className="text-xs font-medium text-slate-600 mb-1">{comment.section}</p>
                    <p className="text-sm text-slate-900 line-clamp-2">{comment.text}</p>
                    <p className="text-xs text-slate-500 mt-1">
                      {comment.replies.length} replies • {comment.resolved ? '✓ Resolved' : 'Open'}
                    </p>
                  </button>
                ))}
              </div>

              {/* Filter Options */}
              <div className="mt-4 space-y-2 border-t border-slate-200 pt-4">
                <button className="w-full text-left text-xs font-medium text-slate-600 hover:text-slate-900 px-2 py-1 rounded hover:bg-slate-50">
                  All Comments
                </button>
                <button className="w-full text-left text-xs font-medium text-slate-600 hover:text-slate-900 px-2 py-1 rounded hover:bg-slate-50">
                  Unresolved Only
                </button>
                <button className="w-full text-left text-xs font-medium text-slate-600 hover:text-slate-900 px-2 py-1 rounded hover:bg-slate-50">
                  Engineer Comments
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* SHARE MODAL */}
      {showShareModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-slate-900">Share with Sound Engineer</h2>
              <button
                onClick={() => setShowShareModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X size={24} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Engineer's Email
                </label>
                <input
                  type="email"
                  placeholder="michiel@engineer.com"
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Name (optional)
                </label>
                <input
                  type="text"
                  placeholder="Michiel"
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Share Log Preview */}
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
                <h3 className="text-sm font-semibold text-slate-900 mb-3">Share History</h3>
                <div className="space-y-2 text-sm">
                  {mockRider.shares.map((share) => (
                    <div key={share.id} className="flex items-start justify-between">
                      <div>
                        <p className="font-medium text-slate-900">{share.name}</p>
                        <p className="text-xs text-slate-600">{share.email}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-slate-600">
                          {new Date(share.sharedAt).toLocaleDateString()}
                        </p>
                        <p className="text-xs text-green-600 mt-1">
                          ✓ Viewed {new Date(share.viewedAt!).toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={() => setShowShareModal(false)}
                className="w-full py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition flex items-center justify-center gap-2"
              >
                <Share2 size={18} />
                Send Share Link
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
