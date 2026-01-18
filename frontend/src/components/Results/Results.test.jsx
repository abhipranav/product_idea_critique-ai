import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import Results from './Results'

describe('Results component', () => {
  it('should show loading state', () => {
    render(<Results isLoading={true} />)

    expect(screen.getByText('Analyzing your content...')).toBeInTheDocument()
    expect(document.querySelector('.loading-spinner')).toBeInTheDocument()
  })

  it('should show error message', () => {
    const errorMessage = 'Failed to analyze content'
    render(<Results error={errorMessage} />)

    expect(screen.getByText(errorMessage)).toBeInTheDocument()
    expect(screen.getByText(errorMessage).closest('.error-message')).toBeInTheDocument()
  })

  it('should show placeholder when no result', () => {
    render(<Results />)

    expect(screen.getByText('Your analysis will appear here')).toBeInTheDocument()
  })

  it('should display analysis results', () => {
    const mockResult = {
      score: 85,
      risk_level: 'Medium',
      critiques: [
        'First critique point',
        'Second critique point'
      ],
      blind_spots: [
        'First blind spot',
        'Second blind spot'
      ]
    }

    render(<Results result={mockResult} />)

    expect(screen.getByText('85')).toBeInTheDocument()
    expect(screen.getByText('Medium Risk')).toBeInTheDocument()
    expect(screen.getByText('First critique point')).toBeInTheDocument()
    expect(screen.getByText('Second critique point')).toBeInTheDocument()
    expect(screen.getByText('First blind spot')).toBeInTheDocument()
    expect(screen.getByText('Second blind spot')).toBeInTheDocument()
  })

  it('should apply correct score color for high score', () => {
    const mockResult = {
      score: 85,
      risk_level: 'Low',
      critiques: [],
      blind_spots: []
    }

    render(<Results result={mockResult} />)

    const scoreElement = screen.getByText('85')
    expect(scoreElement).toHaveStyle({ color: '#22c55e' }) // green
  })

  it('should apply correct score color for medium score', () => {
    const mockResult = {
      score: 60,
      risk_level: 'Medium',
      critiques: [],
      blind_spots: []
    }

    render(<Results result={mockResult} />)

    const scoreElement = screen.getByText('60')
    expect(scoreElement).toHaveStyle({ color: '#f59e0b' }) // yellow
  })

  it('should apply correct score color for low score', () => {
    const mockResult = {
      score: 25,
      risk_level: 'High',
      critiques: [],
      blind_spots: []
    }

    render(<Results result={mockResult} />)

    const scoreElement = screen.getByText('25')
    expect(scoreElement).toHaveStyle({ color: '#ef4444' }) // red
  })

  it('should handle result with error', () => {
    const mockResult = {
      error: 'API Error occurred'
    }

    render(<Results result={mockResult} />)

    expect(screen.getByText('API Error occurred')).toBeInTheDocument()
    expect(screen.getByText('API Error occurred').closest('.error-message')).toBeInTheDocument()
  })

  it('should render critique and blind spot sections', () => {
    const mockResult = {
      score: 75,
      risk_level: 'Medium',
      critiques: ['Critique 1'],
      blind_spots: ['Blind spot 1']
    }

    render(<Results result={mockResult} />)

    expect(screen.getByText('🚩 Critiques')).toBeInTheDocument()
    expect(screen.getByText('⚠️ Blind Spots')).toBeInTheDocument()
    expect(screen.getByText('Critique 1')).toBeInTheDocument()
    expect(screen.getByText('Blind spot 1')).toBeInTheDocument()
  })
})