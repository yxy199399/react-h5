import React, { useEffect } from 'react';
import { useSetState, useMount } from 'react-use';
import { ListView } from 'antd-mobile';
import { StickyContainer, Sticky } from 'react-sticky';

import NavBar from 'src/components/Nav/NavBar';

import './CountryCode.scss';
import { useStore, useActions } from 'easy-peasy';

const CountryCode = props => {
  const codeState = useStore(store => store.countryCode);
  const choseCode = useActions(actions => actions.countryCode.choseCode);
  const fetchCode = useActions(actions => actions.countryCode.fetchData);
  const [state, setState] = useSetState({
    dataSource: new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 !== r2,
      sectionHeaderHasChanged: (s1, s2) => s1 !== s2,
      getSectionHeaderData: (dataBlob, sectionID) => sectionID
    })
  });

  useMount(() => {
    if (!Object.keys(codeState.data).length) {
      fetchCode();
    }
  });

  useEffect(() => {
    setState({ dataSource: state.dataSource.cloneWithRowsAndSections(codeState.data) });
  }, [codeState.data]);

  const handleClose = () => {
    props.history.goBack();
  };

  const handleSelect = data => () => {
    choseCode(data.code);
    handleClose();
  };

  const renderRow = (rowData, sectionID, rowID) => {
    return (
      <div className="page-country-code__item" onClick={handleSelect(rowData)}>
        <span>{rowData.name}</span>
        <span>+ {rowData.code}</span>
      </div>
    );
  };

  const renderSectionWrapper = sectionID => {
    return (
      <StickyContainer
        className="sticky-container"
        style={{ zIndex: 4 }}
        key={`s_${sectionID}_c`}
      />
    );
  };

  const renderSectionHeader = (sectionData, sectionID) => {
    return (
      <Sticky>
        {({ style }) => (
          <div
            className="sticky"
            style={{
              ...style,
              zIndex: 3
            }}
          >
            {sectionData}
          </div>
        )}
      </Sticky>
    );
  };

  return (
    <div className="page-country-code">
      <NavBar title="选择国家" />
      <ListView.IndexedList
        useBodyScroll
        dataSource={state.dataSource}
        renderRow={renderRow}
        renderSectionHeader={renderSectionHeader}
        renderSectionWrapper={renderSectionWrapper}
      />
    </div>
  );
};

export default CountryCode;
