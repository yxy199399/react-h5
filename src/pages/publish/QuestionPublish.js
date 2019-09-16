import React from 'react';
import { useSetState } from 'react-use';
import { Toast } from 'antd-mobile';
import cs from 'classnames';

import Api from 'src/utils/Api';

import NavBar from 'src/components/Nav/NavBar';
import VideoPicker from 'src/components/Forms/VideoPicker';
import FilePicker from 'src/components/Forms/FilePicker';

import './PublishQuestion.scss';
import Agreement from '../../components/Forms/Agreement';
import { FileSize, FileType } from '../../utils/Constant';
import axios from 'axios';
import Tools from '../../utils/Tools';

const QuestionPublish = props => {
  const [state, setState] = useSetState({
    agree: false, // 是否同意协议
    showProtocol: false, // 是否展示协议
    showCategory: false, // 是否展示类别
    category: [], // 类别列表
    tabIndex: null, // 确认选中类别下标
    tabSelect: 0, // 选中类别下标
    child: [], // 二级类别列表
    childIndex: [], // 确认二级类别选中下标
    childSelected: [], // 二级类别选中id
    childMultiple: [], // 确认二级类别选中下标
    title: '', // 标题
    wordNum: 0, // 标题字数
    titleLimit: 20, // 标题限制字数
    label: [], // 标签
    labelName: '', // 标签名
    description: '', // 描述
    contentNum: 0, // 内容字数
    contentLimit: 200, // 内容限制字数
    moreOption: false, // 是否展示更多选项
    video: [], // 上传的视频
    attachment: [] // 上传的附件
  });
  const {
    agree,
    showProtocol,
    showCategory,
    category,
    tabIndex,
    tabSelect,
    child,
    childSelected,
    childIndex,
    childMultiple,
    title,
    wordNum,
    titleLimit,
    label,
    labelName,
    description,
    contentNum,
    contentLimit,
    moreOption,
    video,
    attachment
  } = state;

  // 发布问题
  const submit = async () => {
    if (!agree) return Toast.info('需要接受用户协议');
    if (!(childSelected && childSelected.length > 0)) return Toast.info('请选择类别');
    if (!title) return Toast.info('请填写标题');
    if (!label.length) return Toast.info('请添加标签');
    if (!description) return Toast.info('请填写描述');
    Toast.loading('发布中...');

    const videoList = video
      .filter(f => f.path)
      .map(f => ({ name: f.name, path: f.path, source: f.source, video_type: f.video_type }));
    const files = attachment.filter(f => f.path).map(f => ({ name: f.name, path: f.path }));

    const params = {
      agreement_status: agree,
      content: description,
      word_num: contentNum,
      category_id: childSelected,
      integrity: 20,
      title,
      label
    };
    params.integrity += label.length * 15;
    if (videoList && videoList.length > 0) {
      // const videoPath = videoList && videoList[0] && videoList[0].path;
      const videoSource = videoList && videoList[0] && videoList[0].source;
      const res = await axios.get(videoSource + '?avinfo');

      const video_length = res.data.format.duration;

      params.video = videoList;
      params.video_length = video_length;
      params.integrity += 20;
    }
    if (files && files.length > 0) {
      params.attachment = files;
      params.integrity += 15;
    }
    await Api.post('/questions/create', params);
    Toast.info('发布成功');
    props.history.push(`/publish/success?title=${encodeURIComponent('提问题')}`);
  };

  // 标题
  const titleChange = e => {
    setState({ title: e.target.value, wordNum: e.target.value.length });
  };

  // 标签
  const labelChange = e => {
    setState({ labelName: e.target.value });
  };

  // 添加标签
  const addLabel = () => {
    const content = labelName.trim();
    if (!content) return Toast.info('请填写标签内容');
    if (label.indexOf(content) !== -1) return Toast.info('标签已存在');
    if (label && label.length >= 5) return Toast.info('最多添加5个');
    if (/[a-zA-Z]/.test(content)) {
      if (content.split(' ').length > 8) return Toast.info('英文标签最多8个单词');
    } else {
      if (content.length > 8) return Toast.info('每个标签最多8个字');
    }
    label.push(content);
    setState({ labelName: '' });
  };

  //删除标签
  const removeLabel = index => {
    setState(state => {
      const arr = label;
      arr.splice(index, 1);
      return { label: arr };
    });
  };

  // 描述
  const descriptionChange = e => {
    setState({ description: e.target.value, contentNum: e.target.value.length });
  };

  // 是否展示更多
  const toggleMore = e => {
    e.preventDefault();
    setState({ moreOption: !moreOption });
  };

  // 视频上传
  const handleVideoChange = state => {
    setState({ video: state.files });
  };

  // 文件上传
  const handleFileChange = state => {
    setState({ attachment: state.files });
  };

  // 是否同意协议
  const toggleAgree = e => {
    e.preventDefault();
    setState({ agree: !agree });
  };

  // 是否展示协议
  const toggleProtocol = e => {
    e.preventDefault();
    setState({ showProtocol: !showProtocol });
  };

  // 获取类别列表
  const getCategory = async () => {
    const { data } = await Api.post('/category/list', { type: 2, level: 1 });
    setState({ category: data });
    return data;
  };

  // 获取二级类别
  const getChild = async id => {
    const { data } = await Api.post('/category/list', { type: 2, level: 2, menu_id: id });
    setState({ child: data });
  };

  // 选择类别
  const selectCategory = e => {
    e.preventDefault();
    if (category && category.length > 0) {
      setState({
        showCategory: !showCategory,
        tabSelect: tabIndex ? tabIndex : 0,
        childMultiple: JSON.parse(JSON.stringify(childIndex))
      });
      getChild(category[tabIndex ? tabIndex : 0].menu_id);
      return;
    }
    getCategory().then(data => {
      getChild(data[0].menu_id);
    });
    setState({ showCategory: !showCategory, tabSelect: 0, childMultiple: [] });
  };

  // 类别选定
  const confirm = e => {
    e.preventDefault();
    e.stopPropagation();
    if (!(childMultiple && childMultiple.length > 0)) return Toast.info('请选择子分类');
    const selected = [];
    childMultiple.forEach(item => {
      selected.push(child[item].menu_id);
    });
    setState({
      showCategory: !showCategory,
      tabIndex: tabSelect,
      childIndex: JSON.parse(JSON.stringify(childMultiple)),
      childSelected: selected
    });
  };

  // 类别取消
  const cancel = e => {
    e.preventDefault();
    e.stopPropagation();
    setState({ showCategory: !showCategory, tabSelect: null, childMultiple: [] });
  };

  if (showProtocol) {
    return <Agreement type="h5_user" onConfirm={toggleProtocol} onBack={toggleProtocol} />;
  }
  if (showCategory) {
    // 一级类别点击事件
    const fatherChecked = (id, index) => {
      setState({ tabSelect: index, childMultiple: [] });
      getChild(id);
    };

    // 二级类别点击事件
    const childChecked = index => {
      // const arr = childSelected;
      const arrIndex = childMultiple;
      const key = arrIndex.indexOf(index);
      if (key !== -1) {
        // arr.splice(key,1);
        arrIndex.splice(key, 1);
      } else if (arrIndex.length >= 2) {
        Toast.info('最多选择两个子分类');
      } else {
        // arr.push(id);
        arrIndex.push(index);
      }
      setState({ childMultiple: arrIndex });
    };

    return (
      <div className="upload-category">
        <NavBar
          title="类别"
          left={<NavBar.Icon type="back" onClick={cancel} />}
          right={<NavBar.Btn onClick={confirm}>确定</NavBar.Btn>}
        />
        <div className="upload-category__body">
          <div className="upload-category__body__father">
            <ul className="upload-category__body__father__list">
              {category.map((item, index) => {
                return (
                  <li
                    key={item.id}
                    className={cs('upload-category__body__father__list__item', {
                      active: tabSelect === index
                    })}
                    onClick={() => fatherChecked(item.menu_id, index)}
                  >
                    <span />
                    <p>{item.name}</p>
                  </li>
                );
              })}
            </ul>
          </div>
          <div className="upload-category__body__child">
            <p className="upload-category__body__child__tips">最多可选两个子分类</p>
            <div className="upload-category__body__child__list">
              {child.map((item, index) => {
                return (
                  <span
                    key={item.id}
                    className={cs(
                      'upload-category__body__child__list__item',
                      { active: childMultiple.indexOf(index) !== -1 },
                      { active_orange: childMultiple.indexOf(index) === 0 }
                    )}
                    onClick={() => childChecked(index)}
                  >
                    {item.name}
                  </span>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <NavBar title="上传问题" right={<NavBar.Btn onClick={submit}>发布</NavBar.Btn>} />
      <div className="upload-question__body">
        {/*类别*/}
        <div className="upload-question__body__category" onClick={selectCategory}>
          <div className="upload-question__body__category__info">
            <div className="upload-question__body__category__info__first">
              <span
                className={cs('upload-question__body__category__info__first__img', {
                  none_pic: !(category && category.length > 0 && tabIndex !== null)
                })}
              >
                {category && category.length > 0 && tabIndex !== null && (
                  <img
                    src={Tools.resolveAsset(category[tabIndex].images, '?imageView2/2/w/54/h/54')}
                    alt=""
                  />
                )}
              </span>
              <span
                className={cs('upload-question__body__category__info__first__txt', {
                  category: category && category.length > 0 && tabIndex !== null
                })}
              >
                {category && category.length > 0 && tabIndex !== null
                  ? category[tabIndex].name
                  : '选择类别'}
              </span>
              {/*<span className="upload-question__body__category__info__first__necessary">*</span>*/}
            </div>
            <div className="upload-question__body__category__info__second">
              {childIndex.map(item => {
                return <span key={item}>{child[item].name}</span>;
              })}
            </div>
          </div>
          <div className="upload-question__body__category__icon" />
        </div>
        {/*标题*/}
        <div className="upload-question__body__item">
          <div className="upload-question__body__item__box">
            <div className="upload-question__body__header">
              <span className="upload-question__body__header__txt">题目</span>
              <span className="upload-question__body__header__necessary">*</span>
            </div>
            <input
              type="text"
              placeholder="填写问题标题"
              value={title}
              maxLength={titleLimit}
              onChange={titleChange}
            />
            <span className="upload-question__body__item__box__limit">
              {wordNum + '/' + titleLimit}
            </span>
          </div>
        </div>
        {/*标签*/}
        <div
          className={cs('upload-question__body__item', { label_item: label && label.length > 0 })}
        >
          <div className="upload-question__body__item__box">
            <div className="upload-question__body__header">
              <span className="upload-question__body__header__txt">标签</span>
              <span className="upload-question__body__header__necessary">*</span>
            </div>
            <input
              type="text"
              placeholder="请填写标签内容,最多5个"
              value={labelName}
              onChange={labelChange}
            />
            <span className="upload-question__body__item__box__button" onClick={addLabel}>
              +&nbsp;添加
            </span>
          </div>
        </div>
        {label && label.length > 0 && (
          <div className="upload-question__body__label">
            {label.map((item, index) => {
              return (
                <div className="upload-question__body__label__item" key={index}>
                  <span className="upload-question__body__label__item__txt">{item}</span>
                  <i
                    className="upload-question__body__label__item__remove"
                    onClick={() => removeLabel(index)}
                  />
                </div>
              );
            })}
          </div>
        )}
        {/*描述*/}
        <div className="upload-question__body__description">
          <div className="upload-question__body__header">
            <span className="upload-question__body__header__txt">问题描述</span>
            <span className="upload-question__body__header__necessary">*</span>
          </div>
          <div className="upload-question__body__description__textarea">
            <textarea
              placeholder="填写问题的详细内容"
              value={description}
              onChange={descriptionChange}
              maxLength={contentLimit}
            />
          </div>
          <div className="upload-question__body__description__word">
            {contentNum + '/' + contentLimit}
          </div>
        </div>
        {!moreOption && (
          <div className="upload-question__body__more" onClick={toggleMore}>
            <span className="upload-question__body__more__txt">查看更多选项</span>
            <span className="upload-question__body__more__icon" />
          </div>
        )}
      </div>
      {moreOption && (
        <div className="upload-question__more">
          {/*上传视频*/}
          <div className="upload-question__more__video">
            <div className="upload-question__more__header">
              <span className="upload-question__more__header__txt">上传视频</span>
              <span className="upload-question__more__header__tips">(选填)</span>
            </div>
            <div className="upload-question__more__video__upload">
              <VideoPicker size={FileSize.VIDEO} onChange={handleVideoChange}>
                <i className="ks-video-picker__tips__icon" />
                <span className="ks-video-picker__tips__title">上传视频</span>
                <p className="ks-video-picker__tips__info">视频大小不超过2G，建议比例16:9</p>
                <p className="ks-video-picker__tips__info">
                  支持格式：mp4、flv、avi、mov、rmvb、mkv…
                </p>
              </VideoPicker>
            </div>
          </div>
          {/*上传附件*/}
          <div className="upload-question__more__files">
            <div className="upload-question__more__header">
              <span className="upload-question__more__header__txt">上传附件</span>
              <span className="upload-question__more__header__tips">
                (选填，最多5个，每个不超过30MB)
              </span>
            </div>
            <div className="upload-question__more__files__upload">
              <FilePicker
                max={5}
                type={FileType.ATTACH}
                size={FileSize.ATTACH}
                onChange={handleFileChange}
              />
            </div>
          </div>
        </div>
      )}
      <div className="upload-question__protocol">
        <div className="upload-question__protocol__checkbox" onClick={toggleAgree}>
          <span className={cs('upload-question__protocol__checkbox__dot', { checked: agree })} />
          <span className="upload-question__protocol__checkbox__txt">我已阅读并接受</span>
        </div>
        <div className="upload-question__protocol__detail" onClick={toggleProtocol}>
          《酷耍用户协议》
        </div>
      </div>
    </div>
  );
};

export default QuestionPublish;
