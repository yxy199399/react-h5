import { useMount, useSetState } from 'react-use';
import Api from 'src/utils/Api';
import { useStore } from 'easy-peasy';
import Tools from 'src/utils/Tools';

const CheckOpenId = props => {
  const [state, setState] = useSetState({ ready: false });
  const auth = useStore(store => store.auth);

  useMount(() => {
    check();
  });

  const check = async () => {
    if (!Tools.isWxBrowser()) {
      return setState({ ready: true });
    }

    let openid = sessionStorage.getItem('openid');

    if (!openid && auth.isLogin) {
      try {
        const res = await Api.get('/getTokenAndOpenid', { _toast: false });
        openid = res.data.openid;
        sessionStorage.setItem('openid');
      } catch {
        openid = null;
      }
    }

    if (!openid) {
      const from = encodeURIComponent(window.location.href);
      const redirectUrl = window.location.origin + '/openid?from=' + from;
      const { url } = await Api.get('/getWeChatCode', { params: { redirectUrl } });
      window.location.replace(url);
    } else {
      setState({ ready: true });
    }
  };

  if (!state.ready) {
    return null;
  }

  return props.children;
};

export default CheckOpenId;
