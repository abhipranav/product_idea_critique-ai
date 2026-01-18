import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useTheme } from '../hooks/useTheme'

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
}
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
})

describe('useTheme hook', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    // Reset document attributes
    document.documentElement.removeAttribute('data-theme')
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('should initialize with dark theme by default', () => {
    localStorageMock.getItem.mockReturnValue(null)

    const { result } = renderHook(() => useTheme())

    expect(result.current.theme).toBe('dark')
    expect(localStorageMock.getItem).toHaveBeenCalledWith('theme')
  })

  it('should initialize with saved theme from localStorage', () => {
    localStorageMock.getItem.mockReturnValue('light')

    const { result } = renderHook(() => useTheme())

    expect(result.current.theme).toBe('light')
  })

  it('should apply dark theme to document', () => {
    localStorageMock.getItem.mockReturnValue('dark')

    renderHook(() => useTheme())

    expect(document.documentElement.getAttribute('data-theme')).toBeNull()
    expect(localStorageMock.setItem).toHaveBeenCalledWith('theme', 'dark')
  })

  it('should apply light theme to document', () => {
    localStorageMock.getItem.mockReturnValue('light')

    renderHook(() => useTheme())

    expect(document.documentElement.getAttribute('data-theme')).toBe('light')
    expect(localStorageMock.setItem).toHaveBeenCalledWith('theme', 'light')
  })

  it('should toggle from dark to light', () => {
    localStorageMock.getItem.mockReturnValue('dark')

    const { result } = renderHook(() => useTheme())

    act(() => {
      result.current.toggleTheme()
    })

    expect(result.current.theme).toBe('light')
    expect(document.documentElement.getAttribute('data-theme')).toBe('light')
    expect(localStorageMock.setItem).toHaveBeenCalledWith('theme', 'light')
  })

  it('should toggle from light to dark', () => {
    localStorageMock.getItem.mockReturnValue('light')

    const { result } = renderHook(() => useTheme())

    act(() => {
      result.current.toggleTheme()
    })

    expect(result.current.theme).toBe('dark')
    expect(document.documentElement.getAttribute('data-theme')).toBeNull()
    expect(localStorageMock.setItem).toHaveBeenCalledWith('theme', 'dark')
  })
})