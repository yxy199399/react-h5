import React from 'react';
import cs from 'classnames';

import Image from '../Image';
import Tools from '../../utils/Tools';
import { UserType } from '../../utils/Constant';
import './ArticleCard.scss';

class ArticleCard extends React.PureComponent {
  render() {
    let { title, isCourse, nickname, userType, covers, battery, createDate, hasVideo } = this.props;
    let miniMode = covers.length < 3;
    let _covers = covers.slice(0, miniMode ? 1 : 3);
    let _battery = Tools.getBatteryStr(battery);

    return (
      <div className={cs('ks-article-card', { 'ks-article-card--mini': miniMode })}>
        <h4 className="ks-article-card__title">
          {!!isCourse && <small>教程</small>}
          <span>{title}</span>
        </h4>
        <div className="ks-article-card__covers">
          {_covers.map((item, key) => (
            <Image
              key={key}
              src={Tools.resolveAsset(item.path, '?imageView2/2/w/250/h/156')}
              className="ks-article-card__cover"
            />
          ))}
          {!!hasVideo && <i className="ks-article-card__playbtn" />}
        </div>
        <footer className="ks-article-card__footer">
          <div className="ks-article-card__user">
            <span className="ks-article-card__user__nick">{nickname}</span>
            {+userType === UserType.BUSINESS && <i className="ks-article-card__user__kip" />}
            {+userType === UserType.PROFESSIONAL && (
              <i className="ks-article-card__user__kip ks-article-card__user__kip--active" />
            )}
          </div>
          <div className="ks-article-card__meta">
            {!miniMode && <span>{_battery} · </span>}
            <span>{Tools.getTimeAgo(createDate)}</span>
          </div>
        </footer>
      </div>
    );
  }
}

ArticleCard.defaultProps = {
  title: '',
  isCourse: false,
  nickname: '',
  userType: UserType.NORMAL,
  covers: [],
  battery: 0,
  createDate: null
};

export default ArticleCard;
