import React from 'react';
import { useMount, useSetState } from 'react-use';

import NavBar from 'src/components/Nav/NavBar';
import ForumItem from 'src/components/Forums/ForumItem';
import CommentItem from 'src/components/Comments/CommentItem';
import KsListView from 'src/components/KsListView';
import Card from 'src/components/Card';
import CommentBar from 'src/components/Comments/CommentBar';

import Api from 'src/utils/Api';
import Tools from 'src/utils/Tools';
import Share from 'src/utils/Share';
import './ForumDetail.scss';

const ForumDetail = props => {
  const cool_id = props.match.params.id;
  const [state, setState] = useSetState({
    data: {}
  });

  const fetchDetail = async () => {
    const { data } = await Api.post('/web/cool/getInfo', { cool_id });

    data._avatar = Tools.resolveAsset(data.avatar, '?imageView2/2/w/66/h/66');
    data._date = Tools.getTimeAgo(data.created_at);
    data._meta = data._date + (data.signature ? ' · ' + data.signature : '');
    data._video = Tools.resolveAsset(
      Tools.choseVideoQuality(
        data.videos && data.videos[0] && data.videos[0].path,
        data.videos && data.videos[0] && data.videos[0].video_type
      )
    );
    data._covers = (data.image || []).map(f => Tools.resolveAsset(f.path, '?imageView2/2/w/750'));

    setState({ data });

    // 配置分享信息
    Share.updateShareInfo({
      title: (data.content || '').substring(0, 50),
      desc: data.nickname,
      imgUrl: (data._covers && data._covers[0]) || Tools.getVideoCover(data._video)
    });
  };

  const fetchComments = async page => {
    const res = await Api.post('/web/coolComment/lists', { cool_id, page, pageSize: 10 });
    res.data.data.forEach(item => {
      item._created_at = Tools.getTimeAgo(item.created_at);
    });
    return res;
  };

  const onDelete = () => {
    props.history.goBack();
  };

  const renderComment = item => {
    return (
      <CommentItem
        uid={item.created_id}
        nickname={item.nickname}
        side={item._created_at}
        content={item.content}
        attach={item.image}
      />
    );
  };

  const toReply = () => {
    props.history.push(`/forums/${cool_id}/reply`);
  };

  useMount(() => {
    fetchDetail();
  });

  const commentsCount = state.data.comment_num || 0;

  return (
    <div className="page-forum-detail">
      <NavBar title="酷圈详情" />
      <ForumItem
        key={state.data.cool_id}
        deleteId={state.data.id}
        id={state.data.cool_id}
        avatar={state.data._avatar}
        nickname={state.data.nickname}
        userType={state.data.user_type}
        meta={state.data._meta}
        isFollow={state.data.is_follower}
        uid={state.data.created_id}
        content={state.data.content}
        video={state.data._video}
        covers={state.data._covers}
        battery={state.data.like_num}
        batteryStatus={state.data.voteStatus}
        city={state.data.city}
        msg={null}
        share={true}
        onDelete={onDelete}
      />

      <Card
        className="ks-rec-comment"
        title={`${commentsCount}条评论`}
        empty={!commentsCount}
        emptyStr="暂时没有评论噢~"
      >
        <KsListView useBodyScroll={true} fetchData={fetchComments} renderRow={renderComment} />
      </Card>

      <CommentBar commentsLen={commentsCount} toReply={toReply} toComments={toReply} />
    </div>
  );
};

export default ForumDetail;
