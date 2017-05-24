import React, {Component} from 'react';
import {Form, Select, InputNumber, Input} from 'antd';
import {ajax} from 'zk-react';
import {PageContent} from 'zk-react/antd';
import connectComponent from 'zk-react/redux/store/connectComponent';
import validationRule from '../../commons/validation-rule';

const FormItem = Form.Item;
const Option = Select.Option;
@ajax()
class LayoutComponent extends Component {
    state = {
        goodsList: [],
        goodItems: null,
        viewMsg: '',
        rate: {},
        maxFee: {},
        monthFee: {},
        fixedFee: {},
        foreignCard: {},
    }

    componentDidMount() {
        const {$ajax, form: {setFieldsValue}} = this.props;
        $ajax.get('/rate/getMdChargingInfo').then(res => {
            const goodsList = res.data.goodsList;
            const viewMsg = res.data.viewMsg;
            this.setState({goodsList, viewMsg});
            setFieldsValue({mdChargingInfo: res});
        });
    }

    renderGoods = () => {
        const {goodsList} = this.state;
        return goodsList.map(item => {
            return <Option key={item.goodsId} value={item.goodsId}>{item.goodsName}</Option>;
        });
    }

    handleGoodsChange = (value) => {
        const {goodsList} = this.state;
        const good = goodsList.find(item => item.goodsId === value);
        const sections = good.sections;
        // 打包
        let jiejiSection = sections[0];
        let jingWaiSection = sections[2];
        let monthFee = {};

        // 包月
        if (value === 'GOODS-INF-MD-PACK-MON-B') {
            monthFee = this.getFeeRateInfo(sections[0].rateInfo.fixedFee);
            jiejiSection = sections[1];
            jingWaiSection = sections[3];
        }
        const maxFee = this.getFeeRateInfo(jiejiSection.rateInfo.maxFee);
        const fixedFee = this.getFeeRateInfo(jiejiSection.rateInfo.fixedFee);
        const rate = this.getFeeRateInfo(jiejiSection.rateInfo.rate);
        const foreignCard = this.getFeeRateInfo(jingWaiSection.rateInfo.rate);

        this.setState({maxFee, fixedFee, rate, monthFee, foreignCard});
    }

    getFeeRateInfo(fee) {
        const [, name, isModifiable, max, min, recommendValue, visiable, required, uuid] = fee;
        return {name, isModifiable, max, min, recommendValue, visiable, required, uuid};
    }

