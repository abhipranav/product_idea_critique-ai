import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import AnalysisForm from './AnalysisForm'

describe('AnalysisForm component', () => {
  const mockOnSubmit = vi.fn()

  beforeEach(() => {
    mockOnSubmit.mockClear()
  })

  it('should render form elements', () => {
    render(<AnalysisForm onSubmit={mockOnSubmit} isLoading={false} />)

    expect(screen.getByText('📋 Ticket / Spec')).toBeInTheDocument()
    expect(screen.getByText('💡 Business Idea')).toBeInTheDocument()
    expect(screen.getByRole('textbox')).toBeInTheDocument()
    expect(screen.getByText('🔥 Roast This Ticket')).toBeInTheDocument()
  })

  it('should show ticket placeholder by default', () => {
    render(<AnalysisForm onSubmit={mockOnSubmit} isLoading={false} />)

    const textarea = screen.getByRole('textbox')
    expect(textarea).toHaveAttribute('placeholder', 'Paste your JIRA ticket, PRD, or technical spec here...')
  })

  it('should show business placeholder when business mode is selected', async () => {
    const user = userEvent.setup()

    render(<AnalysisForm onSubmit={mockOnSubmit} isLoading={false} />)

    const businessButton = screen.getByText('💡 Business Idea')
    await user.click(businessButton)

    const textareas = screen.getAllByRole('textbox')
    const mainTextarea = textareas.find(textarea => 
      textarea.tagName === 'TEXTAREA'
    )
    expect(mainTextarea).toHaveAttribute('placeholder', 'Describe your business idea, startup concept, or product vision...')
  })

  it('should show ticket button text by default', () => {
    render(<AnalysisForm onSubmit={mockOnSubmit} isLoading={false} />)

    expect(screen.getByText('🔥 Roast This Ticket')).toBeInTheDocument()
  })

  it('should show business button text when business mode is selected', async () => {
    const user = userEvent.setup()

    render(<AnalysisForm onSubmit={mockOnSubmit} isLoading={false} />)

    const businessButton = screen.getByText('💡 Business Idea')
    await user.click(businessButton)

    expect(screen.getByText('🔥 Roast This Idea')).toBeInTheDocument()
  })

  it('should show criteria selector in business mode', async () => {
    const user = userEvent.setup()

    render(<AnalysisForm onSubmit={mockOnSubmit} isLoading={false} />)

    // Initially, criteria selector should not be visible
    expect(screen.queryByText('Market Fit')).not.toBeInTheDocument()

    const businessButton = screen.getByText('💡 Business Idea')
    await user.click(businessButton)

    // Now criteria selector should be visible
    expect(screen.getByText('Market Fit')).toBeInTheDocument()
  })

  it('should submit form with correct data for ticket mode', async () => {
    const user = userEvent.setup()

    render(<AnalysisForm onSubmit={mockOnSubmit} isLoading={false} />)

    const textareas = screen.getAllByRole('textbox')
    const mainTextarea = textareas.find(textarea => 
      textarea.tagName === 'TEXTAREA'
    )
    const submitButton = screen.getByText('🔥 Roast This Ticket')

    await user.type(mainTextarea, 'Test JIRA ticket content')
    await user.click(submitButton)

    expect(mockOnSubmit).toHaveBeenCalledWith({
      content: 'Test JIRA ticket content',
      mode: 'ticket',
      criteria: []
    })
  })

  it('should submit form with correct data for business mode with criteria', async () => {
    const user = userEvent.setup()

    render(<AnalysisForm onSubmit={mockOnSubmit} isLoading={false} />)

    // Switch to business mode
    const businessButton = screen.getByText('💡 Business Idea')
    await user.click(businessButton)

    // Select a criterion
    const marketFitItem = screen.getByText('Market Fit').closest('.criterion-item')
    await user.click(marketFitItem)

    // Fill content and submit
    const textareas = screen.getAllByRole('textbox')
    const mainTextarea = textareas.find(textarea => 
      textarea.tagName === 'TEXTAREA'
    )
    const submitButton = screen.getByText('🔥 Roast This Idea')

    await user.type(mainTextarea, 'Test business idea')
    await user.click(submitButton)

    expect(mockOnSubmit).toHaveBeenCalledWith({
      content: 'Test business idea',
      mode: 'business',
      criteria: [{ name: 'Market Fit', priority: 'Normal' }]
    })
  })

  it('should not submit form with empty content', async () => {
    const user = userEvent.setup()

    render(<AnalysisForm onSubmit={mockOnSubmit} isLoading={false} />)

    const submitButton = screen.getByRole('button', { name: /roast this ticket/i })
    await user.click(submitButton)

    expect(mockOnSubmit).not.toHaveBeenCalled()
  })

  it('should disable submit button when loading', () => {
    render(<AnalysisForm onSubmit={mockOnSubmit} isLoading={true} />)

    const submitButton = screen.getByRole('button', { name: /analyzing/i })
    expect(submitButton).toBeDisabled()
    expect(submitButton).toHaveTextContent('Analyzing...')
  })

  it('should disable submit button when content is empty', () => {
    render(<AnalysisForm onSubmit={mockOnSubmit} isLoading={false} />)

    const submitButton = screen.getByRole('button', { name: /roast this ticket/i })
    expect(submitButton).toBeDisabled()
  })

  it('should enable submit button when content is entered', async () => {
    const user = userEvent.setup()

    render(<AnalysisForm onSubmit={mockOnSubmit} isLoading={false} />)

    const textarea = screen.getByRole('textbox')
    const submitButton = screen.getByRole('button', { name: /roast this ticket/i })

    expect(submitButton).toBeDisabled()

    await user.type(textarea, 'Some content')

    expect(submitButton).not.toBeDisabled()
  })
})