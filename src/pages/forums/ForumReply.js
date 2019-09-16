import React from 'react';
import { Toast } from 'antd-mobile';

import CommentReply from 'src/components/Comments/CommentReply';

import { FileType, FileSize } from 'src/utils/Constant';
import Api from 'src/utils/Api';

const ArticleReply = props => {
  const contentMax = 200;
  const sourceId = props.match.params.id;

  const handleSubmit = async data => {
    if (!data.content.length) return Toast.info('评论内容不能为空');
    if (data.content.length > contentMax) return Toast.info('评论内容过长');

    const params = {
      content: data.content,
      image: data.files,
      cool_id: sourceId
    };

    Toast.loading('发布中...');
    await Api.post('/web/coolComment/create', params);
    Toast.info('回复成功');
    props.history.goBack();
  };

  return (
    <CommentReply
      contentMax={contentMax}
      onSubmit={handleSubmit}
      fileMax={3}
      fileType={FileType.IMAGE}
      fileSize={FileSize.IMAGE}
      exBtnType="image"
      exBtnText=""
    />
  );
};

export default ArticleReply;
