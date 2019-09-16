import React, { useEffect, useRef } from 'react';
import { useSetState } from 'react-use';
import { Tabs } from 'antd-mobile';
import cs from 'classnames';

import './index.scss';

const FixedTab = props => {
  const tabRef = useRef();
  const { page = 0, tabs, onChange = () => {}, children } = props;
  const [state, setState] = useSetState({
    index: page
  });

  // 更新tab的index
  const handleTabChange = scroll => (data, index) => {
    if (scroll) {
      let top = window.pageYOffset + tabRef.current.getBoundingClientRect().top;
      let scrollTop = window.scrollY;
      if (scrollTop > top) {
        window.scrollTo(0, top);
      }
    }

    setState({ index, fixed: false });

    onChange(data, index);
  };

  useEffect(() => {
    const handleScroll = e => {
      const tabTop = window.pageYOffset + tabRef.current.getBoundingClientRect().top;
      const scrollTop = window.scrollY;

      if (scrollTop >= tabTop) {
        setState({ fixed: true });
      } else {
        setState({ fixed: false });
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div className="ks-tabs">
      <div
        className={cs('ks-tabs__fixed', {
          'ks-tabs__fixed--show': state.fixed
        })}
      >
        <Tabs tabs={tabs} page={state.index} onChange={handleTabChange(true)} />
      </div>

      <div className="ks-tabs__static" ref={tabRef}>
        <Tabs tabs={tabs} page={state.index} onChange={handleTabChange(false)}>
          {children || null}
        </Tabs>
      </div>
    </div>
  );
};

export default FixedTab;
