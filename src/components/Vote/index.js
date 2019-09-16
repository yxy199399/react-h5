import React from 'react';
import cs from 'classnames';

import { VoteStatus } from '../../utils/Constant';
import useVote from 'src/hooks/useVote';
import './index.scss';

const Vote = props => {
  const { status = VoteStatus.NORMAL, number = 0, mode = 'horizontal', sourceId, type } = props;
  const [voteState, voteActions] = useVote({
    status,
    number,
    type,
    sourceId
  });

  return (
    <div
      className={cs({
        'ks-vote': true,
        'ks-vote--like': voteState.status === VoteStatus.LIKE,
        'ks-vote--hate': voteState.status === VoteStatus.HATE,
        'ks-vote--horizontal': mode === 'horizontal',
        'ks-vote--vertical': mode === 'vertical'
      })}
    >
      <i className="ks-vote__up" onClick={voteActions.onLike} />
      <span className="ks-vote__number">{voteActions.getNumber()}</span>
      <i className="ks-vote__down" onClick={voteActions.onHate} />
    </div>
  );
};

export default Vote;
