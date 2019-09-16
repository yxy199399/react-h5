import React from 'react';
import { useMount, useSetState } from 'react-use';
import { Link } from 'react-router-dom';
import moment from 'moment';
import FixedTab from 'src/components/FixedTab';
import KsListView from 'src/components/KsListView';
import Gallery from 'src/components/Gallery';
import Image from 'src/components/Image';
import RichTextView from 'src/components/RichTextView';
import ActivityCard from 'src/components/Activity/ActivityCard';
import ServiceCard from 'src/components/Service/ServiceCard';
import VideoItem from 'src/components/Videos/VideoItem';
import OtherArticleCard from 'src/components/Articles/OtherArticleCard';
import EncyclopediaCard from 'src/components/Encyclopedias/EncyclopediaCard';
import ListFooter from 'src/components/KsListView/ListFooter.js';

import videoIcon from 'src/assets/icon_car_export@2x.png';
import articleIcon from 'src/assets/icon_art_export@2x.png';
import encycIcon from 'src/assets/icon_ecyc_export@2x.png';

import './Plate.scss';
import Api from 'src/utils/Api';
import Tools from 'src/utils/Tools';

const tabs = [{ title: '介绍' }, { title: '活动' }, { title: '服务' }, { title: '上传' }];

//渲染介绍
const KsIntroduce = props => {
  const { cover, content } = props;
  // 预览公司图片
  const previewCompanyCover = () => {
    if (cover && cover.length) {
      Gallery.open(cover, 0);
    }
  };
  return (
    <div className="business_introduce">
      {cover && cover.length > 0 && (
        <div>
          <div className="business_introduce__gallery">
            <Image
              className="business_introduce__gallery__cover"
              src={cover[0].url}
              onClick={previewCompanyCover}
            />
            {cover.length > 1 && (
              <span className="business_introduce__gallery__count">{cover.length}</span>
            )}
          </div>
        </div>
      )}
      <RichTextView className="business_introduce__text" html={content} />
    </div>
  );
};

//渲染活动
const renderActivity = item => {
  return (
    <div style={{ marginTop: '0.24rem' }}>
      <Link
        className="business_activity"
        to={`/activities/${item.active_id}`}
        key={item.article_id}
      >
        <ActivityCard
          cover={item._covers[0].url}
          title={item.title}
          city={item.district}
          price={item.price}
          ticket={item.stock}
          time={item.show_time}
          tags={null}
          video={item.video}
          hot={item.hot}
        />
      </Link>
    </div>
  );
};
//渲染服务
const renderService = item => {
  return (
    <div style={{ marginTop: '0.24rem' }}>
      <Link className="business_activity" to={`/services/${item.service_id}`} key={item.service_id}>
        <ServiceCard
          cover={item._covers[0].url}
          title={item.title}
          city={item.province}
          price={item.price}
          video={item.video}
          menuPname={item.menu_pname}
          menuName={item.menu_name}
          score={item.score}
          isQuestion={item.is_question === 1}
        />
      </Link>
    </div>
  );
};
//渲染3大上传
const KsUpload = props => {
  useMount(() => {
    fetchVideo();
    fetchArticle();
    fetchEnyec();
  });
  const [state, setState] = useSetState({
    videoData: [],
    articleData: [],
    encycData: [],
    videoMore: false,
    articleMore: false,
    encycMore: false
  });
  const { videoData, articleData, encycData, videoMore, articleMore, encycMore } = state;
  const { uid } = props;
  //获取视频
  const fetchVideo = async () => {
    const res = await Api.post('/other/videos', { uid });
    if (res.data.data.length > 2) {
      setState({ videoMore: true });
    }
    let data = res.data.data.splice(0, 2);
    setState({ videoData: data });
  };
  //获取文章
  const fetchArticle = async () => {
    const res = await Api.post('/other/article', { uid });
    if (res.data.data.length > 2) {
      setState({ articleMore: true });
    }
    res.data.data.forEach(item => {
      item.cover = [];
      item.cover.push({ name: 'img', path: item.image_path });
      item.has_video = item.video_url ? 1 : 0;
    });
    let data = res.data.data.splice(0, 2);
    setState({ articleData: data });
  };
  //获取百科
  const fetchEnyec = async page => {
    const res = await Api.post('/other/encyclopedias', { uid });
    if (res.data.data.length > 2) {
      setState({ encycMore: true });
    }
    res.data.data.forEach(item => {
      item._cover = Tools.resolveAsset(item.cover && item.cover[0]);
      item._tags = item.label_name.split(',').map(name => ({ name }));
    });
    let data = res.data.data.splice(0, 2);

    setState({ encycData: data });
  };
  return (
    <div className="business_upload">
      {videoData.length > 0 && (
        <div className="business_upload_type">
          <div className="business_upload_type_name">
            <img src={videoIcon} alt="" />
            <span className="business_upload_type_title">视频</span>
          </div>
          <div>
            {videoData.map((item, index) => {
              const card = (
                <VideoItem
                  title={item.title}
                  cover={item.cover}
                  nickname={null}
                  views={item.view_num}
                  seconds={item.video_length}
                  date={item.created_at}
                  isCourse={item.is_course}
                />
              );

              return item.is_link ? (
                <a href={item.link} key={index}>
                  {card}
                </a>
              ) : (
                <Link to={`/videos/${item.video_id}`} key={index}>
                  {card}
                </Link>
              );
            })}
          </div>
          {videoMore && (
            <Link to={`/business-upload/${uid}/videos`}>
              <p className="business_upload_type_more">查看更多视频</p>
            </Link>
          )}
          {!videoMore && <p className="business_upload_type_nomore">暂无更多视频～</p>}
        </div>
      )}
      {articleData.length > 0 && (
        <div className="business_upload_type">
          <div className="business_upload_type_name">
            <img src={articleIcon} alt="" />
            <span className="business_upload_type_title">文章</span>
          </div>
          <div>
            {articleData.map((item, index) => {
              const card = (
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
              );

              return item.is_link ? (
                <a href={item.link} key={index}>
                  {card}
                </a>
              ) : (
                <Link to={`/articles/${item.article_id}`} key={index}>
                  {card}
                </Link>
              );
            })}
          </div>
          {articleMore && (
            <Link to={`/business-upload/${uid}/articles`}>
              <p className="business_upload_type_more">查看更多文章</p>
            </Link>
          )}
          {!articleMore && <p className="business_upload_type_nomore">暂无更多文章～</p>}
        </div>
      )}
      {encycData.length > 0 && (
        <div className="business_upload_type">
          <div className="business_upload_type_name">
            <img src={encycIcon} alt="" />
            <span className="business_upload_type_title">百科</span>
          </div>
          <div>
            {encycData.map((item, index) => {
              return (
                <Link to={`/encyclopedias/${item.encyclopedia_id}`} key={item.encyclopedia_id}>
                  <EncyclopediaCard
                    title={item.title}
                    cover={item._cover}
                    tags={item._tags}
                    battery={null}
                    content={item.content}
                  />
                </Link>
              );
            })}
          </div>
          {encycMore && (
            <Link to={`/business-upload/${uid}/encycs`}>
              <p className="business_upload_type_more">查看更多百科</p>
            </Link>
          )}
          {!encycMore && <p className="business_upload_type_nomore">暂无更多百科～</p>}
        </div>
      )}
      <ListFooter
        empty={videoData.length === 0 && articleData.length === 0 && encycData.length === 0}
        hasNext={false}
      />
    </div>
  );
};

