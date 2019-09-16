import React from 'react';
import { useSetState, useMount } from 'react-use';
import cs from 'classnames';

import CommentBar from 'src/components/Comments/CommentBar';
// import Drawer from 'src/components/Drawer';
import NavBar from 'src/components/Nav/NavBar';
import TitlePanel from 'src/components/TitlePanel';
import UserBar from 'src/components/UserBar';
import Attachment from 'src/components/Attachment';
import RecommendComment from 'src/components/Comments/RecommendComment';
import RecommendVideo from 'src/components/Videos/RecommendVideo';
import KsVideo from 'src/components/Videos/KsVideo';
import RichTextView from 'src/components/RichTextView';

import { VoteType } from 'src/utils/Constant';
import Api from 'src/utils/Api';
import Tools from 'src/utils/Tools';
import Share from 'src/utils/Share';
import './VideoDetail.scss';

const VideoDetail = props => {
  useMount(() => {
    fetchVideoInfo(video_id);
    fetchRelationVideos(video_id);
    fetchComments(video_id);
  });

  const video_id = props.match.params.id;
  const [state, setState] = useSetState({
    data: {},
    relationVideos: [],
    comments: [],
    commentsTotal: 0,
    show: true
  });
  const { data, relationVideos, comments, commentsTotal, show } = state;

  /**
   * 获取视频详情
   */
  const fetchVideoInfo = async video_id => {
    const { data } = await Api.post('/videos/info', { video_id });

    data._shareDesc = Tools.htmlToText(data.description, 50);
    // data._shareLogo = Tools.resolveAsset(data.cover);
    data._videoSrc = Tools.resolveAsset(Tools.choseVideoQuality(data.video_url, data.video_type));
    data._videoCover = data.cover
      ? Tools.resolveAsset(data.cover, '?imageView2/2/w/750/h/422')
      : Tools.getVideoCover(data._videoSrc);
    data._videoLen = Tools.getVideoLenStr(data.video_length);
    data._createAt = Tools.getTimeAgo(data.created_at);

    setState({ data });

    // 配置微信分享
    Share.updateShareInfo({
      title: data.title,
      desc: data._shareDesc,
      imgUrl: data._videoCover
    });
  };

  /**
   * 获取相关视频
   */
  const fetchRelationVideos = async video_id => {
    const res = await Api.post('/videos/relation', { video_id });
    setState({ relationVideos: res.data || [] });
  };

  /**
   * 获取评论列表
   */
  const fetchComments = async video_id => {
    const { data } = await Api.post('/answer/list', {
      source_id: video_id,
      page_size: 10,
      page: 1,
      order: 1,
      type: 2
    });
    setState({
      comments: data.data || [],
      commentsTotal: data.total
    });
  };

  /**
   * 展开详情
   */
  const toggleShow = () => {
    setState({ show: !show });
  };

  /**
   * 去评论列表
   */
  const toComments = () => {
    props.history.push(`/videos/${video_id}/comments`);
  };

  /**
   * 去评论
   */
  const toReply = () => {
    props.history.push(`/videos/${video_id}/reply`);
  };

  const resolveLink = link => {
    if (!link) return '';
    if (/^(https?|ftp):\/\//.test(link)) return link;
    return 'http://' + link;
  };

  const hasComp = data.source && data.source.length > 0;
  const hasDesc = !!data.description;
  const hasAttach = data.attachment && data.attachment.length > 0;
  const canFold = hasComp || hasDesc || hasAttach;

  return (
    <div>
      <NavBar title="视频详情" />
      <div className="share-video" key={data.video_id}>
        {/* 头部视频 */}
        <KsVideo
          src={data._videoSrc}
          poster={data._videoCover}
          playBtn={true}
          time={data._videoLen}
          views={data.view_num}
        />

        {/* 标题部分 */}
        <TitlePanel
          titleProps={{ isCourse: data.is_course === 1, title: data.title }}
          tagsProps={{ data: data.label }}
          voteProps={{
            key: data.video_id,
            number: data.like_num,
            status: data.vote_status,
            sourceId: data.video_id,
            type: VoteType.VIDEO
          }}
        />

        {/* 作者和详情 */}
        <div className="share-video__body">
          <UserBar
            avatar={data.avatar || ''}
            nickname={data.nickname}
            userType={data.type}
            side={data._createAt}
            onClick={() => props.history.push(`/users/${data.created_id}`)}
          />

          <div className={cs({ 'share-video__body__hide': !show })}>
            {hasComp && (
              <>
                <h3 className="share-video__body__title">
                  <i className="share-video__icon share-video__icon--tool" />
                  使用的零件/软件
                </h3>
                <nav className="share-video__body__comps">
                  {data.source.map((item, key) => (
                    <a
                      className="share-video__body__comp"
                      key={key}
                      disabled={!item.link}
                      href={resolveLink(item.link)}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {item.name}
                    </a>
                  ))}
                </nav>
              </>
            )}

            {hasAttach && (
              <>
                <h3 className="share-video__body__title">
                  <i className="share-video__icon share-video__icon--label" />
                  附件（{data.attachment.length}）
                </h3>
                <Attachment data={data.attachment} />
              </>
            )}

            {hasDesc && (
              <>
                <h3 className="share-video__body__title">
                  <i className="share-video__icon share-video__icon--edit" />
                  视频介绍
                </h3>
                <RichTextView className="share-video__body__info" html={data.description} />
              </>
            )}
          </div>

          {canFold ? (
            <div
              className={cs('share-video__body__more', {
                'share-video__body__more--active': show
              })}
              onClick={toggleShow}
            >
              {show ? '收起' : '查看更多详情'}
            </div>
          ) : (
            <div style={{ height: '.24rem' }} />
          )}
        </div>

        {/* 推荐评论 */}
        <RecommendComment data={comments} total={commentsTotal} toComments={toComments} />

        {/* 推荐视频 */}
        <RecommendVideo data={relationVideos} />

        {/* 评论条 */}
        <CommentBar
          commentsLen={commentsTotal}
          toComments={toComments}
          toReply={toReply}
          shareBtn={true}
        />
      </div>
    </div>
  );
};

export default VideoDetail;
