import React from 'react';
import cs from 'classnames';
import { useSetState } from 'react-use';
// import { Modal } from 'antd-mobile';

import Clipboard from 'src/components/Clipboard';
import WxShareMask from 'src/components/ShareBtn/WxShareMask';
import WeAppShare from 'src/components/ShareBtn/WeAppShare';

import Tools from 'src/utils/Tools';
import './CommentBar.scss';

const CommentBar = props => {
  const {
    type = 'article',
    commentsLen = 0,
    shareBtn = false,
    downloadBtn = true,
    toComments = () => {},
    toReply = () => {}
  } = props;
  // const isWx = Tools.isWxBrowser();
  const [state, setState] = useSetState({
    mask: false,
    mask2: false
  });

  const toggleMask = () => {
    setState(state => ({ mask: !state.mask }));
  };

  const togglemask2 = () => {
    setState(state => ({ mask2: !state.mask2 }));
  };

  const handleToComments = () => {
    toComments();
  };

  return (
    <>
      {state.mask && <WxShareMask onClick={toggleMask} />}
      {state.mask2 && <WeAppShare onClose={togglemask2} />}
      <div className="ks-comment-bar__holder" />
      <div className="ks-comment-bar">
        <span className="ks-comment-bar__input" onClick={toReply}>
          写{type === 'question' ? '回答' : '评论'}...
        </span>

        <span
          className={cs('ks-comment-bar__icon', {
            'ks-comment-bar__icon--msg': type !== 'question',
            'ks-comment-bar__icon--answer': type === 'question'
          })}
          onClick={handleToComments}
        >
          {!!commentsLen && <span className="ks-comment-bar__badge">{commentsLen}</span>}
        </span>
        {shareBtn &&
          (Tools.isWxBrowser() ? (
            <i className="ks-comment-bar__icon ks-comment-bar__icon--share" onClick={toggleMask} />
          ) : (
            <Clipboard
              copyText={window.location.href}
              successText="链接已复制，赶紧去分享给工友吧！"
              errorText="链接复制失败，请手动复制"
            >
              <i className="ks-comment-bar__icon ks-comment-bar__icon--share" />
            </Clipboard>
          ))}
        {downloadBtn && (
          <div
            className="ks-comment-bar__btn"
            // href={process.env.REACT_APP_DOWNLOAD_URL}
            onClick={togglemask2}
          >
            小程序
          </div>
        )}
      </div>
    </>
  );
};

export default CommentBar;
