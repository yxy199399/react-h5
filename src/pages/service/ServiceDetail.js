/*
 * @Author: AMZ
 * @Date: 2019-04-17 14:04:14
 * @Last Modified by: AMZ
 * @Last Modified time: 2019-04-17 18:19:54
 */

import React from 'react';
import { useSetState, useMount } from 'react-use';
import cs from 'classnames';
import Clipboard from '../../components/Clipboard';

import Api from 'src/utils/Api';
import Tools from 'src/utils/Tools';
import Share from 'src/utils/Share';

// import Drawer from 'src/components/Drawer';
import NavBar from 'src/components/Nav/NavBar';
import Tags from 'src/components/Tags';
import KsGalleryVideo from 'src/components/Videos/KsGalleryVideo';
import StickyTabs from 'src/components/Nav/StickyTabs';
import RichTextView from 'src/components/RichTextView';
import AttachmentPanel from 'src/components/Attachment/AttachmentPanel';
import RecommendVideo from 'src/components/Videos/RecommendVideo';
import StarLevel from 'src/components/StarLevel';
import Image from 'src/components/Image';
import Gallery from 'src/components/Gallery';
import GoodsCommentPanel from 'src/components/Comments/GoodsCommentPanel';
import ShareBtn from 'src/components/ShareBtn';

import serviceAttention from 'src/assets/service_attention.png';
import './ServiceDetail.scss';

