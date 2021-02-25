import type { ReactNode, CSSProperties } from 'react';

export default interface BaseNavbarProps {
  title?: ReactNode;
  left?: ReactNode;
  right?: ReactNode;
  style?: CSSProperties;
}
