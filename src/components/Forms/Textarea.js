import React, { useRef } from 'react';
import { useSetState } from 'react-use';
import cs from 'classnames';

import './Textarea.scss';

/**
 * 文本域
 *
 * @param {Number} props.max 最大字限制
 * @param {Number} props.placeholder 提示文字
 * @param {ReactElement} props.extra 拓展按钮
 * @param {Function} props.onChage ({content}) => { ... }
 *
 * @example
 * <Textarea
 *    max={200}
 *    placeholder="提示信息。。。"
 *    onChage={({ content }) => { ... }}
 *    extra={
 *      <>
 *        <Textarea.Btn type="image" onClick={...} />
 *        <Textarea.Btn type="video" onClick={...} />
 *        <Textarea.Btn type="acctch">选择附件</Textarea.Btn>
 *      </>
 *    }
 * />
 *
 */

const Textarea = props => {
  const myRef = useRef();
  const { max = 200, row = 7, placeholder = '', extra, value = '', onChange = () => {} } = props;
  const [state, setState] = useSetState({
    value
  });

  const handleChange = evt => {
    const value = evt.target.value;
    setState({ value });

    // 自动调整textarea高度
    const elm = myRef.current;
    elm.style.height = 'auto';
    elm.style.height = elm.scrollHeight + 'px';

    onChange(value);
  };

  return (
    <div className="ks-textarea">
      <textarea
        ref={myRef}
        rows={row}
        style={{ height: state.height }}
        value={state.value}
        onChange={handleChange}
        placeholder={placeholder}
      />
      <footer className="ks-textarea__footer">
        {extra}
        <span
          className={cs('ks-textarea__count', {
            'ks-textarea__count--warning': state.value.length > max
          })}
        >
          {state.value.length}/{max}
        </span>
      </footer>
    </div>
  );
};

Textarea.Btn = props => {
  const { children, type, className, ...rest } = props;
  return (
    <div
      className={cs('ks-textarea__extra-btn', `ks-textarea__extra-btn--${type}`, className)}
      {...rest}
    >
      {children}
    </div>
  );
};

export default Textarea;
