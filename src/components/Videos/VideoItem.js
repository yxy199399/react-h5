import React from 'react';
import cs from 'classnames';

import Image from '../Image';
import Tools from '../../utils/Tools';
import './VideoItem.scss';

class VideoItem extends React.PureComponent {
  render() {
    let {
      cover,
      title,
      nickname,
      views,
      seconds,
      date,
      isCourse,
      children,
      className,
      ...rest
    } = this.props;

    let _cover = Tools.resolveAsset(cover, '?imageView2/2/w/306/h/172');
    let _seconds = Tools.getVideoLenStr(seconds);

    return (
      <div className={cs('ks-video-item', className)} {...rest}>
        <div className="ks-video-item__cover">
          {isCourse === 1 && <div className="ks-video-item__cover__isCourse">教程</div>}
          <Image className="ks-video-item__cover__img" src={_cover} />
          <div className="ks-video-item__cover__date">{_seconds}</div>
        </div>
        <div className="ks-video-item__body">
          <h4 className="ks-video-item__title">{title}</h4>
          <div className="ks-video-item__meta">
            {nickname !== null && <span className="ks-video-item__nick">{nickname}</span>}
            <span className="ks-video-item__views">{views}</span>
            {!!date && <span className="ks-video-item__date">{Tools.getTimeAgo(date)}</span>}
          </div>
        </div>
      </div>
    );
  }
}

VideoItem.defaultProps = {
  cover: null,
  title: '',
  nickname: '',
  views: 0,
  seconds: 0,
  date: '',
  isCourse: null
};

export default VideoItem;
