import React, { useRef } from 'react';

const AutoHeightTextarea = props => {
  const ref = useRef();
  const { onChange, ...rest } = props;

  const handleChange = evt => {
    // 自动调整textarea高度
    const elm = ref.current;
    elm.style.height = 'auto';
    elm.style.height = elm.scrollHeight + 'px';

    onChange && onChange(evt);
  };

  return <textarea {...rest} onChange={handleChange} ref={ref} />;
};

export default AutoHeightTextarea;
