import React, { useRef } from 'react';
import { useUnmount } from 'react-use';

import Card from '../Card';
import CommentItem from './CommentItem';

import Tools from '../../utils/Tools';
import './RecommendComment.scss';

const RecommendComment = props => {
  const modalRef = useRef();

  useUnmount(() => {
    modalRef.current && modalRef.current.close();
  });

  // const handleReadMore = () => {
  //   modalRef.current = Tools.alertMissingFeatures();
  // };

  let { total = 0, max = 5, data = [], toComments = () => {} } = props;
  let copyData = max ? data.slice(0, max) : data;

  return (
    <Card
      className="ks-rec-comment"
      title={`${total}条评论`}
      empty={!total}
      emptyStr="暂时没有评论噢~"
    >
      {copyData.map(item => (
        <CommentItem
          key={item.answer_id}
          uid={item.uid}
          nickname={item.nickname}
          side={Tools.getTimeAgo(item.created_at)}
          attach={item.attachment}
          content={item.content}
        />
      ))}
      {data.length > max && (
        <div className="ks-rec-comment__more" onClick={toComments}>{`查看全部${total}条评论`}</div>
      )}
    </Card>
  );
};

export default RecommendComment;
