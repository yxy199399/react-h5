import React from 'react';
import cs from 'classnames';
import qs from 'qs';
import Masonry from 'react-masonry-component';
import { Link } from 'react-router-dom';

import NavBar from 'src/components/Nav/NavBar';
import TabBar from 'src/components/Nav/TabBar';
import CityPicker from 'src/components/Forms/CityPicker';
import GoodsItem from 'src/components/Mall/GoodsItem';
import ListFooter from 'src/components/KsListView/ListFooter';

import Api from 'src/utils/Api';
import Tools from 'src/utils/Tools';

import './GoodsList.scss';
import iconAllNor from 'src/assets/icon_all_nor.png';
import iconAllSel from 'src/assets/icon_all_sel.png';

export default class GoodsList extends React.PureComponent {
  state = {
    data: [],
    busy: false,
    hasNext: true,

    types: [],

    page: 1,
    passize: 10,
    order: null, // 1评分 2价格 3完整度 4评论数
    orderBy: null, // desc
    type: null, // 分类
    city: null, // 城市

    dropmenu: false // false关闭 1价格 2评分/评论 3城市 4分类
  };

  componentDidMount() {
    this.firstLoadData();
    this.fetchTypes();
    // this.fetchData(1);
    window.addEventListener('scroll', this.bindScroll);
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.bindScroll);
  }

  getLocalCity = () => {
    return new Promise((res, rej) => {
      const city = new window.BMap.LocalCity();
      city.get(({ name }) => {
        Api.get('/getCityLinkageId', {
          params: { name },
          _toast: false
        })
          .then(resp => {
            res({ id: resp.data.id, name: resp.data.name });
          })
          .catch(err => rej(err));
      });
    });
  };

  firstLoadData = async () => {
    let query = qs.parse(this.props.location.search, { ignoreQueryPrefix: true });

    if (query.city === undefined) {
      query.city = await this.getLocalCity();
    }

    this.setState(
      {
        order: +query.order,
        orderBy: query.orderBy,
        type: query.type,
        city: query.city
      },
      () => this.fetchData(1)
    );
  };

  replaceUrl = () => {
    this.props.history.replace({
      ...this.props.location,
      search: qs.stringify({
        order: this.state.order,
        orderBy: this.state.orderBy,
        type: this.state.type,
        city: this.state.city
      })
    });
  };

  // 切换下拉菜单
  toggleDrop = n => evt => {
    this.setState({ dropmenu: this.state.dropmenu === n ? false : n });
  };

  // 选择排序
  selectOrder = (order, orderBy) => evt => {
    if (order === this.state.order && orderBy === this.state.orderBy) {
      this.setState({ dropmenu: false });
    } else {
      this.setState({ dropmenu: false, order, orderBy }, () => {
        this.fetchData(1);
        this.replaceUrl();
      });
    }
  };

  // 选择类别
  selectType = type => evt => {
    if (this.state.type === type) {
      this.setState({ dropmenu: false });
    } else {
      this.setState({ dropmenu: false, type }, () => {
        this.fetchData(1);
        this.replaceUrl();
      });
    }
  };

  choseCity = city => {
    this.setState({ city }, () => {
      this.fetchData(1);
      this.replaceUrl();
    });
  };

  // 获取列表
  fetchData = async page => {
    const { passize, order, orderBy, type, city, busy, hasNext } = this.state;

    if (page !== 1 && (busy || !hasNext)) return;
    this.setState({ busy: true });
    const params = {
      page,
      passize,
      order,
      orderby: orderBy,
      categoryid: type ? type.menu_id : null,
      provinceid: city ? city.id : null
    };

    Object.keys(params).forEach(key => {
      const value = params[key];
      if (value === null) delete params[key];
    });

    try {
      if (params.page === 1) {
        this.setState({ data: [], hasNext: true });
      }

      const res = await Api.post('/goods/homeIndex', params);
      res.data.forEach(item => {
        item._cover = Tools.resolveAsset(
          item.show_picture && item.show_picture.path,
          '?imageView2/2/w/340'
        );
        item._avatar = Tools.resolveAsset(item.avatar, '?imageView2/2/w/44/h/44');
      });

      const data = params.page === 1 ? res.data : [...this.state.data, ...res.data];
      const hasNext = res.data.length >= params.passize;

      this.setState({ busy: false, data, hasNext, page: params.page });
    } catch {
      this.setState({ busy: false });
    }
  };

  // 获取分类
  fetchTypes = async () => {
    const res = await Api.post('/category/list');
    res.data.forEach(item => {
      item._iconSel = Tools.resolveAsset(item.images, '?imageView2/2/w/42/h/42');
      item._iconNor = Tools.resolveAsset(item.images_beforehover, '?imageView2/2/w/42/h/42');
    });
    this.setState({ types: res.data });
  };

  // 获取下一页
  bindScroll = evt => {
    const bt = document.body.offsetHeight - window.innerHeight - window.pageYOffset;
    if (bt <= window.innerHeight / 2) {
      this.fetchData(this.state.page + 1);
    }
  };

  render() {
    const { dropmenu, types, order, orderBy, type, city, data, hasNext } = this.state;
    const title = (
      <div
        className={cs({ 'goods-list-title': true, 'goods-list-title--active': dropmenu === 4 })}
        onClick={this.toggleDrop(4)}
      >
        {type ? type.name : '全部'}
      </div>
    );
    // console.log(this.props);

    return (
      <div className="goods-list-page">
        <NavBar title={title} left={<NavBar.Avatar />} right={<NavBar.Drop />} />
        <div className="goods-filter">
          {/* tabs */}
          <div className="goods-filter-bar">
            <div
              className={cs({
                'goods-filter-bar__item': true,
                'goods-filter-bar__item--active': dropmenu === 1
              })}
              onClick={this.toggleDrop(1)}
            >
              {!order && <span>综合排序</span>}
              {order === 1 && <span>评分最高</span>}
              {order === 2 && <span>{orderBy === 'asc' ? '价格由低到高' : '价格由高到低'}</span>}
              {order === 4 && <span>评论最多</span>}
              <i />
            </div>

            <div
              className={cs({
                'goods-filter-bar__item': true,
                'goods-filter-bar__item--active': dropmenu === 3
              })}
              onClick={this.toggleDrop(3)}
            >
              <b />
              <span>{city ? city.name : '全国'}</span>
              <i />
            </div>
          </div>

          {/* 价格排序 */}
          {dropmenu === 1 && (
            <div className="goods-filter-drop">
              <div
                className={cs({
                  'goods-filter-drop__item': true,
                  'goods-filter-drop__item--active': order === 2 && orderBy === 'asc'
                })}
                onClick={this.selectOrder(2, 'asc')}
              >
                价格由低到高
              </div>
              <div
                className={cs({
                  'goods-filter-drop__item': true,
                  'goods-filter-drop__item--active': order === 2 && orderBy === 'desc'
                })}
                onClick={this.selectOrder(2, 'desc')}
              >
                价格由高到低
              </div>
              <div
                className={cs({
                  'goods-filter-drop__item': true,
                  'goods-filter-drop__item--active': order === 1 && orderBy === 'desc'
                })}
                onClick={this.selectOrder(1, 'desc')}
              >
                评分最高
              </div>
              <div
                className={cs({
                  'goods-filter-drop__item': true,
                  'goods-filter-drop__item--active': order === 4 && orderBy === 'desc'
                })}
                onClick={this.selectOrder(4, 'desc')}
              >
                评论最多
              </div>
            </div>
          )}

          {/* 选择类别 */}
          {dropmenu === 4 && (
            <div className="goods-type-drop">
              <div
                className={cs({
                  'goods-type-drop__item': true,
                  'goods-type-drop__item--active': !type
                })}
                onClick={this.selectType(null)}
              >
                <img src={type ? iconAllNor : iconAllSel} alt="" />
                <span>全部</span>
                <i />
              </div>
              {types.map(item => (
                <div
                  key={item.id}
                  className={cs({
                    'goods-type-drop__item': true,
                    'goods-type-drop__item--active': type === item
                  })}
                  onClick={this.selectType(item)}
                >
                  <img src={type === item ? item._iconSel : item._iconNor} alt="" />
                  <span>{item.name}</span>
                  <i />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 城市选择 */}
        <CityPicker
          // auto={true}
          hidden={dropmenu !== 3}
          className="goods-city-picker"
          onChange={this.choseCity}
          onClose={this.toggleDrop(false)}
        />

        {dropmenu && <div className="goods-filter-mask" onClick={this.toggleDrop(false)} />}

        <div style={{ paddingLeft: '.12rem' }}>
          <Masonry>
            {data.map(item => (
              <Link to={`/goods/${item.asin}`} key={item.asin}>
                <GoodsItem
                  key={item.asin}
                  cover={item._cover}
                  location={item.city}
                  title={item.title}
                  price={item.price}
                  views={item.view_num}
                  avatar={item._avatar}
                  nick={item.nickname}
                />
              </Link>
            ))}
          </Masonry>
          <ListFooter empty={!hasNext && !data.length} hasNext={hasNext} />
        </div>

        <TabBar />
      </div>
    );
  }
}
