import React from 'react';

import './ActivityCity.scss';
import CityIcon from '../../assets/icon_location.png';
import CityRefresh from '../../assets/icon_refresh.png';

import Api from '../../utils/Api';
import { useMount, useSetState } from 'react-use';

const ActivityCity = props => {
  useMount(() => {
    getHotCityList();
  });

  const [state, setState] = useSetState({
    data: []
  });

  const getHotCityList = async () => {
    const { hotCities } = await Api.get('/actives/getAllActivesCity');
    // const { allCities } = await Api.get('/actives/getAllActivesCity');

    hotCities.map(item => {
      item._name = item.name;
    });

    // Object.keys(allCities).forEach(items => {
    //   console.log(items);
    // });

    setState({ data: hotCities });
  };

  return (
    <div className="city">
      <div className="city__gps">
        <div className="city__gps__city">
          <img src={CityIcon} />
          <p className="city__gps__city__name">
            重庆
            <span>当前定位城市</span>
          </p>
          {/* <p className="city__gps__city__notGps">无法获取当前定位</p> */}
        </div>

        <div className="city__gps__refresh">
          <img src={CityRefresh} />
          刷新
        </div>
      </div>
      <div className="city__hotCity">
        <div className="city__hotCity__title">热门城市</div>
        <div className="city__hotCity__list">
          <div className="city_name">全国</div>
          {state.data.map((item, index) => {
            return (
              <div className="city_name" key={index}>
                {item._name}
              </div>
            );
          })}
        </div>
      </div>

      <div className="city__cityList">
        <div className="city__cityList__citySort">
          <div className="city__cityList__citySort__cityNum">A</div>
          <div className="city__cityList__citySort__cityName">重庆</div>
        </div>
      </div>
    </div>
  );
};

export default ActivityCity;
