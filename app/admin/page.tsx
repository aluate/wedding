'use client'

import { useState } from 'react'
import Link from 'next/link'
import KanbanBoard from '@/components/KanbanBoard'

// Mock data - in production this would come from an API
const mockRSVPs = [
  { id: 1, name: 'John & Jane Doe', status: 'yes', meal: 'beef', updated: '2025-12-01' },
  { id: 2, name: 'Bob Smith', status: 'yes', meal: 'chicken', updated: '2025-12-02' },
  { id: 3, name: 'Alice Johnson', status: 'no', meal: null, updated: '2025-12-01' },
]

export default function AdminPage() {
  const [selectedView, setSelectedView] = useState<'overview' | 'guests' | 'kanban'>('overview')

  const totalInvited = 50 // Mock
  const totalYes = mockRSVPs.filter(r => r.status === 'yes').length
  const totalNo = mockRSVPs.filter(r => r.status === 'no').length
  const totalPending = totalInvited - totalYes - totalNo

  return (
    <main className="min-h-screen py-12 px-4 bg-background">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <Link href="/" className="text-primary hover:underline">
            ← Back to Home
          </Link>
          <h1 className="font-heading text-5xl mt-4">Admin Dashboard</h1>
        </div>

        {/* Navigation Tabs */}
        <div className="flex gap-4 mb-8 border-b">
          <button
            onClick={() => setSelectedView('overview')}
            className={`pb-2 px-4 ${selectedView === 'overview' ? 'border-b-2 border-primary font-semibold' : ''}`}
          >
            Overview
          </button>
          <button
            onClick={() => setSelectedView('guests')}
            className={`pb-2 px-4 ${selectedView === 'guests' ? 'border-b-2 border-primary font-semibold' : ''}`}
          >
            Guests
          </button>
          <button
            onClick={() => setSelectedView('kanban')}
            className={`pb-2 px-4 ${selectedView === 'kanban' ? 'border-b-2 border-primary font-semibold' : ''}`}
          >
            Task Board
          </button>
        </div>

        {/* Overview View */}
        {selectedView === 'overview' && (
          <div className="space-y-6">
            <div className="grid md:grid-cols-4 gap-4">
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <p className="text-accent/70 mb-2">Total Invited</p>
                <p className="text-3xl font-bold">{totalInvited}</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <p className="text-accent/70 mb-2">Yes</p>
                <p className="text-3xl font-bold text-green-600">{totalYes}</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <p className="text-accent/70 mb-2">No</p>
                <p className="text-3xl font-bold text-red-600">{totalNo}</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <p className="text-accent/70 mb-2">Pending</p>
                <p className="text-3xl font-bold text-yellow-600">{totalPending}</p>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h2 className="font-heading text-2xl mb-4">Recent RSVPs</h2>
              <div className="space-y-2">
                {mockRSVPs.map((rsvp) => (
                  <div key={rsvp.id} className="flex justify-between items-center py-2 border-b">
                    <span>{rsvp.name}</span>
                    <span className={`px-3 py-1 rounded ${
                      rsvp.status === 'yes' ? 'bg-green-100 text-green-800' :
                      rsvp.status === 'no' ? 'bg-red-100 text-red-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {rsvp.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Guests View */}
        {selectedView === 'guests' && (
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="font-heading text-2xl mb-4">All Guests</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-2">Name</th>
                    <th className="text-left p-2">Status</th>
                    <th className="text-left p-2">Meal</th>
                    <th className="text-left p-2">Updated</th>
                  </tr>
                </thead>
                <tbody>
                  {mockRSVPs.map((rsvp) => (
                    <tr key={rsvp.id} className="border-b">
                      <td className="p-2">{rsvp.name}</td>
                      <td className="p-2">{rsvp.status}</td>
                      <td className="p-2">{rsvp.meal || '-'}</td>
                      <td className="p-2">{rsvp.updated}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Kanban View */}
        {selectedView === 'kanban' && (
          <div>
            <div className="mb-6">
              <h2 className="font-heading text-2xl mb-2">Wedding Task Board</h2>
              <p className="text-accent/70">
                Kanban board for managing wedding tasks (similar to CateredByMe swim lanes)
              </p>
              <p className="text-sm text-accent/70 mt-2">
                Drag and drop tasks between columns to update their status
              </p>
            </div>
            <KanbanBoard />
          </div>
        )}
      </div>
    </main>
  )
}

