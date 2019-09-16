import React from 'react';
import { useSetState } from 'react-use';

import CommentBar from 'src/components/Comments/CommentBar';
import NavBar from 'src/components/Nav/NavBar';
import KsListView from 'src/components/KsListView';
import AnswerCard from 'src/components/Answers/AnswerCard';

import Api from 'src/utils/Api';

const QuestionComments = props => {
  const question_id = props.match.params.id;
  const [state, setState] = useSetState({
    total: 0
  });

  const fetchData = async page => {
    const params = {
      question_id,
      page_size: 20,
      page,
      order: 1,
      type: 2
    };
    const res = await Api.post('/questions/get/explain', params);
    setState({ total: res.data.total });
    return res;
  };

  const renderRow = item => {
    return (
      <AnswerCard
        id={item.explain_id}
        key={item.explain_id}
        uid={item.uid}
        voteStatus={item.vote_status}
        battery={item.like_num}
        message={item.comment_num}
        content={item.content}
        nickname={item.nickname}
        userType={item.type}
        date={item.created_at}
        attach={item.attachment}
      />
    );
  };

  const toReply = () => {
    props.history.push(`/questions/${question_id}/reply`);
  };

  return (
    <div>
      <NavBar title="问题回答" />

      <KsListView
        // style={{ background: '#fff' }}
        fetchData={fetchData}
        renderRow={renderRow}
        useBodyScroll={true}
      />

      <CommentBar type="question" commentsLen={state.total} toReply={toReply} />
    </div>
  );
};

export default QuestionComments;
