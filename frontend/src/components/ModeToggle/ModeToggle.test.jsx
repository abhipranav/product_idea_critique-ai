import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import ModeToggle from './ModeToggle'

describe('ModeToggle component', () => {
  it('should render both mode buttons', () => {
    const mockOnModeChange = vi.fn()

    render(<ModeToggle mode="ticket" onModeChange={mockOnModeChange} />)

    expect(screen.getByText('📋 Ticket / Spec')).toBeInTheDocument()
    expect(screen.getByText('💡 Business Idea')).toBeInTheDocument()
  })

  it('should highlight ticket mode when active', () => {
    const mockOnModeChange = vi.fn()

    render(<ModeToggle mode="ticket" onModeChange={mockOnModeChange} />)

    const ticketButton = screen.getByText('📋 Ticket / Spec')
    const businessButton = screen.getByText('💡 Business Idea')

    expect(ticketButton).toHaveClass('active')
    expect(businessButton).not.toHaveClass('active')
  })

  it('should highlight business mode when active', () => {
    const mockOnModeChange = vi.fn()

    render(<ModeToggle mode="business" onModeChange={mockOnModeChange} />)

    const ticketButton = screen.getByText('📋 Ticket / Spec')
    const businessButton = screen.getByText('💡 Business Idea')

    expect(businessButton).toHaveClass('active')
    expect(ticketButton).not.toHaveClass('active')
  })

  it('should call onModeChange with "ticket" when ticket button is clicked', async () => {
    const user = userEvent.setup()
    const mockOnModeChange = vi.fn()

    render(<ModeToggle mode="business" onModeChange={mockOnModeChange} />)

    const ticketButton = screen.getByText('📋 Ticket / Spec')
    await user.click(ticketButton)

    expect(mockOnModeChange).toHaveBeenCalledWith('ticket')
    expect(mockOnModeChange).toHaveBeenCalledTimes(1)
  })

  it('should call onModeChange with "business" when business button is clicked', async () => {
    const user = userEvent.setup()
    const mockOnModeChange = vi.fn()

    render(<ModeToggle mode="ticket" onModeChange={mockOnModeChange} />)

    const businessButton = screen.getByText('💡 Business Idea')
    await user.click(businessButton)

    expect(mockOnModeChange).toHaveBeenCalledWith('business')
    expect(mockOnModeChange).toHaveBeenCalledTimes(1)
  })
})