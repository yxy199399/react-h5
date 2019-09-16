import React from 'react';
import { useSetState, useMount } from 'react-use';
import './BusinessHome.scss';
import { Toast } from 'antd-mobile';
import backUrl from 'src/assets/icon_jt.png';
import ordUrl from 'src/assets/icon_vip_normal@2x.png'; //普通
import majUrl from 'src/assets/icon_vip_export@2x.png'; //商家
import mrbgUrl from 'src/assets/other_sjbg.png';
import StarLevel from 'src/components/StarLevel';
import Plate from './Plate.js';
import Image from 'src/components/Image';

import Api from 'src/utils/Api';
import Tools from 'src/utils/Tools';

const businessHome = props => {
  const businessUid = props.uid; //获取详情页传过来的商家UID
  useMount(() => {
    fetchBusinessInfo();
    judgeIsFollow();
  });
  const [state, setState] = useSetState({
    data: {}, //商家详情
    isfollow: false //是否关注商家
  });
  const { data, isfollow } = state;
  //私信
  const handleSendNews = () => {
    Toast.info('该功能暂时未开放！');
  };
  //添加关注
  const handlefollow = async () => {
    Api.post('/other/changefollow', { uid: businessUid });
    setState({ isfollow: true });
    Toast.info('关注成功');
  };
  //取消关注
  const handlefollowFalse = async () => {
    Api.post('/other/changefollow', { uid: businessUid });
    setState({ isfollow: false });
    Toast.info('取消关注成功');
  };
  //判断是否关注
  const judgeIsFollow = async () => {
    const data = await Api.post('/other/isfollow', { uid: businessUid });
    if (data.status === 1) {
      setState({ isfollow: true });
    }
  };
  //获取他人详情
  const fetchBusinessInfo = async () => {
    const { data } = await Api.post('/other/companie/info', { uid: businessUid });
    data._background = Tools.resolveAsset(data.background, '?imageView2/2/w/750/h/422') || mrbgUrl;
    data._fans = data.fans;
    data._follower_count = data.follower_count;
    data._avatar = Tools.resolveAsset(data.avatar, '?imageView2/2/w/120/h/120');
    data._signature = data.signature;
    data._score = data.score;
    setState({ data: data });
  };
  return (
    <div className="business_home">
      <div className="business_bg">
        <Image className="business_bg_pic" src={data._background} alt="" />
        <div className="business_bg_back" onClick={props.history.goBack}>
          <img src={backUrl} alt="" />
        </div>
        <div className="business_follow">
          <div className="business_follow_left">
            <p className="business_follow_left_name">学徒</p>
            <p className="business_follow_left_num">{data._fans}</p>
          </div>
          <div className="business_follow_left">
            <p className="business_follow_left_name">燃料</p>
            <p className="business_follow_left_num">{data.fuel}</p>
          </div>
        </div>
      </div>
      <div className="business_info">
        <div className="business_avatar">
          {data.type === 2 && (
            <div className="business_avatar_box_maj">
              <img className="business_avatar_img_maj" src={data._avatar} alt="" />
              <img className="business_avatar_icon" src={majUrl} alt="" />
            </div>
          )}
          {data.type === 3 && (
            <div className="business_avatar_box_ord">
              <img className="business_avatar_img_maj" src={data._avatar} alt="" />
              <img className="business_avatar_icon" src={ordUrl} alt="" />
            </div>
          )}
        </div>
        <p className="business_title">{data.name}</p>
        <div className="business_star">
          <StarLevel score={data._score} />
        </div>
        <p className="business_signature">{data._signature}</p>
        <div className="business_btn">
          <div className="business_btn_left" onClick={handleSendNews}>
            发消息
          </div>
          {!isfollow && (
            <div className="business_btn_right_false" onClick={handlefollow}>
              +关注
            </div>
          )}
          {isfollow && (
            <div className="business_btn_right_true" onClick={handlefollowFalse}>
              已关注
            </div>
          )}
        </div>
      </div>
      <Plate data={state.data} uid={businessUid} />
    </div>
  );
};

export default businessHome;
