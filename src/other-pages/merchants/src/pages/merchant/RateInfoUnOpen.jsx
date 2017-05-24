import React, {Component} from 'react';
import {Form, Select, InputNumber, Input} from 'antd';
import {ajax} from 'zk-react';
import {PageContent, FontIcon} from 'zk-react/antd';
import connectComponent from 'zk-react/redux/store/connectComponent';
import validationRule from '../../commons/validation-rule';

const FormItem = Form.Item;
const Option = Select.Option;
@ajax()
class LayoutComponent extends Component {
    state = {
        goodId: undefined,
        goodsList: {},
        feeDetailVisible: false,
    }

    componentDidMount() {
        const {form: {setFieldsValue}, $ajax, orgNo, isBaoDi} = this.props;
        $ajax.get(`/rate/getChargingInfo/01/${orgNo}`).then(res => {
            this.setState({goodsList: res.goodsList});
            setFieldsValue({chargingInfo: res});

            if (isBaoDi) {
                const firstGood = res.goodsList[Object.keys(res.goodsList)[0]];
                setFieldsValue({billingWay: firstGood.goodsId});
                this.handleGoodsChange(firstGood.goodsId);
            }
        });
    }

    renderGoods = () => {
        const {goodsList} = this.state;
        let keys = Object.keys(goodsList);
        if (keys && keys.length) {
            keys = keys.sort();
            return keys.map(key => {
                const item = goodsList[key];
                return <Option key={item.goodsId} value={item.goodsId}>{item.goodsName}</Option>;
            });
        }
        return null;
    }

    handleGoodsChange = (goodId) => {
        this.setState({goodId});
    }

    renderGoodsItems(rateInfomation) {
        let initSections = [];
        let initGoodId;
        if (rateInfomation) {
            initGoodId = rateInfomation.current.currentGoodsId;
            initSections = rateInfomation.current.goodsList[0].sections;
        }

        let {goodsList, goodId = initGoodId} = this.state;
        const good = goodsList[goodId];
        if (!good) return null;
        const sections = good.sections;
        const keys = Object.keys(sections).sort();
        const items = keys.map(key => sections[key]);
        return items.map(item => {
            const {rateId} = item;
            const rateInfo = item.rateInfo;
            const {maxFee, minFee, rate} = rateInfo;

            const initSec = initSections.find(isc => isc.rateId === rateId);
            let initRate;
            let initMaxFee;
            let initMinFee;
            if (initSec) {
                initRate = initSec.rateInfo.rate && initSec.rateInfo.rate[0];
                initMaxFee = initSec.rateInfo.maxFee && initSec.rateInfo.maxFee[0];
                initMinFee = initSec.rateInfo.minFee && initSec.rateInfo.minFee[0];
            }
            return (
                <div key={rateId}>
                    <div>{item.sectionName}</div>
                    {this.renderRate(rate, initRate)}
                    {this.renderFee(maxFee, initMaxFee)}
                    {this.renderFee(minFee, initMinFee)}
                </div>
            );
        });
    }

    renderFee = (fee, initFee) => {
        const {form: {getFieldDecorator}, isBaoDi, isDetail} = this.props;
        const formItemLayout = {
            labelCol: {
                xs: {span: 24},
                sm: {span: 6},
            },
            wrapperCol: {
                xs: {span: 24},
                sm: {span: 14},
            },
        };
        const {modfElemtNm, modDwn, modfUp, modfFlg, visiable, recommendValue, required, uuid} = fee;
        if (visiable !== '1') return null;
        const disabled = modfFlg === '0' || isDetail;
        let initialValue = disabled ? Number(recommendValue || '') : initFee;
        if (isBaoDi) {
            initialValue = initFee || Number(recommendValue || '');
        }
        return (
            <FormItem
                {...formItemLayout}
                label={modfElemtNm}
            >
                {getFieldDecorator(`${uuid}-fee`, {
                    initialValue,
                    rules: [
                        {
                            required: required === '1', message: `${modfElemtNm}-不能为空.`,
                        },
                        validationRule.numberWithTwoDecimal(),
                        validationRule.numberRange(Number(modDwn), Number(modfUp), '输入值不在允许范围'),
                    ],
                })(
                    <InputNumber disabled={disabled} step={0.01}/>
                )}
            </FormItem>
        );
    }

