import { create } from 'zustand'

export interface Reservation {
  id: string
  userId: string
  eventId: string
  eventName: string
  eventDate: string
  eventTime: string
  location: string
  attendees: number
  status: 'confirmed' | 'cancelled' | 'checked-in' | 'no-show'
  qrCode?: string
  createdAt: string
}

interface ReservationState {
  reservations: Reservation[]
  selectedReservation: Reservation | null
  isLoading: boolean
  error: string | null

  // Actions
  setReservations: (reservations: Reservation[]) => void
  addReservation: (reservation: Reservation) => void
  updateReservation: (id: string, updates: Partial<Reservation>) => void
  removeReservation: (id: string) => void
  setSelectedReservation: (reservation: Reservation | null) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  clearReservations: () => void
}

export const useReservationStore = create<ReservationState>((set) => ({
  reservations: [],
  selectedReservation: null,
  isLoading: false,
  error: null,

  setReservations: (reservations) => set({ reservations }),

  addReservation: (reservation) =>
    set((state) => ({
      reservations: [reservation, ...state.reservations],
    })),

  updateReservation: (id, updates) =>
    set((state) => ({
      reservations: state.reservations.map((r) =>
        r.id === id ? { ...r, ...updates } : r
      ),
    })),

  removeReservation: (id) =>
    set((state) => ({
      reservations: state.reservations.filter((r) => r.id !== id),
    })),

  setSelectedReservation: (reservation) => set({ selectedReservation: reservation }),

  setLoading: (loading) => set({ isLoading: loading }),

  setError: (error) => set({ error }),

  clearReservations: () => set({ reservations: [], selectedReservation: null, error: null }),
}))
