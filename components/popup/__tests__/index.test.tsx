import React from 'react';
import { mount, shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import ReactDOM from 'react-dom';
import Portal from '../Portal';
import Popup from '../Popup';
import Events from '../../utils/events';
import Trigger from '../../trigger';

describe('Popup', () => {
  describe('snapshot', () => {
    it('renders correctly', () => {
      const onMaskClick = jest.fn();
      const afterClose = jest.fn();
      const wrapper = mount(
        <Popup direction="bottom" onMaskClick={onMaskClick} afterClose={afterClose}>
          foo
        </Popup>,
      );
      expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('renders mount node correctly', () => {
      const onMaskClick = jest.fn();
      const afterClose = jest.fn();
      const wrapper = mount(
        <Popup
          visible
          direction="bottom"
          onMaskClick={onMaskClick}
          afterClose={afterClose}
          mountContainer={() => document.body}
        >
          foo
        </Popup>,
      );
      expect(toJson(wrapper)).toMatchSnapshot();
    });
  });

  it('should render portal if props.visible is truthy', () => {
    const wrapper = shallow(<Popup visible />);
    expect(wrapper.state()).toEqual({ renderPortal: true, portalVisible: true });
    expect(wrapper.exists()).toBeTruthy();
  });

  it('should not render portal if props.visible is falsy', () => {
    const wrapper = shallow(<Popup />);
    expect(wrapper.state()).toEqual({ renderPortal: false, portalVisible: false });
    expect(wrapper.find(Portal).exists()).toBeFalsy();
  });

  it('should create portal ref', () => {
    const wrapper = mount(<Popup visible />);
    // eslint-disable-next-line dot-notation
    expect(wrapper.instance()['portalRef']).toBeInstanceOf(Portal);
  });

  it('should destroy(unmount) portal from component tree', () => {
    const wrapper = shallow(<Popup visible destroy />);
    // eslint-disable-next-line dot-notation
    wrapper.instance()['handlePortalUnmount']();
    expect(wrapper.state()).toEqual({ renderPortal: false, portalVisible: true });
    expect(wrapper.find(Portal).exists()).toBeFalsy();
  });

  it('should not destroy(unmount) portal from componen tree but set to invisible', () => {
    const wrapper = shallow(<Popup visible destroy={false} />);
    // eslint-disable-next-line dot-notation
    wrapper.instance()['handlePortalUnmount']();
    expect(wrapper.state()).toEqual({ renderPortal: true, portalVisible: false });
    expect(wrapper.find(Portal).exists()).toBeTruthy();
    expect(wrapper.find(Portal).prop('visible')).toBeFalsy();
  });

  it('should pass correct props to Portal', () => {
    const wrapper = shallow(<Popup visible />);
    expect(wrapper.prop('destroy')).toBeUndefined();
  });
});

describe('Portal', () => {
  let PortalCJS: typeof import('../Portal').default;
  const events = [
    'webkitTransitionEnd',
    'transitionend',
    'webkitAnimationEnd',
    'animationend',
  ] as const;
  beforeEach(() => {
    jest.resetModules();
    jest.dontMock('../../utils/dom');
    jest.dontMock('react-dom');
  });
  afterEach(() => {
    jest.restoreAllMocks();
  });
  it('should bind transitionend and animationend events for popup element', () => {
    expect.assertions(events.length);
    const eventsOnSpy = jest.spyOn(Events, 'on').mockImplementation();
    const wrapper = mount(<Portal />);
    events.forEach((e) => {
      // eslint-disable-next-line dot-notation
      expect(eventsOnSpy).toBeCalledWith(wrapper.instance()['popup'], e, expect.any(Function));
    });
  });

  it('should unbind transitionend and animationend events for popup element and do cleanup work', () => {
    expect.assertions(events.length + 2);
    let popupRef: HTMLDivElement;
    Object.defineProperty(Portal.prototype, 'popup', {
      get() {
        return this._popup;
      },
      set(ref) {
        if (ref) {
          popupRef = ref;
        }
        this._popup = ref;
      },
      configurable: true,
    });
    const clearTimeoutSpy = jest.spyOn(window, 'clearTimeout').mockImplementation();
    const eventsOffSpy = jest.spyOn(Events, 'off').mockImplementation();
    const mountContainer = document.createElement('div');
    document.body.appendChild(mountContainer);
    const wrapper = mount(<Portal mountContainer={mountContainer} />);
    wrapper.unmount();
    events.forEach((e) => {
      expect(eventsOffSpy).toBeCalledWith(popupRef, e, expect.any(Function));
    });
    expect(clearTimeoutSpy).toBeCalledTimes(1);
    expect(mountContainer.querySelector('.za-popup-container')).toBeFalsy();
  });

  it('should create container inside document.body', () => {
    const createElementSpy = jest.spyOn(document, 'createElement');
    const appendChildSpy = jest.spyOn(document.body, 'appendChild');
    mount(<Portal mountContainer={document.body} />);
    expect(createElementSpy).toBeCalledWith('div');
    const container = document.body.querySelector('.za-popup-container');
    expect(container).toBeTruthy();
    expect(container!.className).toEqual('za-popup-container');
    expect(appendChildSpy).toBeCalledTimes(1);
  });

  it('should not create container if mount container is falsy', () => {
    const createElementSpy = jest.spyOn(document, 'createElement');
    shallow(<Portal mountContainer={false} />);
    expect(createElementSpy).not.toBeCalled();
  });

  it('should render null if canUseDOM is false', () => {
    jest.doMock('../../utils/dom', () => {
      const origin = jest.requireActual('../../utils/dom');
      return { ...origin, canUseDOM: false };
    });
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    PortalCJS = require('../Portal').default;
    const wrapper = mount(<PortalCJS />);
    expect(wrapper.find(Trigger).children()).toHaveLength(0);
  });

  it('should render popup and its children without mask', () => {
    const wrapper = shallow(
      <Portal mask={false}>
        <div id="test">test</div>
      </Portal>,
    );
    const popup = wrapper.find('[role="dialog"]');
    expect(popup.exists()).toBeTruthy();
    expect(popup.prop('className')).toEqual('za-popup za-popup--bottom');
    expect(popup.find('#test').text()).toEqual('test');
  });

  it('should render portal inside the popup container html div element (react version >= 16)', () => {
    const createPortalSpy = jest.spyOn(ReactDOM, 'createPortal');
    const wrapper = mount(<Portal mask={false} mountContainer={document.body} />);
    const popupContainer = document.body.querySelector('.za-popup-container');
    expect(popupContainer!.querySelector('[role="dialog"]')).toBeTruthy();
    expect(createPortalSpy).toBeCalled();
    const portal = wrapper.find(Trigger).childAt(0);
    expect(portal.exists()).toBeTruthy();
    expect(portal.name()).toBe('Portal');
    expect(portal.type().toString()).toBe('Symbol(react.portal)');
  });

  it('should render portal inside the popup container html div element (react version < 16)', () => {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { createPortal } = require('react-dom');
    // eslint-disable-next-line camelcase
    const unstable_renderSubtreeIntoContainerProxy = jest.fn((_, element, container) => {
      createPortal(element, container);
    });
    jest.doMock('react-dom', () => {
      const origin = jest.requireActual('react-dom');
      return {
        ...origin,
        unstable_renderSubtreeIntoContainer: unstable_renderSubtreeIntoContainerProxy,
        createPortal: undefined,
      };
    });

    // eslint-disable-next-line @typescript-eslint/no-var-requires
    PortalCJS = require('../Portal').default;
    mount(<PortalCJS mask={false} mountContainer={document.body} />);
    expect(unstable_renderSubtreeIntoContainerProxy).toBeCalled();
  });

  it('should handle ESC keyboard input', () => {
    const mOnEsc = jest.fn();
    const wrapper = shallow(<Portal onEsc={mOnEsc} />);
    wrapper.invoke('onClose')();
    expect(mOnEsc).toBeCalledTimes(1);
  });

  it('should handle mask click', () => {
    const mOnMaskClick = jest.fn();
    const wrapper = mount(<Portal onMaskClick={mOnMaskClick} />);
    const maskWrapper = wrapper.find('.za-popup__wrapper');
    const mEvent = { stopPropagation: jest.fn() };
    maskWrapper.simulate('click', mEvent);
    expect(mEvent.stopPropagation).toBeCalledTimes(1);
    expect(mOnMaskClick).toBeCalledTimes(1);
  });

  it('should not handle mask click if popup ref is event target', () => {
    let popupRef: HTMLDivElement;
    Object.defineProperty(Portal.prototype, 'popup', {
      get() {
        return this._popup;
      },
      set(ref) {
        if (ref) {
          popupRef = ref;
        }
        this._popup = ref;
      },
      configurable: true,
    });
    const mOnMaskClick = jest.fn();
    const wrapper = mount(<Portal onMaskClick={mOnMaskClick} />);
    const maskWrapper = wrapper.find('.za-popup__wrapper');
    const mEvent = { stopPropagation: jest.fn(), target: popupRef };
    maskWrapper.simulate('click', mEvent);
    expect(mEvent.stopPropagation).toBeCalledTimes(1);
    expect(mOnMaskClick).not.toBeCalled();
  });
});