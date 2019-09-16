import React, { useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';

// import Drawer from 'src/components/Drawer';
import NavBar from 'src/components/Nav/NavBar';
import TabBar from 'src/components/Nav/TabBar';
// import ActivityOption from 'src/components/Activity/ActivityOption';
import KsListView from 'src/components/KsListView';
import ActivityCard from 'src/components/Activity/ActivityCard';
import CityPicker from 'src/components/Forms/CityPicker';
import CateSelecter from 'src/components/Activity/CateSelecter';

import CityIcon from 'src/assets/icon_location_white.png';

import './ActivityList.scss';
import Api from 'src/utils/Api';
import Tools from 'src/utils/Tools';
import { useSetState } from 'react-use';

const ActivityList = props => {
  const listRef = useRef();
  const [state, setState] = useSetState({
    type: null,
    type2: null,
    city: null,
    cityName: '全国',
    cityShow: false,
    cates: []
  });

  const fetchData = async page => {
    const params = {
      page,
      menu_id: state.type,
      category_id: state.type2,
      district: state.city,
      order_by: 4
    };

    const res = await Api.get('/actives/list', { params });
    res.data.data.forEach(item => {
      item._cover = item.pics && item.pics[0] && item.pics[0].path;
      item._cover = Tools.resolveAsset(item._cover, '?imageView2/2/w/750');
    });
    return res;
  };

  const renderRow = item => {
    return (
      <Link to={`/activities/${item.active_id}`}>
        <ActivityCard
          cover={item._cover}
          title={item.title}
          city={item.city_name}
          price={item.price}
          ticket={item.stock}
          time={item.show_time}
          tags={item.tags}
          video={item.video}
          hot={item.hot}
        />
      </Link>
    );
  };

  const toggleCity = () => {
    setState(state => ({ cityShow: !state.cityShow }));
  };

  const choseType = (lv1, lv2) => {
    setState({ type: lv1, type2: lv2 });
  };

  const choseCity = item => {
    if (item) {
      setState({ city: item.id, cityName: item.name });
    } else {
      setState({ city: null, cityName: '全国' });
    }
  };

  // 获取类别
  const fetchCates = async () => {
    const res = await Api.get('/actives/homeCategory');
    const cates = Object.values(res.data).map(item => ({
      key: item.id,
      name: item.name,
      value: item.menu_id,
      icon: Tools.resolveAsset(item.images_h5, '?imageView2/2/w/144/h/90'),
      children: (item.child || []).map(item => ({
        key: item.id,
        name: item.name,
        value: item.menu_id
      }))
    }));

    setState({ cates });
  };

  useEffect(() => {
    listRef.current.fetchData(1);
  }, [state.type, state.city, state.type2]);

  useEffect(() => {
    fetchCates();
  }, []);

  const navTabs = (
    <div className="header-tabs">
      <button className="header-tabs__item header-tabs__activity active">活动</button>
      <Link to={`/services`}>
        <button className="header-tabs__item header-tabs__service ">服务</button>
      </Link>
    </div>
  );

  const navRight = (
    <div className="city_title" onClick={toggleCity}>
      <img src={CityIcon} alt="" />
      {state.cityName}
    </div>
  );

  return (
    <div>
      <NavBar title={navTabs} right={navRight} left={<NavBar.Avatar />} />
      {/* <ActivityOption onChange={choseType} /> */}
      <CateSelecter data={state.cates} onChange={choseType} />

      <KsListView
        ref={listRef}
        auto={false}
        fetchData={fetchData}
        renderRow={renderRow}
        useBodyScroll={true}
      />

      <CityPicker
        auto={true}
        hidden={!state.cityShow}
        onClose={toggleCity}
        onChange={choseCity}
        style={{ top: '.88rem' }}
      />

      <TabBar />
    </div>
  );
};

export default ActivityList;
