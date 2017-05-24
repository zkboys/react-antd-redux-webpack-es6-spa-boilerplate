import React, {Component} from 'react';
import {Form, Input, Row, Col, Select, Tooltip, Spin, Modal} from 'antd';
import {debounce} from 'lodash/function';
import {ajax, event} from 'zk-react';
import {FontIcon, PageContent} from 'zk-react/antd';
import connectComponent from 'zk-react/redux/store/connectComponent';
import * as common from './common';
import validationRule from '../../commons/validation-rule';

const FormItem = Form.Item;

/* eslint-disable */
function regBankCardIsCorrect(value) {
    var bankno = String(value);
    var lastNum = bankno.substr(bankno.length - 1, 1);//取出最后一位（与luhm进行比较）

    var first15Num = bankno.substr(0, bankno.length - 1);//前15或18位
    var newArr = new Array();
    for (var i = first15Num.length - 1; i > -1; i--) {    //前15或18位倒序存进数组
        newArr.push(first15Num.substr(i, 1));
    }
    var arrJiShu = new Array();  //奇数位*2的积 <9
    var arrJiShu2 = new Array(); //奇数位*2的积 >9

    var arrOuShu = new Array();  //偶数位数组
    for (var j = 0; j < newArr.length; j++) {
        if ((j + 1) % 2 == 1) {//奇数位
            if (parseInt(newArr[j]) * 2 < 9)
                arrJiShu.push(parseInt(newArr[j]) * 2);
            else
                arrJiShu2.push(parseInt(newArr[j]) * 2);
        }
        else //偶数位
            arrOuShu.push(newArr[j]);
    }

    var jishu_child1 = new Array();//奇数位*2 >9 的分割之后的数组个位数
    var jishu_child2 = new Array();//奇数位*2 >9 的分割之后的数组十位数
    for (var h = 0; h < arrJiShu2.length; h++) {
        jishu_child1.push(parseInt(arrJiShu2[h]) % 10);
        jishu_child2.push(parseInt(arrJiShu2[h]) / 10);
    }

    var sumJiShu = 0; //奇数位*2 < 9 的数组之和
    var sumOuShu = 0; //偶数位数组之和
    var sumJiShuChild1 = 0; //奇数位*2 >9 的分割之后的数组个位数之和
    var sumJiShuChild2 = 0; //奇数位*2 >9 的分割之后的数组十位数之和
    var sumTotal = 0;
    for (var m = 0; m < arrJiShu.length; m++) {
        sumJiShu = sumJiShu + parseInt(arrJiShu[m]);
    }

    for (var n = 0; n < arrOuShu.length; n++) {
        sumOuShu = sumOuShu + parseInt(arrOuShu[n]);
    }

    for (var p = 0; p < jishu_child1.length; p++) {
        sumJiShuChild1 = sumJiShuChild1 + parseInt(jishu_child1[p]);
        sumJiShuChild2 = sumJiShuChild2 + parseInt(jishu_child2[p]);
    }
    //计算总和
    sumTotal = parseInt(sumJiShu) + parseInt(sumOuShu) + parseInt(sumJiShuChild1) + parseInt(sumJiShuChild2);

    //计算Luhm值
    var k = parseInt(sumTotal) % 10 == 0 ? 10 : parseInt(sumTotal) % 10;
    var luhm = 10 - k;
    if (lastNum != luhm) {
        return false;
    }
    return true;
};
/* eslint-enable */

export const INIT_STATE = {
    scope: 'billingPrivate',
    toPrivateAccountName: '',
    toPrivateSettleAccountNo: '',
    toPrivateCnapsCode: '',
};

@Form.create({
    onValuesChange(props, values) {
        props.actions.setState(values);
    },
})
@ajax()
@event()
class LayoutComponent extends Component {
    constructor(props) {
        super(props);
        this.handleSearchBank = debounce(this.handleSearchBank, 500);
    }

    state = {
        fetching: false,
        banks: [],
    }

    componentDidMount() {
        const {getForm, form, data, actions} = this.props;
        getForm(form);
        if (data) {
            actions.setState(data);
        }
    }

    handleSearchBank = (value) => {
        if (!value || (value && value.length < 2)) {
            return;
        }
        const {$ajax} = this.props;
        this.setState({fetching: true});
        common.getOpenBankList($ajax, value).then(res => {
            this.setState({banks: res});
        }).finally(() => {
            this.setState({fetching: false});
        });
    }

