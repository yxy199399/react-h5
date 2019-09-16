import React from 'react';
import { useSetState, useMount } from 'react-use';
import { Toast } from 'antd-mobile';
import NavBar from 'src/components/Nav/NavBar';
import rightUrl from '../../assets/icon_right.png';
import marketUrl from '../../assets/icon_market.png';
import upLoadUrl from '../../assets/icon_uploads.png';
import ordUrl from '../../assets/icon_vip_normal@2x.png'; //普通
import majUrl from '../../assets/icon_vip_export@2x.png'; //商家

import './BusinessCenter.scss';
import Api from 'src/utils/Api';
import Tools from 'src/utils/Tools';

const BusinessCenter = props => {
  const title = '商家中心';
  useMount(() => {
    fetchUserInfo();
  });
  const [state, setState] = useSetState({
    data: {}
  });
  const { data } = state;
  const fetchUserInfo = async () => {
    const { data } = await Api.post('/web/user/profile', {});
    data._avatar = Tools.resolveAsset(data.avatar, '?imageView2/2/w/200/h/200');
    setState({ data });
  };

  const noFunction = () => {
    Toast.info('功能正在开发中，敬请期待');
  };

  return (
    <div className="business-center">
      <div
        className={
          data.user_type === 2
            ? 'business-center__info__zy'
            : data.user_type === 3
            ? 'business-center__info__pt'
            : ''
        }
      >
        <NavBar title={title} />
        <div className="business-center__info__card">
          <div className="business-center__info__card__top">
            <div className="card__left">
              <div className="card__box">
                <p className="card__box__num">{data.fans}</p>
                <p className="card__box__type">学徒</p>
              </div>
            </div>
            <div className="list_division" />
            <div className="card__center">
              <div className="card__avator">
                <div className="business_avatar">
                  {data.user_type === 2 && (
                    <div className="business_avatar_box_maj">
                      <img className="business_avatar_img_maj" src={data._avatar} alt="" />
                      <img className="business_avatar_icon" src={majUrl} alt="" />
                    </div>
                  )}
                  {data.user_type === 3 && (
                    <div className="business_avatar_box_ord">
                      <img className="business_avatar_img_maj" src={data._avatar} alt="" />
                      <img className="business_avatar_icon" src={ordUrl} alt="" />
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="list_division" />
            <div className="card__right">
              <div className="card__box">
                <p className="card__box__num">
                  {data.fuel}
                  <span>mJ</span>
                </p>
                <p className="card__box__type">燃料</p>
              </div>
            </div>
          </div>
          <p className="business-center__info__name">{data.nickname}</p>
          <p className="business-center__info__autograph">{data.signature}</p>
        </div>
      </div>
      <div className="business-center__nav">
        {data.user_type === 3 && (
          <div className="business-center__nav__list" onClick={noFunction}>
            <img className="icon_img" src={marketUrl} alt="" />
            <div className="business-center__nav__list__left">
              <span>淘货管理</span>
              <img src={rightUrl} alt="" />
            </div>
          </div>
        )}
        <div className="business-center__nav__list" onClick={noFunction}>
          <img className="icon_img" src={upLoadUrl} alt="" />
          <div className="business-center__nav__list__left">
            <span>上传管理</span>
            <img src={rightUrl} alt="" />
          </div>
        </div>
      </div>
    </div>
  );
};
export default BusinessCenter;
