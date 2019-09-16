import React from 'react';
import { NavLink } from 'react-router-dom';

import './TabBar.scss';

const TabBar = props => {
  return (
    <>
      <div className="ks-tabbar-holder" />
      <div className="ks-tabbar">
        <NavLink className="ks-tabbar__item" activeClassName="ks-tabbar__item--active" to="/" exact>
          <i className="ks-tabbar__item__icon ks-tabbar__item__icon--home" />
          <span className="ks-tabbar__item__name">首页</span>
        </NavLink>
        <NavLink className="ks-tabbar__item" activeClassName="ks-tabbar__item--active" to="/forums">
          <i className="ks-tabbar__item__icon ks-tabbar__item__icon--cool" />
          <span className="ks-tabbar__item__name">酷圈</span>
        </NavLink>
        {/* <NavLink className="ks-tabbar__item" activeClassName="ks-tabbar__item--active" to="/">
          <i className="ks-tabbar__item__icon ks-tabbar__item__icon--mall" />
          <span className="ks-tabbar__item__name">商城</span>
        </NavLink> */}
        <NavLink className="ks-tabbar__item" activeClassName="ks-tabbar__item--active" to="/goods">
          <i className="ks-tabbar__item__icon ks-tabbar__item__icon--goods" />
          <span className="ks-tabbar__item__name">淘货</span>
        </NavLink>
        <NavLink
          className="ks-tabbar__item"
          activeClassName="ks-tabbar__item--active"
          to="/activities"
        >
          <i className="ks-tabbar__item__icon ks-tabbar__item__icon--activty" />
          <span className="ks-tabbar__item__name">活动中心</span>
        </NavLink>
      </div>
    </>
  );
};

export default TabBar;
