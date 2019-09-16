import React from 'react';
import { Toast } from 'antd-mobile';

import CommentReply from 'src/components/Comments/CommentReply';

import Api from 'src/utils/Api';

const QuestionReply = props => {
  const contentMax = 800;
  const sourceId = props.match.params.id;

  const handleSubmit = async data => {
    if (!data.content.length) return Toast.info('回答内容不能为空');
    if (data.content.length > contentMax) return Toast.info('回答内容过长');

    const params = {
      content: data.content,
      attachment: data.files,
      question_id: sourceId,
      word_num: data.content.length
    };

    Toast.loading('发布中...');
    await Api.post('/questions/add/explain', params);
    Toast.info('回复成功');
    props.history.push('/questions/reply-succ');
  };

  return (
    <CommentReply
      title="写回答"
      placeholder="写下您的回答..."
      contentMax={contentMax}
      onSubmit={handleSubmit}
    />
  );
};

export default QuestionReply;
