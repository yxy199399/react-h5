import React from 'react';
import Image from 'src/components/Image';

import './OrderCard.scss';
import ptUrl from '../../assets/icon_vip_export@2x.png';
import riUrl from '../../assets/icon_right.png';

class OrderCard extends React.PureComponent {
  render() {
    let { nickname, image } = this.props;

    return (
      <div className="ks-order-card">
        <div className="ks-order-card__top">
          <div className="ks-order-card__top__left">
            <span>{nickname}</span>
            <img src={ptUrl} alt="" />
            <img src={riUrl} alt="" />
          </div>
          <div className="ks-order-card__top__right">
            <span>等待发货</span>
          </div>
        </div>
        <div className="ks-order-card__bot">
          <Image className="ks-order-card__pic" src={image} alt="" />
          <div className="ks-order-card__bot__right">
            <div className="ks-order-card__bot__title">
              <div className="title">的个人可以退热贴了好几口铁干里克人面桃花热闹天天来看过没人疼豆腐来看你敢不敢加入</div>
              <span className="price">¥150.00</span>
            </div>
            <div className="ks-order-card__bot__num">
              <div className="num__left">
                <span className="num__left__name">数量：</span>
                <span className="num__left__num">x1</span>
              </div>
              <div className="num__right">
                <span className="num__right__name">合计：</span>
                <span className="num__right__num">150.00</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default OrderCard;
