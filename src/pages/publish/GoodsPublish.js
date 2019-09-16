import React from 'react';
import { useSetState, useMount } from 'react-use';
import cs from 'classnames';
import axios from 'axios';

import CityPicker2 from 'src/components/Forms/CityPicker2';
import AutoHeightTextarea from 'src/components/Forms/AutoHeightTextarea';
import FilePicker from 'src/components/Forms/FilePicker';
import VideoPicker from 'src/components/Forms/VideoPicker';
import NavBar from 'src/components/Nav/NavBar';
import DropMenu from 'src/components/Forms/DropMenu';
import Image from 'src/components/Image';
import Agreement from 'src/components/Forms/Agreement';
import './publish.scss';
import './GoodsPublish.scss';

import { FileSize, FileType } from 'src/utils/Constant';
import Api from 'src/utils/Api';
import Tools from 'src/utils/Tools';
import useUploader from 'src/hooks/useUploader';
import { Toast } from 'antd-mobile';

const GoodsPublish = props => {
  const [state, setState] = useSetState({
    type: null,
    // cover: [],
    // images: [],
    title: '',
    tags: [],
    desc: '',
    price: '',
    stock: '',
    city: null,
    videos: [],
    attach: [],
    agree: false,

    tagText: '',
    more: false,
    agreeShow: false,
    typeShow: false,
    types: []
  });

  const [coverState, coverActions] = useUploader({
    type: FileType.IMAGE,
    max: 1,
    size: FileSize.IAMGE
  });
  const [imageState, imageActions] = useUploader({
    type: FileType.IMAGE,
    max: 9,
    size: FileSize.IAMGE
  });

  const handleSubmit = async () => {
    const getFile = item =>
      item
        .filter(f => f.path)
        .map(f => {
          const item = { name: f.name, path: f.path };
          if (f.video_type) {
            item.video_type = f.video_type;
          }
          return item;
        });

    const covers = getFile(coverState.files);
    const images = getFile(imageState.files);
    const allImages = covers.concat(images);
    const videos = getFile(state.videos);
    const attach = getFile(state.attach);

    const params = {
      category_id: state.type ? state.type.id : null,
      image: allImages,
      title: state.title,
      tags: state.tags,
      content: state.desc,
      price: state.price,
      stock: Number(state.stock),
      province: state.city && state.city[0],
      city: state.city && state.city[1],
      district: state.city && state.city[2],
      video: videos,
      attachment: attach,
      video_length: 0,
      integrity: 0,
      agreement_status: Number(state.agree)
    };

    if (!params.category_id) return Toast.info('请选择类别');
    if (!covers.length) return Toast.info('请添加封面');
    if (!images.length) return Toast.info('请添加图片');
    if (!params.title) return Toast.info('请填写标题');
    if (!params.tags.length) return Toast.info('请添加标签');
    if (!params.content.length) return Toast.info('请填写商品详情');
    if (params.price === '') return Toast.info('请填写单价');
    if (state.stock === '') return Toast.info('请填写库存');
    if (isNaN(params.stock) || params.stock > 10 || params.stock < 1)
      return Toast.info('库存最多允许10个');
    if (!params.province) return Toast.info('请选择省市区');
    if (!state.agree) return Toast.info('发布前需要同意酷耍用户协议');
    Toast.loading('发布中...');

    const videoSource = videos && videos[0] && videos[0].source;

    if (videoSource) {
      const res = await axios.get(videoSource + '?avinfo');
      params.video_length = res.data.format.duration;
    }

    params.integrity += Math.min(4, allImages.length) * 10;
    params.integrity += params.video.length ? 20 : 0;
    params.integrity += params.attachment.length ? 10 : 0;
    params.integrity += params.tags.length * 10;

    await Api.post('/goods/create', params);
    Toast.info('发布成功');
    props.history.push(`/publish/success?title=${encodeURIComponent('发布淘货')}`);
  };

  const handleTextChange = name => evt => {
    const value = evt.target.value;
    setState({ [name]: value });
  };

  // 添加标签
  const addTag = () => {
    const tag = state.tagText.trim();
    if (!tag) return;
    if (~state.tags.indexOf(tag)) return;
    if (state.tags.length >= 5) return;
    if (/[A-Za-z]/.test(tag)) {
      if (tag.split(' ').length > 8) return;
    } else {
      if (tag.length > 8) return;
    }
    setState(state => ({ tags: [...state.tags, tag], tagText: '' }));
  };

  // 删除标签
  const removeTag = key => evt => {
    setState(state => ({ tags: state.tags.filter((t, k) => k !== key) }));
  };

  // 查看更多
  const toggleMore = () => {
    setState(state => ({ more: !state.more }));
  };

  // 同意协议
  const handleAgree = () => {
    setState(state => ({ agree: !state.agree }));
  };

  // 显示协议
  const toggleAgreeShow = evt => {
    evt.stopPropagation();
    evt.preventDefault();
    setState(state => ({ agreeShow: !state.agreeShow }));
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

  // 选择类型
  const selectType = item => {
    setState({ type: item });
  };

  // 显示类型
  const toggleTypeShow = () => {
    setState(state => ({ typeShow: !state.typeShow }));
  };

  // 选择视频
  const onVideoChange = data => {
    setState({ videos: data.files });
  };

  // 选择附件
  const onAttachChange = data => {
    setState({ attach: data.files });
  };

  // 选择省市区
  const selectCity = value => {
    setState({ city: value });
  };

  // 选择省市区item
  const CityPickerChild = props => {
    return (
      <div
        className="publish-item"
        onClick={props.onClick}
        style={{ borderBottom: '1px solid #ebedf0' }}
      >
        <div className="publish-item__bar">
          <div className="publish-item__label publish-item__label--required">所在地区</div>
          <div className="publish-item__center" style={state.city ? { color: '#323333' } : null}>
            {props.extra}
          </div>
          <div className="publish-item__extra">
            <i className="publish-item__arrow" />
          </div>
        </div>
      </div>
    );
  };

  useMount(() => {
    fetchType();
  });

  if (state.agreeShow) {
    return <Agreement type="h5_user" onConfirm={toggleAgreeShow} onBack={toggleAgreeShow} />;
  }

  return (
    <div className="goods-publish">
      <NavBar title="卖闲置" right={<NavBar.Btn onClick={handleSubmit}>发布</NavBar.Btn>} />

      {/* <CityPicker2 /> */}

      <div className="publish-group">
        {/* 选择类型 */}
        <div className="publish-item">
          <div className="publish-item__bar" onClick={toggleTypeShow}>
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
              <i className="publish-item__arrow" />
            </div>

            <DropMenu show={state.typeShow} data={state.types} onSelect={selectType} />
          </div>
        </div>
        <div className="publish-item">
          <div className="publish-item__bar">
            <div className="publish-item__label publish-item__label--required">图片展示</div>
          </div>
          <div className="publish-item__body goods-publish__cover" style={{ margin: '0 -.24rem' }}>
            <div className="ks-file-picker">
              {/* 上传封面 */}
              {coverState.files.map(item => (
                <div className="ks-file-picker__item" key={item.id}>
                  {/* 图片和视频类型显示预览图 */}
                  <Image src={item.thumb} />

                  {/* 显示上传动画 */}
                  {item.percent < 100 && (
                    <>
                      <i className="ks-file-picker__mask" style={{ height: item.percent + '%' }} />
                      <i className="ks-file-picker__percent">{item.percent}%</i>
                    </>
                  )}

                  {/* 删除按钮 */}
                  <i
                    className="ks-file-picker__close"
                    onClick={() => coverActions.remove(item.id)}
                  />
                </div>
              ))}

              {coverState.files.length < coverState.max && (
                <div className="ks-file-picker__item" onClick={coverActions.add}>
                  <i className="ks-file-picker__plus" />
                  <span className="ks-file-picker__text">封面</span>
                </div>
              )}

              {/* 上传图片 */}
              {imageState.files.map(item => (
                <div className="ks-file-picker__item" key={item.id}>
                  {/* 图片和视频类型显示预览图 */}
                  <Image src={item.thumb} />

                  {/* 显示上传动画 */}
                  {item.percent < 100 && (
                    <>
                      <i className="ks-file-picker__mask" style={{ height: item.percent + '%' }} />
                      <i className="ks-file-picker__percent">{item.percent}%</i>
                    </>
                  )}

                  {/* 删除按钮 */}
                  <i
                    className="ks-file-picker__close"
                    onClick={() => imageActions.remove(item.id)}
                  />
                </div>
              ))}

              {imageState.files.length < imageState.max && (
                <div className="ks-file-picker__item" onClick={imageActions.add}>
                  <i className="ks-file-picker__plus" />
                  <span className="ks-file-picker__text">
                    {imageState.files.length}/{imageState.max}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 标题 */}
        <div className="publish-item">
          <div className="publish-item__bar">
            <div className="publish-item__label publish-item__label--required">标题</div>
            <div className="publish-item__center">
              <input
                type="text"
                className="publish-item__field"
                placeholder="填写商品标题"
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
                value={state.tagText}
                onChange={handleTextChange('tagText')}
              />
            </div>
            <div className="publish-item__side">
              <span className="publish-item__btn" onClick={addTag}>
                + 添加
              </span>
            </div>
          </div>
          {state.tags && state.tags.length > 0 && (
            <div className="publish-tags">
              {state.tags.map((item, key) => (
                <div className="publish-tags__item" key={key}>
                  <span>{item}</span>
                  <i onClick={removeTag(key)} />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 商品详情 */}
        <div className="publish-item">
          <div className="publish-item__bar">
            <div className="publish-item__label publish-item__label--required">商品详情</div>
            <div className="publish-item__center" />
            <div className="publish-item__extra">{state.desc.length}/1000</div>
          </div>
          <div className="publish-item__body">
            <AutoHeightTextarea
              className="publish-item__textarea"
              placeholder="填写商品的详细介绍"
              rows="6"
              value={state.desc}
              onChange={handleTextChange('desc')}
              maxLength={1000}
            />
          </div>
        </div>
      </div>

      <div className="publish-group">
        {/* 单价&库存 */}
        <div className="publish-item goods-publish__row">
          <div className="publish-row">
            <div className="publish-item__bar">
              <div className="publish-item__label publish-item__label--required">单价</div>
              <div className="publish-item__center">
                <input
                  type="text"
                  className="publish-item__field publish-item__field--orange"
                  placeholder="0.00"
                  onChange={handleTextChange('price')}
                  value={state.price}
                />
              </div>
              <div className="publish-item__extra">&yen;</div>
            </div>
            <div className="publish-item__bar">
              <div className="publish-item__label publish-item__label--required">库存</div>
              <div className="publish-item__center">
                <input
                  type="text"
                  className="publish-item__field"
                  placeholder="最多10"
                  onChange={handleTextChange('stock')}
                  value={state.stock}
                />
              </div>
              <div className="publish-item__extra">件</div>
            </div>
          </div>
        </div>

        {/* 所在地区 */}
        <CityPicker2 onSelect={selectCity}>
          <CityPickerChild />
        </CityPicker2>

        {/* 查看更多 */}
        {!state.more && (
          <div className="publish-item" onClick={toggleMore}>
            <div className="publish-more">查看更多选项</div>
          </div>
        )}
      </div>

      {state.more && (
        <div className="publish-group">
          {/* 上传视频 */}
          <div className="publish-item">
            <div className="publish-item__bar">
              <div className="publish-item__label">上传视频</div>
              <div className="publish-item__center">(选填)</div>
              <div className="publish-item__extra" />
            </div>
            <div className="publish-item__center goods-publish__video">
              <VideoPicker size={FileSize.VIDEO} onChange={onVideoChange}>
                <i className="ks-video-picker__tips__icon" />
                <span className="ks-video-picker__tips__title">上传视频</span>
                <p className="ks-video-picker__tips__info">视频大小不超过2G</p>
                <p className="ks-video-picker__tips__info">
                  支持格式：mp4、flv、avi、mov、rmvb、mkv…
                </p>
              </VideoPicker>
            </div>
          </div>

          {/* 附件 */}
          <div className="publish-item">
            <div className="publish-item__bar">
              <div className="publish-item__label">附件</div>
              <div className="publish-item__center">(选填，最多5个，每个不超过30MB)</div>
            </div>
            <div className="publish-item__body" style={{ margin: '0 -.24rem' }}>
              <FilePicker
                max={5}
                type={FileType.ATTACH}
                size={FileSize.ATTACH}
                onChange={onAttachChange}
              />
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

export default GoodsPublish;
