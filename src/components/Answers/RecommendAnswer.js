import './RecommendAnswer.scss';
import React from 'react';
import cs from 'classnames';

import Card from '../Card';
import AnswerCard from './AnswerCard';

const RecommendAnswer = props => {
  const handleReadMore = () => {
    toComments();
  };

  let { total = 0, max = 5, data = [], toComments = () => {}, className, ...rest } = props;

  if (!data || data.length === 0) {
    return <Card title="0条回答" empty={true} />;
  }

  return (
    <div className={cs('ks-rec-answer', className)} {...rest}>
      <div className="ks-rec-answer__body">
        {data.map((item, key) => (
          <AnswerCard
            key={item.explain_id}
            id={item.explain_id}
            uid={item.uid}
            title={key === 0 ? `${total}条回答` : null}
            voteStatus={item.vote_status}
            battery={item.like_num}
            message={item.comment_num}
            content={item.content}
            nickname={item.nickname}
            userType={item.type}
            date={item.created_at}
            attach={item.attachment}
          />
        ))}
      </div>
      {total > max && (
        <Card className="ks-rec-answer__more" onClick={handleReadMore}>
          查看全部 {total}条回答
        </Card>
      )}
    </div>
  );
};

export default RecommendAnswer;
