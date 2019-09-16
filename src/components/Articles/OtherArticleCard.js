import React from 'react';
import cs from 'classnames';

import Image from '../Image';
import Tools from '../../utils/Tools';
import { UserType } from '../../utils/Constant';
import './OtherArticleCard.scss';

class ArticleCard extends React.PureComponent {
  render() {
    let { title, iscourse, covers, views, createDate, hasVideo } = this.props;
    let miniMode = covers.length < 3;
    let _covers = covers.slice(0, miniMode ? 1 : 3);

    return (
      <div className={cs('ks-article-card', { 'ks-article-card--mini': miniMode })}>
        <h4 className="ks-article-card__title">
          {!!iscourse && <small>教程</small>}
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
        <footer className="ks-article-card__Otherfooter">
          <span className="ks-article-card__views">{views}</span>
          <span className="ks-article-card__date">{Tools.getTimeAgo(createDate)}</span>
        </footer>
      </div>
    );
  }
}

ArticleCard.defaultProps = {
  title: '',
  iscourse: false,
  nickname: '',
  userType: UserType.NORMAL,
  covers: [],
  battery: 0,
  createDate: null,
  views: null
};

export default ArticleCard;
