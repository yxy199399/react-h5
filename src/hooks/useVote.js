import { useSetState } from 'react-use';
import { Toast } from 'antd-mobile';

import { VoteStatus } from 'src/utils/Constant';
import Api from 'src/utils/Api';

const useVote = props => {
  const { number = 0, status = VoteStatus.NORMAL, sourceId, type } = props;
  const [state, setState] = useSetState({
    status,
    number,
    busy: false
  });

  const onChange = async is_like => {
    if (!sourceId || !type) {
      throw new Error('缺少 sourceId 和 type');
    }

    if (state.busy) return;

    try {
      setState({ busy: true });
      const params = { source_id: sourceId, type, is_like };
      const res = await Api.post('/upvote', params);

      let status = VoteStatus.NORMAL;

      if (res.type) {
        status = is_like ? VoteStatus.LIKE : VoteStatus.HATE;
      }

      setState(state => ({ number: state.number + res.num, status, busy: false }));
      Toast.info(res.msg);
    } catch {
      setState({ busy: false });
    }
  };

  // 点赞
  const onLike = () => onChange(1);

  // 踩
  const onHate = () => onChange(0);

  // 获取点赞数
  const getNumber = () => {
    let number = state.number;

    if (number >= 10000) {
      number = (number / 10000).toFixed(1) + 'w';
    }

    return number;
  };

  return [state, { onLike, onHate, getNumber }];
};

export default useVote;
