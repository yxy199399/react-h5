import React from 'react';
import cs from 'classnames';
import { withRouter } from 'react-router-dom';

import Avatar from 'src/components/Avatar';
import Image from 'src/components/Image';
import FollowBtn from 'src/components/FollowBtn';
import Tags from 'src/components/Tags';

import Tools from 'src/utils/Tools';
import './VideoCard.scss';
import { UserType } from 'src/utils/Constant';

const VideoCard = props => {
  const {
    theme = false, // 'circle'
    cover,
    nickname,
    avatar,
    userType,
    date,
    title,
    tags,
    course,
    videoLen,
    battery,
    uid,
    isFollow = false,
    staticContext,
    className,
    ...rest
  } = props;

  const _date = Tools.getTimeAgo(date);
  const _avatar = Tools.resolveAsset(avatar, '?imageView2/2/w/100/h/100');
  const _time = Tools.getVideoLenStr(videoLen);
  const _cover = Tools.resolveAsset(cover, '?imageView2/2/w/750/h/420');
  const _battery = Tools.getBatteryStr(battery);

  const toUserCenter = evt => {
    evt.stopPropagation();
    evt.preventDefault();

    props.history.push(`/users/${uid}`);
  };

  return (
    <section
      className={cs(
        'ks-video-card',

        {
          'ks-video-card--follow': isFollow,
          [`ks-video-card--${theme}`]: theme
        },

        className
      )}
      {...rest}
    >
      {/* 用户信息 */}
      <div className="ks-video-card__user" onClick={toUserCenter}>
        <Avatar className="ks-video-card__user__avatar" src={_avatar} />
        <div className="ks-video-card__user__nick">{nickname}</div>
        {userType === UserType.BUSINESS && <i className="ks-video-card__user__kip" />}
        {userType === UserType.PROFESSIONAL && (
          <i className="ks-video-card__user__kip ks-video-card__user__kip--sel" />
        )}
        {date && <span className="ks-video-card__user__date"> · {_date}</span>}
        <FollowBtn className="ks-video-card__user__btn" uid={uid} isFollow={isFollow} />
      </div>

      {/* 单标题 */}
      <h4 className="ks-video-card__title">{title}</h4>

      {/* 封面 */}
      <div className="ks-video-card__body">
        <div className="ks-video-card__body__inner">
          <Image className="ks-video-card__body__cover" src={_cover} />
          <i
            className={cs('ks-video-card__body__mask', {
              'ks-video-card__body__mask--blue': !!course
            })}
          />
          {!!course && (
            <>
              <span className="ks-video-card__body__tag2">教程</span>
              <span className="ks-video-card__body__tag">教程</span>
            </>
          )}
          <span className="ks-video-card__body__time">{_time}</span>
          <span className="ks-video-card__body__meta">
            {_battery} · {_date}
          </span>
        </div>
      </div>

      {/* 介绍 */}
      <div className="ks-video-card__info">
        <Avatar className="ks-video-card__info__avatar" src={_avatar} onClick={toUserCenter} />
        <div className="ks-video-card__info__cont">
          <h4 className="ks-video-card__info__title">{title}</h4>
          <Tags data={tags} />
        </div>
      </div>
    </section>
  );
};

export default withRouter(VideoCard);
