import React from 'react';
import cs from 'classnames';
import { Link } from 'react-router-dom';

import Card from '../../components/Card';
import VideoItem from './VideoItem';

class RecommendVideo extends React.PureComponent {
  render() {
    let { data, className, ...rest } = this.props;

    return (
      <Card className={cs(className)} title="相关视频" empty={data.length <= 0} {...rest}>
        {data.map(item => (
          <Link to={`/videos/${item.video_id}`} key={item.video_id}>
            <VideoItem
              title={item.title}
              cover={item.cover}
              nickname={item.nickname}
              views={item.view_num}
              seconds={item.video_length}
            />
          </Link>
        ))}
      </Card>
    );
  }
}

RecommendVideo.defaultProps = {
  data: []
};

export default RecommendVideo;
