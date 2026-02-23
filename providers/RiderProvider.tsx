'use client'

import { createContext, useContext } from 'react'
import { useRiderState } from '@/hooks/useRiderState'

type RiderContextType = ReturnType<typeof useRiderState>

const RiderContext = createContext<RiderContextType | null>(null)

export function RiderProvider({ children }: { children: React.ReactNode }) {
  const riderState = useRiderState()

  return (
    <RiderContext.Provider value={riderState}>
      {children}
    </RiderContext.Provider>
  )
}

export function useRider() {
  const ctx = useContext(RiderContext)
  if (!ctx) throw new Error('useRider must be used within RiderProvider')
  return ctx
}
