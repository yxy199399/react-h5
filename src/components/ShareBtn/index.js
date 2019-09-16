import React from 'react';
import { useSetState } from 'react-use';

import WxShareMask from './WxShareMask';
import WeAppShare from './WeAppShare';
import Clipboard from '../Clipboard';

import Tools from 'src/utils/Tools';
import './index.scss';

const ShareBtn = props => {
  // const download = () => {
  //   window.location.href = process.env.REACT_APP_DOWNLOAD_URL;
  // };

  const [state, setState] = useSetState({
    mask: false,
    mask2: false
  });

  const toggleMask = () => {
    setState(state => ({ mask: !state.mask }));
  };

  const toggleMask2 = () => {
    setState(state => ({ mask2: !state.mask2 }));
  };

  return (
    <footer className="ks-share">
      {state.mask && <WxShareMask onClick={toggleMask} />}
      {state.mask2 && <WeAppShare onClose={toggleMask2} />}
      <div className="ks-share__holder" />
      <div className="ks-share__bar">
        {Tools.isWxBrowser() ? (
          <div className="ks-share__btn ks-share__btn--light" onClick={toggleMask}>
            立即分享
          </div>
        ) : (
          <Clipboard
            copyText={window.location.href}
            successText="链接已复制，赶紧去分享给工友吧！"
            errorText="链接复制失败，请手动复制"
          >
            <div className="ks-share__btn ks-share__btn--light">立即分享</div>
          </Clipboard>
        )}
        <div className="ks-share__btn" onClick={toggleMask2}>
          关注小程序
        </div>
      </div>
    </footer>
  );
};

export default ShareBtn;
