import React from 'react';
import './WeAppShare.scss';

const WeAppShare = props => {
  const { onClose = () => {}, text = '扫码or在微信搜索“酷耍实验室”' } = props;

  return (
    <div className="weapp-share">
      <div className="weapp-share__mask" onClick={onClose} />
      <div className="weapp-share__body">
        <i className="weapp-share__close" onClick={onClose} />
        <img src={require('../../assets/weapp_qr.jpg')} alt="" className="weapp-share__qr" />
        <p className="weapp-share__info">{text}</p>
      </div>
    </div>
  );
};

export default WeAppShare;
