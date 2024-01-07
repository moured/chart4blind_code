import { fireEvent, render, screen } from '@testing-library/react'
import { ModeConfigurationContext } from '../../src/globalUtilities/modeConfigurationContext'
import { ChartContext } from '../../src/globalUtilities/chartContext'
import Header from '../../src/globalComponents/Header'
import React from 'react'
import '@testing-library/jest-dom/extend-expect';

jest.mock('react-dnd', () => ({
  DndProvider: ({ children }) => <div>{children}</div>,
}))
jest.mock('react-dnd-html5-backend', () => ({}))
jest.mock('uuid', () => ({
  v4: jest.fn(),
}))
jest.mock('notistack', () => ({
  enqueueSnackbar: jest.fn(),
}))
describe('Header Component', () => {
  jest.spyOn(require('../../src/globalComponents/InteractiveTutorial'), 'default')
    .mockReturnValue(<div>InteractiveTutorial</div>)
  jest.spyOn(require('../../src/globalComponents/AccessibilityTutorial'), 'default')
    .mockReturnValue(<div>AccessibilityTutorial</div>)
  const mockSetAppState = jest.fn()
  const mockSetX1 = jest.fn()
  const mockSetX2 = jest.fn()
  const mockSetY1 = jest.fn()
  const mockSetY2 = jest.fn()

  const renderHeader = () => {
    render(
      <ModeConfigurationContext.Provider value={{ setAppState: mockSetAppState }}>
        <ChartContext.Provider value={{
          imageSrc: '',
          setX1: mockSetX1,
          setX2: mockSetX2,
          setY1: mockSetY1,
          setY2: mockSetY2
        }}>
          <Header />
        </ChartContext.Provider>
      </ModeConfigurationContext.Provider>
    )
  }

  test('renders header', () => {
    renderHeader()
    const headerElement = screen.getByRole('banner')
    expect(headerElement).toBeInTheDocument()
  })

  test('opens file input after click buttons', () => {
    global.URL.createObjectURL.mockReturnValueOnce('http://google.com');
    renderHeader()
    const input = screen.getByLabelText('folder import')
    expect(input).toBeInTheDocument()
    const file = new File(['image isFillleeeed'], 'imageSrc.png', { type: 'image/png' })
    fireEvent.change(input, { target: { files: null }})
    fireEvent.change(input, { target: { files: [] }})
    fireEvent.change(input, { target: { files: [file] } })
    expect(input.files[0]).toStrictEqual(file)
    expect(input.files).toHaveLength(1)
  })
  test('opens Tutorial about after click buttons', async () => {
    renderHeader()
    const temp = screen.getByRole('button', { name: /about button/i })
    expect(temp).toBeInTheDocument()
    fireEvent.click(temp)
    //const aboutScreen = await screen.findByText(/InteractiveTutorial/i)
    //expect(aboutScreen).toBeInTheDocument()
  })
  test('opens accessibility Tutorial about after click buttons', async () => {
    renderHeader()
    const accessButton = screen.getByRole('button', { name: /accessibility button/i })
    expect(accessButton).toBeInTheDocument()
    fireEvent.click(accessButton)
    //const accessibilityTutorial = await screen.findByText(/AccessibilityTutorial/i)
    //expect(accessibilityTutorial).toBeInTheDocument()
  })
})
