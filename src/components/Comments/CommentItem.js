import React from 'react';
import cs from 'classnames';
import { withRouter } from 'react-router-dom';

import RichTextView from 'src/components/RichTextView';
import RandomColorBar from '../RandomColorBar';
import Attachment from '../Attachment';
import './CommentItem.scss';

class CommentItem extends React.PureComponent {
  state = { showAttach: false };

  toggleAttach = () => {
    this.setState({ showAttach: !this.state.showAttach });
  };

  toUserCenter = evt => {
    evt.stopPropagation();
    evt.preventDefault();
    const uid = this.props.uid;

    uid && this.props.history.push(`/users/${uid}`);
  };

  render() {
    let { showAttach } = this.state;
    let { nickname, side, content, attach } = this.props;

    return (
      <div className="ks-comment">
        <div className="ks-comment__header" onClick={this.toUserCenter}>
          <h4 className="ks-comment__nick">
            <RandomColorBar />
            {nickname}
          </h4>
          <div className="ks-comment__side">{side}</div>
        </div>
        <div className="ks-comment__body">
          <RichTextView html={content} />
        </div>
        {attach && attach.length > 0 && (
          <div
            className={cs('ks-comment__attach', {
              'ks-comment__attach--show': showAttach
            })}
          >
            <div className="ks-comment__attach__header" onClick={this.toggleAttach}>
              <div className="ks-comment__attach__title">附件</div>
              <i className="ks-comment__attach__arrow" />
            </div>
            <div className="ks-comment__attach__body">
              <Attachment data={attach} />
            </div>
          </div>
        )}
      </div>
    );
  }
}

CommentItem.defaultProps = {
  nickname: '',
  side: null,
  attach: []
};

export default withRouter(CommentItem);
