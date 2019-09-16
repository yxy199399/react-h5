import React from 'react';
import cs from 'classnames';
import moment from 'moment';
import { Link } from 'react-router-dom';
import { useSetState, useMount } from 'react-use';

// import Drawer from 'src/components/Drawer';
import NavBar from 'src/components/Nav/NavBar';
import Image from 'src/components/Image';
import Title from 'src/components/Title';
import Tags from 'src/components/Tags';
import Vote from 'src/components/Vote';
import RandomColorBar from 'src/components/RandomColorBar';
import Attachment from 'src/components/Attachment';
import ShareBtn from 'src/components/ShareBtn';
import RichTextView from 'src/components/RichTextView';

import { VoteType } from 'src/utils/Constant';
import Api from 'src/utils/Api';
import Tools from 'src/utils/Tools';
import Share from 'src/utils/Share';
import './EncyclopediaDetail.scss';

const EncyclopediaDetail = props => {
  useMount(() => {
    fetchEncycInfo(encyclopedia_id);
  });

  const encyclopedia_id = props.match.params.id;
  const [state, setState] = useSetState({
    attachShow: false,
    referShow: false,
    data: {},
    subData: [],
    relatedEncyc: [],
    relatedQuestion: []
  });
  const { attachShow, referShow, data, subData, relatedEncyc, relatedQuestion } = state;
  const hasAttach = data.attachment && data.attachment.length > 0;
  const hasRefer = data.source && data.source.length > 0;
  const hasRelatedQuestion = relatedQuestion && relatedQuestion.length > 0;
  const hasRelatedEncyc = relatedEncyc && relatedEncyc.length > 0;

  /**
   * 获取百科详情
   */
  const fetchEncycInfo = async encyclopedia_id => {
    const { data, arr: subData } = await Api.post('/encyclopedias/info', { encyclopedia_id });
    data._shareDesc = Tools.htmlToText(data.content, 50);
    data._shareLogo = Tools.resolveAsset(data.cover, '?imageView2/2/w/200/h/200');
    data._updateAt = moment(data.updated_at).format('YYYY-MM-DD');
    data._cover = Tools.resolveAsset(data.cover, '?imageView2/2/w/750');

    setState({ data, subData });

    // 请求评论
    fetchEncycRelated(data.encyclopedia_id, data.category_id, data.title);

    // 配置微信分享
    Share.updateShareInfo({
      title: data.title,
      desc: data._shareDesc,
      imgUrl: data._shareLogo
    });
  };

  /**
   * 获取相关推荐
   */
  const fetchEncycRelated = async (encyclopedia_id, category_id, title) => {
    const { data } = await Api.post('/encyclopedias/related', {
      encyclopedia_id,
      category_id,
      title
    });
    setState({
      relatedEncyc: data.encyclopedias,
      relatedQuestion: data.questions
    });
  };

  const toggleAttach = () => {
    setState({ attachShow: !attachShow });
  };

  const toggleRefer = () => {
    setState({ referShow: !referShow });
  };

  const resolveLink = link => {
    if (!link) return '';
    if (/^(https?|ftp):\/\//.test(link)) return link;
    return 'http://' + link;
  };

  return (
    <div>
      <NavBar title="百科详情" />
      <div className="share-encyc">
        {/* 封面和标题 */}
        <div className="share-encyc-banner">
          <Image className="share-encyc-banner__cover" src={data._cover} />
          <i className="share-encyc-banner__mask" />
          <Title className="share-encyc-banner__title">{data.title}</Title>
          {data.updated_at && (
            <span className="share-encyc-banner__date">编辑于：{data._updateAt}</span>
          )}
        </div>

        <div className="share-encyc-panel">
          {/* 标签 */}
          <div className="share-encyc-tags">
            <Tags data={data.label} />
          </div>

          {/* 点赞 */}
          <div className="share-encyc-vote">
            <Vote
              key={data.source_id}
              status={data.vote_status}
              number={data.like_num}
              type={VoteType.ENCYCLOPEDIA}
              sourceId={data.source_id}
            />
          </div>

          {/* 简介 */}
          <div className="share-encyc-box">
            <div className="share-encyc-box__header">
              <div className="share-encyc-box__header__bar">
                <RandomColorBar />
              </div>
              <h3 className="share-encyc-box__header__title">简介</h3>
            </div>
            <RichTextView html={data.content} />
          </div>

          {/* 其他介绍 */}
          <div className="share-encyc-box">
            {subData.map(item => (
              <React.Fragment key={item.id}>
                <div className="share-encyc-box__header">
                  <div className="share-encyc-box__header__bar">
                    <RandomColorBar />
                  </div>
                  <h3 className="share-encyc-box__header__title">{item.name}</h3>
                </div>
                <RichTextView html={item.content} />
                {(item.next || []).map(sub => (
                  <React.Fragment key={sub.id}>
                    <h4 className="share-encyc-box__subtitle">{sub.name}</h4>
                    <RichTextView html={sub.content} />
                  </React.Fragment>
                ))}
              </React.Fragment>
            ))}
          </div>
        </div>

        {(hasAttach || hasRefer) && (
          <div className="share-encyc-panel">
            {/* 附件 */}
            {hasAttach && (
              <div
                className={cs('share-encyc-attach', { 'share-encyc-attach--hide': !attachShow })}
              >
                <div className="share-encyc-titlebar" onClick={toggleAttach}>
                  <h3 className="share-encyc-titlebar__title">
                    <i className="share-encyc-titlebar__icon" />
                    <span>附件（{data.attachment.length}）</span>
                  </h3>
                  <i className="share-encyc-titlebar__arrow" />
                </div>
                <div className="share-encyc-attach__body">
                  <Attachment data={data.attachment} />
                </div>
              </div>
            )}

            {/* 参考文献 */}
            {hasRefer && (
              <div className={cs('share-encyc-refer', { 'share-encyc-refer--hide': !referShow })}>
                <div className="share-encyc-titlebar" onClick={toggleRefer}>
                  <h3 className="share-encyc-titlebar__title">
                    <i className="share-encyc-titlebar__icon" />
                    <span>参考文献</span>
                  </h3>
                  <i className="share-encyc-titlebar__arrow" />
                </div>
                <nav className="share-encyc-refer__list">
                  {data.source.map((item, idx) => (
                    <a
                      key={idx}
                      className={cs('share-encyc-refer__item', {
                        'share-encyc-refer__item--active': item.link
                      })}
                      href={resolveLink(item.link)}
                      disabled={!item.link}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      [{idx + 1}] {item.name}
                    </a>
                  ))}
                </nav>
              </div>
            )}
          </div>
        )}

        <div className="share-encyc-panel share-encyc-study clearfix">
          <div className="share-encyc-titlebar">
            <h3 className="share-encyc-titlebar__title">
              <i className="share-encyc-titlebar__icon" />
              <span>学海无涯</span>
            </h3>
          </div>

          {!hasRelatedEncyc && !hasRelatedQuestion && (
            <div className="share-encyc-empty">暂时没有数据哦～</div>
          )}

          {/* 推荐问题 */}
          {hasRelatedQuestion &&
            relatedQuestion.map(item => (
              <Link to={`/questions/${item.question_id}`} key={item.question_id}>
                <div className="share-encyc-question">
                  <h4 className="share-encyc-question__title">{item.title}</h4>
                  <Tags
                    className="share-encyc-question__tag"
                    data={item.tagsname.map(name => ({ name }))}
                  />
                  <div className="share-encyc-question__footer">
                    <span>{item.view_num}次浏览</span>
                    <span>{Tools.getTimeAgo(item.created_at)}</span>
                  </div>
                </div>
              </Link>
            ))}

          {/* 推荐百科 */}
          {hasRelatedEncyc &&
            relatedEncyc.map(item => (
              <Link to={`/encyclopedias/${item.encyclopedia_id}`} key={item.encyclopedia_id}>
                <div className="share-encyc-encyc">
                  <Image
                    className="share-encyc-encyc__cover"
                    src={Tools.resolveAsset(item.cover)}
                  />
                  <div className="share-encyc-encyc__cont">
                    <h4 className="share-encyc-encyc__title">{item.title}</h4>
                    <div className="share-encyc-encyc__meta">
                      <span>{item.view_num}次浏览</span>
                      <span>{Tools.getTimeAgo(item.created_at)}</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
        </div>

        {/* 分享按钮 */}
        <ShareBtn />
      </div>
    </div>
  );
};

export default EncyclopediaDetail;
