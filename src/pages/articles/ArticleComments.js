import React from 'react';
import { useSetState } from 'react-use';

import CommentBar from 'src/components/Comments/CommentBar';
import NavBar from 'src/components/Nav/NavBar';
import KsListView from 'src/components/KsListView';
import CommentItem from 'src/components/Comments/CommentItem';

import Api from 'src/utils/Api';
import Tools from 'src/utils/Tools';

const ArticleComments = props => {
  const source_id = props.match.params.id;
  const [state, setState] = useSetState({
    total: 0
  });

  const fetchData = async page => {
    const params = { source_id, page, page_size: 20, type: 2, order: 0 };

    const res = await Api.post('/answer/list', params);
    setState({ total: res.data.total });
    // res.data.current_page = page;
    // res.data.last_page = Math.ceil(res.data.total / params.page_size);
    return res;
  };

  const renderRow = row => {
    return (
      <div style={{ padding: '0 .24rem' }}>
        <CommentItem
          key={row.answer_id}
          uid={row.uid}
          nickname={row.nickname}
          side={Tools.getTimeAgo(row.created_at)}
          attach={row.attachment}
          content={row.content}
        />
      </div>
    );
  };

  const toReply = () => {
    props.history.push(`/articles/${source_id}/reply`);
  };

  return (
    <div className="article-comments">
      <NavBar title="文章评论" />

      <KsListView
        style={{ background: '#fff' }}
        fetchData={fetchData}
        renderRow={renderRow}
        useBodyScroll={true}
      />

      <CommentBar commentsLen={state.total} toReply={toReply} />
    </div>
  );
};

export default ArticleComments;
