import React, { useEffect } from 'react';
import { Picker } from 'antd-mobile';

import Api from 'src/utils/Api';
import { useSetState, useMount } from 'react-use';

const CityPicker2 = props => {
  const { onSelect = () => {}, ...rest } = props;
  const [state, setState] = useSetState({
    data: [],
    value: props.value
  });

  const fetchCitys = async () => {
    const res = await Api.get('/city/getAllCities');
    const data = (res.data || []).map(lv1 => ({
      ...lv1,
      label: lv1.name,
      value: lv1.id,
      children: (lv1.child || []).map(lv2 => ({
        ...lv2,
        label: lv2.name,
        value: lv2.id,
        children: (lv2.child || []).map(lv3 => ({
          ...lv3,
          label: lv3.name,
          value: lv3.id
        }))
      }))
    }));
    setState({ data });
  };

  const handleOnChange = value => {
    setState({ value });
  };

  useMount(() => {
    fetchCitys();
  });

  useEffect(() => {
    onSelect(state.value);
  }, [state.value]);

  return (
    <Picker
      extra="请选择所在地区"
      title="选择城市"
      data={state.data}
      value={state.value}
      onChange={handleOnChange}
      {...rest}
    >
      {props.children}
    </Picker>
  );
};

export default CityPicker2;
