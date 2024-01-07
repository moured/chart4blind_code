import React from 'react';
import renderer from 'react-test-renderer';
import AdvancedButton from '../src/globalComponents/Buttons/AdvancedButton'
import MainToggleButton from '../src/globalComponents/Buttons/MainToggleButton'
import ModeButton from '../src/globalComponents/Buttons/ModeButton'
import { CgShapeCircle } from 'react-icons/cg'
import OptionToggleButton from '../src/globalComponents/Buttons/OptionToggleButton'
import AIFeatures from '../src/globalComponents/EditorModes/AIFeatures'
import CirclePlacerFeatures from '../src/globalComponents/EditorModes/CirclePlacerFeatures'
import OCRFeatures from '../src/globalComponents/EditorModes/OCRFeatures'
import CustomInputField from '../src/globalComponents/fields/CustomInputField'
import DropDownMenu from '../src/globalComponents/fields/DropDownMenu'
import SmallDropDownMenu from '../src/globalComponents/fields/SmallDropDownMenu'
import TelescopeField from '../src/globalComponents/fields/TelescopeField'
import { DEFAULT_AXIS_TEXT } from '../src/constants/mainTypesDefaults'
import TelescopeLabels from '../src/globalComponents/fields/TelescopeLabels'
import DividerWithText from '../src/globalComponents/spacing_and_headers/DividerWithText'
import LoadingIndicatorConfig from '../src/globalComponents/spacing_and_headers/LoadingIndicatorConfig'
import AccessibilityTutorial from '../src/globalComponents/AccessibilityTutorial'
import DataPointGrid from '../src/globalComponents/DataPointGrid'
import Editor from '../src/globalComponents/Editor'
import ExportModal from '../src/globalComponents/ExportModal'
import Header from '../src/globalComponents/Header'
import ImageEditor from '../src/globalComponents/ImageEditor'
import InteractiveTutorial from '../src/globalComponents/InteractiveTutorial'
import Sidebar from '../src/globalComponents/Sidebar'
import ToolBar from '../src/globalComponents/ToolBar'
import UndoRedo from '../src/globalComponents/UndoRedo'
import ZoomLens from '../src/globalComponents/ZoomLens'
import D3SVGView from '../src/charTypes/lineCharts/components/D3SVGView'
import LineDataSideBar from '../src/charTypes/lineCharts/components/LineDataSideBar'
import LinePropertiesSideBar from '../src/charTypes/lineCharts/components/LinePropertiesSideBar'
import * as ReactDnd from 'react-dnd'
import { JSDOM } from 'jsdom'
const jsdom = new JSDOM('<!doctype html><html><body></body></html>')
const { window } = jsdom
global.window = window
global.document = window.document
const dom = new JSDOM('')
global.Image = dom.window.Image
jest.mock('axios', () => ({
  get: jest.fn(() => Promise.resolve({ data: {} })),
  post: jest.fn(() => Promise.resolve({ data: {} })),
}));
jest.mock('react-dnd', () => ({
  useDrop: jest.fn(() => {})
}));

describe('Advanced Button Test', () => {
  it('renders correctly', () => {
    const tree = renderer
      .create(<AdvancedButton  handleToggle={() => {}} toggleData/>)
      .toJSON();
    expect(tree).toMatchSnapshot();
  })
})

