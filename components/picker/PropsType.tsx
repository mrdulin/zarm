import type BasePickerViewProps from '../picker-view/PropsType';
import type { Locale } from '../config-provider/PropsType';
import type { ContainerType } from '../utils/dom';
import type { WheelItem } from '../wheel/PropsType';

export default interface BasePickerProps extends Omit<BasePickerViewProps, 'onChange' | 'stopScroll'> {
  visible?: boolean;
  title?: string;
  okText?: string;
  cancelText?: string;
  maskClosable?: boolean;
  destroy: boolean;
  onChange?: (selected: Array<WheelItem>) => void;
  onOk?: (selected: Array<WheelItem>) => void;
  onCancel?: () => void;
  mountContainer?: ContainerType;
  locale?: Locale['Picker'] & Locale['Select'];
}
