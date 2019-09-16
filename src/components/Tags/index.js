import React from 'react';
import cs from 'classnames';
import './index.scss';

class Tags extends React.PureComponent {
  render() {
    let { className, data, type, warp = false, ...rest } = this.props;

    // data = [...data, ...data, ...data];

    return (
      <ul
        className={cs(
          {
            'ks-tags': true,
            'ks-tags--light': type === 'light',
            'ks-tags--normal': type === 'normal',
            'ks-tags--warp': warp
          },
          className
        )}
        {...rest}
      >
        {data.map((item, key) => (
          <li className="ks-tags__tag" key={key}>
            <span className="ks-tags__txt">{item.name}</span>
            <i className="ks-tags__ico" />
          </li>
        ))}
      </ul>
    );
  }
}

Tags.defaultProps = {
  type: 'normal', // oneOf(['normal', 'light'])
  data: []
};

export default Tags;
