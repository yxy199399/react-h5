import { useMount } from 'react-use';
import qs from 'qs';

import Api from 'src/utils/Api';

const OpenId = props => {
  useMount(() => {
    getOpenid();
  });

  const getOpenid = async () => {
    const { from, code } = qs.parse(props.location.search, { ignoreQueryPrefix: true });
    const res = await Api.get('/getTokenAndOpenid', { params: { code } });
    sessionStorage.setItem('openid', res.data.openid);
    window.location.replace(decodeURIComponent(from));
  };

  return null;
};

export default OpenId;
