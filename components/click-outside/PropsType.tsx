import type { SyntheticEvent } from 'react';

export default interface ClickOutsideProps {
  onClickOutside?: (event: SyntheticEvent) => void;
  disabled?: boolean;
  className?: string;
  ignoredNode?: HTMLElement;
  [propName: string]: any;
}
