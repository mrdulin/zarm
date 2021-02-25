import type { ReactNode } from 'react';
import type { Locale } from '../config-provider/PropsType';
import type { ContainerType } from '../utils/dom';

export default interface PropsType {
  shape?: 'radius' | 'rect';
  visible?: boolean;
  animationType?:
    | 'fade'
    | 'door'
    | 'flip'
    | 'rotate'
    | 'zoom'
    | 'moveUp'
    | 'moveDown'
    | 'moveLeft'
    | 'moveRight'
    | 'slideUp'
    | 'slideDown'
    | 'slideLeft'
    | 'slideRight';
  animationDuration?: number;
  width?: string | number;
  title?: ReactNode;
  content?: ReactNode;
  cancelText?: string;
  destroy?: boolean;
  onCancel?: () => void;
  afterClose?: () => void;
  locale?: Locale['Alert'];
  mountContainer?: ContainerType;
}
