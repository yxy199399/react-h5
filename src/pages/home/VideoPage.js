import React from 'react';
import qs from 'qs';

import './VideoPage.scss';

const VideoPage = props => {
  let query = qs.parse(props.location.search, { ignoreQueryPrefix: true });
  let src = decodeURIComponent(query.src);

  return (
    <div className="page-video">
      <video
        src={src}
        className="page-video__video"
        autoPlay={true}
        controls="true"
        preload="auto"
        playsInline={true}
        webkit-playsinline="true"
        x5-playsinline="true"
        // x5-video-player-type="h5"
        // x5-video-player-fullscreen="true"
        // x5-video-orientation="portraint"
      />
    </div>
  );
};

export default VideoPage;
