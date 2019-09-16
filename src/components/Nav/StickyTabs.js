import React, { useRef } from 'react';
import { Tabs } from 'antd-mobile';
import { useSetState } from 'react-use';
import './StickyTabs.scss';
import Tools from 'src/utils/Tools';

const StickyTabs = props => {
  const tabRef = useRef();
  const { page, children, ...rest } = props;
  const [state, setState] = useSetState({
    page
  });

  const handleTabChange = (tabs, page) => {
    let top =
      window.pageYOffset + tabRef.current.getBoundingClientRect().top - Tools.remToPx(0.88 + 0.78);
    let scrollTop = window.scrollY;
    if (scrollTop > top) {
      window.scrollTo({
        top,
        behavior: 'smooth'
      });
    }
    setState({ page });

    props.onChange && props.onChange(tabs, page);
  };

  return (
    <div className="ks-tabs">
      <div className="ks-tabs__bar">
        <Tabs
          {...rest}
          useOnPan={false}
          swipeable={false}
          page={state.page}
          onChange={handleTabChange}
        />
      </div>

      <div ref={tabRef}>
        <Tabs
          {...rest}
          useOnPan={false}
          swipeable={false}
          page={state.page}
          onChange={handleTabChange}
          renderTabBar={() => null}
        >
          {children || null}
        </Tabs>
      </div>
    </div>
  );
};

export default StickyTabs;
