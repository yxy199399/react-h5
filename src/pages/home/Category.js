import React from 'react';
import { Link } from 'react-router-dom';
import qs from 'qs';

import Drawer from 'src/components/Nav/Drawer';
import KsListView from 'src/components/KsListView';
import ArticleCard from 'src/components/Articles/ArticleCard';
import VideoCard from 'src/components/Videos/VideoCard';
import EncyclopediaCard from 'src/components/Encyclopedias/EncyclopediaCard';
import QuestionCard from 'src/components/Questions/QuestionCard';
import TabBar from 'src/components/Nav/TabBar';
import StickyTabs from 'src/components/Nav/StickyTabs';
import NavBar from 'src/components/Nav/NavBar';

import Api from 'src/utils/Api';
import Tools from 'src/utils/Tools';

const tabs = [
  { title: '综合' },
  { title: '视频' },
  { title: '文章' },
  // { title: '百科' },
  { title: '问题' }
];

const TabPanel = props => {
  return (
    <KsListView renderRow={props.renderRow} fetchData={props.fetchData} useBodyScroll={true} />
  );
};

const Category = props => {
  const query = qs.parse(props.location.search, { ignoreQueryPrefix: true });
  const index = +query.index || 0;
  const folder = query.folder || '';
  const keywords = query.keywords || '';

  // type: 0综合；1文章；2百科；3视频；4问题；默认 0
  const fetchData = type => async page => {
    if (type === 0) {
      const res = await (keywords
        ? Api.post('/search/keywords', { type, page, keywords })
        : Api.get('/index/all', { params: { page, folder } }));
      res.data.data.forEach(item => {
        if (item.type_name === 'question' || item.type_name === 'encyc') {
          item.content = Tools.htmlToText(item.content);
        }
      });
      return res;
    }

    if (type === 1) {
      const res = await (keywords
        ? Api.post('/search/keywords', { type, page, keywords })
        : Api.get('/index/article', { params: { folder, page } }));
      return res;
    }

    if (type === 2) {
      const res = await (keywords
        ? Api.post('/search/keywords', { type, page, keywords })
        : Api.get('/index/encyc', { params: { folder, page } }));
      res.data.data.forEach(item => {
        item.content = Tools.htmlToText(item.content);
      });
      return res;
    }

    if (type === 3) {
      const res = await (keywords
        ? Api.post('/search/keywords', { type, page, keywords })
        : Api.get('/index/video', { params: { folder, page } }));
      return res;
    }

    if (type === 4) {
      const res = await (keywords
        ? Api.post('/search/keywords', { type, page, keywords })
        : Api.get('/index/question', { params: { folder, page } }));
      res.data.data.forEach(item => {
        item.content = Tools.htmlToText(item.content);
      });
      return res;
    }
  };

  // 渲染综合
  const renderMixinRow = (rowData, sectionID, rowID) => {
    switch (rowData.type_name) {
      case 'article':
        return renderArticleRow(rowData, sectionID, rowID);
      case 'video':
        return renderVideoRow(rowData, sectionID, rowID);
      case 'question':
        return renderQuestionRow(rowData, sectionID, rowID);
      case 'encyc':
        return renderEncycRow(rowData, sectionID, rowID);

      default:
        return null;
    }
  };

  // 渲染视频
  const renderVideoRow = (rowData, sectionID, rowID) => {
    let cover = rowData.image && rowData.image[0] && rowData.image[0].path;
    const card = (
      <VideoCard
        uid={rowData.created_id}
        isFollow={rowData.is_follow}
        nickname={rowData.nickname}
        avatar={rowData.avatar}
        userType={rowData.user_type}
        date={rowData.created_at}
        title={rowData.title}
        tags={rowData.tags}
        course={rowData.is_course}
        videoLen={rowData.video_length}
        battery={rowData.like_num}
        cover={cover}
      />
    );

    return rowData.is_link ? (
      <a href={rowData.link} className="ks-listview__card" key={rowData.source_id}>
        {card}
      </a>
    ) : (
      <Link
        className="ks-listview__card"
        to={`/videos/${rowData.source_id}`}
        key={rowData.source_id}
      >
        {card}
      </Link>
    );
  };

  // 渲染文章
  const renderArticleRow = (rowData, sectionID, rowID) => {
    const card = (
      <ArticleCard
        title={rowData.title}
        isCourse={rowData.is_course}
        nickname={rowData.nickname}
        battery={rowData.like_num}
        userType={rowData.user_type}
        covers={rowData.image}
        createDate={rowData.created_at}
        hasVideo={rowData.has_video}
      />
    );

    return rowData.is_link ? (
      <a className="ks-listview__card" href={rowData.link}>
        {card}
      </a>
    ) : (
      <Link to={`/articles/${rowData.source_id}`} className="ks-listview__card">
        {card}
      </Link>
    );
  };

  // 渲染百科
  const renderEncycRow = (rowData, sectionID, rowID) => {
    let cover =
      Tools.resolveAsset(rowData.image && rowData.image[0] && rowData.image[0].path) || '';

    return (
      <Link
        className="ks-listview__card"
        to={`/encyclopedias/${rowData.source_id}`}
        key={rowData.source_id}
      >
        <EncyclopediaCard
          title={rowData.title}
          cover={cover}
          tags={rowData.tags}
          battery={rowData.like_num}
          content={rowData.content}
        />
      </Link>
    );
  };

  // 渲染问题
  const renderQuestionRow = (rowData, sectionID, rowID) => {
    let date = Tools.getTimeAgo(rowData.created_at);
    return (
      <Link
        className="ks-listview__card"
        to={`/questions/${rowData.source_id}`}
        key={rowData.source_id}
      >
        <QuestionCard
          title={rowData.title}
          info={rowData.content}
          battery={rowData.like_num}
          comments={rowData.comment_num}
          tags={rowData.tags}
          date={date}
        />
      </Link>
    );
  };

  // 切换tab
  const onTabChange = (tab, index) => {
    const { history, location } = props;

    history.replace({
      pathname: location.pathname,
      search: qs.stringify({ ...query, index })
    });
  };

  return (
    <Drawer
      title={
        <Link to={`/search?keywords=${keywords}&folder=${folder}`}>
          <NavBar.Search disabled={true} value={keywords} />
        </Link>
      }
    >
      <StickyTabs tabs={tabs} initialPage={index} onChange={onTabChange}>
        {/* 综合 */}
        <TabPanel fetchData={fetchData(0)} renderRow={renderMixinRow} />
        {/* 视频 */}
        <TabPanel fetchData={fetchData(3)} renderRow={renderVideoRow} />
        {/* 文章 */}
        <TabPanel fetchData={fetchData(1)} renderRow={renderArticleRow} />
        {/* 百科 */}
        {/* <TabPanel fetchData={fetchEncycData} renderRow={renderEncycRow} /> */}
        {/* 问题 */}
        <TabPanel fetchData={fetchData(4)} renderRow={renderQuestionRow} />
      </StickyTabs>

      <TabBar />
    </Drawer>
  );
};

export default Category;
