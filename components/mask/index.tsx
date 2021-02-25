import React, { PureComponent } from 'react';
import type { HTMLAttributes } from 'react';
import classnames from 'classnames';
import type PropsType from './PropsType';

export interface MaskProps extends HTMLAttributes<HTMLDivElement>, PropsType {
  prefixCls?: string;
}

export default class Mask extends PureComponent<MaskProps, {}> {
  static defaultProps: MaskProps = {
    prefixCls: 'za-mask',
    visible: false,
    type: 'normal',
  };

  render() {
    const { prefixCls, className, visible, type, ...others } = this.props;
    const markCls = classnames(prefixCls, className, {
      [`${prefixCls}--${type}`]: !!type,
    });
    return visible && <div className={markCls} {...others} />;
  }
}