const Plate = props => {
  const { data, uid } = props;
  const covers = (data.cover || []).map(item => ({
    url: Tools.resolveAsset(item.path),
    path: Tools.resolveAsset(item.path)
  }));
  //获取商家活动
  const fetchActivity = async page => {
    const data = await Api.post('/other/companie/actives', { uid, page });
    data.data.forEach(elem => {
      elem._start = moment(elem.active_date_start).format('YYYY-MM-DD');
      elem._end = moment(elem.active_date_end).format('YYYY-MM-DD');
      elem._deadline = moment(elem.registration_deadline).format('YYYY-MM-DD');
      elem._expire = moment().isAfter(elem.registration_deadline);
      elem._covers = (elem.pics || []).map(item => ({ url: Tools.resolveAsset(item.path) }));
      elem._video = Tools.resolveAsset(
        Tools.choseVideoQuality(
          elem.video && elem.video[0] && elem.video[0].path,
          elem.video && elem.video[0] && elem.video[0].video_type
        )
      );
      elem._shareDesc = Tools.htmlToText(elem.content, 50);
      elem._shareLogo = elem._covers.length ? elem._covers[0].url : null;
    });
    let res = data.data;
    data.data = {};
    data.data.data = res;
    return data;
  };
  //获取服务
  const fetchService = async page => {
    const data = await Api.post('/other/companie/services', { uid, page });
    data.data.data.forEach(elem => {
      elem._covers = (elem.images || []).map(item => ({ url: Tools.resolveAsset(item.path) }));
      elem._video = Tools.resolveAsset(
        Tools.choseVideoQuality(
          elem.video && elem.video[0] && elem.video[0].path,
          elem.video && elem.video[0] && elem.video[0].video_type
        )
      );
    });
    return data;
  };
  return (
    <div className="other-home-plate">
      <FixedTab tabs={tabs}>
        <KsIntroduce cover={covers} content={data.profile} />
        <KsListView fetchData={fetchActivity} renderRow={renderActivity} useBodyScroll={true} />
        <KsListView fetchData={fetchService} renderRow={renderService} useBodyScroll={true} />
        <KsUpload uid={uid} />
      </FixedTab>
    </div>
  );
};

export default Plate;
