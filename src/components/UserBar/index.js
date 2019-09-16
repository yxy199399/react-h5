import React from 'react';
import cs from 'classnames';

import Avatar from 'src/components/Avatar';
import StarLevel from 'src/components/StarLevel';
import './index.scss';

import { UserType } from 'src/utils/Constant';

const UserBar = props => {
  const { avatar, nickname, userType, meta, side = null, score = null, className, ...rest } = props;

  const getSide = () => {
    if (side) {
      return side;
    } else if (score !== null) {
      return <StarLevel score={score} />;
    } else {
      return null;
    }
  };

  return (
    <div className={cs('ks-userbar', className)} {...rest}>
      {avatar !== null && <Avatar className="ks-userbar__avatar" src={avatar} />}
      <div className="ks-userbar__center">
        <div className="ks-userbar__nick">
          <span className="ks-userbar__nick__name">{nickname}</span>
          {userType === UserType.BUSINESS && <i className="ks-userbar__nick__kip" />}
          {userType === UserType.PROFESSIONAL && (
            <i className="ks-userbar__nick__kip ks-userbar__nick__kip--pro" />
          )}
        </div>
        <div className="ks-userbar__meta">{meta}</div>
      </div>
      <aside className="ks-userbar__side">{getSide()}</aside>
    </div>
  );
};

export default UserBar;