    renderRate = (rate, initRate) => {
        const {isBaoDi, isDetail} = this.props;
        const {modfElemtNm, modDwn, modfUp, modfFlg, recommendValue, required, visiable, uuid} = rate;
        if (visiable !== '1') return null;
        const {form: {getFieldDecorator}} = this.props;
        const formItemLayout = {
            labelCol: {
                xs: {span: 24},
                sm: {span: 6},
            },
            wrapperCol: {
                xs: {span: 24},
                sm: {span: 14},
            },
        };
        const disabled = modfFlg === '0' || isDetail;
        let initialValue = disabled ? Number(recommendValue || '') : initRate;
        if (isBaoDi) {
            initialValue = initRate || Number(recommendValue || '');
        }
        return (
            <FormItem
                {...formItemLayout}
                label={modfElemtNm}
            >
                {getFieldDecorator(`${uuid}-rate`, {
                    initialValue,
                    rules: [
                        {
                            required: required === '1', message: `${modfElemtNm}-不能为空.`,
                        },
                        validationRule.numberWithTwoDecimal(),
                        validationRule.numberRange(Number(modDwn), Number(modfUp), '输入值不在允许范围'),
                    ],
                })(
                    <InputNumber disabled={disabled} step={0.01}/>
                )}
            </FormItem>
        );
    }

    render() {
        const {feeDetailVisible} = this.state;
        const {form: {getFieldDecorator}, isBaoDi, isDetail, data = {}} = this.props;
        const formItemLayout = {
            labelCol: {
                xs: {span: 24},
                sm: {span: 6},
            },
            wrapperCol: {
                xs: {span: 24},
                sm: {span: 14},
            },
        };

        const label = isBaoDi ? '保底费率' : '计费方式';
        const disabled = isBaoDi || isDetail;

        // 修改 查看回显数据
        let initBillingWay;
        let {rateInfomation} = data;
        if (rateInfomation) {
            rateInfomation = JSON.parse(rateInfomation);
            initBillingWay = rateInfomation.current.currentGoodsId;
        }
        return (
            <PageContent className="merchant-rate">

                <FormItem
                    style={{display: 'none'}}
                >
                    {getFieldDecorator('chargingInfo', {})(
                        <Input/>
                    )}
                </FormItem>

                <FormItem
                    {...formItemLayout}
                    label={label}
                >
                    {getFieldDecorator('billingWay', {
                        initialValue: initBillingWay,
                        onChange: this.handleGoodsChange,
                        rules: [
                            {
                                required: true, message: '计费方式-不能为空.',
                            },
                        ],
                    })(
                        <Select style={{width: 150}} disabled={disabled} placeholder="请选择计费方式">
                            {this.renderGoods()}
                        </Select>
                    )}
                    {isBaoDi ?
                        <FontIcon
                            type={feeDetailVisible ? 'up' : 'down'}
                            style={{cursor: 'pointer', marginLeft: 8, fontSize: 18}}
                            onClick={() => {
                                this.setState({feeDetailVisible: !feeDetailVisible});
                            }}
                        />
                        : null}
                </FormItem>
                {
                    isBaoDi ?
                        <div className={`fee-detail ${feeDetailVisible ? 'show-fee-detail' : 'hide-fee-detail'}`}>
                            {this.renderGoodsItems(rateInfomation)}
                        </div>
                        : this.renderGoodsItems(rateInfomation)
                }
            </PageContent>
        );
    }
}

function mapStateToProps(state) {
    return {
        ...state,
    };
}

export default connectComponent({LayoutComponent, mapStateToProps});