    handleAccountBlur = (e) => {
        const value = e.target.value;
        const isBankNo = regBankCardIsCorrect(value);
        if (!isBankNo) {
            Modal.error({
                title: '提示',
                content: '您输入的卡号有误，请再次确认是否正确！',
            });
        }
    }
    privateFields = {
        toPrivateAccountName: '',
        toPrivateSettleAccountNo: '',
        toPrivateCnapsCode: '',
    };
    handlePrivateChange = (value, field) => {
        this.privateFields[field] = value;
        const hasValue = Object.keys(this.privateFields).find(key => {
            const v = this.privateFields[key];
            return !!v;
        });
        this.props.$emit('billing-private-has-value', !!hasValue);
    }

    render() {
        const {banks, fetching} = this.state;
        const {
            form: {getFieldDecorator, setFieldsValue},
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
        const bankOptions = common.renderOpenBankList(banks);
        return (
            <PageContent>
                <Row>
                    <Col span={12}>
                        <FormItem
                            {...formItemLayout}
                            label="账户名"
                        >
                            {getFieldDecorator('toPrivateAccountName', {
                                onChange: (e) => this.handlePrivateChange(e.target.value, 'toPrivateAccountName'),
                                initialValue: data.toPrivateAccountName,
                                rules: [
                                    validationRule.noSpace(),
                                    validationRule.stringByteMaxLength(60),
                                ],
                            })(
                                <Input placeholder="请输入账户名" disabled={isDetail}/>
                            )}
                        </FormItem>
                    </Col>
                    <Col span={12}>
                        <FormItem
                            {...formItemLayout}
                            label="结算账号"
                        >
                            {getFieldDecorator('toPrivateSettleAccountNo', {
                                onChange: (e) => this.handlePrivateChange(e.target.value, 'toPrivateSettleAccountNo'),
                                initialValue: data.toPrivateSettleAccountNo,
                                rules: [
                                    validationRule.noSpace(),
                                    validationRule.number(),
                                    validationRule.stringByteRangeLength(5, 30),
                                    validationRule.checkExitBillingAccountID(data.toPrivateSettleAccountNo, '0', '对私结算账号的重复次数超出系统限制，请联系相关人员！'),
                                ],
                            })(
                                <Input placeholder="请输入结算账号" onBlur={this.handleAccountBlur} disabled={isDetail}/>
                            )}
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col span={12}>
                        <FormItem
                            {...formItemLayout}
                            label="关联行号"
                        >
                            {getFieldDecorator('toPrivateCnapsCode', {
                                initialValue: data.toPrivateCnapsCode,
                                rules: [
                                    validationRule.noSpace(),
                                ],
                            })(
                                <Input disabled placeholder="请输入关联行号"/>
                            )}
                        </FormItem>
                    </Col>

                    <Col span={12}>
                        {getFieldDecorator('toPrivateOpenbankInfomation', {
                            initialValue: data.toPrivateOpenbankInfomation,
                        })(
                            <Input type="hidden"/>
                        )}
                        <FormItem
                            {...formItemLayout}
                            label={
                                <span>
                                    <Tooltip title="请使用关键词检索，关键词间用空格隔开，例如：北京 石景山 工商">
                                        <FontIcon type="question-circle-o"/>
                                    </Tooltip>
                                     开户行信息
                                </span>
                            }
                        >
                            {getFieldDecorator('toPrivateOpenbankInfomationSelect', {
                                initialValue: {key: data.toPrivateCnapsCode || '', label: data.toPrivateOpenbankInfomation || ''},
                                onChange: (value) => {
                                    if (!value) {
                                        this.handlePrivateChange('', 'toPrivateCnapsCode');
                                        setFieldsValue({toPrivateCnapsCode: '', toPrivateOpenbankInfomation: ''});
                                    } else {
                                        this.handlePrivateChange(value.key, 'toPrivateCnapsCode');
                                        setFieldsValue({toPrivateCnapsCode: value.key, toPrivateOpenbankInfomation: value.label});
                                    }
                                },
                                rules: [],
                            })(
                                <Select
                                    showSearch
                                    allowClear
                                    labelInValue
                                    placeholder="请使用关键词检索，至少输入两个字符"
                                    notFoundContent={fetching ? <Spin size="small"/> : '暂无数据'}
                                    filterOption={false}
                                    onSearch={this.handleSearchBank}
                                    style={{width: '100%'}}
                                    disabled={isDetail}
                                >
                                    {bankOptions}
                                </Select>
                            )}
                        </FormItem>
                    </Col>
                </Row>
            </PageContent>
        );
    }
}

function mapStateToProps(state) {
    return {
        ...state,
    };
}

export default connectComponent({LayoutComponent, mapStateToProps, INIT_STATE});
