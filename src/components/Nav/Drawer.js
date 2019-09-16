import React, { useRef } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { useStore, useActions } from 'easy-peasy';
import { Modal, Toast } from 'antd-mobile';
import { useSetState, useUnmount, useMount } from 'react-use';
import cs from 'classnames';

import Avatar from 'src/components/Avatar';
import NavBar from 'src/components/Nav/NavBar';

import Tools from 'src/utils/Tools';
import Api from 'src/utils/Api';
import './Drawer.scss';

import iconExit from 'src/assets/icon_exit.png';
import iconAvatar from 'src/assets/icon_avatar2.png';

const Drawer = props => {
  const modalRef = useRef();
  const auth = useStore(store => store.auth);
  const logout = useActions(actions => actions.auth.logout);
  const [state, setState] = useSetState({
    category: [],
    open: false
  });
  const { title, right, className, children, location } = props;

  const toggleSide = () => {
    setState(state => ({ open: !state.open }));
  };

  const handleLogout = e => {
    e.stopPropagation();
    modalRef.current = Modal.alert(null, '确定要退出当前酷耍账号？', [
      {
        text: '取消',
        onPress: () => {}
      },
      {
        text: '确定',
        onPress: () => {
          logout();
          toggleSide();
          Toast.info('退出成功');
        }
      }
    ]);
  };

  const fetchCate = async () => {
    const res = await Api.post('/category/list');
    setState({ category: res.data });
  };

  useMount(() => {
    fetchCate();
  });

  useUnmount(() => {
    modalRef.current && modalRef.current.close();
  });

  return (
    <div className={cs('ks-drawer', { 'ks-drawer--open': state.open }, className)}>
      <div className="ks-drawer__body">
        <NavBar
          left={<NavBar.Icon type="more" onClick={toggleSide} />}
          title={title}
          right={right === undefined ? <NavBar.Drop /> : right}
        />
        {children}
      </div>
      <i className="ks-drawer__mask" onClick={toggleSide} />
      <div className="ks-drawer__side">
        <div className="ks-drawer__side__in">
          {auth.isLogin ? (
            <Link to="/user-center" className="ks-drawer__side__user">
              <Avatar
                className="ks-drawer__side__user__avatar"
                src={Tools.resolveAsset(auth.userInfo.avatar, '?imageView2/2/w/100/h/100')}
              />
              <div className="ks-drawer__side__user__info">
                <div className="ks-drawer__side__user__nick">{auth.userInfo.nickname}</div>
                <span className="ks-drawer__side__user__meta">{auth.userInfo.signature}</span>
              </div>
            </Link>
          ) : (
            <Link
              to={{ pathname: '/login', state: { from: location } }}
              className="ks-drawer__side__user"
            >
              <Avatar holder={iconAvatar} className="ks-drawer__side__user__avatar" />
              <div className="ks-drawer__side__user__info">
                <div className="ks-drawer__side__user__nick">登录/注册</div>
              </div>
            </Link>
          )}

          <nav className="ks-drawer__side__nav">
            {state.category.map(item => (
              <Link
                to={`/categories?folder=${item.menu_id}`}
                key={item.menu_id}
                className="ks-drawer__side__nav__item"
                onClick={toggleSide}
              >
                <img src={Tools.resolveAsset(item.images, '?imageView2/2/w/50/h/50')} alt="" />
                <span>{item.name}</span>
                <i />
              </Link>
            ))}
          </nav>
          {auth.isLogin && (
            <nav className="ks-drawer__side__nav">
              <div className="ks-drawer__side__nav__item" onClick={handleLogout}>
                <img src={iconExit} alt="" />
                <span>退出</span>
                <i />
              </div>
            </nav>
          )}
        </div>
      </div>
    </div>
  );
};

export default withRouter(Drawer);
