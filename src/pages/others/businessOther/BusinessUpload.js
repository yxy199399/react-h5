import React from 'react';
import NavBar from 'src/components/Nav/NavBar';
import KsListView from 'src/components/KsListView';
import VideoItem from 'src/components/Videos/VideoItem';
import OtherArticleCard from 'src/components/Articles/OtherArticleCard';
import EncyclopediaCard from 'src/components/Encyclopedias/EncyclopediaCard';
import { Link } from 'react-router-dom';
import Api from 'src/utils/Api';
import Tools from 'src/utils/Tools';

const KsUploadList = props => {
  const { uid, type } = props.match.params;

  const renderTitle = () => {
    switch (type) {
      case 'videos':
        return 'TA的视频';
      case 'articles':
        return 'TA的文章';
      case 'encycs':
        return 'TA的百科';
      default:
        return '';
    }
  };

  const title = renderTitle();

  //渲染视频
  const renderVideo = item => {
    return (
      <Link to={`/videos/${item.video_id}`} key={item.video_id}>
        <VideoItem
          title={item.title}
          cover={item.cover}
          nickname={null}
          views={item.view_num}
          seconds={item.video_length}
          date={item.created_at}
          isCourse={item.is_course}
        />
      </Link>
    );
  };

  //渲染文章
  const renderAirticle = item => {
    return (
      <Link
        className="other-home-plate__airticle"
        to={`/articles/${item.article_id}`}
        key={item.article_id}
      >
        <OtherArticleCard
          title={item.title}
          iscourse={item.is_course}
          nickname={item.nickname}
          battery={item.like_num}
          userType={item.user_type}
          covers={item.cover}
          createDate={item.created_at}
          hasVideo={item.has_video}
          views={item.view_num}
        />
      </Link>
    );
  };
  //渲染百科
  const renderEnyec = item => {
    return (
      <Link
        className="other-home-plate__enyec"
        to={`/encyclopedias/${item.encyclopedia_id}`}
        key={item.encyclopedia_id}
      >
        <EncyclopediaCard
          title={item.title}
          cover={item._cover}
          tags={item._tags}
          battery={null}
          content={item.content}
        />
      </Link>
    );
  };
  //获取视频
  const fetchVideo = async page => {
    const res = await Api.post('/other/videos', { uid, page });
    return res;
  };
  // 获取文章
  const fetchArticle = async page => {
    const res = await Api.post('/other/article', { uid, page });
    res.data.data.forEach(item => {
      item.cover = [];
      item.cover.push({ name: 'img', path: item.image_path });
      item.has_video = item.video_url ? 1 : 0;
    });
    return res;
  };
  //获取百科
  const fetchEnyec = async page => {
    const res = await Api.post('/other/encyclopedias', { uid, page });
    res.data.data.forEach(item => {
      item._cover = Tools.resolveAsset(item.cover && item.cover[0]);
      item._tags = item.label_name.split(',').map(name => ({ name }));
    });
    return res;
  };
  return (
    <div className="ks-upload-list">
      <NavBar title={title} />
      {type === 'videos' && (
        <KsListView fetchData={fetchVideo} renderRow={renderVideo} useBodyScroll={true} />
      )}
      {type === 'articles' && (
        <KsListView fetchData={fetchArticle} renderRow={renderAirticle} useBodyScroll={true} />
      )}
      {type === 'encycs' && (
        <KsListView fetchData={fetchEnyec} renderRow={renderEnyec} useBodyScroll={true} />
      )}
    </div>
  );
};
export default KsUploadList;
