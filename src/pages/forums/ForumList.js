import React, { useRef } from 'react';
import { Link } from 'react-router-dom';

// import HeaderBar from 'src/components/HeaderBar';
// import Drawer from 'src/components/Drawer';
import KsListView from 'src/components/KsListView';
import ForumItem from 'src/components/Forums/ForumItem';
import TabBar from 'src/components/Nav/TabBar';
import NavBar from 'src/components/Nav/NavBar';

import Api from 'src/utils/Api';
import Tools from 'src/utils/Tools';

const ForumList = props => {
  const listRef = useRef();

  const handleToAdd = () => {
    props.history.push('/forums/add');
  };

  const fetchData = async page => {
    const res = await Api.post('/web/cool/lists', { pagSize: 10, page });
    // 格式化数据
    res.data.data.forEach(item => {
      item._avatar = Tools.resolveAsset(item.avatar, '?imageView2/2/w/66/h/66');
      item._date = Tools.getTimeAgo(item.created_at);
      item._meta = item._date + (item.signature ? ' · ' + item.signature : '');
      item._video = Tools.resolveAsset(
        Tools.choseVideoQuality(
          item.videos && item.videos[0] && item.videos[0].path,
          item.videos && item.videos[0] && item.videos[0].video_type
        )
      );
      item._covers = (item.image || []).map(f => Tools.resolveAsset(f.path, '?imageView2/2/w/750'));
    });

    return res;
  };

  const handleDelete = id => {
    const list = listRef.current;
    list.data = list.data.filter(f => f.id !== id);
    list.setState({ dataSource: list.state.dataSource.cloneWithRows(list.data) });
  };

  const renderRow = item => {
    return (
      <Link to={`/forums/${item.cool_id}`} key={item.cool_id}>
        <ForumItem
          deleteId={item.id}
          id={item.cool_id}
          avatar={item._avatar}
          nickname={item.nickname}
          userType={item.user_type}
          meta={item._meta}
          isFollow={item.is_follower}
          uid={item.created_id}
          content={item.content}
          video={item._video}
          covers={item._covers}
          battery={item.like_num}
          batteryStatus={item.vote_status}
          msg={item.answers_count}
          city={item.city}
          onDelete={handleDelete}
        />
      </Link>
    );
  };

  return (
    <div>
      <NavBar
        title="酷圈"
        left={<NavBar.Avatar />}
        right={<NavBar.Icon type="edit" onClick={handleToAdd} />}
      />
      <KsListView
        ref={listRef}
        // auto={false}
        useBodyScroll={true}
        fetchData={fetchData}
        renderRow={renderRow}
      />

      <TabBar />
    </div>
  );
};

export default ForumList;
