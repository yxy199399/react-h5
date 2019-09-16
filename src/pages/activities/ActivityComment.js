import React from 'react';

import NavBar from 'src/components/Nav/NavBar';
import KsListView from 'src/components/KsListView';
import GoodsReview from 'src/components/Comments/GoodsReview';

import Api from 'src/utils/Api';
import Tools from 'src/utils/Tools';

const ActivityComment = props => {
  const sourceId = props.match.params.id;

  const fetchData = async page => {
    const res = await Api.post('/answer/list', {
      source_id: sourceId,
      page_size: 10,
      page,
      type: 2,
      order: 0
    });

    res.data.data.forEach(item => {
      item._date = Tools.getTimeAgo(item.created_at);
      item._album = (item.attachment || []).map(attach => {
        return {
          thumb: Tools.resolveAsset(attach.path, '?imageView2/2/w/200/h/200'),
          path: Tools.resolveAsset(attach.path)
        };
      });
    });

    return res;
  };

  const renderRow = item => {
    return (
      <GoodsReview
        key={item.answer_id}
        nickname={item.nickname}
        score={item.score}
        content={item.content}
        date={item._date}
        album={item._album}
      />
    );
  };

  return (
    <div>
      <NavBar title="活动评论" />
      <div style={{ background: '#fff', padding: '0 .24rem' }}>
        <KsListView useBodyScroll={true} fetchData={fetchData} renderRow={renderRow} />
      </div>
    </div>
  );
};

export default ActivityComment;
