import React from 'react';
import { Link } from 'react-router-dom';
import { useSetState, useMount } from 'react-use';
import NavBar from 'src/components/Nav/NavBar';
import WeAppShare from 'src/components/ShareBtn/WeAppShare';

import imgUrl from '../../assets/icon_zy_bs.png';
import orderUrl from '../../assets/icon_order.png';
import rightUrl from '../../assets/icon_right.png';
import marketUrl from '../../assets/icon_market.png';
import upLoadUrl from '../../assets/icon_uploads.png';
import './UserCenter.scss';
import Api from 'src/utils/Api';
import Tools from 'src/utils/Tools';

const UserCenter = props => {
  const title = '个人中心';
  useMount(() => {
    fetchUserInfo();
  });
  const [state, setState] = useSetState({
    data: {},
    showTips: false
  });
  const { data, showTips } = state;
  const fetchUserInfo = async () => {
    const { data } = await Api.post('/web/user/profile', {});
    data._avatar = Tools.resolveAsset(data.avatar, '?imageView2/2/w/200/h/200');
    setState({ data });
  };

  const noFunction = () => {
    setState(state => ({ showTips: !state.showTips }));
  };

  const renderBattery = battery => {
    let number = battery;
    let unit = ' mAh';

    if (battery >= 1000) {
      number = parseFloat((battery / 1000).toFixed(1));
      unit = ' Ah';
    }

    return (
      <p className="number">
        {number}
        <span className="dw">{unit}</span>
      </p>
    );
  };

  return (
    <div className="user-center">
      {showTips && (
        <WeAppShare
          onClose={noFunction}
          text={
            <>
              <div>功能开发中</div>
              <div>扫码or微信搜索“酷耍实验室”</div>
              <div>即可体验</div>
            </>
          }
        />
      )}
      <div className="user-center__info">
        <NavBar
          title={title}
          right={
            <Link className="user-center__info__gear" to="/mine/list">
              <img src={require('../../assets/gear.png')} alt="" />
            </Link>
          }
        />
        <div className="user-center__info__card">
          <div className="user-center__info__card__top">
            <img className="user-center__info__card__ava" src={data._avatar} alt="" />
            <div className="user-center__info__card__left">
              <div className="user-center__name">
                <p>{data.nickname}</p>
                <img src={imgUrl} alt="" />
                <span>{data.occupation ? data.occupation : '无'}</span>
              </div>
              <div className="user-center__info__card__top__bot">
                <p>{data.signature}</p>
              </div>
            </div>
          </div>
          <div className="user-center__info__card__bot">
            <div className="other_data">
              <div className="other_data_list">
                <div className="other_data_list_num">
                  <p className="number">{data.fans}</p>
                  <p className="type">学徒</p>
                </div>
              </div>
              <div className="list_division" />
              <div className="other_data_list">
                <div className="other_data_list_num">
                  <p className="number">{data.focus}</p>
                  <p className="type">师傅</p>
                </div>
              </div>
              <div className="list_division" />
              <div className="other_data_list">
                <div className="other_data_list_num">{renderBattery(data.electric)}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="user-center__nav">
        {/* <Link to={`/user-order/`}> */}
        <div className="user-center__nav__list" onClick={noFunction}>
          <img className="icon_img" src={orderUrl} alt="" />
          <div className="user-center__nav__list__left">
            <span>我的订单</span>
            <img src={rightUrl} alt="" />
          </div>
        </div>
        {/* </Link> */}
        <div className="user-center__nav__list" onClick={noFunction}>
          <img className="icon_img" src={marketUrl} alt="" />
          <div className="user-center__nav__list__left">
            <span>淘货管理</span>
            <img src={rightUrl} alt="" />
          </div>
        </div>
        <Link to="/mine/upload">
          <div className="user-center__nav__list">
            <img className="icon_img" src={upLoadUrl} alt="" />
            <div className="user-center__nav__list__left">
              <span>上传管理</span>
              <img src={rightUrl} alt="" />
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
};
export default UserCenter;
