import React from 'react';
import cs from 'classnames';

import Attachment from './index';
import './AttachmentPanel.scss';

class AttachmentPanel extends React.PureComponent {
  state = {
    show: this.props.show || false
  };

  toggleShow = () => {
    this.setState({ show: !this.state.show });
  };

  render() {
    let { show } = this.state;
    let { data, className, show: _, ...rest } = this.props;

    return (
      <div
        className={cs('ks-attach-panel', { 'ks-attach-panel--show': show }, className)}
        {...rest}
      >
        <div className="ks-attach-panel__header" onClick={this.toggleShow}>
          <h3 className="ks-attach-panel__title">附件（{data.length}）</h3>
          <i className="ks-attach-panel__arrow" />
        </div>
        <div className="ks-attach-panel__body">
          <Attachment data={data} />
        </div>
      </div>
    );
  }
}

AttachmentPanel.defaultProps = {
  data: []
};

export default AttachmentPanel;
