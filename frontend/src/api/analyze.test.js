import { describe, it, expect, vi, beforeEach } from 'vitest'
import { analyzeContent } from '../api/analyze'

// Mock fetch globally
global.fetch = vi.fn()

describe('API - analyzeContent', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should successfully analyze content', async () => {
    const mockResponse = {
      score: 85,
      risk_level: 'Medium',
      critiques: ['Test critique'],
      blind_spots: ['Test blind spot']
    }

    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockResponse)
    })

    const result = await analyzeContent('Test content', 'ticket', [])

    expect(global.fetch).toHaveBeenCalledWith('/api/analyze', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        content_text: 'Test content',
        analysis_mode: 'ticket',
        criteria_data: [],
      }),
    })

    expect(result).toEqual(mockResponse)
  })

  it('should handle API errors', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: false,
      status: 500
    })

    await expect(analyzeContent('Test content', 'ticket', []))
      .rejects
      .toThrow('API error: 500')
  })

  it('should send correct data for business mode with criteria', async () => {
    const mockResponse = { score: 75, risk_level: 'High' }
    const criteria = [{ name: 'Market Fit', priority: 'Critical' }]

    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockResponse)
    })

    await analyzeContent('Business idea', 'business', criteria)

    expect(global.fetch).toHaveBeenCalledWith('/api/analyze', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        content_text: 'Business idea',
        analysis_mode: 'business',
        criteria_data: criteria,
      }),
    })
  })
})