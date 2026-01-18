import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Header from './Header'

describe('Header component', () => {
  it('should render the header with theme toggle', () => {
    const mockToggleTheme = vi.fn()

    render(<Header theme="dark" onToggleTheme={mockToggleTheme} />)

    expect(screen.getByText('Vibe Scorer')).toBeInTheDocument()
    expect(screen.getByText('Ruthless analysis for your ideas and specs')).toBeInTheDocument()
    expect(screen.getByRole('button')).toBeInTheDocument()
  })

  it('should call onToggleTheme when theme button is clicked', async () => {
    const user = userEvent.setup()
    const mockToggleTheme = vi.fn()

    render(<Header theme="dark" onToggleTheme={mockToggleTheme} />)

    const themeButton = screen.getByRole('button')
    await user.click(themeButton)

    expect(mockToggleTheme).toHaveBeenCalledTimes(1)
  })

  it('should display moon icon for dark theme', () => {
    const mockToggleTheme = vi.fn()

    render(<Header theme="dark" onToggleTheme={mockToggleTheme} />)

    // The moon icon should be visible (sun icon hidden)
    const moonIcon = document.querySelector('svg')
    expect(moonIcon).toBeInTheDocument()
  })

  it('should display sun icon for light theme', () => {
    const mockToggleTheme = vi.fn()

    render(<Header theme="light" onToggleTheme={mockToggleTheme} />)

    // The sun icon should be visible
    const sunIcon = document.querySelector('svg')
    expect(sunIcon).toBeInTheDocument()
  })
})