import React from 'react';
import { Carousel } from 'antd-mobile';
import { useSetState } from 'react-use';
import { Link } from 'react-router-dom';
import cs from 'classnames';

import Gallery from '../Gallery';
import Image from '../Image';
import './KsGalleryVideo.scss';

const KsGalleryVideo = props => {
  const { covers = [], src, index = 0, carouselProps, className, ...rest } = props;
  const [state, setState] = useSetState({ idx: index });

  const onIdxChange = idx => {
    setState({ idx });
  };

  const previewCovers = idx => () => {
    const data = covers.map(item => ({ path: item.url }));
    Gallery.open(data, idx);
  };

  return (
    <div className={cs('ks-gallery-video', className)} {...rest}>
      <Carousel
        dots={false}
        autoplay={false}
        autoplayInterval={5000}
        infinite={true}
        afterChange={onIdxChange}
        {...carouselProps}
      >
        {covers.map((item, key) => (
          <Image
            key={key}
            className="ks-gallery-video__img"
            src={item.url}
            onClick={previewCovers(key)}
          />
        ))}
      </Carousel>
      <div className="ks-gallery-video__pager">
        {covers.length ? state.idx + 1 : 0}/{covers.length}
      </div>
      {src && state.idx === 0 && (
        <Link
          to={{ pathname: '/play-video', search: `src=${encodeURIComponent(src)}` }}
          className="ks-gallery-video__play"
        />
      )}
    </div>
  );
};

export default KsGalleryVideo;
