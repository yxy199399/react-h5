import React, { useRef } from 'react';
import { useSetState, useMount } from 'react-use';
import { Link } from 'react-router-dom';
import { Toast } from 'antd-mobile';
import qs from 'qs';

import NavBar from 'src/components/Nav/NavBar';

import Api from 'src/utils/Api';
import './Search.scss';

const Search = props => {
  const timerRef = useRef();
  const query = qs.parse(props.location.search, { ignoreQueryPrefix: true });
  const folder = query.folder || '';
  const [state, setState] = useSetState({
    value: query.keywords || '',
    autoList: [],
    hots: []
  });

  const onChange = keyword => {
    setState({ value: keyword, autoList: [] });
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      updateAuto(keyword);
    }, 500);
  };

  const updateAuto = async keyword => {
    if (!keyword) return;

    Toast.loading('查询中...');
    const res = await Api.post('/search/reminders', { keywords: keyword, page_size: 8, type: 1 });
    const autoList = res.data.data;
    autoList.forEach(item => {
      item._title = item.title.replace(keyword, '<em>$&</em>');
    });
    setState({ autoList: res.data.data });
    Toast.hide();
  };

  const fetchHots = async () => {
    const res = await Api.get('/search/hot', { size: 0, page: 1 });
    setState({ hots: res.data.data });
  };

  const onSearch = () => {
    if (!state.value) {
      return props.history.push(folder ? `/categories?folder=${folder}` : '/');
    }
    props.history.push(`/categories?keywords=${state.value}&folder=${folder}`);
  };

  useMount(() => {
    fetchHots();
  });

  const showAuto = !!state.value && state.autoList.length > 0;

  return (
    <div>
      <NavBar
        title={<NavBar.Search onChange={onChange} value={state.value} />}
        right={<NavBar.Btn onClick={onSearch}>搜索</NavBar.Btn>}
      />

      {!showAuto && (
        <div className="search-hots">
          <h3 className="search-hots__title">酷耍热搜</h3>
          <div className="search-hots__body">
            {state.hots.map(item => (
              <Link
                className="search-hots__body__item"
                key={item.id}
                to={`/categories?keywords=${item.keyword}&folder=${folder}`}
              >
                {item.keyword}
              </Link>
            ))}
          </div>
        </div>
      )}

      {showAuto && (
        <div className="search-autocomplete">
          {state.autoList.map((item, key) => (
            <Link
              className="search-autocomplete__item"
              key={key}
              to={`/categories?keywords=${item.title}&folder=${folder}`}
            >
              <span dangerouslySetInnerHTML={{ __html: item._title }} />
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default Search;
