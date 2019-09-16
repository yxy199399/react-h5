import React, { useRef, useEffect } from 'react';
import { useSetState, useMount } from 'react-use';
import cs from 'classnames';

import CommentBar from 'src/components/Comments/CommentBar';
// import Drawer from 'src/components/Drawer';
import NavBar from 'src/components/Nav/NavBar';
import TitlePanel from 'src/components/TitlePanel';
import AttachmentPanel from 'src/components/Attachment/AttachmentPanel';
import RecommendAnswer from 'src/components/Answers/RecommendAnswer';
import RichTextView from 'src/components/RichTextView';
import KsVideo from 'src/components/Videos/KsVideo';

import { VoteType } from 'src/utils/Constant';
import Share from 'src/utils/Share';
import Api from 'src/utils/Api';
import Tools from 'src/utils/Tools';
import './QuestionDetail.scss';
import { useStore } from 'easy-peasy';

const QuestionDetail = props => {
  const descRef = useRef();
  const auth = useStore(store => store.auth);
  const question_id = props.match.params.id;
  const [state, setState] = useSetState({
    data: {},
    comments: [],
    commentsTotal: 0,
    needFold: true,
    fold: true
  });
  const { data, comments, commentsTotal, fold, needFold } = state;

  /**
   * 获取问题详情
   */
  const fetchQuestionInfo = async question_id => {
    const { data } = await Api.post('/questions/questionsInfo', { question_id });

    data._content = Tools.htmlToText(data.content, 50);
    // data._video = data.video_url && data.video_url[0] && data.video_url[0].path;
    data._video = Tools.resolveAsset(
      Tools.choseVideoQuality(
        data.video_url && data.video_url[0] && data.video_url[0].path,
        data.video_url && data.video_url[0] && data.video_url[0].video_type
      )
    );
    data._cover = data._video ? Tools.getVideoCover(data._video) : '';
    data._tags = (data.tagsname || '')
      .split(',')
      .filter(i => i)
      .map(i => ({ name: i }));

    setState({ data });

    // 配置微信分享
    Share.updateShareInfo({
      title: data.title,
      desc: data._content,
      imgUrl: data._cover
    });

    fetchQuestionComment(question_id);
  };

  /**
   * 获取问题答案
   */
  const fetchQuestionComment = async question_id => {
    const { data } = await Api.post('/questions/get/explain', {
      question_id,
      page_size: 5,
      page: 1,
      order: 1,
      type: 2
    });

    setState({ comments: data.data, commentsTotal: data.total });
  };

  /**
   * 展开描述
   */
  const openDesc = () => {
    if (auth.isLogin) {
      setState({ fold: false });
    } else {
      props.history.push({ pathname: '/login', state: { from: props.location } });
    }
  };

  const toComments = () => {
    props.history.push(`/questions/${question_id}/comments`);
  };

  const toReply = () => {
    props.history.push(`/questions/${question_id}/reply`);
  };

  useMount(() => {
    fetchQuestionInfo(question_id);
  });

  useEffect(() => {
    const ctr = descRef.current;
    setState({ needFold: ctr.offsetHeight < ctr.scrollHeight });
  }, [state.data]);

  return (
    <div>
      <NavBar title="问题详情" />
      <div className="share-question">
        {/* 标题 */}
        <TitlePanel
          titleProps={{ title: data.title }}
          tagsProps={{ data: data._tags }}
          voteProps={{
            key: data.question_id,
            number: data.like_num,
            status: data.vote_status,
            type: VoteType.QUESTION,
            sourceId: data.question_id
          }}
        />

        <div className="share-question-bg">
          {/* 视频 */}
          {!!data._video && (
            <KsVideo className="share-question-video" src={data._video} poster={data._cover} />
          )}

          {/* 描述 */}
          <div
            ref={descRef}
            className={cs({
              'share-question-info': true,
              'share-question-info--show': !fold
            })}
          >
            <RichTextView html={data.content} />
          </div>
          {needFold && fold && (
            <div className="share-question-info-more" onClick={openDesc}>
              展开描述
            </div>
          )}

          {/* 附件 */}
          {data.attachment && data.attachment.length > 0 && (
            <AttachmentPanel data={data.attachment} />
          )}
        </div>

        {/* 回答列表 */}
        <RecommendAnswer total={commentsTotal} data={comments} toComments={toComments} />

        {/* 评论条 */}
        <CommentBar
          type="question"
          commentsLen={commentsTotal}
          toComments={toComments}
          toReply={toReply}
          shareBtn={true}
        />
      </div>
    </div>
  );
};

export default QuestionDetail;
