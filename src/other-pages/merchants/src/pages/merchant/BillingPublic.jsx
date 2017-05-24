import React, {Component} from 'react';
import {Form, Input, Row, Col, Select, Tooltip, Spin} from 'antd';
import {debounce} from 'lodash/function';
import {ajax, event} from 'zk-react';
import {FontIcon, PageContent} from 'zk-react/antd';
import connectComponent from 'zk-react/redux/store/connectComponent';
import * as common from './common';
import validationRule from '../../commons/validation-rule';

const FormItem = Form.Item;
export const INIT_STATE = {
    scope: 'billingPublic',
    toPublicAccountName: '',
    toPublicSettleAccountNo: '',
    toPublicCnapsCode: '',
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
        showAccountLegalPersonName: false,
        hasPrivateValue: false,
    }

    componentDidMount() {
        const {getForm, form, $on, actions, data} = this.props;
        getForm(form);
        if (data) {
            actions.setState(data);
        }
        $on('merchants-regist-name-change', value => {
            const toPublicAccountName = form.getFieldValue('toPublicAccountName');
            const showAccountLegalPersonName = toPublicAccountName && toPublicAccountName !== value;
            this.setState({showAccountLegalPersonName});
        });
        $on('billing-private-has-value', hasPrivateValue => {
            this.setState({hasPrivateValue});
            if (hasPrivateValue) {
                // 2.若对私和对公信息都填写时，对公结算户名与注册名称不一致时，不展示账户法人姓名字段
                this.setState({showAccountLegalPersonName: false});
            } else {
                // 1.只填写对公结算信息时，且对公结算户名与注册名称不一致时，对公结算信息部分需要增加账户法人姓名字段必填。
                const {form: {getFieldValue}} = this.props;
                const accountName = getFieldValue('toPublicAccountName');
                this.handleShowAccountLegalPersonName(accountName);
            }
        });
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

    handleShowAccountLegalPersonName(accountName) {
        const {getBaseInfoForm} = this.props;
        const baseInfoForm = getBaseInfoForm();
        const registName = baseInfoForm.getFieldValue('registName');
        const showAccountLegalPersonName = accountName && registName !== accountName;
        this.setState({showAccountLegalPersonName});
    }

    render() {
        const {
            getBillingPrivateInfoForm,
            getBaseInfoForm,
            form,
            form: {getFieldDecorator, setFieldsValue},
            isDetail,
            data = {},
        } = this.props;

        let showALPN = false;
        const billingPrivateInfoForm = getBillingPrivateInfoForm();
        const baseInfoForm = getBaseInfoForm();
        if (billingPrivateInfoForm && baseInfoForm) {
            const {
                toPrivateAccountName,
                toPrivateSettleAccountNo,
                toPrivateCnapsCode,
            } = billingPrivateInfoForm.getFieldsValue();

            if (toPrivateAccountName || toPrivateSettleAccountNo || toPrivateCnapsCode) { // 填写了对私
                showALPN = false;
            } else { // 没有填写对私
                let toPublicAccountName = form.getFieldValue('toPublicAccountName');
                toPublicAccountName = toPublicAccountName === undefined ? data.toPublicAccountName : toPublicAccountName;
                const registName = baseInfoForm.getFieldValue('registName');
                showALPN = toPublicAccountName && registName !== toPublicAccountName;
            }
        }

        const {fetching, banks, showAccountLegalPersonName} = this.state;
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
                            {getFieldDecorator('toPublicAccountName', {
                                initialValue: data.toPublicAccountName,
                                rules: [
                                    validationRule.noSpace(),
                                    validationRule.stringByteRangeLength(10, 80),
                                    validationRule.checkExitBillingAccountName(data.toPublicAccountName, '0', '对公结算账户名的重复次数超出系统限制，请联系相关人员！'),
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
                            {getFieldDecorator('toPublicSettleAccountNo', {
                                initialValue: data.toPublicSettleAccountNo,
                                rules: [
                                    validationRule.noSpace(),
                                    validationRule.number(),
                                    validationRule.stringByteRangeLength(5, 30),
                                    validationRule.checkExitBillingAccountID(data.toPublicSettleAccountNo, '0', '对公结算账号的重复次数超出系统限制，请联系相关人员！'),
                                ],
                            })(
                                <Input placeholder="请输入结算账号" disabled={isDetail}/>
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
                            {getFieldDecorator('toPublicCnapsCode', {
                                initialValue: data.toPublicCnapsCode,
                                rules: [
                                    validationRule.noSpace(),
                                ],
                            })(
                                <Input disabled placeholder="请输入关联行号"/>
                            )}
                        </FormItem>
                    </Col>
                    <Col span={12}>
                        {getFieldDecorator('toPublicOpenbankInfomation', {
                            initialValue: data.toPublicOpenbankInfomation,
                        })(
                            <Input type="hidden" disabled={isDetail}/>
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
                            {getFieldDecorator('toPublicOpenbankInfomationSelect', {
                                initialValue: {key: data.toPublicCnapsCode || '', label: data.toPublicOpenbankInfomation || ''},
                                onChange: (value) => {
                                    if (!value) {
                                        setFieldsValue({toPublicCnapsCode: '', toPublicOpenbankInfomation: ''});
                                    } else {
                                        setFieldsValue({toPublicCnapsCode: value.key, toPublicOpenbankInfomation: value.label});
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
                {
                    showAccountLegalPersonName || showALPN ?
                        <Row>
                            <Col span={12}>
                                <FormItem
                                    {...formItemLayout}
                                    label="账户法人姓名"
                                >
                                    {getFieldDecorator('accountLegalPersonName', {
                                        initialValue: data.accountLegalPersonName,
                                        rules: [
                                            {
                                                required: true, message: '账户法人姓名-不能为空.',
                                            },
                                            validationRule.stringByteMaxLength(30),
                                            validationRule.noSpace(),
                                        ],
                                    })(
                                        <Input placeholder="请输入账户法人姓名"/>
                                    )}
                                </FormItem>
                            </Col>
                        </Row>
                        : null
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

export default connectComponent({LayoutComponent, mapStateToProps, INIT_STATE});