    render() {
        const {
            viewMsg,
            rate,
            maxFee,
            monthFee,
            fixedFee,
            foreignCard,
        } = this.state;
        const {
            form: {getFieldDecorator, getFieldValue},
            isDetail,
            data = {},
        } = this.props;
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
        const billingMdWay = getFieldValue('billingMdWay');
        const isPackBlB = billingMdWay === 'GOODS-INF-MD-PACK-BL-B';
        const isPackMonB = billingMdWay === 'GOODS-INF-MD-PACK-MON-B';

        // 构造 固定金额(元) 下拉
        const unchangeFree = [];
        for (let i = 0; i < 5; i++) {
            unchangeFree.push(<Option key={i}>{`${i}.0`}</Option>);
            unchangeFree.push(<Option key={i + 0.5}>{i + 0.5}</Option>);
        }
        unchangeFree.push(<Option key={5}>5.0</Option>);

        // 查看、修改回显数据
        const posmdstr = data.posmdstr || '';
        let [initRate, initMaxFee, initFixedFee = 0, initMonthFee = 0, initForeignCard, initBillingMdWay] = posmdstr.split(',');
        if (initRate === 'undefined') initRate = undefined;
        if (initMaxFee === 'undefined') initMaxFee = undefined;
        if (initFixedFee === 'undefined') initFixedFee = undefined;
        if (initMonthFee === 'undefined') initMonthFee = undefined;
        if (initForeignCard === 'undefined') initForeignCard = undefined;
        if (initBillingMdWay === 'undefined') initBillingMdWay = undefined;
        return (
            <PageContent>
                <FormItem
                    style={{display: 'none'}}
                >
                    {getFieldDecorator('mdChargingInfo', {})(
                        <Input/>
                    )}
                </FormItem>

                <FormItem
                    {...formItemLayout}
                    label="计费方式"
                >
                    {getFieldDecorator('billingMdWay', {
                        initialValue: initBillingMdWay,
                        onChange: this.handleGoodsChange,
                        rules: [
                            {
                                required: true, message: viewMsg,
                            },
                        ],
                    })(
                        <Select style={{width: 150}} placeholder="请选择计费方式" disabled={isDetail}>
                            {this.renderGoods()}
                        </Select>
                    )}
                </FormItem>
                {billingMdWay ?
                    <div>
                        <FormItem
                            {...formItemLayout}
                            label="费率(%)"
                        >
                            {getFieldDecorator('rate', {
                                initialValue: initRate || rate.recommendValue,
                                rules: [
                                    {
                                        required: rate.required === '1', message: '费率(%)-不能为空.',
                                    },
                                    validationRule.numberWithTwoDecimal(),
                                    validationRule.numberRange(Number(rate.min || 0), Number(rate.max || 100), '输入值不在允许范围'),
                                ],
                            })(
                                <InputNumber step={0.01} disabled={isDetail}/>
                            )}
                        </FormItem>
                        <FormItem
                            {...formItemLayout}
                            label="借记卡封顶金额(元)"
                        >
                            {getFieldDecorator('maxFee', {
                                initialValue: initMaxFee || maxFee.recommendValue,
                                rules: [
                                    {
                                        required: maxFee.required === '1', message: '借记卡封顶金额(元)-不能为空.',
                                    },
                                    validationRule.numberWithTwoDecimal(),
                                    validationRule.numberRange(Number(maxFee.min || 0), Number(maxFee.max || 999999), '输入值不在允许范围'),
                                ],
                            })(
                                <InputNumber step={0.01} disabled={isDetail}/>
                            )}
                            <span style={{color: 'red'}}>注：仅在借记卡交易未秒到时生效</span>
                        </FormItem>
                        {isPackBlB ?
                            <FormItem
                                {...formItemLayout}
                                label="固定金额(元)"
                            >
                                {getFieldDecorator('fixedFee', {
                                    initialValue: initFixedFee || fixedFee.recommendValue,
                                    rules: [
                                        {
                                            required: fixedFee.required === '1', message: '固定金额(元)-不能为空.',
                                        },
                                    ],
                                })(
                                    <Select style={{width: 80}} disabled={isDetail}>
                                        {unchangeFree}
                                    </Select>
                                )}
                            </FormItem>
                            : null}
                        {isPackMonB ?
                            <FormItem
                                {...formItemLayout}
                                label="月收入金额(元)"
                            >
                                {getFieldDecorator('monthFee', {
                                    initialValue: initMonthFee || 300,
                                    rules: [
                                        {
                                            required: monthFee.required === '1', message: '月收入金额(元)-不能为空.',
                                        },
                                        validationRule.numberWithTwoDecimal(),
                                        validationRule.numberRange(Number(monthFee.min || 0), Number(monthFee.max || 999999), '输入值不在允许范围'),
                                    ],
                                })(
                                    <InputNumber step={0.01} disabled={isDetail}/>
                                )}
                            </FormItem>
                            : null}
                        <FormItem
                            {...formItemLayout}
                            label="外卡(%)"
                        >
                            {getFieldDecorator('foreignCard', {
                                initialValue: initForeignCard || foreignCard.recommendValue,
                                rules: [
                                    {
                                        required: foreignCard.required === '1', message: '外卡(%)-不能为空.',
                                    },
                                    validationRule.numberWithTwoDecimal(),
                                    validationRule.numberRange(Number(foreignCard.min || 0), Number(foreignCard.max || 100), '输入值不在允许范围'),
                                ],
                            })(
                                <InputNumber step={0.01} disabled={isDetail}/>
                            )}
                        </FormItem>
                    </div>
                    : null}
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
