import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import CriteriaSelector from './CriteriaSelector'

describe('CriteriaSelector component', () => {
  const mockOnCriteriaChange = vi.fn()

  beforeEach(() => {
    mockOnCriteriaChange.mockClear()
  })

  it('should render preset criteria', () => {
    render(<CriteriaSelector criteria={[]} onCriteriaChange={mockOnCriteriaChange} />)

    expect(screen.getByText('Market Fit')).toBeInTheDocument()
    expect(screen.getByText('Monetization')).toBeInTheDocument()
    expect(screen.getByText('Scalability')).toBeInTheDocument()
    expect(screen.getByText('Tech Feasibility')).toBeInTheDocument()
    expect(screen.getByText('Viral Potential')).toBeInTheDocument()
    expect(screen.getByText('Competitive Moat')).toBeInTheDocument()
  })

  it('should show selected criteria as checked', () => {
    const selectedCriteria = [
      { name: 'Market Fit', priority: 'Normal' },
      { name: 'Scalability', priority: 'Critical' }
    ]

    render(<CriteriaSelector criteria={selectedCriteria} onCriteriaChange={mockOnCriteriaChange} />)

    // Check that the selected criteria have checkmarks or are highlighted
    const marketFitItem = screen.getByText('Market Fit').closest('.criterion-item')
    const scalabilityItem = screen.getByText('Scalability').closest('.criterion-item')

    expect(marketFitItem).toHaveClass('selected')
    expect(scalabilityItem).toHaveClass('selected')
  })

  it('should toggle preset criteria selection', async () => {
    const user = userEvent.setup()

    render(<CriteriaSelector criteria={[]} onCriteriaChange={mockOnCriteriaChange} />)

    const marketFitItem = screen.getByText('Market Fit').closest('.criterion-item')
    await user.click(marketFitItem)

    expect(mockOnCriteriaChange).toHaveBeenCalledWith([
      { name: 'Market Fit', priority: 'Normal' }
    ])
  })

  it('should deselect preset criteria when clicked again', async () => {
    const user = userEvent.setup()
    const selectedCriteria = [{ name: 'Market Fit', priority: 'Normal' }]

    render(<CriteriaSelector criteria={selectedCriteria} onCriteriaChange={mockOnCriteriaChange} />)

    const marketFitItem = screen.getByText('Market Fit').closest('.criterion-item')
    await user.click(marketFitItem)

    expect(mockOnCriteriaChange).toHaveBeenCalledWith([])
  })

  it('should add custom criteria', async () => {
    const user = userEvent.setup()

    render(<CriteriaSelector criteria={[]} onCriteriaChange={mockOnCriteriaChange} />)

    const nameInput = screen.getByPlaceholderText('Criterion name')
    const descInput = screen.getByPlaceholderText('Optional description')
    const addButton = screen.getByText('+ Add')

    await user.type(nameInput, 'Innovation')
    await user.type(descInput, 'How innovative is the idea')
    await user.click(addButton)

    expect(mockOnCriteriaChange).toHaveBeenCalledWith([
      {
        name: 'Innovation',
        priority: 'Normal',
        description: 'How innovative is the idea'
      }
    ])

    // Check that inputs are cleared
    expect(nameInput.value).toBe('')
    expect(descInput.value).toBe('')
  })

  it('should not add custom criteria with empty name', async () => {
    const user = userEvent.setup()

    render(<CriteriaSelector criteria={[]} onCriteriaChange={mockOnCriteriaChange} />)

    const addButton = screen.getByText('+ Add')
    await user.click(addButton)

    expect(mockOnCriteriaChange).not.toHaveBeenCalled()
  })

  it('should display custom criteria with remove button', () => {
    const customCriteria = [
      { name: 'Innovation', priority: 'Normal', description: 'How innovative' }
    ]

    render(<CriteriaSelector criteria={customCriteria} onCriteriaChange={mockOnCriteriaChange} />)

    expect(screen.getByText('Innovation')).toBeInTheDocument()
  })

  it('should remove custom criteria', async () => {
    const user = userEvent.setup()
    const customCriteria = [
      { name: 'Innovation', priority: 'Normal', description: 'How innovative' }
    ]

    render(<CriteriaSelector criteria={customCriteria} onCriteriaChange={mockOnCriteriaChange} />)

    const removeButton = screen.getByText('✕')
    await user.click(removeButton)

    expect(mockOnCriteriaChange).toHaveBeenCalledWith([])
  })
})