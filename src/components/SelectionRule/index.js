import React from 'react';
import './index.scss';
import {useSetState} from 'react-use';
import {Toast} from 'antd-mobile';
import Api from '../../utils/Api';

const ServiceCard = props => {
  const {
    product_specs = [],
    showmodel,
    specification = [],
    onSelectionRule = '',
    img,
    toCurrenData = () => {},
    tohidemodel = () => {},
  } = props;
  let speciArr = [];
  product_specs.forEach (it => {
    speciArr.push (it.title);
  });
  const initIndex = speciArr.indexOf (onSelectionRule);
  let currenData = initIndex > -1
    ? product_specs[initIndex]
    : {
        images: '',
        stock: 0,
        price: '0.00',
      };
  const currentArr = onSelectionRule ? onSelectionRule.split (' ') : [];
  const [state, setState] = useSetState ({
    price: 0,
    currenData,
    currentArr,
  });
  const getprice = async (index, val) => {
    if (state.currentArr[index] === val) {
      state.currentArr[index] = '';
    } else {
      state.currentArr[index] = val;
    }
    const currntSpeci = state.currentArr.join (' ');
    const nowIndex = speciArr.indexOf (currntSpeci);
    const currenData = nowIndex > -1
      ? product_specs[nowIndex]
      : state.currenData;
    setState ({currenData});
  };

  const getCurrenData = async currenData => {
    if (currenData.id) {
      const {data} = await Api.get ('/products/specs', {
        params: {specs: currenData.id},
      });
      toCurrenData (data, false);
    } else {
      Toast.info ('规格不能为空');
    }
  };
  const hideshowmodel = async () => {
    tohidemodel (false);
  };
  return (
    <div>
      <div
        onClick={hideshowmodel}
        className={showmodel ? 'mask masktrue' : 'mask maskfalse'}
      />
      <div
        className={showmodel ? 'model modelshowView' : 'model modelhideView'}
      >

        <div className="li">
          <div className="header">
            <img
              src={state.currenData.images ? state.currenData.images : img}
              className="headerImg"
              alt=""
            />
            <div>
              <span>
                ¥
              </span>
              {state.currenData.price}
              <p>
                库存：{state.currenData.stock}
              </p>
            </div>
          </div>
          <i onClick={hideshowmodel} />
        </div>
        <div className="maxH">
          {specification
            ? specification.map ((item, key) => (
                <div className="li" key={'specificationli' + key}>
                  <h2>{item.name}</h2>
                  <div className="con">
                    {item.value.map ((li, index) => (
                      <div
                        className={
                          state.currentArr[key] === li ? 'item checked' : 'item'
                        }
                        key={'conli' + index}
                        onClick={() => getprice (key, li)}
                      >
                        {li}
                      </div>
                    ))}
                  </div>
                </div>
              ))
            : null}

        </div>
        <div className="li">
          <button onClick={() => getCurrenData (state.currenData)}>确定</button>
        </div>
      </div>
    </div>
  );
};

export default ServiceCard;
