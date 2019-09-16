import React from 'react';
import { useSetState, useMount } from 'react-use';
import cs from 'classnames';
import { Toast } from 'antd-mobile';

import Agreement from 'src/components/Forms/Agreement';
import NavBar from 'src/components/Nav/NavBar';
// import Switch from 'src/components/Forms/Switch';
import DropMenu from 'src/components/Forms/DropMenu';
import Image from 'src/components/Image';

import Api from 'src/utils/Api';
import Tools from 'src/utils/Tools';
import { FileSize, FileType } from 'src/utils/Constant';
import useUploader from 'src/hooks/useUploader';
import './publish.scss';
import './PublishArticle.scss';

const types2 = [
  { name: '体验分享', value: 1 },
  { name: '制作教程', value: 2 },
  { name: '基础理论', value: 3 }
];

// const ageData = [
//   { name: '小学', value:  }
// ]

const reprintData = [{ name: '允许转载', value: 1 }, { name: '禁止转载或摘编', value: 2 }];

const PublishArticle = props => {
  const [state, setState] = useSetState({
    type: null,
    type2: null,
    course: false,
    title: '',
    label: [],
    link: '',
    reprint: 1,
    age: null,

    ageData: [],
    labelText: '',
    types: [],
    agree: false,
    agreeShow: false,
    typeShow: false,
    type2Show: false
  });
  const [coverState, coverActions] = useUploader({
    size: FileSize.IAMGE,
    type: FileType.IMAGE,
    max: 1
  });

  const handleSubmit = async () => {
    const getFiles = f => f.filter(f => f.path).map(f => ({ name: f.name, path: f.path }));
    const covers = getFiles(coverState.files);

    const params = {
      category_id: state.type ? state.type.id : null,
      is_course: Number(state.course),
      content_type: state.type2 ? state.type2.value : null,
      image: covers.length ? covers : null,
      title: state.title,
      label: state.label,
      content: state.link,
      word_num: state.link.length,
      is_link: 1,
      agreement_status: Number(state.agree),
      integrity: 40,
      is_share: state.reprint,
      suit_age: state.age
    };

    if (!params.category_id) return Toast.info('请选择类别');
    if (!params.content_type) return Toast.info('请选择类型');
    if (!covers.length) return Toast.info('请上传封面');
    if (!params.title) return Toast.info('请添加标题');
    if (!params.label.length) return Toast.info('请添加标签');
    if (!params.content) return Toast.info('请添加链接');
    if (!params.suit_age) return Toast.info('请选择年龄阶段');
    if (!params.is_share) return Toast.info('请选择转载权限');
    if (!params.agreement_status) return Toast.info('需要用意用户协议');
    Toast.loading('发布中...');

    if (params.is_course) {
      params.integrity = 100;
    } else {
      params.integrity += params.label.length * 20;
    }

    Toast.loading('发布中...');
    await Api.post('/article/upload', params);
    Toast.info('发布成功');
    props.history.push(`/publish/success?title=${encodeURIComponent('发文章')}`);
  };

  const fetchAgeData = async () => {
    const { data } = await Api.get('/h5/user/suitAge');
    setState({ ageData: data.filter(n => n.value) });
  };

  // 获取类型
  const fetchType = async () => {
    const { data } = await Api.post('/category/list');
    const types = data.map(item => ({
      name: item.name,
      icon: Tools.resolveAsset(item.images, '?imageView2/2/w/42/h/42'),
      id: item.menu_id
    }));
    setState({ types });
  };

  // 切换类别下拉显示
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

  // 切换类型下拉
  const toggleType2 = bool => {
    if (typeof bool === 'boolean') {
      setState({ type2Show: bool });
    } else {
      setState(state => ({ type2Show: !state.type2Show }));
    }
  };

  // 选择类型
  const handleType2Select = item => {
    setState({ type2: item });
  };

  // 切换是否是课程
  // const handleToggleCourse = course => {
  //   setState({ course });
  // };

  // 输入框改变
  const handleTextChange = name => evt => {
    const val = evt.target.value;
    setState({ [name]: val });
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

  // 同意用户协议
  const handleAgree = () => {
    setState(state => ({ agree: !state.agree }));
  };

  // 显示用户协议
  const toggleAgreeShow = evt => {
    evt.stopPropagation();
    setState(state => ({ agreeShow: !state.agreeShow }));
  };

  // 选择年龄
  const toggleAge = value => () => {
    setState({ age: value });
  };

  // 选择转载权
  const toggleReprint = value => () => {
    setState({ reprint: value });
  };

  useMount(() => {
    fetchType();
    fetchAgeData();
  });

  if (state.agreeShow) {
    return <Agreement type="h5_user" onConfirm={toggleAgreeShow} onBack={toggleAgreeShow} />;
  }

  return (
    <div className="publish-article">
      <NavBar title="上传文章" right={<NavBar.Btn onClick={handleSubmit}>发布</NavBar.Btn>} />

      {/* 类型&教程 */}
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
        <div className="publish-item__bar" onClick={e => toggleType2()}>
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
          <DropMenu show={state.type2Show} data={types2} onSelect={handleType2Select} />
        </div>
      </div>

      {/* 设置封面 */}
      <div className="publish-article-cover">
        {coverState.files.length ? (
          <div className="publish-article-cover__preview">
            <Image src={coverState.files[0].thumb} />
            <i onClick={() => coverActions.remove(coverState.files[0].id)} />
          </div>
        ) : (
          <div className="publish-article-cover__upload" onClick={coverActions.add}>
            <i />
            <h4>设置封面图</h4>
            <p>建议比例16:9，格式jpeg、png</p>
            <p>文件大小&lt;20MB，建议尺寸≧712x400</p>
          </div>
        )}
      </div>

      <div className="publish-group">
        {/* 标题 */}
        <div className="publish-item">
          <div className="publish-item__bar">
            <div className="publish-item__label publish-item__label--required">标题</div>
            <div className="publish-item__center">
              <input
                type="text"
                className="publish-item__field"
                placeholder="填写文章标题"
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

        {/* 文章链接 */}
        <div className="publish-item">
          <div className="publish-item__bar">
            <div className="publish-item__label publish-item__label--required">文章链接</div>
          </div>
          <div className="publish-article-link">
            <input
              type="text"
              placeholder="输入链接的全称如 https、http://…"
              value={state.link}
              onChange={handleTextChange('link')}
            />
          </div>
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
      </div>

      {/* 用户协议 */}
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

export default PublishArticle;
