import React from 'react';
import cs from 'classnames';
import { useSetState, useMount } from 'react-use';

// import ShareBtn from 'src/components/ShareBtn';
// import Drawer from 'src/components/Drawer';
import NavBar from 'src/components/Nav/NavBar';
import Title from 'src/components/Title';
import Tags from 'src/components/Tags';
import UserBar from 'src/components/UserBar';
import Vote from 'src/components/Vote';
import Attachment from 'src/components/Attachment';
import RecommendComment from 'src/components/Comments/RecommendComment';
import KsVideo from 'src/components/Videos/KsVideo';
import RichTextView from 'src/components/RichTextView';
import Image from 'src/components/Image';
import CommentBar from 'src/components/Comments/CommentBar';

import { VoteType } from 'src/utils/Constant';
import Api from 'src/utils/Api';
import Tools from 'src/utils/Tools';
import Share from 'src/utils/Share';
import './ArticleDetail.scss';

const ArticleDetail = props => {
  useMount(() => {
    fetchArticleInfo(article_id);
  });

  const article_id = props.match.params.id;
  const [state, setState] = useSetState({
    data: {},
    showAttach: false,
    comments: [],
    commentsTotal: 0
  });
  const { data, showAttach, comments, commentsTotal } = state;

  /**
   * 获取文章详情
   */
  const fetchArticleInfo = async article_id => {
    const { data } = await Api.post('/article/info', { article_id });

    data._shareDesc = Tools.htmlToText(data.content, 50);
    data._shareLogo = Tools.resolveAsset(data.image_path, '?imageView2/2/w/200/h/200');
    data._createAt = Tools.getTimeAgo(data.created_at);
    data._cover = Tools.resolveAsset(data.image_path, '?imageView2/2/w/750/h/422');
    data._videoSrc = Tools.resolveAsset(Tools.choseVideoQuality(data.video_url, data.video_type));
    data._avatar = Tools.resolveAsset(data.avatar, '?imageView2/2/w/66/h/66');

    setState({ data });

    // 配置微信分享
    Share.updateShareInfo({
      title: data.title,
      desc: data._shareDesc,
      imgUrl: data._shareLogo
    });

    // 请求评论
    fetchArticleComment(article_id);
  };

  /**
   * 获取文章评论
   */
  const fetchArticleComment = async source_id => {
    const { data } = await Api.post('/answer/list', {
      source_id,
      page_size: 10,
      page: 1,
      type: 2,
      order: 0
    });

    setState({ comments: data.data || [], commentsTotal: data.total });
  };

  /**
   * 显示附件
   */
  const handleToggleShowAttach = () => {
    setState({ showAttach: !showAttach });
  };

  /**
   * 跳转评论列表
   */
  const toComments = () => {
    props.history.push(`/articles/${article_id}/comments`);
  };

  /**
   * 去评论
   */
  const toReply = () => {
    props.history.push(`/articles/${article_id}/reply`);
  };

  return (
    <div>
      <NavBar title="文章详情" />
      <div>
        <div className="share-article">
          {/* banner */}
          <div className="share-article-banner">
            <Image className="share-article-banner__cover" src={data._cover} />
            <div className="share-article-banner__body">
              <div className="share-article-banner__title">
                <Title isCourse={data.is_course === 1} title={data.title} />
              </div>
              <div className="share-article-banner__tags">
                <Tags data={data.label} type="light" warp={true} />
              </div>
            </div>
          </div>

          {/* 标题和用户信息 */}
          <div className="share-article-header">
            <div className="share-article-header__box">
              <UserBar
                avatar={data._avatar}
                nickname={data.nickname}
                side={data._createAt}
                userType={data.type}
                onClick={() => props.history.push(`/users/${data.created_id}`)}
              />
              <Vote
                key={data.article_id}
                number={data.like_num}
                status={data.vote_status}
                type={VoteType.ARTICLE}
                sourceId={data.article_id}
              />
            </div>
          </div>

          {/* 视频播放 */}
          {data._videoSrc && (
            <KsVideo
              className="share-article-video"
              src={data._videoSrc}
              poster={data._cover}
              // views={data.view_num}
            />
          )}

          {/* 文章描述 */}
          <RichTextView className="share-article-body" html={data.content} />

          {/* 附件 */}
          {data.attachment && data.attachment.length > 0 && (
            <div
              className={cs('share-article-attach', { 'share-article-attach--show': showAttach })}
            >
              <div className="share-article-attach__header" onClick={handleToggleShowAttach}>
                <h3 className="share-article-attach__title">附件（{data.attachment.length}）</h3>
                <i className="share-article-attach__arrow" />
              </div>
              <div className="share-article-attach__body">
                <Attachment data={data.attachment} />
              </div>
            </div>
          )}
        </div>

        {/* 评论列表 */}
        <RecommendComment data={comments} total={commentsTotal} toComments={toComments} />

        {/* 评论条 */}
        <CommentBar
          commentsLen={commentsTotal}
          toReply={toReply}
          toComments={toComments}
          shareBtn={true}
        />
      </div>
    </div>
  );
};

export default ArticleDetail;
