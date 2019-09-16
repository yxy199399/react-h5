import React from 'react';

import RandomColorBar from '../RandomColorBar';
import Image from '../Image';
import StarLevel from '../StarLevel';
import Gallery from '../Gallery';

import './GoodsReview.scss';

const GoodsReview = props => {
  let { nickname, date, score, content, album = [] } = props;
  let max = 4;
  let _album = album.slice(0, max);

  const previewAlbum = index => evt => {
    const data = album.map(item => ({ path: item.preview || item.path }));
    Gallery.open(data, index);
  };

  return (
    <div className="ks-goods-review">
      <header className="ks-goods-review__header">
        <RandomColorBar className="ks-goods-review__header__bar" />
        <div className="ks-goods-review__header__nick">{nickname}</div>
        <div className="ks-goods-review__header__date">&nbsp;·&nbsp;{date}</div>
        <StarLevel size="mini" score={score} />
      </header>
      <div className="ks-goods-review__body">{content}</div>
      <footer className="ks-goods-review__album">
        {_album.map((item, idx) => (
          <div className="ks-goods-review__album__item" key={idx}>
            <div className="ks-goods-review__album__rect">
              <Image
                className="ks-goods-review__album__img"
                src={item.thumb || item.path}
                onClick={previewAlbum(idx)}
              />
            </div>
          </div>
        ))}
        {album.length > max && (
          <span className="ks-goods-review__album__count">{album.length}</span>
        )}
      </footer>
    </div>
  );
};

export default GoodsReview;
