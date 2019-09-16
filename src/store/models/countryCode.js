import { action, thunk } from 'easy-peasy';
import Api from 'src/utils/Api';

export default {
  value: '86',
  data: {},

  // 更新国家代码列表
  updateData: action((state, payload) => {
    state.data = payload;
  }),

  // 选中国家代码
  choseCode: action((state, payload) => {
    state.value = payload;
  }),

  // 获取国家代码列表
  fetchData: thunk(async (actions, payload) => {
    const { data } = await Api.get('/appCountryCode');
    actions.updateData(data);
  })
};
