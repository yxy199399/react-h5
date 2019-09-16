import React, { useRef, useEffect } from 'react';
import { useSetState } from 'react-use';
import cs from 'classnames';

import Api from 'src/utils/Api';
import './LocalCity.scss';

/**
 * 选择当前城市
 *
 * @example
 * <LocalCity onChange={({city}) => { .... }}>
 *
 */

const LocalCity = props => {
  const cityRef = useRef(null);
  const [state, setState] = useSetState({
    city: null,
    busy: false
  });

  const getCity = async () => {
    if (cityRef.current) {
      setState({ city: cityRef.current });
    } else {
      setState({ busy: true });
      const city = new window.BMap.LocalCity();
      city.get(async ({ name }) => {
        try {
          const { data } = await Api.get('/getCityLinkageId', { params: { name } });
          cityRef.current = { id: data.id, name: data.name };
          setState({ city: cityRef.current, busy: false });
        } catch {
          setState({ busy: false });
        }
      });
    }
  };

  const toggleCity = () => {
    if (state.city || state.busy) {
      setState({ city: null, busy: false });
    } else {
      getCity();
    }
  };

  useEffect(() => {
    props.onChange && props.onChange(state.city);
  }, [state.city]);

  return (
    <div
      className={cs('ks-local-city', {
        'ks-local-city--active': state.city
      })}
      onClick={toggleCity}
    >
      {state.busy ? '获取中...' : state.city ? state.city.name : '使用当前位置'}
    </div>
  );
};

export default LocalCity;
