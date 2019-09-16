import React, { useRef } from 'react';
import { useMount, useSetState } from 'react-use';
import cs from 'classnames';
import { Link } from 'react-router-dom';

import Card from '../Card';
import UserBar from '../UserBar';
import AttachmentPanel from '../Attachment/AttachmentPanel';
import RichTextView from '../RichTextView';

import { VoteStatus, VoteType } from 'src/utils/Constant';
import useVote from 'src/hooks/useVote';
import Tools from 'src/utils/Tools';
import './AnswerCard.scss';

const AnswerCard = props => {
  const myRef = useRef();
  const {
    id,
    uid,
    battery,
    message,
    title,
    content,
    nickname,
    userType,
    date,
    attach,
    voteStatus,
    folding = true,
    attachShow = false,
    staticContext,
    className,
    ...rest
  } = props;

  const [voteState, voteActions] = useVote({
    number: battery,
    status: voteStatus,
    type: VoteType.ANSWER,
    sourceId: id
  });

  const [state, setState] = useSetState({
    needFold: false,
    voteStatus,
    battery
  });

  const dateStr = Tools.getTimeAgo(date);

  useMount(() => {
    const container = myRef.current;
    if (folding && container) {
      if (container.offsetHeight < container.scrollHeight) {
        setState({ needFold: true });
      }
    }
  });

  return (
    <Card title={title} className={cs('ks-answer', className)} {...rest}>
      <div className="ks-answer__inner">
        <div className="ks-answer__side">
          <span
            className={cs('ks-answer__side__battery', {
              'ks-answer__side__battery--active': VoteStatus.LIKE === voteState.status
            })}
            onClick={voteActions.onLike}
          >
            {voteState.number}
          </span>
          <span className="ks-answer__side__msg">{message}</span>
        </div>

        <div className="ks-answer__body">
          <div
            className={cs('ks-answer__content', { 'ks-answer__content--folding': folding })}
            ref={myRef}
          >
            <RichTextView ref={myRef} html={content} />
          </div>
          {state.needFold && (
            <Link to={{ pathname: `/answers/${id}`, state: props }} className="ks-answer__more">
              显示全文
            </Link>
          )}
          <Link to={`/users/${uid}`} className="ks-answer__userbar" disabled={!uid}>
            <UserBar avatar={null} nickname={nickname} userType={userType} side={dateStr} />
          </Link>
        </div>
      </div>

      <div className="ks-answer__attach">
        {attach && attach.length > 0 && <AttachmentPanel data={attach} show={attachShow} />}
      </div>
    </Card>
  );
};

export default AnswerCard;
