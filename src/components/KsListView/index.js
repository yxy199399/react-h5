import React from 'react';
import cs from 'classnames';
import { ListView } from 'antd-mobile';

import ListFooter from './ListFooter';
import './index.scss';

let rowHasChanged = (r1, r2) => r1 !== r2;

class KsListView extends React.PureComponent {
  data = [];
  state = {
    dataSource: new ListView.DataSource({ rowHasChanged }),
    page: 1,
    loading: false,
    hasMore: true
  };

  componentDidMount() {
    this.props.auto && this.fetchData(1);
  }

  fetchData = async page => {
    try {
      this.setState({ loading: true });

      if (page === 1) {
        this.data = [];
        const dataSource = this.state.dataSource.cloneWithRows(this.data);
        this.setState({ dataSource, page, loading: false, hasMore: true });
      }

      let res = await this.props.fetchData(page);
      this.data = [...this.data, ...res.data.data];
      let dataSource = this.state.dataSource.cloneWithRows(this.data);

      this.setState({
        dataSource,
        page,
        loading: false,
        hasMore: res.data.current_page < res.data.last_page
      });
    } catch (err) {
      this.setState({ loading: false });
    }
  };

  onEndReached = () => {
    let { loading, hasMore, page } = this.state;

    if (loading || !hasMore) {
      return;
    } else {
      this.fetchData(page + 1);
    }
  };

  renderFooter = () => {
    return (
      <ListFooter empty={!this.state.hasMore && !this.data.length} hasNext={this.state.hasMore} />
    );
  };

  renderSeparator = (sid, rid) => {
    return <div className="ks-listview-separator" key={`${sid}-${rid}`} />;
  };

  renderHeader = () => {
    return <div className="ks-listview-separator" />;
  };

  render() {
    let { dataSource } = this.state;
    let { renderRow, className, ...rest } = this.props;

    return (
      <ListView
        className={cs('ks-listview', className)}
        dataSource={dataSource}
        renderRow={renderRow}
        renderFooter={this.renderFooter}
        onEndReached={this.onEndReached}
        {...rest}
      />
    );
  }
}

KsListView.defaultProps = {
  auto: true,
  fetchData: () => {},
  renderRow: () => {}
};

export default KsListView;
