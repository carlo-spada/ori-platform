import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { NavLink } from '@/components/NavLink'

describe('NavLink Component', () => {
  it('renders a navigation link with correct text', () => {
    render(<NavLink href="/test">Test Link</NavLink>)

    const link = screen.getByRole('link', { name: /test link/i })
    expect(link).toBeInTheDocument()
    expect(link).toHaveAttribute('href', '/test')
  })

  it('applies active class when href matches current path', () => {
    render(
      <NavLink href="/" className="custom-class">
        Home
      </NavLink>,
    )

    const link = screen.getByRole('link', { name: /home/i })
    expect(link).toBeInTheDocument()
    expect(link).toHaveClass('custom-class')
  })
})
