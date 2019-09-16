import React from 'react';
import { Toast } from 'antd-mobile';

import CommentReply from 'src/components/Comments/CommentReply';

import { ReplyType } from 'src/utils/Constant';
import Api from 'src/utils/Api';

const VideoReply = props => {
  const contentMax = 200;
  const sourceId = props.match.params.id;

  const handleSubmit = async data => {
    if (!data.content.length) return Toast.info('评论内容不能为空');
    if (data.content.length > contentMax) return Toast.info('评论内容过长');

    const params = {
      content: data.content,
      attachment: data.files,
      source_id: sourceId,
      type: ReplyType.VIDEO
    };

    Toast.loading('发布中...');
    await Api.post('/web/answers/create', params);
    Toast.info('回复成功');
    props.history.goBack();
  };

  return <CommentReply contentMax={contentMax} onSubmit={handleSubmit} />;
};

export default VideoReply;
