import React from 'react';
import { useSetState, useMount } from 'react-use';
import { Link } from 'react-router-dom';

import Image from 'src/components/Image';
import ShareBtn from 'src/components/ShareBtn';
import NavBar from 'src/components/Nav/NavBar';
import Tags from 'src/components/Tags';
import KsGalleryVideo from 'src/components/Videos/KsGalleryVideo';
import StickyTabs from 'src/components/Nav/StickyTabs';
import Card from 'src/components/Card';
import AttachmentPanel from 'src/components/Attachment/AttachmentPanel';
import RichTextView from 'src/components/RichTextView';
import GoodsCommentPanel from 'src/components/Comments/GoodsCommentPanel';
import UserBar from 'src/components/UserBar';

import Api from 'src/utils/Api';
import imgAfterSale from 'src/assets/after_sale.png';
import Tools from 'src/utils/Tools';
import Share from 'src/utils/Share';
import './GoodsDetail.scss';

const tabs = [{ title: '详情' }, { title: '评价' }, { title: '售后' }];

const MallDetail = props => {
  const sourceId = props.match.params.id;
  const [state, setState] = useSetState({
    data: {},
    comments: [],
    commentsLen: 0,
    commentsAvg: 0,
    related: []
  });

  // 获取详情
  const fetchDetail = async () => {
    const { data } = await Api.post('/goods/info', { asin: sourceId });
    data._avatar = Tools.resolveAsset(data.avatar, '?imageView2/2/w/66/h/66');
    data._createdAt = Tools.getTimeAgo(data.created_at);
    data._postFrom = data.city ? ' · 发布于' + data.city : '';
    data._meta = data._createdAt + data._postFrom;
    data._tags = (data.tagsname || '').split(',').map(name => ({ name }));
    data._covers = data.show_picture.map(n => ({
      url: Tools.resolveAsset(n.path, '?imageView2/2/w/750/h/750'),
      name: n.name
    }));
    data._video = Tools.resolveAsset(
      Tools.choseVideoQuality(
        data.video && data.video[0] && data.video[0].path,
        data.video && data.video[0] && data.video[0].video_type
      )
    );

    setState({ data });

    Share.updateShareInfo({
      title: data.title,
      desc: Tools.htmlToText(data.content, 50),
      imgUrl: data._covers && data._covers[0] && data._covers[0].url
    });

    fetchComment();
    fetchRelated(sourceId, data.title, data._tags.map(n => n.name));
  };

  // 获取评论
  const fetchComment = async () => {
    const { data, avg } = await Api.post('/answer/list', {
      page: 1,
      page_size: 10,
      total: 0,
      type: 2,
      source_id: sourceId
    });

    const comments = data.data.map(item => ({
      id: item.answer_id,
      nickname: item.nickname,
      date: Tools.getTimeAgo(item.created_at),
      score: item.score,
      content: item.content,
      album: (item.attachment || []).map(n => ({
        name: n.name,
        thumb: Tools.resolveAsset(n.path, '?imageView2/2/w/200/h/200'),
        path: Tools.resolveAsset(n.path)
      }))
    }));

    setState({ comments, commentsLen: data.total, commentsAvg: avg });
  };

  // 相关商品
  const fetchRelated = async (asin, title, tags) => {
    const params = { asin, title, tags: tags.length ? tags : null };
    const { data } = await Api.post('/goods/relatedGoods', params);
    data.forEach(item => {
      const path = item.show_picture && item.show_picture[0] && item.show_picture[0].path;
      item._cover = Tools.resolveAsset(path, '?imageView2/2/w/342/h/342');
    });
    setState({ related: data });
  };

  // 加入购物车
  const addToCart = async () => {
    const params = {
      product_id: sourceId,
      quantity: 1,
      type: 2
    };
    await Api.post('/shoppingCart/create', params);
    props.history.push('/shopping-cart');
  };

  useMount(() => {
    fetchDetail();
  });

  return (
    <div>
      <NavBar title="淘货" />
      <div className="goods-detail">
        <div
          className="goods-detail-userbar"
          onClick={() => props.history.push(`/users/${state.data.created_id}`)}
        >
          <UserBar
            avatar={state.data._avatar}
            nickname={state.data.nickname}
            userType={state.data.user_type}
            meta={state.data._meta}
            score={state.data.useravg}
          />
        </div>

        <section className="goods-detail-header">
          <header className="goods-detail-header__hd">
            <span className="goods-detail-header__hd__price">&yen; {state.data.price}</span>
            <div className="goods-detail-header__hd__btn" onClick={addToCart}>
              加入购物车
            </div>
          </header>
          <h3 className="goods-detail-header__title">{state.data.title}</h3>
          <Tags data={state.data._tags} />
        </section>

        <KsGalleryVideo
          key={state.data.id}
          covers={state.data._covers}
          src={state.data._video}
          className="goods-detail-gallery"
        />

        <div className="goods-detail-tabs">
          <StickyTabs tabs={tabs} page={0}>
            {/* 详情 */}
            <div>
              <div className="goods-detail-desc">
                <RichTextView html={state.data.content} />
              </div>
              {state.data.attachment && state.data.attachment.length > 0 && (
                <AttachmentPanel data={state.data.attachment} />
              )}
            </div>

            {/* 评论 */}
            <div>
              <GoodsCommentPanel
                headerText={`全部(${state.commentsLen})`}
                footerText={`查看全部 ${state.commentsLen}条评价`}
                score={state.commentsAvg}
                data={state.comments}
                onClickFooter={() => props.history.push(`/goods/${sourceId}/comments`)}
              />
            </div>

            {/* 售后 */}
            <div className="goods-detail-after-sale">
              <img src={imgAfterSale} alt="" />
            </div>
          </StickyTabs>
        </div>

        <Card className="goods-detail-related" title="挖货" empty={!state.related.length}>
          <div className="goods-detail-related__list">
            {state.related.map(item => (
              <Link
                to={`/goods/${item.asin}`}
                key={item.asin}
                className="goods-detail-related__item"
              >
                <Image className="goods-detail-related__cover" src={item._cover} />
                <h4 className="goods-detail-related__title">{item.title}</h4>
                <div className="goods-detail-related__price">&yen;{item.price}</div>
              </Link>
            ))}
          </div>
        </Card>

        <ShareBtn />
      </div>
    </div>
  );
};

export default MallDetail;
