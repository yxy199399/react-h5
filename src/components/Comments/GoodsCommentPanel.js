import React from 'react';

import StarLevel from 'src/components/StarLevel';
import GoodsReview from 'src/components/Comments/GoodsReview';

import './GoodsCommentPanel.scss';

const GoodsCommentPanel = props => {
  const { score = 0, max = 5, data = [], headerText, footerText, onClickFooter = () => {} } = props;

  const limitData = max ? data.slice(0, max) : data;

  return (
    <div className="ks-goods-comment">
      <header className="ks-goods-comment-header">
        <div className="ks-goods-comment-header__title">{headerText}</div>
        <div className="ks-goods-comment-header__side">
          综合星级：
          <StarLevel score={score} />
        </div>
      </header>

      {data.length > 0 ? (
        <>
          <div className="ks-goods-comment-list">
            {limitData.map(item => (
              <GoodsReview
                key={item.id}
                nickname={item.nickname}
                date={item.date}
                score={item.score}
                content={item.content}
                album={item.album}
              />
            ))}
          </div>
          {data.length > max && (
            <footer className="ks-goods-comment-footer" onClick={onClickFooter}>
              {footerText}
            </footer>
          )}
        </>
      ) : (
        <p className="ks-goods-comment-empty">暂时没有评价哦～</p>
      )}
    </div>
  );
};

export default GoodsCommentPanel;
