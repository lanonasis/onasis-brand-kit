import '@testing-library/jest-dom/vitest'
import { vi } from 'vitest'

// Mock fetch to prevent accidental network calls during tests
global.fetch = vi.fn()

// Mock localStorage for Supabase client
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
}
global.localStorage = localStorageMock

// Mock window.location for navigation tests
Object.defineProperty(window, 'location', {
  value: {
    href: 'http://localhost:3000',
    origin: 'http://localhost:3000',
    pathname: '/',
    search: '',
    hash: '',
  },
  writable: true,
})
