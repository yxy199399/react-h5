import React from 'react';
import { useSetState, useMount } from 'react-use';
import { Toast } from 'antd-mobile';

import stuUrl from 'src/assets/icon_student@2x.png';
import teaUrl from 'src/assets/icon_teacher@2x.png';
import porUrl from 'src/assets/icon_like@2x.png';
import mrbgUrl from 'src/assets/other_mrbg.png';

import Image from 'src/components/Image';
import NavBar from 'src/components/Nav/NavBar';
import Avatar from 'src/components/Avatar';

import './OtherHome.scss';
import Plate from './Plate.js';
import Api from 'src/utils/Api';
import Tools from 'src/utils/Tools';

const otherHome = props => {
  const otherUid = props.uid;
  useMount(() => {
    fetchOtherInfo(otherUid);
    judgeIsFollow();
  });
  const [state, setState] = useSetState({
    data: {},
    isfollow: false
  });
  const { data, isfollow } = state;
  const handleSendNews = () => {
    Toast.info('该功能暂时未开放！');
  };
  //添加关注
  const handlefollow = async () => {
    await Api.post('/other/changefollow', { uid: otherUid });

    setState({ isfollow: true });
    Toast.info('关注成功');
  };
  //取消关注
  const handlefollowFalse = async () => {
    await Api.post('/other/changefollow', { uid: otherUid });

    setState({ isfollow: false });
    Toast.info('取消关注成功');
  };
  //判断是否关注
  const judgeIsFollow = async () => {
    const res = await Api.post('/other/isfollow', { uid: otherUid });
    if (res.status === 1) {
      setState({ isfollow: true });
    }
  };
  //获取他人详情
  const fetchOtherInfo = async () => {
    // const {  } = await Api.post('/other/user/info', { uid: otherUid });
    const data = props.data;
    data._background = Tools.resolveAsset(data.background, '?imageView2/2/w/750/h/187') || mrbgUrl;
    data._user_nikname = data.user_nikname;
    data._avatar = Tools.resolveAsset(data.avatar, '?imageView2/2/w/120/h/120');
    data._signature = data.signature;
    data._fans = data.fans;
    data._electric = data.electric;
    data._follower_count = data.follower_count;
    data._occupation = data.occupation;
    setState({ data });
  };
  return (
    <div className="other_home">
      <NavBar title="TA的主页" />
      <Image className="other_bg" src={data._background} />
      <div className="other_info">
        <div className="other_top">
          <Avatar className="other_top__avatar" src={data._avatar} />
          <div className="other_seize_seat" />
          <div className="other_top_right">
            <div className="other_top_right_left" onClick={handleSendNews}>
              发私信
            </div>
            {!isfollow && (
              <div className="other_top_right_false" onClick={handlefollow}>
                +关注
              </div>
            )}
            {isfollow && (
              <div className="other_top_right_true" onClick={handlefollowFalse}>
                已关注
              </div>
            )}
          </div>
        </div>
        <div className="other_top_info">
          <p className="other_name">{data._user_nikname}</p>
          <span className="other_job">{data._occupation ? data._occupation : '普通地球人'}</span>
        </div>
        <p className="other_autograph">{data._signature}</p>
        <div className="other_data">
          <div className="other_data_list">
            <div className="other_data_list_num">
              <span className="number">{data._fans}</span>
              <span className="type">学徒</span>
            </div>
            <div className="type_img">
              <img src={stuUrl} alt="" />
            </div>
          </div>
          <div className="list_division" />
          <div className="other_data_list">
            <div className="other_data_list_num">
              <span className="number">{data._follower_count}</span>
              <span className="type">师傅</span>
            </div>
            <div className="type_img">
              <img src={teaUrl} alt="" />
            </div>
          </div>
          <div className="list_division" />
          <div className="other_data_list">
            <div className="other_data_list_num">
              <span className="number">{data._electric}</span>
              <span className="type">mAh</span>
            </div>
            <div className="type_img">
              <img src={porUrl} alt="" />
            </div>
          </div>
        </div>
      </div>
      <Plate uid={otherUid} />
    </div>
  );
};

export default otherHome;
