import { render, screen } from '@testing-library/react'
import React from 'react'
import App from '../../src/App'
import '@testing-library/jest-dom/extend-expect';

jest.mock('react-dnd', () => ({
  DndProvider: ({ children }) => <div>{children}</div>,
}))
jest.mock('react-dnd-html5-backend', () => ({}))
jest.mock('uuid', () => ({
  v4: jest.fn(),
}))

describe('App', () => {
  jest.spyOn(require('../../src/globalComponents/Header'), 'default')
    .mockReturnValue(<div>Header</div>)
  jest.spyOn(require('../../src/globalComponents/Editor'), 'default')
    .mockReturnValue(<div>Editor</div>)
  jest.spyOn(require('../../src/globalComponents/Sidebar'), 'default')
    .mockReturnValue(<div>Sidebar</div>)
  it('renders "Upload Your File To Begin!" when no imageSrc', () => {
    render(<App />)
    expect(screen.getByText(/Upload Your File To Begin!/i)).toBeInTheDocument()
  })
})
