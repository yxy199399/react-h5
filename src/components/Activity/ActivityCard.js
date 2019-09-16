import React from 'react';

import Tags from 'src/components/Tags/index';
import './ActivityCard.scss';

const ActivityCard = props => {
  const { cover, title, city, price, ticket, time, tags, video, hot } = props;

  return (
    <div className="activity-card">
      <div className="activity-card__cover">
        <img className="activity-card__cover__images" src={cover} alt="" />
      </div>
      <div className="activity-card__text">
        <div className="activity-card__text__city">
          <span className="activity-card__text__city__cityIcon" />
          {city}
        </div>
        <div className="activity-card__text__main">
          <div className="activity-card__text__main__message">
            <p className="activity-card__text__main__message__price">
              &yen;<span>{price || '免费'}</span>
            </p>
            <p className="activity-card__text__main__message__ticket">
              {hot && <span className="activity-card__text__main__message__ticket__fire" />}
              {hot ? '仅剩' : '剩余'}票数：{ticket}
            </p>
            <p className="activity-card__text__main__message__time">{time}</p>
          </div>
          {video && <div className="activity-card__text__main__videoBtn" />}
        </div>
      </div>

      <div className="activity-card__content">
        <p className="activity-card__content-text">{title}</p>
        {tags && <Tags data={tags} />}
      </div>
    </div>
  );
};

export default ActivityCard;
