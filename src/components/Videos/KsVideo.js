import React, { useRef } from 'react';
import { useSetState } from 'react-use';
import cs from 'classnames';

import Image from '../Image';
import './KsVideo.scss';

const KsVideo = props => {
  let {
    src,
    poster,
    mask = true,
    time = null,
    views = null,
    playBtn = 'center',
    className,
    ...rest
  } = props;

  const videoRef = useRef();
  const [state, setState] = useSetState({
    played: false
  });

  const handlePlay = () => {
    videoRef.current.play();
    setState({ played: true });
  };

  return (
    <div className={cs('ks-video', className)} {...rest}>
      <video
        ref={videoRef}
        src={src}
        className="ks-video__video"
        poster={poster}
        controls={true}
        preload="auto"
        playsInline={true}
        webkit-playsinline="true"
        x5-playsinline="true"
        // x5-video-player-type="h5"
        // x5-video-player-fullscreen="false"
        // x5-video-orientation="portrait"
      />
      {!state.played && (
        <>
          <Image className="ks-video__cover" src={poster} />
          {mask && <i className="ks-video__mask" />}
          <div className="ks-video__meta">
            {time !== null && <span className="ks-video__meta__time">{time}</span>}
            {views !== null && <span className="ks-video__meta__views">{views}</span>}
          </div>
          {playBtn && (
            <i
              className={cs('ks-video__play', { 'ks-video__play--center': playBtn === 'center' })}
              onClick={handlePlay}
            />
          )}
        </>
      )}
    </div>
  );
};

export default KsVideo;
