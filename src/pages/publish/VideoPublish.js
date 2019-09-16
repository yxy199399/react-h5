import React from 'react';
import { useSetState, useMount } from 'react-use';
import { Toast } from 'antd-mobile';
import cs from 'classnames';
import axios from 'axios';

import Agreement from 'src/components/Forms/Agreement';
import AutoHeightTextarea from 'src/components/Forms/AutoHeightTextarea';
import DropMenu from 'src/components/Forms/DropMenu';
// import Switch from 'src/components/Forms/Switch';
import VideoPicker from 'src/components/Forms/VideoPicker';
import FilePicker from 'src/components/Forms/FilePicker';
import NavBar from 'src/components/Nav/NavBar';

import Api from 'src/utils/Api';
import Tools from 'src/utils/Tools';
import { FileType, FileSize } from 'src/utils/Constant';
import './publish.scss';

const types2 = [
  { name: '体验分享', value: 1 },
  { name: '制作教程', value: 2 },
  { name: '基础理论', value: 3 }
];

const reprintData = [{ name: '允许转载', value: 1 }, { name: '禁止转载或摘编', value: 2 }];

const VideoPublish = props => {
  const [state, setState] = useSetState({
    type: '',
    course: false,
    video: [],
    title: '',
    label: [],
    description: '',
    attachment: [],
    source: [],
    type2: '',
    age: '',
    reprint: 1,

    ageData: [],
    type2Show: false,
    types: [],
    typeShow: false,
    agree: false,
    agreeShow: false,
    labelText: '',
    sourceText: '',
    more: false
  });

  // 切换显示更多
  const toggleMore = () => {
    setState(state => ({ more: !state.more }));
  };

  // 获取类型
  const fetchType = async () => {
    const { data } = await Api.post('/category/list');
    const types = data.map(item => ({
      name: item.name,
      icon: Tools.resolveAsset(item.images),
      id: item.menu_id
    }));
    setState({ types });
  };

  // 切换类型下拉显示
  const toggleType = typeShow => {
    if (typeof typeShow === 'boolean') {
      setState({ typeShow });
    } else {
      setState(state => ({ typeShow: !state.typeShow }));
    }
  };

  const handleTypeClick = evt => {
    toggleType();
  };

  // 选中类别
  const handleTypeSelect = item => {
    setState({ type: item });
  };

  // // 切换是否是课程
  // const handleToggleCourse = course => {
  //   setState({ course });
  // };

  // 视频上传
  const handleVideoChange = state => {
    setState({ video: state.files });
  };

  // 输入框改变
  const handleTextChange = name => evt => {
    const val = evt.target.value;
    setState({ [name]: val });
  };

  // 文件上传
  const handleFileChange = state => {
    setState({ attachment: state.files });
  };

  // 添加标签
  const addLabel = () => {
    const text = state.labelText.trim();

    if (!text) return;
    if (~state.label.indexOf(text)) return;
    if (state.label.length >= 5) return;
    if (/[A-Za-z]/.test(text)) {
      if (text.split(' ').length > 8) return;
    } else {
      if (text.length > 8) return;
    }

    setState(state => ({
      label: [...state.label, text],
      labelText: ''
    }));
  };

  // 删除标签
  const removeLabel = index => evt => {
    setState(state => ({
      label: state.label.filter((item, key) => key !== index)
    }));
  };

  // 添加零件
  const addSource = () => {
    const text = state.sourceText.trim();

    if (!text) return;
    if (state.source.some(i => i.name === text)) return;
    if (state.source.length >= 15) return;

    setState(state => ({
      source: [...state.source, { name: text, path: '' }],
      sourceText: ''
    }));
  };

  // 零件url修改
  const updateSource = index => evt => {
    const path = evt.target.value;
    setState(state => ({
      source: state.source.map((item, key) => {
        if (index === key) {
          return { ...item, path };
        } else {
          return item;
        }
      })
    }));
  };

  // 删除零件
  const removeSource = index => evt => {
    setState(state => ({
      source: state.source.filter((item, key) => key !== index)
    }));
  };

  // 同意用户协议
  const handleAgree = () => {
    setState(state => ({ agree: !state.agree }));
  };

  // 显示用户协议
  const toggleAgreeShow = evt => {
    evt.stopPropagation();
    setState(state => ({ agreeShow: !state.agreeShow }));
  };

  // 发布
  const handleSubmit = async () => {
    const video = state.video
      .filter(f => f.path)
      .map(f => ({ name: f.name, path: f.path, source: f.source, video_type: f.video_type }));
    const files = state.attachment.filter(f => f.path).map(f => ({ name: f.name, path: f.path }));
    const source = state.source.map(f => ({ partName: f.name, link: f.path }));

    if (!state.type) return Toast.info('请选择类别');
    if (!state.type2) return Toast.info('请选择类型');
    if (!video.length) return Toast.info('请上传视频');
    if (!state.title) return Toast.info('请填写标题');
    if (!state.label.length) return Toast.info('请添加标签');
    if (!state.age) return Toast.info('请选择年龄段');
    if (!state.reprint) return Toast.info('请选择转载权限');
    if (!state.agree) return Toast.info('需要接受用户协议');
    Toast.loading('发布中...');

    // const videoPath = video && video[0] && video[0].path;
    const videoSource = video && video[0] && video[0].source;
    const res = await axios.get(videoSource + '?avinfo');
    const video_length = res.data.format.duration;

    let integrity = 0;

    if (state.course) {
      integrity = 100;
    } else {
      if (video_length >= 3 * 60) {
        integrity += 20;
      }

      if (state.description.length >= 150) {
        integrity += 15;
      }

      integrity += state.label.length * 20;
    }

    const params = {
      content_type: state.type2 ? state.type2.value : '',
      suit_age: state.age,
      is_share: state.reprint,
      category_id: state.type && state.type.id,
      is_course: Number(state.course),
      title: state.title,
      description: state.description,
      video: video,
      video_length,
      // image: null,
      // attachment: files.length ? files : null,
      // label: state.label.length ? state.label : null,
      // source: state.source.length ? state.source : null,
      integrity
    };

    if (files.length) {
      params.attachment = files;
    }

    if (state.label.length) {
      params.label = state.label;
    }

    if (source.length) {
      params.source = source;
    }

    await Api.post('/videos/upload', params);
    Toast.info('发布成功');
    props.history.push(`/publish/success?title=${encodeURIComponent('发视频')}`);
  };

  // 切换类型下拉菜单
  const toggleType2 = () => {
    setState(state => ({ type2Show: !state.type2Show }));
  };

  // 选择类型
  const selectType2 = item => {
    setState({ type2: item });
  };

  // 选择年龄阶段
  const toggleAge = age => () => {
    setState({ age });
  };

  // 选择转载权限
  const toggleReprint = reprint => () => {
    setState({ reprint });
  };

  // 获取年龄阶段
  const fetchAgeData = async () => {
    const { data } = await Api.get('/h5/user/suitAge');
    setState({ ageData: data.filter(n => n.value) });
  };

  useMount(() => {
    fetchType();
    fetchAgeData();
  });

  if (state.agreeShow) {
    return <Agreement type="h5_user" onConfirm={toggleAgreeShow} onBack={toggleAgreeShow} />;
  }

  return (
    <div>
      <NavBar title="发视频" right={<NavBar.Btn onClick={handleSubmit}>发布</NavBar.Btn>} />

      <div className="publish-row">
        <div className="publish-item__bar" onClick={handleTypeClick}>
          <i
            className={cs('publish-item__icon', {
              'publish-item__icon--empty': !state.type
            })}
            style={state.type ? { backgroundImage: `url("${state.type.icon}")` } : null}
          />
          <div
            className={cs('publish-item__label', {
              'publish-item__label--required': !state.type
            })}
          >
            {state.type ? state.type.name : '选择类别'}
          </div>
          <div className="publish-item__extra">
            <i
              className={cs('publish-item__arrowdown ', {
                'publish-item__arrowdown--sel': state.typeShow
              })}
            />
          </div>

          <DropMenu show={state.typeShow} data={state.types} onSelect={handleTypeSelect} />
        </div>
        <div className="publish-item__bar" onClick={toggleType2}>
          <div
            className={cs({
              'publish-item__label ': true,
              'publish-item__label--required': !state.type2
            })}
          >
            {state.type2 ? state.type2.name : '类型'}
          </div>
          <div className="publish-item__extra">
            <i
              className={cs('publish-item__arrowdown ', {
                'publish-item__arrowdown--sel': state.type2Show
              })}
            />
            {/* <Switch checkedText="教程" unCheckedText="普通" onChange={handleToggleCourse} /> */}
          </div>
          <DropMenu show={state.type2Show} data={types2} onSelect={selectType2} />
        </div>
      </div>

      <VideoPicker onChange={handleVideoChange} />

      <div className="publish-group">
        {/* 标题 */}
        <div className="publish-item">
          <div className="publish-item__bar">
            <div className="publish-item__label publish-item__label--required">标题</div>
            <div className="publish-item__center">
              <input
                type="text"
                className="publish-item__field"
                placeholder="填写视频标题"
                onChange={handleTextChange('title')}
                value={state.title}
                maxLength={20}
              />
            </div>
            <div className="publish-item__extra">{state.title.length}/20</div>
          </div>
        </div>

        {/* 标签 */}
        <div className="publish-item">
          <div className="publish-item__bar">
            <div className="publish-item__label publish-item__label--required">标签</div>
            <div className="publish-item__center">
              <input
                type="text"
                className="publish-item__field"
                placeholder="填写标签内容，最多5个"
                value={state.labelText}
                onChange={handleTextChange('labelText')}
              />
            </div>
            <div className="publish-item__side">
              <span className="publish-item__btn" onClick={addLabel}>
                + 添加
              </span>
            </div>
          </div>
          {state.label && state.label.length > 0 && (
            <div className="publish-tags">
              {state.label.map((item, key) => (
                <div className="publish-tags__item" key={key}>
                  <span>{item}</span>
                  <i onClick={removeLabel(key)} />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 年龄段 */}
        <div className="publish-item">
          <div className="publish-item__bar">
            <div className="publish-item__label publish-item__label--required">选择难度系数</div>
          </div>
          <div className="publish-item__cont">
            <div className="publish-sels">
              {state.ageData.map(item => (
                <div
                  className={cs({
                    'publish-sel': true,
                    'publish-sel--active': state.age === item.value
                  })}
                  key={item.value}
                  onClick={toggleAge(item.value)}
                >
                  {item.name}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 转载权 */}
        <div className="publish-item">
          <div className="publish-item__bar">
            <div className="publish-item__label publish-item__label--required">选择转载权限</div>
          </div>
          <div className="publish-item__cont">
            <div className="publish-sels">
              {reprintData.map(item => (
                <div
                  className={cs({
                    'publish-sel': true,
                    'publish-sel--active': state.reprint === item.value
                  })}
                  key={item.value}
                  onClick={toggleReprint(item.value)}
                >
                  {item.name}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 查看更多 */}
        {!state.more && (
          <div className="publish-item" onClick={toggleMore}>
            <div className="publish-more">查看更多选项</div>
          </div>
        )}
      </div>

      {state.more && (
        <div className="publish-group">
          {/* 介绍 */}
          <div className="publish-item">
            <div className="publish-item__bar">
              <div className="publish-item__label">介绍</div>
              <div className="publish-item__center">选填视频的详细介绍</div>
              <div className="publish-item__extra">{state.description.length}/800</div>
            </div>
            <div className="publish-item__body">
              <AutoHeightTextarea
                className="publish-item__textarea"
                rows="6"
                value={state.description}
                onChange={handleTextChange('description')}
                maxLength={800}
              />
            </div>
          </div>

          {/* 附件 */}
          <div className="publish-item">
            <div className="publish-item__bar">
              <div className="publish-item__label">附件</div>
              <div className="publish-item__center">(选填，最多5个，每个不超过30MB)</div>
            </div>
            <div className="publish-item__cont" style={{ margin: '0 -.24rem' }}>
              <FilePicker
                max={5}
                type={FileType.ATTACH}
                size={FileSize.ATTACH}
                onChange={handleFileChange}
              />
            </div>
          </div>

          {/* 零件 */}
          <div className="publish-item">
            <div className="publish-item__bar">
              <div className="publish-item__label">使用的零件/软件</div>
              <div className="publish-item__center">(选填，最多15个，每个最多8个字)</div>
            </div>
            {state.source && state.source.length > 0 && (
              <div className="publish-item__cont">
                {state.source.map((item, key) => (
                  <div className="publish-gear" key={key}>
                    <div className="publish-gear__tag">
                      <span>{item.name}</span>
                      <i onClick={removeSource(key)} />
                    </div>
                    <input
                      className="publish-gear__field"
                      type="text"
                      placeholder="选填链接地址"
                      value={item.path}
                      onChange={updateSource(key)}
                    />
                  </div>
                ))}
              </div>
            )}

            <div className="publish-item__bar">
              <div className="publish-item__center">
                <input
                  type="text"
                  className="publish-item__field"
                  placeholder="填写零件/软件名称"
                  maxLength={8}
                  value={state.sourceText}
                  onChange={handleTextChange('sourceText')}
                />
              </div>
              <div className="publish-item__side">
                <span className="publish-item__btn" onClick={addSource}>
                  + 添加
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      <p
        className={cs('publish-agreement', {
          'publish-agreement--sel': state.agree
        })}
        onClick={handleAgree}
      >
        <i />
        <span>我已阅读并接受</span>
        <em onClick={toggleAgreeShow}>《酷耍用户协议》</em>
      </p>
    </div>
  );
};

export default VideoPublish;
