import React from 'react';
import { useSetState } from 'react-use';

import CommentBar from 'src/components/Comments/CommentBar';
import NavBar from 'src/components/Nav/NavBar';
import KsListView from 'src/components/KsListView';
import CommentItem from 'src/components/Comments/CommentItem';

import Api from 'src/utils/Api';
import Tools from 'src/utils/Tools';

const VideoComments = props => {
  const source_id = props.match.params.id;
  const [state, setState] = useSetState({
    total: 0
  });

  const fetchData = async page => {
    const params = {
      source_id,
      page_size: 20,
      page,
      order: 1,
      type: 2
    };
    const res = await Api.post('/answer/list', params);
    setState({ total: res.data.total });
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
    props.history.push(`/videos/${source_id}/reply`);
  };

  return (
    <div>
      <NavBar title="视频评论" />

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

export default VideoComments;
