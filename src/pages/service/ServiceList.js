import React, { useRef, useEffect } from 'react';
import { useSetState } from 'react-use';
import { Link } from 'react-router-dom';
import Api from 'src/utils/Api';
import Tools from 'src/utils/Tools';

import NavBar from 'src/components/Nav/NavBar';
import TabBar from 'src/components/Nav/TabBar';
import CityPicker from 'src/components/Forms/CityPicker';
import KsListView from 'src/components/KsListView';
import ServiceCard from 'src/components/Service/ServiceCard';
import CateSelecter from 'src/components/Activity/CateSelecter';

import './ServiceList.scss';
import CityIcon from 'src/assets/icon_location_white.png';

const ServiceList = props => {
  const listRef = useRef();
  const [state, setState] = useSetState({
    type: null,
    type2: null,
    city: null,
    cityName: '全国',
    cityShow: false,
    cates: []
  });

  // 获取服务列表
  const getServiceList = async page => {
    const params = {
      page,
      prderby: 'asc',
      pagesize: 9,
      provinceid: state.city,
      categoryid: state.type2 || state.type,
      order: 7
    };

    const res = await Api.post('/services/homeIndex', params);
    res.data.data.forEach(item => {
      item._cover = item.images && item.images.path;
      item._cover = Tools.resolveAsset(item._cover, '?imageView2/2/w/700/h/400');
      // item.tags = [];
      // item.tagsname.split(',').forEach(tmp => {
      //   item.tags.push({ name: tmp });
      // });
    });
    return res;
  };

  const toggleCity = () => {
    setState(state => ({ cityShow: !state.cityShow }));
  };

  // 选择城市
  const choseCity = item => {
    if (item) {
      setState({ city: item.id, cityName: item.name });
    } else {
      setState({ city: null, cityName: '全国' });
    }
  };

  // 选择分类
  const choseType = (lv1, lv2) => {
    setState({ type: lv1, type2: lv2 });
  };

  // 获取类别
  const fetchData = async () => {
    const res = await Api.get('/services/homeCategory');
    const cates = Object.values(res.data).map(item => ({
      key: item.id,
      name: item.name,
      value: item.menu_id,
      icon: Tools.resolveAsset(item.images_h5, '?imageView2/2/w/38/h/38'),
      children: (item.child || []).map(item => ({
        key: item.id,
        name: item.name,
        value: item.menu_id
      }))
    }));

    setState({ cates });
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    listRef.current.fetchData(1);
  }, [state.type, state.city, state.type2]);

  const renderRow = item => {
    return (
      <Link to={`/service/${item.service_id}`}>
        <ServiceCard
          cover={item._cover}
          title={item.title}
          city={item.province}
          price={item.price}
          video={item.video}
          score={item.score}
          menuPname={item.menu_pname}
          menuName={item.menu_name}
          isQuestion={item.is_question === 1}
        />
      </Link>
    );
  };

  //头部标签页
  const navTabs = (
    <div className="header-tabs">
      <Link to={`/activities`}>
        <button className="header-tabs__item header-tabs__activity">活动</button>
      </Link>
      <button className="header-tabs__item header-tabs__service active">服务</button>
    </div>
  );

  // 头部定位
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
        fetchData={getServiceList}
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

export default ServiceList;
