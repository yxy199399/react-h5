import React from 'react';
import ClipboardJS from 'clipboard';
import { Toast } from 'antd-mobile';

import Tools from '../../utils/Tools';

class Clipboard extends React.PureComponent {
  myRef = React.createRef();
  cliper = null;

  componentDidMount() {
    this.clipboard = new ClipboardJS(this.myRef.current, {
      text: (...args) => {
        let { copyText, onCopy } = this.props;
        if (onCopy) {
          return onCopy(...args);
        } else if (copyText) {
          return copyText;
        }
      }
    });

    this.clipboard.on('success', () => {
      let { successText, onSuccess } = this.props;

      if (onSuccess) {
        onSuccess();
      } else if (successText) {
        Toast.info(successText);
      }
    });

    this.clipboard.on('error', () => {
      let { errText, onError } = this.props;

      // UC浏览器补丁
      if (Tools.isUcBrowser()) {
        Toast.info(ClipboardJS.isSupported() ? '复制成功' : '复制失败');
      }

      if (onError) {
        onError();
      } else if (errText) {
        Toast.info(errText);
      }
    });
  }

  componentWillUnmount() {
    this.cliper && this.cliper.destroy();
  }

  render() {
    const childElement = React.Children.only(this.props.children);

    return React.cloneElement(childElement, { ref: this.myRef });
  }
}

export default Clipboard;
