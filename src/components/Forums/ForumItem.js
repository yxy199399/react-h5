import React, { useRef } from 'react';
import cs from 'classnames';
import { Toast, Modal } from 'antd-mobile';
import { useStore } from 'easy-peasy';
import { useUnmount, useSetState } from 'react-use';
import { withRouter } from 'react-router-dom';

import Gallery from 'src/components/Gallery';
import Image from 'src/components/Image';
import Avatar from 'src/components/Avatar';
import FollowBtn from 'src/components/FollowBtn';
import Clipboard from 'src/components/Clipboard';
import WxShareMask from 'src/components/ShareBtn/WxShareMask';

import useVote from 'src/hooks/useVote';
import { VoteType, VoteStatus, UserType } from 'src/utils/Constant';

import Tools from 'src/utils/Tools';
import Api from 'src/utils/Api';
import './ForumItem.scss';

const ForumItem = props => {
  const modalRef = useRef();
  const {
    deleteId,
    id,
    avatar = '',
    nickname,
    userType,
    meta,
    isFollow = false,
    uid,
    content,
    video,
    covers = [],
    battery = 0,
    batteryStatus,
    msg = 0,
    share = false,
    city,
    onDelete,
    history
  } = props;
  const [state, setState] = useSetState({ mask: false });
  const [voteState, voteActions] = useVote({
    number: battery,
    status: batteryStatus,
    sourceId: id,
    type: VoteType.FORUM
  });

  const _covers = (video ? [Tools.getVideoCover(video)] : []).concat(covers); //.slice(0, 3);

  const auth = useStore(store => store.auth);
  const isSelf = auth.isLogin && auth.userInfo.uid === uid;

  const toggleShareMask = () => {
    setState(state => ({ mask: !state.mask }));
  };

  // 播放视频
  const handlePlay = () => {
    history.push(`/play-video?src=${encodeURIComponent(video)}`);
  };

  // 图片预览
  const hanldePreview = index => evt => {
    evt.stopPropagation();
    evt.preventDefault();

    const data = covers.map(p => ({ path: p }));
    if (video && index === 0) {
      handlePlay();
    } else if (video) {
      Gallery.open(data, index - 1);
    } else {
      Gallery.open(data, index);
    }
  };

  // 点赞
  const handleVote = evt => {
    evt.stopPropagation();
    evt.preventDefault();

    voteActions.onLike();
  };

  // 删除酷圈
  const handleDelete = evt => {
    evt.stopPropagation();
    evt.preventDefault();

    modalRef.current = Modal.alert(null, '确定要删除吗?', [
      { text: '取消' },
      {
        text: <div style={{ color: '#FF4D4F' }}>删除</div>,
        onPress: async () => {
          await Api.post('/web/cool/destroy', { id: deleteId });
          Toast.info('删除成功');
          if (typeof onDelete === 'function') {
            onDelete(deleteId);
          }
        }
      }
    ]);
  };

  // 跳转用户详情
  const jumpToUserCenter = evt => {
    evt.stopPropagation();
    evt.preventDefault();
    props.history.push(`/users/${uid}`);
  };

  useUnmount(() => {
    modalRef.current && modalRef.current.close();
  });

  return (
    <section className="ks-forum-item">
      {state.mask && <WxShareMask onClick={toggleShareMask} />}
      {/* header */}
      <header className="ks-forum-item__header" onClick={jumpToUserCenter}>
        <div className="ks-forum-item__header__avatar">
          <Avatar src={avatar} />
        </div>
        <div className="ks-forum-item__header__userinfo">
          <div className="ks-forum-item__header__nick">
            <span>{nickname}</span>
            {userType === UserType.BUSINESS && <i className="kip" />}
            {userType === UserType.PROFESSIONAL && <i className="kip kip--sel" />}
          </div>
          <div className="ks-forum-item__header__meta">{meta}</div>
        </div>
        <div className="ks-forum-item__header__follow">
          <FollowBtn isFollow={isFollow} uid={uid} />
        </div>
      </header>

      {/* content */}
      <pre className="ks-forum-item__content">{content}</pre>

      {/* 单图 */}
      {_covers.length === 1 && (
        <div className="ks-forum-item__covers">
          <div className="ks-forum-item__covers__single" onClick={hanldePreview(0)}>
            {video ? (
              <>
                <Image src={_covers[0]} />
                <i className="ks-forum-item__covers__mask" />
                <i className="ks-forum-item__covers__play" />
              </>
            ) : (
              <img src={_covers[0]} alt="" />
            )}
          </div>
        </div>
      )}

      {/* 多图 */}
      {_covers.length > 1 && (
        <div className="ks-forum-item__covers">
          {_covers.slice(0, 3).map((item, key) => (
            <div className="ks-forum-item__covers__item" key={key}>
              <div className="ks-forum-item__covers__rect">
                <div className="ks-forum-item__covers__inner" onClick={hanldePreview(key)}>
                  <Image src={item} />
                  {video && key === 0 && (
                    <>
                      <i className="ks-forum-item__covers__mask" />
                      <i className="ks-forum-item__covers__play" />
                    </>
                  )}
                  {_covers.length >= 4 && key === 2 && (
                    <span className="ks-forum-item__covers__count">{covers.length}</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* footer */}
      <footer className="ks-forum-item__footer">
        <span
          className={cs('ks-forum-item__footer__battery', {
            'ks-forum-item__footer__battery--active': voteState.status === VoteStatus.LIKE
          })}
          onClick={handleVote}
        >
          {voteActions.getNumber()}
        </span>
        {msg !== null && <span className="ks-forum-item__footer__msg">{msg}</span>}
        {share &&
          (Tools.isWxBrowser() ? (
            <i className="ks-forum-item__footer__share" onClick={toggleShareMask} />
          ) : (
            <Clipboard
              copyText={window.location.href}
              successText="分享链接复制成功"
              errorText="分享链接复制失败"
            >
              <i className="ks-forum-item__footer__share" />
            </Clipboard>
          ))}
        {onDelete && isSelf && (
          <span className="ks-forum-item__footer__delete" onClick={handleDelete}>
            删除
          </span>
        )}
        {!!city && <span className="ks-forum-item__footer__location">{city}</span>}
      </footer>
    </section>
  );
};

export default withRouter(ForumItem);
