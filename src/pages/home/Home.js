import React from 'react';
import { Link } from 'react-router-dom';

import KsListView from 'src/components/KsListView';
import VideoCard from 'src/components/Videos/VideoCard';
import TabBar from 'src/components/Nav/TabBar';
import Drawer from 'src/components/Nav/Drawer';
import NavBar from 'src/components/Nav/NavBar';

import Api from 'src/utils/Api';
import Tools from 'src/utils/Tools';

const Home = props => {
  const fetchData = page => {
    return Api.get('/index/home', { params: { page, random: Tools.getRandomInt(1000, 2000) } });
  };

  const renderRow = rowData => {
    let cover = rowData.cover && rowData.cover[0] && rowData.cover[0].path;
    const card = (
      <VideoCard
        theme="circle"
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
      <a href={rowData.link} key={rowData.video_id}>
        {card}
      </a>
    ) : (
      <Link
        style={{ display: 'block', margin: '.24rem 0' }}
        to={`/videos/${rowData.video_id}`}
        key={rowData.video_id}
      >
        {card}
      </Link>
    );
  };

  return (
    <div>
      <Drawer
        title={
          <Link to="/search">
            <NavBar.Search disabled={true} />
          </Link>
        }
      >
        <KsListView
          // auto={false}
          useBodyScroll={true}
          fetchData={fetchData}
          renderRow={renderRow}
        />

        <TabBar />
      </Drawer>
    </div>
  );
};

export default Home;