describe('Main Button Test', () => {
  it('renders correctly', () => {
    const tree = renderer
      .create(
        <MainToggleButton  handleToggle={() => {}} toggleData/>
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  })
})

describe('Mode Button Test', () => {
  it('renders correctly', () => {
    const tree = renderer
      .create(<ModeButton handleToggle={() => {}} toggleData Icon={CgShapeCircle}/>)
      .toJSON();
    expect(tree).toMatchSnapshot();
  })
})
describe('Option toggle Button Test', () => {
  it('renders correctly', () => {
    const tree = renderer
      .create(<OptionToggleButton handlePress={() => {}} options={['image', 'src']} selected={'image'}/>)
      .toJSON();
    expect(tree).toMatchSnapshot();
  })
})
describe('AI Feature Test', () => {
  it('renders correctly', () => {
    const svgRef = React.createRef()
    const tree = renderer
      .create(<AIFeatures localSvgRef={svgRef} scale={10}/>)
      .toJSON();
    expect(tree).toMatchSnapshot();
  })
})
describe('Circle placer Feature', () => {
  it('renders correctly', () => {
    const svgRef = React.createRef()
    const tree = renderer
      .create(<CirclePlacerFeatures localSvgRef={svgRef} scale={10}/>)
      .toJSON();
    expect(tree).toMatchSnapshot();
  })
})

describe('OCR features test', () => {
  it('renders correctly', () => {
    const svgRef = React.createRef()
    const tree = renderer
      .create(<OCRFeatures localSvgRef={svgRef}/>)
      .toJSON();
    expect(tree).toMatchSnapshot();
  })
})

describe('Custom input field test', () => {
  beforeEach(() => {
    jest.spyOn(ReactDnd, 'useDrop').mockImplementation(() => [{}, () => {}]);
  });
  afterEach(() => {
    jest.clearAllMocks();
  })
  it('renders correctly', () => {
    const tree = renderer
      .create(<CustomInputField  onChange={() => {}} placeholder={'test'} type={'text'} value={'text'}/>)
      .toJSON();
    expect(tree).toMatchSnapshot();
  })
})
/*
describe('Draggable Text test', () => {
  beforeEach(() => {})
  afterEach(() => {
    jest.clearAllMocks();
  });
  it('renders correctly', () => {
    const tree = renderer
      .create(<DraggableText direction/>)
      .toJSON();
    expect(tree).toMatchSnapshot();
  })
})
 */

describe('Drop down menu test', () => {
  it('renders correctly', () => {
    const tree = renderer
      .create(<DropDownMenu onChange={() => {}} value={'text'} options={[{key: 'fast', title: 'value'}]}/>)
      .toJSON();
    expect(tree).toMatchSnapshot();
  })
})
describe('Small drop down menu test', () => {
  it('renders correctly', () => {
    const tree = renderer
      .create(<SmallDropDownMenu onChange={() => {}} value={'text'} options={[{key: 'fast', title: 'value'}]}/>)
      .toJSON();
    expect(tree).toMatchSnapshot();
  })
})

describe('TelescopeField test', () => {
  it('renders correctly', () => {
    const val = {...DEFAULT_AXIS_TEXT, id: '10'}
    const tree = renderer
      .create(
        <TelescopeField
    field={val}
    fields={[val, val]}
    appendFields={() => {}}
    onChangeText={() => {}}
    onChangeValue={() => {}}
    accessor={'x'}
    index={10}
    />
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  })
})

describe('telescope labels render', () => {
  beforeEach(() => {
    jest.spyOn(ReactDnd, 'useDrop').mockImplementation(() => [{}, () => {}]);
  });
  afterEach(() => {
    jest.clearAllMocks();
  });
  it('renders correctly', () => {
    const val = {...DEFAULT_AXIS_TEXT, id: '10'}
    const tree = renderer
      .create(
        <TelescopeLabels accessor={'x'} fields={[val, val, val]} setFields={() => {}}/>
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  })
})

describe('divider with text', () => {
  it('renders correctly', () => {
    const tree = renderer
      .create(
        <DividerWithText  text={'Lena'}/>
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  })
})

describe('Loading with text', () => {
  it('renders correctly', () => {
    const tree = renderer
      .create(
        <LoadingIndicatorConfig />
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  })
})

describe('accessibility tutorial test', () => {
  beforeEach(() => {
    if (typeof window !== 'undefined') {
      Object.defineProperty(window, 'innerWidth', { value: 500 })
    }
  });
  afterEach(() => {
    jest.clearAllMocks();
  })
  it('renders correctly', () => {
    const tree = renderer
      .create(
        <AccessibilityTutorial  showAccess toggleAccess={() => {}}/>
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  })
})


describe('datapoint grid test', () => {
  it('renders correctly', () => {
    const tree = renderer
      .create(
        <DataPointGrid/>
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  })
})


describe('Editor test', () => {
  it('renders correctly', () => {
    const tree = renderer
      .create(
        <Editor/>
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  })
})
describe('Export Modal test', () => {
  it('renders correctly', () => {
    const tree = renderer
      .create(
        <ExportModal toggleModal={() => {}}/>
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  })
})

describe('Header test', () => {
  it('renders correctly', () => {
    const tree = renderer
      .create(
        <Header/>
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  })
})

describe('ImageEditor test', () => {
  it('renders correctly', () => {
    const tree = renderer
      .create(
        <ImageEditor/>
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  })
})
describe('Interactive Tutorial test', () => {
  beforeEach(() => {
    Object.defineProperty(window, 'innerWidth', { value: 500 });
  });
  afterEach(() => {
    jest.clearAllMocks();
  })
  it('renders correctly', () => {
    const tree = renderer
      .create(
        <InteractiveTutorial showAbout toggleAbout={() => {}}/>
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  })
})

describe('SideBar test', () => {
  it('renders correctly', () => {
    const introJS = {
      setOptions: jest.fn(),
      onExit: jest.fn(),
    };

    jest.spyOn(React, 'useContext').mockImplementation(() => ({ introJS }));
    jest.spyOn(ReactDnd, 'useDrop').mockImplementation(() => [{}, () => {}])
    const tree = renderer
      .create(
        <Sidebar/>
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  })
})
describe('Toolbar test', () => {
  it('renders correctly', () => {
    jest.spyOn(ReactDnd, 'useDrop').mockImplementation(() => [{}, () => {}])
    const tree = renderer
      .create(
        <ToolBar/>
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  })
})

describe('UndoRedo test', () => {
  it('renders correctly', () => {
    const tree = renderer
      .create(
        <UndoRedo/>
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  })
})
describe('ZoomLens test', () => {
  it('renders correctly', () => {
    const tree = renderer
      .create(
        <ZoomLens/>
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  })
})

/*
describe('App test', () => {
  it('renders correctly', () => {
    jest.spyOn(ReactDnd, 'useDrop').mockImplementation(() => [{}, () => {}])
    const tree = renderer
      .create(
        <App/>
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  })
})
 */

describe('D3 test', () => {
  it('renders correctly', () => {
    const tree = renderer
      .create(
        <D3SVGView/>
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  })
})
describe('LineDataSdeBar test', () => {
  beforeEach(() => {
    jest.spyOn(ReactDnd, 'useDrop').mockImplementation(() => [{}, () => {}]);
  });
  afterEach(() => {
    jest.clearAllMocks();
  });
  it('renders correctly', () => {
    const tree = renderer
      .create(
        <LineDataSideBar/>
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  })
})
describe('LinePropertiesSidebar test', () => {
  beforeEach(() => {
    jest.spyOn(ReactDnd, 'useDrop').mockImplementation(() => [{}, () => {}]);
  });
  afterEach(() => {
    jest.clearAllMocks();
  });
  it('renders correctly', () => {
    const tree = renderer
      .create(
          <LinePropertiesSideBar/>
          )
      .toJSON();
    expect(tree).toMatchSnapshot();
  })
})
