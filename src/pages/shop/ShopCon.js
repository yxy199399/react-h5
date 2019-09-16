import React from 'react';
import NavBar from 'src/components/Nav/NavBar';
import {useSetState, useMount} from 'react-use';
import {Link} from 'react-router-dom';
import {Toast} from 'antd-mobile';
import KsGalleryVideo from '../../components/Videos/KsGalleryVideo';
import StarLevel from '../../components/StarLevel';
import './ShopCon.scss';
import rightUrl from '../../assets/icon_right.png';
import GoodsReview from '../../components/Comments/GoodsReview';
import Api from '../../utils/Api';
import imgAfterSale from '../../assets/after_sale.png';
import RichTextView from '../../components/RichTextView';
import AttachmentPanel from '../../components/Attachment/AttachmentPanel';
import Tools from '../../utils/Tools';
import Share from '../../utils/Share';
import Card from '../../components/Card';
import Image from 'src/components/Image';
import SelectionRule from 'src/components/SelectionRule';

const ShopCon = props => {
  const product_id = props.match.params.id;
  const [state, setState] = useSetState ({
    data: {},
    comments: [],
    likeList: [],
    commentsLen: 0,
    commentsAvg: 0,
    tabTilte: [
      {
        name: '商品介绍',
        type: 0,
      },
      {
        name: '酷耍售后',
        type: 1,
      },
    ],
    activeTab: 0,
    img: '',
    ShowSelectionRule: false,
    onSelectionRule: '',
    ishow: false,
  });
  useMount (() => {
    getData ();
  });
  const getData = async () => {
    const {data} = await Api.get ('/products/detail', {
      params: {product_id},
    });
    let ishow;
    if (data.product_specs.length > 0) {
      let friceprice;
      let lastprice;
      data.product_specs.forEach ((val, key) => {
        if (key === 0) {
          friceprice = val.price;
        }
        if (key + 1 === data.product_specs.length) {
          lastprice = val.price;
        }
      });
      if (friceprice === lastprice) {
        data._price = friceprice;
      } else {
        data._price = friceprice + '-' + lastprice;
      }
      ishow = true;
    } else {
      data._price = data.price;
      ishow = false;
    }
    if (data.config.config_type === 1) {
      data._config_type = 1;
    } else if (data.config.config_type === 2) {
      data._config_type = 2;
    } else if (data.config.config_type === 3) {
      data._config_type = 3;
      data._price = data.config.config_price;
    } else {
      data._config_type = 0;
    }
    data._covers = data.show_picture.map (n => ({
      url: Tools.resolveAsset (n.path, '?imageView2/2/w/750/h/750'),
      name: n.name,
    }));

    data._video = Tools.resolveAsset (
      Tools.choseVideoQuality (
        data.video && data.video[0] && data.video[0].path,
        data.video && data.video[0] && data.video[0].video_type
      )
    );

    setState ({data, ishow});
    Share.updateShareInfo ({
      title: data.title,
      desc: Tools.htmlToText (data.content, 50),
      imgUrl: data._covers && data._covers[0] && data._covers[0].url,
    });
    getlimitData ();
    getlikeList ();
  };
  const getlimitData = async () => {
    const {data, avg} = await Api.post ('/answer/list', {
      page: 1,
      page_size: 10,
      total: 0,
      type: 2,
      source_id: product_id,
    });

    const comments = data.data.map (item => ({
      id: item.answer_id,
      nickname: item.nickname,
      date: Tools.getTimeAgo (item.created_at),
      score: item.score,
      content: item.content,
      album: (item.attachment || []).map (n => ({
        name: n.name,
        thumb: Tools.resolveAsset (n.path, '?imageView2/2/w/200/h/200'),
        path: Tools.resolveAsset (n.path),
      })),
    }));

    setState ({comments, commentsLen: data.total, commentsAvg: avg});
  };
  const checkedtabTitle = async activeTab => {
    setState ({activeTab});
  };
  const getlikeList = async () => {
    const {data} = await Api.get ('/products/possibleLike', {
      params: {product_id},
    });
    data.forEach (item => {
      const path = item.show_picture;
      item._cover = Tools.resolveAsset (path, '?imageView2/2/w/342/h/342');
    });
    setState ({likeList: data});
  };
  const checkedShowSelectionRule = async () => {
    let img;
    state.data._covers.forEach ((val, index) => {
      if (index === 0) {
        img = val.url;
      }
    });
    setState ({img, ShowSelectionRule: true});
  };
  const toCurrenData = async (onSelectionRule, ShowSelectionRule) => {
    setState ({onSelectionRule, ShowSelectionRule});
  };
  const tohidemodel = async ShowSelectionRule => {
    setState ({ShowSelectionRule});
  };

  // 跳转到购物车
  const goCart = () => {
    props.history.push ('/shopping-cart');
  };

  // 添加到购物车
  const addCart = async () => {
    if (
      state.data &&
      state.data.id &&
      state.data.product_specs.length &&
      !state.onSelectionRule
    ) {
      Toast.info ('请先选择商品规格～');
      return;
    }
    let params = {};
    if (!state.data.product_specs.length) {
      // 商品没有规格
      params = {
        product_id: state.data.product_id,
        quantity: 1,
        type: 1,
        isBuy: false,
      };
    } else {
      params = {
        product_id: state.data.product_id,
        quantity: 1,
        type: 1,
        specs: state.onSelectionRule.id,
        isBuy: false,
      };
    }
    const {msg, code} = await Api.post ('/shoppingCart/create', params);
    if (code === 200) {
      Toast.info (msg);
    }
  };

  // 立即购买
  const bugNow = async () => {
    if (
      state.data &&
      state.data.id &&
      state.data.product_specs.length &&
      !state.onSelectionRule
    ) {
      Toast.info ('请先选择商品规格～');
      return;
    }
    let params = {};
    if (!state.data.product_specs.length) {
      // 商品没有规格
      params = {
        product_id: state.data.product_id,
        quantity: 1,
        type: 1,
        isBuy: false,
      };
    } else {
      params = {
        product_id: state.data.product_id,
        quantity: 1,
        type: 1,
        specs: state.onSelectionRule.id,
        isBuy: false,
      };
    }
    const {code, cart_id} = await Api.post ('/shoppingCart/create', params);
    if (code === 200) {
      const {code} = await Api.get ('/shoppingCart/balance', {
        params: {
          cart_id: cart_id,
        },
      });
      if (code === 200) {
        props.history.push ('/pay/settlement');
      }
    }
  };

  return (
    <div className="shop-con">
      <NavBar title="商品详情" />
      <KsGalleryVideo
        key={state.data.id}
        covers={state.data._covers}
        src={state.data._video}
        className="shop-con-gallery"
      />
      {state.data._config_type === 1 || state.data._config_type === 2
        ? <p className="price">
            <span>¥</span>
            {state.onSelectionRule
              ? state.onSelectionRule.price
              : state.data._price}
          </p>
        : state.data._config_type === 3
            ? <div className="hd">
                <div className="left">
                  <div>
                    <i>¥</i>
                    {state.onSelectionRule
                      ? state.onSelectionRule.config.config_price
                      : state.data._price}
                  </div>
                  <div>
                    <p className="Original">
                      ¥
                      {' '}
                      {state.onSelectionRule
                        ? state.onSelectionRule.price
                        : state.data.price}
                    </p>
                    <i className="hdprice">活动价</i>
                  </div>
                </div>
                <i className="shu" />
                <div className="right">
                  <p>
                    {state.data.platform_active.name}
                  </p>
                  <div className="time">
                    距结束
                    <span>
                      29
                    </span>
                    天
                    <span>
                      29
                    </span>
                    时
                    <span>
                      29
                    </span>
                    分
                  </div>
                </div>
              </div>
            : null}
      <div className="shop-con-title">
        {state.data._config_type === 0
          ? <p className="price">
              <span>¥</span>
              {state.onSelectionRule
                ? state.onSelectionRule.price
                : state.data._price}
            </p>
          : null}
        <h1>
          {state.data.title}
        </h1>
        <div className="footer">
          <span className="freight">
            运费：¥{state.data.postage_price}
          </span>
          <span className="salesVolume">
            {state.data.sell_num} 销量
          </span>
        </div>
      </div>
      {state.ishow
        ? <div
            className="shop-con-specification"
            onClick={checkedShowSelectionRule}
          >
            <div className="select">
              已选
            </div>
            {state.onSelectionRule
              ? <div className="chosen">
                  {state.onSelectionRule.title}
                </div>
              : <div className="chosen">
                  请选择
                </div>}

            <p>
              更多选项
              <img src={rightUrl} alt="" />
            </p>
          </div>
        : null}
      <div className="shop-con-merchant">
        {state.data.company
          ? <div className="left">
              <div className="name">
                <div className="nameTitle">
                  {state.data.company.nickname}
                </div>
                <StarLevel score={state.data.company.score} />
                <span>{state.data.company.score}</span>
              </div>
              <div className="title">
                {state.data.company.signature}
              </div>
            </div>
          : null}
        <div className="right">
          <img src={rightUrl} alt="" />
        </div>
      </div>
      <div className="shop-con-evaluation">
        <div className="header">
          <div className="name">
            <div className="nameTitle">
              评价
            </div>
            <StarLevel score={state.data.score} />
            <span>{state.data.score}</span>
          </div>
          <div className="more">
            共
            {state.data.comment_num}
            条评论
            <img src={rightUrl} className="right" alt="" />
          </div>
        </div>
        {state.comments.map (
          (item, key) =>
            key < 3
              ? <GoodsReview
                  key={item.id}
                  nickname={item.nickname}
                  date={item.date}
                  score={item.score}
                  content={item.content}
                  album={item.album}
                />
              : null
        )}
        {state.commentsLen > 3
          ? <div className="seeMore">
              查看全部评价
            </div>
          : null}
        {state.commentsLen <= 0
          ? <div className="empty">
              暂时没有评价哦～
            </div>
          : null}
      </div>
      <div className="shop-con-tab">
        {state.tabTilte.map ((item, key) => (
          <div
            key={'tabTitle' + key}
            className={state.activeTab === item.type ? 'active' : ''}
            onClick={() => checkedtabTitle (item.type)}
          >
            {item.name}
          </div>
        ))}
      </div>
      <div className="shop-con-content">
        {state.activeTab === 0
          ? <div>
              <RichTextView html={state.data.description} />
              {state.data.attachment &&
                state.data.attachment.length > 0 &&
                <AttachmentPanel data={state.data.attachment} />}
            </div>
          : <div>
              <img src={imgAfterSale} alt="" />
            </div>}
      </div>
      <Card title="猜你喜欢" empty={!state.likeList} className="likeListCard">
        {state.likeList.length > 0
          ? <div className="shop-con-likeList">
              {state.likeList.map (item => (
                <Link to={`/ShopCon/${item.product_id}`} key={item.product_id}>
                  <Image src={item._cover} className="cover" />
                  <h4>{item.title}</h4>
                  <div>&yen;{item.price}</div>
                </Link>
              ))}
            </div>
          : null}
      </Card>
      <div className="shop-con-footer">
        <div onClick={() => goCart ()}>
          <i className="car" />
          购物车
        </div>
        <div>
          <i className="share" />
          分享
        </div>
        <div onClick={() => addCart ()} className="addCar font">
          加入购物车
        </div>
        <div onClick={() => bugNow ()} className="gopay font">
          立即购买
        </div>
      </div>
      <SelectionRule
        img={state.img}
        product_specs={state.data.product_specs}
        specification={state.data.specification}
        onSelectionRule={state.data.onSelectionRule}
        showmodel={state.ShowSelectionRule}
        toCurrenData={toCurrenData}
        tohidemodel={tohidemodel}
      />
    </div>
  );
};

export default ShopCon;
