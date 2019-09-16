import React, { useRef } from 'react';
import { useMount, useSetState } from 'react-use';
import cs from 'classnames';

import './CityPicker.scss';
import Api from 'src/utils/Api';

const CityPicker = props => {
  const scrollRef = useRef();
  const { auto = false, onChange = () => {}, onClose = () => {}, className, ...rest } = props;
  const [state, setState] = useSetState({
    hots: [],
    all: [],
    selected: null,
    current: null,
    busy: false,
    first: true
  });

  const fetchData = async () => {
    const res = await Api.get('/actives/getAllActivesCity');
    const hots = res.hotCities;
    const all = {};
    Object.keys(res.allCities).forEach(key => {
      Object.assign(all, res.allCities[key]);
    });
    setState({ hots, all });
  };

  const getLocalCity = evt => {
    if (evt) {
      evt.preventDefault();
      evt.stopPropagation();
    }

    setState({ busy: true, current: null });

    const city = new window.BMap.LocalCity();
    city.get(async ({ name }) => {
      try {
        const { data } = await Api.get('/getCityLinkageId', {
          params: { name },
          _toast: false
        });
        const current = { id: data.id, name: data.name };

        setState({ busy: false, current });

        if (state.first && auto) {
          setState({ selected: current, first: false });
          onChange(current);
        }
      } catch {
        setState({ busy: false, current: null });
      }
    });
  };

  const choseCity = city => evt => {
    setState({ selected: city, first: false });
    onClose();
    onChange(city);
  };

  const choseCurrent = () => {
    if (!state.current) return;
    choseCity(state.current)();
  };

  const scrollTo = (key, idx) => evt => {
    const dom = scrollRef.current;

    if (key === '#') {
      dom.scrollTop = 0;
    } else {
      const chars = dom.querySelectorAll('.city-picker__citys__char');
      const top = chars[idx].offsetTop;
      dom.scrollTop = top;
    }
  };

  useMount(() => {
    fetchData();
    getLocalCity();
  });

  const keys = Object.keys(state.all);

  return (
    <div className={cs('city-picker', className)} {...rest}>
      <div className="city-picker__crt" onClick={choseCurrent}>
        <i className="city-picker__crt__icon" />
        {state.current && <span className="city-picker__crt__name">{state.current.name}</span>}
        <small className="city-picker__crt__tip">
          {state.current ? '当前定位城市' : state.busy ? '定位中...' : '定位失败'}
        </small>
        <i className="city-picker__crt__refresh" onClick={getLocalCity}>
          刷新
        </i>
      </div>

      <div className="city-picker__scroll" ref={scrollRef}>
        {state.hots.length > 0 && (
          <div className="city-picker__hot">
            <header className="city-picker__hot__title">热门城市</header>
            <ul className="city-picker__hot__list">
              <li
                className={cs({
                  'city-picker__hot__item': true,
                  'city-picker__hot__item--active': null === state.selected
                })}
                onClick={choseCity(null)}
              >
                全国
              </li>
              {state.hots.map(item => (
                <li
                  key={item.city}
                  className={cs({
                    'city-picker__hot__item': true,
                    'city-picker__hot__item--active':
                      state.selected && item.city === state.selected.id
                  })}
                  onClick={choseCity({ id: item.city, name: item.name })}
                >
                  {item.name}
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="city-picker__citys">
          {keys.map(key => {
            const citys = state.all[key];
            return (
              <React.Fragment key={key}>
                <div className="city-picker__citys__char">{key}</div>
                <div>
                  {citys.map(item => (
                    <div
                      key={item.id}
                      className="city-picker__citys__item"
                      onClick={choseCity({ id: item.id, name: item.name })}
                    >
                      {item.name}
                    </div>
                  ))}
                </div>
              </React.Fragment>
            );
          })}
        </div>
      </div>

      <ul className="city-picker__chars">
        <li onClick={scrollTo('#')}>#</li>
        {keys.map((item, key) => (
          <li key={key} onClick={scrollTo(item, key)}>
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CityPicker;
