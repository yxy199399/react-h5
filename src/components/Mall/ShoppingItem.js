import React from 'react';
import cs from 'classnames';
import {useSetState} from 'react-use';
import {Toast} from 'antd-mobile';
import Api from 'src/utils/Api';
import Tools from 'src/utils/Tools';
import {useEffect} from 'react';
import SelectionRule from 'src/components/SelectionRule';

import './ShoppingItem.scss';

const ShoppingItem = props => {
  // const timerRef = useRef ();
  const {
    item,
    name,
    index,
    checked,
    select,
    quantity,
    currentEdit,
    editChecked,
  } = props;
  const [state, setState] = useSetState ({
    select: checked,
    editSelect: editChecked,
    quantity: Number (item.quantity),
    remark: item.description ? item.description : '',
    oldRemark: item.description ? item.description : '',
    img: '',
    productDetail: {},
    ShowSelectionRule: false,
    onSelectionRule: '',
    speciTitle: '',
    selectSpecData: {},
  });

  useEffect (
    () => {
      // console.log(checked);
      setState ({select: checked, editSelect: editChecked});
    },
    [checked, editChecked]
  );

  // 勾选
  const toggleSelect = async () => {
    // console.log(state.select);
    if (currentEdit) {
      await setState ({editSelect: !state.editSelect});
      select (!state.editSelect, name, index);
    } else {
      await setState ({select: !state.select});
      select (!state.select, name, index);
    }
  };
  // 数量变化
  const changeNum = async type => {
    // console.log(type);
    if (state.quantity >= item.stock && type >= 1) {
      Toast.info ('商品数量不能大于库存');
      return;
    }

    await Api.post ('/shoppingCart/edit', {
      cart_id: item.cart_id,
      num: type ? state.quantity + 1 : state.quantity - 1,
    });

    if (type) {
      // state.quantity+=1;
      state.quantity < item.stock &&
        setState ({quantity: (state.quantity += 1)});
    } else {
      state.quantity > 1 &&
        (state.quantity > item.stock
          ? setState ({quantity: item.stock})
          : setState ({quantity: (state.quantity -= 1)}));
    }
    quantity (state.quantity, name, index);
  };
  // 添加/更新备注
  // const addRemark = e => {
  //   const remark = e.target.value;
  //   setState ({remark});

  //   clearTimeout (timerRef.current);
  //   timerRef.current = setTimeout (async () => {
  //     try {
  //       if (!!state.oldRemark) {
  //         await Api.post ('/shoppingCart/updateDescription', {
  //           cart_id: item.cart_id,
  //           content: remark,
  //           type: 2,
  //         });
  //       } else {
  //         await Api.post ('/shoppingCart/createDescription', {
  //           cart_id: item.cart_id,
  //           description: remark,
  //         });
  //       }
  //       setState ({oldRemark: state.remark});
  //     } catch (e) {
  //       setState ({remark: state.oldRemark});
  //     }
  //   }, 800);
  // };

  let speciTitle = '';
  state.selectSpecData.id
    ? (speciTitle = state.selectSpecData.title)
    : // eslint-disable-next-line array-callback-return
      (item.specs_title || []).map ((it, ind) => {
        speciTitle =
          speciTitle + (ind === 0 ? it.specs_value : ` ${it.specs_value}`);
      });

  let configArr = [];
  if (item.config && item.config !== []) {
    configArr = Object.keys (item.config);
  }
  if (state.selectSpecData.config && state.selectSpecData.config !== []) {
    configArr = Object.keys (state.selectSpecData.config);
  }

  let price = '';
  price = configArr.length && item.config.use_type === 3 && !item.is_over_limit
    ? item.config.config_price
    : item.price;
  // console.log (configArr, 77777);

  const toCurrenData = async (onSelectionRule, ShowSelectionRule) => {
    Api.post ('/shoppingCart/specs', {
      id: item.id,
      specs: onSelectionRule.id,
    }).then (data => {
      if (data.code === 200) {
        setState ({
          selectSpecData: onSelectionRule,
        });

        setState ({onSelectionRule, ShowSelectionRule});
      } else {
        Toast.info (data.msg);
      }
    });
  };
  const tohidemodel = async ShowSelectionRule => {
    setState ({ShowSelectionRule});
  };

  // 选择规格
  const selectSpec = async () => {
    await Api.get ('/products/detail', {
      params: {product_id: item.product_id},
    }).then (data => {
      let {data: detailData} = data;
      Api.get ('/products/possibleLike', {
        params: {product_id: detailData.product_id},
      }).then (data => {
        const {data: likeData} = data;
        likeData.forEach ((item, index) => {
          if (index === 0) {
            let img = Tools.resolveAsset (
              item.show_picture,
              '?imageView2/2/w/342/h/342'
            );
            setState ({
              img,
              ShowSelectionRule: true,
              productDetail: detailData,
              speciTitle: detailData.title,
            });
          }
        });
      });
    });
  };
  return (
    <div className="shopping-card">
      {/* 商品活动 */}
      {configArr.length
        ? <div className="activity-box">
            {item.config.use_type === 1
              ? <div className="label-item reback-corn">返酷币</div>
              : item.config.use_type === 2
                  ? <div className="label-item corn-reset">酷币抵扣</div>
                  : null}
            {item.config.config_type === 2
              ? <div className="label-item limit-buy">限购</div>
              : item.config.config_type === 3
                  ? item.platform_name &&
                      <div className="label-item palt-ac">
                        {item.platform_name}
                      </div>
                  : null}
            <div className="txt">{item.platform_description || ''}</div>
          </div>
        : null}
      <div className="shopping-card__main">
        <div className="shopping-card__main__info__img">
          <img
            src={Tools.resolveAsset (
              item.show_picture &&
                item.show_picture[0] &&
                item.show_picture[0].path,
              '?imagediv2/2/w/180/h/180'
            )}
            alt=""
          />
        </div>
        <div className="shopping-card__main__info__content">
          <div className="shopping-card__main__info__content__txt">
            <p className="shopping-card__main__info__content__txt__title">
              {item.title}
            </p>
            {!item.is_down
              ? speciTitle &&
                  <div onClick={() => selectSpec ()} className="speci-box">
                    <div className="txt">{speciTitle}</div>
                    <img
                      src={require ('../../assets/icon_arrow.png')}
                      className="arr-ic"
                      alt=""
                    />
                  </div>
              : <div className="down-words">该商品已下架不能购买</div>}
          </div>
          {!item.is_down
            ? <div className="shopping-card__main__info__content__number">
                <span className="shopping-card__main__info__content__number__price">
                  <span className="shopping-card__main__info__content__number__price__symbol">
                    &yen;
                  </span>
                  {price}
                  {configArr.length &&
                    item.config.use_type === 3 &&
                    !item.is_over_limit
                    ? <span className="pre-price">&yen;{item.price}</span>
                    : null}
                </span>
                <span className="shopping-card__main__info__content__number__button">
                  <button className="left" onClick={() => changeNum (0)}>
                    -
                  </button>
                  <span className="shopping-card__main__info__content__number__button__input">
                    {state.quantity}
                  </span>
                  <button className="right" onClick={() => changeNum (1)}>
                    +
                  </button>
                </span>
              </div>
            : null}
        </div>
        <div className="shopping-card__main__select-box">
          {!currentEdit && item.is_down
            ? <div className="down-ic">失效</div>
            : !currentEdit && !item.stock
                ? <div
                    className="shopping-card__main__select"
                    style={{backgroundColor: '#EBEDF0'}}
                  />
                : <span
                    className={cs ('shopping-card__main__select', {
                      selected: (!currentEdit && state.select) ||
                        state.editSelect,
                    })}
                    onClick={toggleSelect}
                  />}
        </div>
        <div className="shopping-card__inner-line" />
      </div>
      <div className="shopping-card__out-line" />
      {/* <div className="shopping-card__main__remark">
          <div className="shopping-card__main__remark__button">
            <input type="text" placeholder="添加备注" value={state.remark} onChange={addRemark} />
          </div>
        </div> */}
      <div className="shopping-card__footer" />
      <SelectionRule
        img={state.img}
        product_specs={state.productDetail.product_specs}
        specification={state.productDetail.specification}
        onSelectionRule={state.productDetail.onSelectionRule}
        showmodel={state.ShowSelectionRule}
        toCurrenData={toCurrenData}
        tohidemodel={tohidemodel}
      />
    </div>
  );
};

export default ShoppingItem;
