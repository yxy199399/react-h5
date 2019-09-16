import React from 'react';
import './WxShareMask.scss';

const WxShareMask = props => {
  return (
    <div className="wx-share-mask" onClick={props.onClick}>
      <div className="wx-share-mask__cont">
        <b />
        <div className="wx-share-mask__tips">
          <p>
            点击右上角「 <i />
            <i />
            <i /> 」
          </p>
          <p>选择“发送给朋友”</p>
          <p>或“分享到朋友圈”</p>
        </div>
      </div>
    </div>
  );
};

export default WxShareMask;
