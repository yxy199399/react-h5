import React from 'react';
import cs from 'classnames';
import { withRouter, Link } from 'react-router-dom';
import { useSetState } from 'react-use';
import { useStore } from 'easy-peasy';

import Avatar from '../Avatar';
import DropMenu from 'src/components/Forms/DropMenu';

import Tools from 'src/utils/Tools';
import iconAvatar from 'src/assets/icon_avatar2.png';
import './NavBar.scss';

const NavBarIcon = props => {
  const { type, className, ...rest } = props;

  return (
    <div
      className={cs('ks-navbar__icon', type ? `ks-navbar__icon--${type}` : null, className)}
      {...rest}
    />
  );
};

const NavBarBtn = props => {
  const { className, children, ...rest } = props;
  return (
    <div className={cs('ks-navbar__btn', className)} {...rest}>
      {children || null}
    </div>
  );
};

const NavBarDrop = props => {
  const [state, setState] = useSetState({ drop: false });

  const toggleDrop = () => {
    setState(state => ({ drop: !state.drop }));
  };

  const dropData = [
    {
      icon: require('../../assets/icon_video.png'),
      name: '发视频',
      path: '/publish/video'
    },
    {
      icon: require('../../assets/icon_edit.png'),
      name: '发文章',
      path: '/publish/article'
    },
    {
      icon: require('../../assets/icon_question.png'),
      name: '提问题',
      path: '/publish/question'
    },
    {
      icon: require('../../assets/icon_sell.png'),
      name: '卖闲置',
      path: '/publish/goods'
    }
  ];

  return (
    <NavBarIcon type="upload" onClick={toggleDrop}>
      <DropMenu
        mode="bottom-right"
        show={state.drop}
        data={dropData}
        onSelect={item => item.path && props.history.push(item.path)}
      />
    </NavBarIcon>
  );
};

const NavBarAvatar = props => {
  const auth = useStore(store => store.auth);

  if (auth.isLogin) {
    return (
      <Link to="/user-center" className="ks-navbar__login">
        <Avatar
          className="ks-navbar__login__avatar"
          src={Tools.resolveAsset(auth.userInfo.avatar, '?imageView2/2/w/100/h/100')}
        />
        {/* <i className="ks-navbar__login__dot" /> */}
      </Link>
    );
  } else {
    return (
      <Link
        to={{ pathname: '/login', state: { from: props.location } }}
        className="ks-navbar__logout"
      >
        <img className="ks-navbar__logout__avatar" src={iconAvatar} alt="" />
        <span className="ks-navbar__logout__text">登录</span>
      </Link>
    );
  }
};

const NavBarSearch = props => {
  const {
    value = '',
    placeholder = '搜索视频、文章、问题',
    onChange = () => {},
    disabled = false
  } = props;
  const [state, setState] = useSetState({ value });

  const handleChange = evt => {
    evt.stopPropagation();
    evt.preventDefault();
    const value = evt.target.value;
    setState({ value });
    onChange(value);
  };

  const handleClear = () => {
    setState({ value: '' });
    onChange('');
  };

  return (
    <div className="ks-navbar-search">
      <input
        type="text"
        placeholder={placeholder}
        onChange={handleChange}
        value={state.value}
        disabled={disabled}
      />
      {state.value && !disabled ? <b onClick={handleClear} /> : <i />}
    </div>
  );
};

const NavBar = props => {
  const { title = '酷耍', left, right } = props;
  const back = <NavBarIcon type="back" onClick={props.history.goBack} />;

  return (
    <header className="ks-navbar">
      <h2 className={cs('ks-navbar__title', { 'ks-navbar__title--kushua': title === '酷耍' })}>
        {title}
      </h2>
      <div className="ks-navbar__left">{left === undefined ? back : left}</div>
      <div className="ks-navbar__right">{right}</div>
    </header>
  );
};

NavBar.Icon = NavBarIcon;
NavBar.Btn = NavBarBtn;
NavBar.Drop = withRouter(NavBarDrop);
NavBar.Avatar = withRouter(NavBarAvatar);
NavBar.Search = NavBarSearch;

export default withRouter(NavBar);
