import type { ComponentType } from 'react';

export default interface BasePropsType {
  type?: string;
  theme?: 'default' | 'primary' | 'success' | 'warning' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  component?: ComponentType<React.SVGProps<SVGSVGElement>>;
  viewBox?: string;
}