const ServiceDetail = props => {
  useMount(() => {
    getDetail(service_id);
  });

  let service_id = props.match.params.id;
  service_id.indexOf('&') >= 0 && (service_id = service_id.split('&')[0]);
  const [state, setState] = useSetState({
    data: {},
    merchantInfo: {},
    videos: [],
    comment: [],
    commentTotal: 0
  });

  const { data, videos, merchantInfo, comment, commentTotal } = state;
  const tabs = [{ title: '详情' }, { title: '商户' }, { title: '评价' }, { title: '注意' }];

  // 获取服务详情
  const getDetail = async id => {
    const { data } = await Api.post('/services/getInfo', { service_id: id });
    // console.log(data);
    data._images = (data.images || []).map(item => ({
      url: Tools.resolveAsset(item.path, '?imageView2/2/w/750/h/420')
    }));
    data._video = Tools.resolveAsset(data.video && data.video[0] && data.video[0].path);
    data._tags = (data.tagsname || []).map(item => ({ name: item }));
    data.merchantInfo._cover = (data.merchantInfo.cover || []).map(item => ({
      path: Tools.resolveAsset(item.path)
    }));
    // console.log(data.merchantInfo);
    setState({ data, merchantInfo: data.merchantInfo });
    getRelatedtVideo(data.title, id, data.category_id);
    getSErviceComment(id);

    Share.updateShareInfo({
      title: data.title,
      desc: Tools.htmlToText(data.content, 50),
      imgUrl: data._images && data._images[0] && data._images[0].url
    });
  };

  // 获取相关视频
  const getRelatedtVideo = async (title, uid, cid) => {
    const { data } = await Api.post('/services/relatedServicesVideo', {
      title,
      uid,
      category_id: cid
    });
    // console.log(data);
    setState({ videos: data });
  };

  // 获取服务评价
  const getSErviceComment = async id => {
    const { data } = await Api.post('/answer/list', {
      source_id: id,
      page: 1,
      page_size: 10,
      order: 1,
      type: 2
    });
    // console.log(data);
    const comment = data.data.map(item => {
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
    setState({ comment, commentTotal: data.total });
  };

  // 公司图片预览
  const previewCompanyCover = () => {
    if (merchantInfo._cover && merchantInfo._cover.length) {
      Gallery.open(merchantInfo._cover, 0);
    }
  };

  return (
    <div>
      <NavBar title="服务详情" />
      <div className="service-info">
        {/* 轮播图及视频 */}
        <KsGalleryVideo covers={data._images} src={data._video} />
        {/* 价格及联系商家 */}
        <div className="service-info__price">
          <div className="service-info__price__box">
            <p className="service-info__price__box__shelf">
              <span className="service-info__price__box__shelf__title">酷耍价:</span>
              <span className="service-info__price__box__shelf__specific">
                {data.is_question === 1 ? (
                  <span className="service-info__price__box__shelf__specific__num">咨询商家</span>
                ) : (
                  <>
                    <span className="service-info__price__box__shelf__specific__symbol">&yen;</span>
                    <span className="service-info__price__box__shelf__specific__num">
                      {data.price}
                    </span>
                  </>
                )}
              </span>
            </p>
            <a href={`tel:${data.telphone}`} className="service-info__price__box__button">
              <span className="service-info__price__box__button__img" />
              <span>咨询商家</span>
            </a>
          </div>
        </div>
        {/* 标题 */}
        <div className="service-info__title">
          <div className="service-info__title__txt">{data.title}</div>
          <div className="service-info__title__tags">
            <Tags data={data._tags} warp={true} />
          </div>
        </div>
        {/* 地址 */}
        <div className="service-info__address">
          <div className="service-info__address__detail">
            <span className="service-info__address__detail__symbol" />
            <span className="service-info__address__detail__txt">{data.address}</span>
          </div>
          <span className="service-info__address__line" />
          <Clipboard
            copyText={data.address}
            successText="地址已复制，赶紧去分享吧！"
            errorText="地址复制失败，请手动复制"
          >
            <div className="service-info__address__copy">
              <p className="service-info__address__copy__img" />
              <p className="service-info__address__copy__txt">复制</p>
            </div>
          </Clipboard>
        </div>
        {/* tabs */}
        <StickyTabs tabs={tabs}>
          {/* 详情 */}
          <div className="service-info__details">
            <RichTextView html={data.content} className="service-info__details__txt" />
            {data.attachment && data.attachment.length > 0 && (
              <AttachmentPanel data={data.attachment} />
            )}
          </div>
          {/* 商户 */}
          <div className="service-info__merchant">
            <div className="service-info__merchant__item">
              <h4 className="service-info__merchant__item__title">商户简介</h4>
              <div className="service-info__merchant__item__name">
                <div className="service-info__merchant__item__name__txt">
                  <span onClick={() => props.history.push(`/users/${data.created_id}`)}>
                    {merchantInfo.name}
                  </span>
                  <span
                    className={cs('service-info__merchant__item__name__txt__symbol', {
                      normal: merchantInfo.users_type >= 3
                    })}
                  />
                </div>
                <div className="service-info__merchant__item__name__score">
                  <span className="service-info__merchant__item__name__score__title">
                    商家星级:
                  </span>
                  <div className="service-info__merchant__item__name__score__num">
                    <StarLevel score={merchantInfo.scoreavg} />
                  </div>
                </div>
              </div>
              <div className="service-info__merchant__item__introduce">{merchantInfo.feature}</div>
            </div>
            <div className="service-info__merchant__item">
              <h4 className="service-info__merchant__item__title">图片展示</h4>
              <div className="service-info__merchant__item__pic">
                <Image
                  className="service-info__merchant__item__pic__cover"
                  src={
                    merchantInfo._cover && merchantInfo._cover.length > 0
                      ? merchantInfo._cover[0].path
                      : ''
                  }
                  onClick={previewCompanyCover}
                />
                {merchantInfo._cover && merchantInfo._cover.length > 1 && (
                  <span className="service-info__merchant__item__pic__num">
                    {merchantInfo._cover.length}
                  </span>
                )}
              </div>
            </div>
            <div className="service-info__merchant__item">
              <h4 className="service-info__merchant__item__title">详细介绍</h4>
              <div className="service-info__merchant__item__detail">
                <RichTextView html={merchantInfo.profile} />
              </div>
            </div>
          </div>
          {/* 评价 */}
          <div className="service-info__comment">
            <GoodsCommentPanel
              headerText={`服务评价（${commentTotal}）`}
              footerText={`查看全部 ${commentTotal}条评价`}
              score={data.score}
              data={comment}
              onClickFooter={() => props.history.push(`/service/${service_id}/comments`)}
            />
          </div>
          {/* 注意 */}
          <div className="service-info__attention">
            <img src={serviceAttention} alt="" />
          </div>
        </StickyTabs>
        {/* 相关视频 */}
        <RecommendVideo data={videos} />
        {/* 分享按钮 */}
        <ShareBtn />
      </div>
    </div>
  );
};

export default ServiceDetail;
