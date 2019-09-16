import React from 'react';
import { useSetState, useMount } from 'react-use';
import moment from 'moment';
import { Link } from 'react-router-dom';

import ShareBtn from 'src/components/ShareBtn';
import KsGalleryVideo from 'src/components/Videos/KsGalleryVideo';
import Gallery from 'src/components/Gallery';
import AttachmentPanel from 'src/components/Attachment/AttachmentPanel';
import StarLevel from 'src/components/StarLevel';
import NavBar from 'src/components/Nav/NavBar';
import Image from 'src/components/Image';
import Tags from 'src/components/Tags';
import RecommendVideo from 'src/components/Videos/RecommendVideo';
import RichTextView from 'src/components/RichTextView';
import StickyTabs from 'src/components/Nav/StickyTabs';
import GoodsCommentPanel from 'src/components/Comments/GoodsCommentPanel';

import { UserType } from 'src/utils/Constant';
import Api from 'src/utils/Api';
import Tools from 'src/utils/Tools';
import Share from 'src/utils/Share';
import './ActivityDetail.scss';

import imgActivityEquity from 'src/assets/activity_equity.png';

const tabs = [{ title: '介绍' }, { title: '商户' }, { title: '评价' }, { title: '权益' }];

const ActivityDetail = props => {
  useMount(() => {
    fetchActivityData(active_id);
  });

  const active_id = props.match.params.id;
  const [state, setState] = useSetState({
    data: {},
    videos: [],
    comments: [],
    commentsTotal: 0,
    commentsAvg: 0,
    company: {},
    carouselIndex: 0
  });

  // 获取活动详情
  const fetchActivityData = async active_id => {
    const { data } = await Api.get('/actives/detail', { params: { active_id } });

    data._start = moment(data.active_date_start).format('YYYY-MM-DD');
    data._end = moment(data.active_date_end).format('YYYY-MM-DD');
    data._deadline = moment(data.registration_deadline).format('YYYY-MM-DD');
    data._expire = moment().isAfter(data.registration_deadline);
    data._covers = (data.pics || []).map(item => ({
      url: Tools.resolveAsset(item.path, '?imageView2/2/w/750/h/420')
    }));
    data._video = Tools.resolveAsset(
      Tools.choseVideoQuality(data.video && data.video[0] && data.video[0].path, data.video_type)
    );
    data._shareDesc = Tools.htmlToText(data.content, 50);
    data._shareLogo = data._covers.length ? data._covers[0].url : null;

    setState({ data });

    Share.updateShareInfo({
      title: data.title,
      desc: data._shareDesc,
      imgUrl: data._shareLogo
    });

    fetchCompany(active_id);
    fetchComments(active_id);
    fetchVideos(active_id);
  };

  // 获取相关视频
  const fetchVideos = async active_id => {
    const { data } = await Api.get('/actives/relatedActivesVideo', { params: { active_id } });
    const videos = data.map(item => ({
      video_id: item.video_id,
      title: item.title,
      cover: (item.image && item.image[0] && item.image[0].path) || '',
      view_num: item.view_num,
      video_length: item.video_length
    }));

    setState({ videos });
  };

  // 获取公司信息
  const fetchCompany = async active_id => {
    const { data } = await Api.get('/actives/company', { params: { active_id } });

    data._cover = (data.cover || []).map(item => ({
      url: Tools.resolveAsset(item.path, '?imageView2/2/w/750'),
      path: Tools.resolveAsset(item.path)
    }));

    setState({ company: data });
  };

  // 获取评论
  const fetchComments = async source_id => {
    const { data, avg } = await Api.post('/answer/list', {
      source_id,
      page_size: 10,
      page: 1,
      type: 2,
      order: 0
    });

    const commentsTotal = data.total;
    const commentsAvg = avg;
    const comments = data.data.map(item => {
      return {
        id: item.answer_id,
        nickname: item.nickname,
        score: item.score,
        content: item.content,
        date: Tools.getTimeAgo(item.created_at),
        album: (item.attachment || []).map(attach => {
          return {
            thumb: Tools.resolveAsset(attach.path, '?imageView2/2/w/200/h/200'),
            path: Tools.resolveAsset(attach.path)
          };
        })
      };
    });

    setState({ commentsTotal, comments, commentsAvg });
  };

  // 预览公司图片
  const previewCompanyCover = () => {
    if (state.company._cover && state.company._cover.length) {
      Gallery.open(state.company._cover, 0);
    }
  };

  return (
    <div>
      <NavBar title="活动详情" />
      <div className="activity-detail">
        {/* 轮播和视频 */}
        <KsGalleryVideo covers={state.data._covers} src={state.data._video} />

        {/* 主面板 */}
        <div className="activity-detail__panel-main">
          <header className="activity-detail__panel-main__header">
            <div className="activity-detail__panel-main__price">
              酷耍价：<small>&yen;</small>
              <em>{state.data.price}&nbsp;</em>
            </div>
            <Link
              to={{ pathname: `/pay/activities`, search: `id=${active_id}` }}
              className="activity-detail__panel-main__btn"
              disabled={state.data._expire}
            >
              {state.data._expire ? '已经过期' : '立即报名'}
            </Link>
          </header>
          <h2 className="activity-detail__panel-main__title">{state.data.title}</h2>
          <footer className="activity-detail__panel-main__footer">
            <Tags data={state.data.tags} warp={true} />
            <div className="activity-detail__panel-main__sales">已售 {state.data.sale_num}</div>
          </footer>
        </div>

        {/* 次面板 */}
        <div className="activity-detail__panel-sub">
          <header className="activity-detail__panel-sub__header">
            <div className="activity-detail__panel-sub__date">
              <span className="activity-detail__panel-sub__date__label">开始时间：</span>
              <em className="activity-detail__panel-sub__date__cont">{state.data._start}</em>
            </div>
            <div className="activity-detail__panel-sub__date">
              <span className="activity-detail__panel-sub__date__label">结束时间：</span>
              <em className="activity-detail__panel-sub__date__cont">{state.data._end}</em>
            </div>
            <div className="activity-detail__panel-sub__date">
              <span className="activity-detail__panel-sub__date__label">报名截止时间：</span>
              <em className="activity-detail__panel-sub__date__cont">{state.data._deadline}</em>
            </div>
          </header>
          <footer className="activity-detail__panel-sub__footer">
            <i className="activity-detail__panel-sub__footer__icon" />
            <p className="activity-detail__panel-sub__footer__address">{state.data.address}</p>
            <a
              href={`tel:${state.data.telphone}`}
              className="activity-detail__panel-sub__footer__phone"
            >
              {state.data.telphone}
            </a>
          </footer>
        </div>

        {/* tabs */}
        <StickyTabs tabs={tabs}>
          {/* 介绍 */}
          <div className="activity-detail__info">
            <RichTextView className="activity-detail__info__rich" html={state.data.content} />
            {state.data.attachment && state.data.attachment.length > 0 && (
              <AttachmentPanel data={state.data.attachment} />
            )}
          </div>

          {/* 商户 */}
          <div className="activity-detail__vendors">
            <h4 className="activity-detail__vendors__title">商户简介</h4>
            <div className="activity-detail__vendors__intro">
              <header className="activity-detail__vendors__intro__user">
                <span
                  className="activity-detail__vendors__intro__user__nick"
                  onClick={() => props.history.push(`/users/${state.company.uid}`)}
                >
                  {state.company.nickname}
                </span>
                {state.company.user_type === UserType.BUSINESS && (
                  <i className="activity-detail__vendors__intro__user__kip" />
                )}
                {state.company.user_type === UserType.PROFESSIONAL && (
                  <i className="activity-detail__vendors__intro__user__kip activity-detail__vendors__intro__user__kip--sel" />
                )}
                <div className="activity-detail__vendors__intro__user__level">商家星级：</div>
                <StarLevel score={state.company.score} />
              </header>
              <RichTextView
                className="activity-detail__vendors__text"
                html={state.company.feature}
              />
            </div>
            {state.company._cover && state.company.cover.length > 0 && (
              <>
                <h4 className="activity-detail__vendors__title">图片展示</h4>
                <div className="activity-detail__vendors__gallery">
                  <Image
                    className="activity-detail__vendors__gallery__cover"
                    src={state.company._cover[0].url}
                    onClick={previewCompanyCover}
                  />
                  {state.company.cover.length > 1 && (
                    <span className="activity-detail__vendors__gallery__count">
                      {state.company._cover.length}
                    </span>
                  )}
                </div>
              </>
            )}
            <h4 className="activity-detail__vendors__title">详细介绍</h4>
            <RichTextView className="activity-detail__vendors__text" html={state.company.profile} />
          </div>

          {/* 评价 */}
          <div className="activity-detail__comments">
            <GoodsCommentPanel
              headerText={`活动评价（${state.commentsTotal}）`}
              footerText={`查看全部 ${state.commentsTotal}条评价`}
              score={state.commentsAvg}
              data={state.comments}
              onClickFooter={() => props.history.push(`/activities/${active_id}/comments`)}
            />
          </div>

          {/* 权益 */}
          <div className="activity-detail__equity">
            <img src={imgActivityEquity} alt="" />
          </div>
        </StickyTabs>

        {/* 相关视频 */}
        <RecommendVideo data={state.videos} />

        {/* 分享按钮 */}
        <ShareBtn />
      </div>
    </div>
  );
};

export default ActivityDetail;
