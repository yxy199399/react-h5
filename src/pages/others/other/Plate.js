import React from 'react';
import { Link } from 'react-router-dom';

import VideoItem from 'src/components/Videos/VideoItem';
import FixedTab from 'src/components/FixedTab';
import OtherArticleCard from 'src/components/Articles/OtherArticleCard';
// import EncyclopediaCard from 'src/components/Encyclopedias/EncyclopediaCard';
import OtherQuestionCard from 'src/components/Questions/OtherQuestionCard';
import OtherAnswerCard from 'src/components/Answers/OtherAnswerCard';
import KsListView from 'src/components/KsListView';

import './Plate.scss';
import Api from 'src/utils/Api';
import Tools from 'src/utils/Tools';

const tabs = [
  { title: '视频' },
  { title: '文章' },
  // { title: '百科' },
  { title: '问题' },
  { title: '回答' }
];

//渲染视频
const renderVideo = item => {
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
    <a href={item.link} key={item.video_id}>
      {card}
    </a>
  ) : (
    <Link to={`/videos/${item.video_id}`} key={item.video_id}>
      {card}
    </Link>
  );
};

//渲染文章
const renderAirticle = item => {
  // console.log(item)
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
    <a className="ks-listview__card" href={item.content} key={item.article_id}>
      {card}
    </a>
  ) : (
    <Link to={`/articles/${item.article_id}`} className="ks-listview__card" key={item.article_id}>
      {card}
    </Link>
  );
};
//渲染百科
// const renderEnyec = item => {
//   return (
//     <Link
//       className="other-home-plate__enyec"
//       to={`/encyclopedias/${item.encyclopedia_id}`}
//       key={item.encyclopedia_id}
//     >
//       <EncyclopediaCard
//         title={item.title}
//         cover={item._cover}
//         tags={item._tags}
//         battery={null}
//         content={item.content}
//       />
//     </Link>
//   );
// };

// 渲染问题
const renderQuestion = item => {
  return (
    <Link
      className="other-home-plate__question"
      to={`/questions/${item.question_id}`}
      key={item.question_id}
    >
      <OtherQuestionCard
        title={item.title}
        info={item._content}
        battery={item.like_num}
        comments={item.comment_num}
        tags={item._tags}
        date={item._date}
      />
    </Link>
  );
};

// 渲染回答
const renderAnswer = item => {
  return (
    <Link to={`/questions/${item.question_id}`} key={item.question_id}>
      <OtherAnswerCard
        title={item.title}
        info={item._content}
        battery={item.like_num}
        createDate={item._date}
      />
    </Link>
  );
};

const Plate = props => {
  const { uid } = props;

  //获取他人视频
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
  // const fetchEnyec = async page => {
  //   const res = await Api.post('/other/encyclopedias', { uid, page });
  //   res.data.data.forEach(item => {
  //     item._cover = Tools.resolveAsset(item.cover && item.cover[0]);
  //     item._tags = item.label_name.split(',').map(name => ({ name }));
  //   });
  //   return res;
  // };

  const fetchQuestion = async page => {
    const res = await Api.post('/other/questions', { uid, page });
    res.data.data.forEach(item => {
      item._tags = item.label_name.split(',').map(name => ({ name }));
      item._content = Tools.htmlToText(item.content);
      item._date = Tools.getTimeAgo(item.created_at);
    });

    return res;
  };

  const fetchAnswer = async page => {
    const res = await Api.post('/other/answers', { uid, page });
    res.data.data.forEach(item => {
      item._content = Tools.htmlToText(item.answer_content);
      item._date = Tools.getTimeAgo(item.created_at);
    });
    return res;
  };

  return (
    <div className="other-home-plate">
      <FixedTab tabs={tabs}>
        <KsListView fetchData={fetchVideo} renderRow={renderVideo} useBodyScroll={true} />
        <KsListView fetchData={fetchArticle} renderRow={renderAirticle} useBodyScroll={true} />
        {/* <KsListView fetchData={fetchEnyec} renderRow={renderEnyec} useBodyScroll={true} /> */}
        <KsListView fetchData={fetchQuestion} renderRow={renderQuestion} useBodyScroll={true} />
        <KsListView fetchData={fetchAnswer} renderRow={renderAnswer} useBodyScroll={true} />
      </FixedTab>
    </div>
  );
};

export default Plate;
