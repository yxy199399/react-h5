import React, { useImperativeHandle, forwardRef, useEffect } from 'react';
import cs from 'classnames';

import Image from 'src/components/Image';

import { FileType } from 'src/utils/Constant';
import useUploader from 'src/hooks/useUploader';
import './FilePicker.scss';

/**
 * 文件选择器
 *
 * @param {Number} props.max 最大可上传数量
 * @param {Number} props.size 单个文件大小限制 默认不限制
 * @param {FileType} props.type 允许上传的文件类型 默认不限制
 * @param {String} props.btnText 上传按钮+号下面的提示文字
 * @param {Function<File => Boolean>} props.beforeUpload 手动验证文件 返回false则忽略该文件
 *
 * @example
 * <FilePicker
 *  max={2}
 *  size={5 * 1024 * 1024}
 *  type={FileType.IMAGE}
 *  onChange={state => update(state)}
 * />
 *
 * const files = state.files.filter(f => f.path).map(f => ({ name: f.name, path: f.path })) // 获取已经上传成功的文件
 *
 */

const FilePicker = (props, ref) => {
  const { max, size, type, beforeUpload, btnText, onChange, className, ...rest } = props;
  const [state, actions] = useUploader({ type, max, size, beforeUpload });

  // 将actions暴露给外部ref
  useImperativeHandle(ref, () => actions, [state]);

  // 触发change事件
  useEffect(() => {
    onChange && onChange(state);
  }, [state]);

  return (
    <div className={cs('ks-file-picker', className)} {...rest}>
      {state.files.map(item => {
        const isImgOrVideo = item.type === FileType.IMAGE || item.type === FileType.VIDEO;

        return (
          <div className="ks-file-picker__item" key={item.id}>
            {/* 图片和视频类型显示预览图 */}
            {isImgOrVideo && <Image src={item.thumb} />}

            {/* 无法识别的类型显示文件名字 */}
            {!isImgOrVideo && (
              <div className="ks-file-picker__file">
                <i className="ks-file-picker__edit" />
                <span className="ks-file-picker__text ks-file-picker__text--dark">{item.name}</span>
              </div>
            )}

            {/* 显示上传动画 */}
            {item.percent < 100 && (
              <>
                <i className="ks-file-picker__mask" style={{ height: item.percent + '%' }} />
                <i className="ks-file-picker__percent">{item.percent}%</i>
              </>
            )}

            {/* 加载完成之后视频需要显示蒙层 */}
            {item.percent >= 100 && item.type === FileType.VIDEO && (
              <>
                <i className="ks-file-picker__mask ks-file-picker__mask--blue" />
                <i className="ks-file-picker__play" />
              </>
            )}

            {/* 删除按钮 */}
            <i className="ks-file-picker__close" onClick={() => actions.remove(item.id)} />
          </div>
        );
      })}

      {state.files.length < state.max && (
        <div className="ks-file-picker__item" onClick={actions.add}>
          <i className="ks-file-picker__plus" />
          <span className="ks-file-picker__text">{btnText}</span>
        </div>
      )}
    </div>
  );
};

export default forwardRef(FilePicker);
