import React from 'react';

import Avatar from 'src/components/Avatar';
import './GoodsItem.scss';

const GoodsItem = props => {
  const { cover, location, title, price, views, avatar, nick } = props;

  return (
    <div className="goods-masonry-item">
      <img src={cover} alt="" className="goods-masonry-item__cover" />
      <i className="goods-masonry-item__bar" />
      <span className="goods-masonry-item__location">{location}</span>
      <h4 className="goods-masonry-item__title">{title}</h4>
      <footer className="goods-masonry-item__footer">
        <span className="goods-masonry-item__price">&yen;{price}</span>
        <span className="goods-masonry-item__views">{views}</span>
      </footer>
      <div className="goods-masonry-item__user">
        <Avatar className="goods-masonry-item__avatar" src={avatar} />
        <div className="goods-masonry-item__nick">{nick}</div>
      </div>
    </div>
  );
};

export default GoodsItem;
