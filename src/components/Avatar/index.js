import React from 'react';
import cs from 'classnames';

import Tools from '../../utils/Tools';
import iconAvatar from '../../assets/avatar.jpg';
import './index.scss';

class Avatar extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = { src: this.props.holder };
    this.img = new window.Image();
    this.img.onload = () => this.setState({ src: this.img.src });
    this.img.onerror = () => this.setState({ src: this.props.holder });
  }

  render() {
    let { src, holder, className, style, ...rest } = this.props;

    src = Tools.resolveAsset(src, '?imageView2/2/w/100/h/100');

    if (src !== this.img.src) {
      this.img.src = src;
    }

    return (
      <div
        className={cs('ks-avatar', className)}
        style={{ backgroundImage: `url("${this.state.src}")`, ...style }}
        {...rest}
      />
    );
  }
}

Avatar.defaultProps = {
  src: '',
  holder: iconAvatar
};

export default Avatar;
