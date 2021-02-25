import type BasePickerProps from '../picker/PropsType';
import type { WheelValue, WheelItem } from '../wheel/PropsType';

type pickerPropsWithoutVisible = Omit<BasePickerProps, 'visible'>;

export default interface BaseSelectProps extends pickerPropsWithoutVisible {
  placeholder?: string;
  displayRender?: (data?: Array<WheelItem>) => WheelValue;
  hasArrow?: boolean;
}
