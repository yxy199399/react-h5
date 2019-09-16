import React from 'react';

import KsListView from 'src/components/KsListView';
import NavBar from 'src/components/Nav/NavBar';
import GoodsReview from 'src/components/Comments/GoodsReview';
import './GoodsComment.scss';

import Api from 'src/utils/Api';
import Tools from 'src/utils/Tools';

const GoodsComment = props => {
  const sourceId = props.match.params.id;

  const fetchData = async page => {
    const params = { page, page_size: 20, total: 0, type: 2, source_id: sourceId };
    const res = await Api.post('/answer/list', params);

    res.data.data.forEach(item => {
      item._date = Tools.getTimeAgo(item.date);
      item._album = item.attachment.map(n => ({
        name: n.name,
        thumb: Tools.resolveAsset(n.path, '?imageView2/2/w/200/h/200'),
        path: Tools.resolveAsset(n.path)
      }));
    });

    return res;
  };

  const renderRow = item => {
    return (
      <div className="goods-comment__item">
        <GoodsReview
          nickname={item.nickname}
          date={item._date}
          score={item.score}
          content={item.content}
          album={item._album}
        />
      </div>
    );
  };

  return (
    <div className="goods-comment">
      <NavBar title="查看评价" />
      <KsListView fetchData={fetchData} renderRow={renderRow} useBodyScroll={true} />
    </div>
  );
};

export default GoodsComment;
