import React from 'react';
import StarLevel from 'src/components/StarLevel';
import Image from 'src/components/Image';

import './ServiceCard.scss';

const ServiceCard = props => {
  const { cover, title, city, price, video, menuPname, menuName, score, isQuestion } = props;

  return (
    <div className="service-card">
      <div className="service-card__cover">
        <Image className="service-card__cover__img" src={cover} />
        {!!video && (
          <img
            src={require('../../assets/play_btn.png')}
            alt=""
            className="service-card__cover__play"
          />
        )}
      </div>
      <div className="service-card__cont">
        <div className="service-card__title">{title}</div>
        <div className="service-card__meta">
          {!!city && (
            <>
              <img
                src={require('../../assets/icon_location.png')}
                alt=""
                className="service-card__loc"
              />
              <span className="service-card__city">{city}</span>
            </>
          )}
          <span className="service-card__side">
            {menuPname} · {menuName}
          </span>
        </div>
        <div className="service-card__footer">
          <StarLevel score={score} />
          <div className="service-card__price">
            {isQuestion ? (
              <span>咨询商家</span>
            ) : (
              <>
                <span className="service-card__price__sm">&yen;</span>
                <span>{price}</span>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceCard;
