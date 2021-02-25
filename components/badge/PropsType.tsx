import type { ReactNode, CSSProperties } from 'react';

export default interface PropsType {
  theme?: 'primary' | 'success' | 'warning' | 'danger';
  shape?: 'dot' | 'radius' | 'round' | 'rect' | 'circle' | 'leaf';
  text?: ReactNode;
  style?: CSSProperties;
}
