import React, {Component} from 'react';
import {Form, Input, Select, Button, Modal, Row, Col} from 'antd';
import {ajax, event} from 'zk-react';
import {PageContent, FontIcon} from 'zk-react/antd';
import connectComponent from 'zk-react/redux/store/connectComponent';
import CustomClassify from './CustomClassify';
import Address from './Address';
import validationRule from '../../commons/validation-rule';

const FormItem = Form.Item;
const Option = Select.Option;

@Form.create()
@ajax()
@event()
class LayoutComponent extends Component {
    state = {
        province: [], // 注册或装机 省
        clerkList: [], // 业务人员列表
        defaultSalesmanCode: '', // 业务人员默认code
        defaultSalesmanName: '', // 业务人员默认name
        customClassify: [], // 自定义分类
        customClassifyModalVisible: false, // 是否显示自定义分类管理弹框
        customerManagerBankList: [], // 所在银行
        customerManagerList: [], // 合作经理
        bankTeamworkSignText: [], // 银行合作标识
        bankTeamworkSignTextModalVisible: false, // 是否显示银行合作标识管理弹框
    }

    componentDidMount() {
        const {getForm, form} = this.props;
        getForm(form);
        this.getClerkList();
        this.getCustomClassify();
        this.getCustomerManagerBankList();
        this.getBankTeamworkSignText();
    }

    // 获取业务员下拉列表
    getClerkList() {
        const {orgNo, userCode} = this.props;
        this.props.$ajax.get(`/binfo/getClerkList/${orgNo}/${userCode}`).then(res => {
            const defaultClerk = res.find(item => item.isDefault === 1);
            if (defaultClerk) {
                this.setState({
                    defaultSalesmanCode: defaultClerk.userCode,
                    defaultSalesmanName: defaultClerk.remarkName,
                });
            }
            this.setState({clerkList: res});
        });
    }

    // 渲染业务员下拉列表
    renderClerk() {
        return this.state.clerkList.map(item => {
            return <Option key={item.userCode} value={String(item.userCode)}>{item.remarkName}</Option>;
        });
    }

    // 获取自定义分类
    getCustomClassify() {
        const {orgNo} = this.props;
        this.props.$ajax.get(`/label/getCustomLabelList/3/${orgNo}`).then(res => {
            this.setState({customClassify: res});
        });
    }

    // 处理自定义分类列表改变事件，data为最新列表数据
    handleCustomClassifyChange = (data) => {
        this.setState({customClassify: data});

        // 更新已选中的自定义分类
        const {getFieldValue, setFieldsValue} = this.props.form;
        const selectedCustomClassify = getFieldValue('customClassify');
        if (selectedCustomClassify && selectedCustomClassify.length) {
            const sc = selectedCustomClassify.filter(item => data.find(it => it.id === item));
            setFieldsValue({customClassify: sc});
        }
    }

    // 渲染自定义分类下拉列表
    renderCustomClassify = () => {
        return this.state.customClassify.map(item => <Option key={item.id} value={String(item.id)}>{item.name}</Option>);
    }

    // 显示自定义分类管理弹框
    showCustomClassifyModal = () => {
        this.setState({customClassifyModalVisible: true});
    }

    // 隐藏自定义分类管理弹框
    hideCustomClassifyModal = () => {
        this.setState({customClassifyModalVisible: false});
    }

    // 获取银行合作标识
    getBankTeamworkSignText() {
        const {orgNo} = this.props;
        this.props.$ajax.get(`/label/getCustomLabelList/2/${orgNo}`).then(res => {
            this.setState({bankTeamworkSignText: res});
        });
    }

    // 渲染银行合作标识下拉列表
    renderBankTeamworkSignText = () => {
        return this.state.bankTeamworkSignText.map(item => <Option key={item.id} value={String(item.id)}>{item.name}</Option>);
    }

    // 处理银行合作标识列表改变事件，data为最新的列表数据
    handleBankTeamworkSignTextChange = (data) => {
        this.setState({bankTeamworkSignText: data});

        // 更新已选中的自定义分类
        const {getFieldValue, setFieldsValue} = this.props.form;
        const selectedBankTeamworkSignText = getFieldValue('bankTeamworkSignText');
        const sc = data.find(it => it.id === selectedBankTeamworkSignText);
        if (sc) {
            setFieldsValue({bankTeamworkSignText: selectedBankTeamworkSignText});
        } else {
            setFieldsValue({bankTeamworkSignText: undefined});
        }
    }

    // 显示银行合作标识管理弹框
    showBankTeamworkSignTextModal = () => {
        this.setState({bankTeamworkSignTextModalVisible: true});
    }

    // 隐藏银行合作标识管理弹框
    hideBankTeamworkSignTextModal = () => {
        this.setState({bankTeamworkSignTextModalVisible: false});
    }

    // 渲染银行合作下拉列表
    renderBankTeamwork() {
        const bankTeamworkOptions = [<Option key="2" value="2">自主拓展</Option>];
        if (this.state.customerManagerBankList && this.state.customerManagerBankList.length) {
            bankTeamworkOptions.unshift(<Option key="1" value="1">随行付合作</Option>);
        }
        return bankTeamworkOptions;
    }

    // 获取所在银行下拉列表
    getCustomerManagerBankList() {
        const {orgNo, isModify, isDetail} = this.props;
        this.props.$ajax.get(`/binfo/getBankListByType/${orgNo}`).then(res => {
            this.setState({customerManagerBankList: res});
            if (isModify || isDetail) {
                const id = (res && res.length && res[0].id) || '';
                this.getCustomerManager(id);
            }
        });
    }

    // 渲染所在银行下拉列表
    renderCustomerManagerBank() {
        return this.state.customerManagerBankList.map(item => <Option key={item.id}>{item.name}</Option>);
    }

    // 处理所在银行改变事件，级联获取合作经理下拉列表
    handleCustomerManagerBankChange = (value) => {
        this.getCustomerManager(value);
    }

    // 获取合作经理下拉列表
    getCustomerManager(bankId) {
        if (!bankId) return;
        const {orgNo} = this.props;
        this.props.$ajax.get(`/binfo/getManagerByBankId/${bankId}/${orgNo}`).then(res => this.setState({customerManagerList: res}));
    }

    // 渲染合作经理下拉列表
    renderCustomerManager() {
        return this.state.customerManagerList.map(item => <Option key={item.managerId} value={item.managerId}>{item.managerName}</Option>);
    }

    // 行业大类改变事件
    handleBusinessClassifyChange = (value) => {
        const {getfunctionInfoForm, $emit} = this.props;
        const functionInfoForm = getfunctionInfoForm();
        const {getFieldValue, setFieldsValue} = functionInfoForm;
        const functionAcceptanceSettle = getFieldValue('functionAcceptanceSettle') || [];

        $emit('merchants-business-classify-change', value);

        if (value !== '1' && value !== '2' && functionAcceptanceSettle.indexOf('2') > -1) {
            return Modal.error({
                title: '提示',
                content: '预授权商户行业大类必须是 一般类或餐娱类，将关闭预授权！',
                onOk: () => {
                    setFieldsValue({functionAcceptanceSettle: functionAcceptanceSettle.filter(item => item !== '2')});
                },
            });
        }
    }

    // 商户等级改变事件
    handleMecNormalLevelChange = (value) => {
        this.props.$emit('merchants-mec-normal-level-change', value);
    }
    // 注册名称改变事件
    handleRegistNameChange = (e) => {
        const value = e.target.value;
        this.props.$emit('merchants-regist-name-change', value);
    }

    render() {
        const {defaultSalesmanCode, defaultSalesmanName} = this.state;
        const {
            form,
            form: {getFieldDecorator, getFieldValue},
            data = {},
            isDetail,
            isModify,
            userCode,
            orgNo,
        } = this.props;
        const formItemLayout = {
            labelCol: {
                xs: {span: 24},
                sm: {span: 10},
            },
            wrapperCol: {
                xs: {span: 24},
                sm: {span: 14},
            },
        };
        const threeColLayout = {
            xs: 12,
            sm: 12,
            md: 8,
            lg: 8,
            xl: 8,
        };
        const formItemWidth = 300;
        return (
            <PageContent>
                <Row>
                    <Col {...threeColLayout}>
                        <FormItem
                            style={{width: formItemWidth}}
                            {...formItemLayout}
                            label="商户类型"
                        >
                            {getFieldDecorator('merchantType', {
                                initialValue: data.merchantType || '1',
                                rules: [
                                    {
                                        required: true, message: '商户类型-不能为空.',
                                    },
                                ],
                            })(
                                <Select placeholder="请选择商户类型" disabled={isDetail}>
                                    <Option value="1">普通商户</Option>
                                    <Option value="2">连锁总店</Option>
                                    <Option value="4">1+N总店</Option>
                                </Select>
                            )}
                        </FormItem>
                    </Col>
                    <Col {...threeColLayout}>
                        <FormItem
                            style={{width: formItemWidth}}
                            {...formItemLayout}
                            label="签购单名称"
                        >
                            {getFieldDecorator('receiptsName', {
                                initialValue: data.receiptsName,
                                rules: [
                                    {
                                        required: true, message: '签购单名称-不能为空.',
                                    },
                                    validationRule.noSpace(),
                                    validationRule.stringByteRangeLength(12, 40, '请输入6-20个汉字或12-40个字符.'),
                                ],
                            })(
                                <Input placeholder="请输入签购单名称" disabled={isDetail}/>
                            )}
                        </FormItem>
                    </Col>
                    <Col {...threeColLayout}>
                        <FormItem
                            style={{width: formItemWidth}}
                            {...formItemLayout}
                            label="注册名称"
                        >
                            {getFieldDecorator('registName', {
                                onChange: this.handleRegistNameChange,
                                initialValue: data.registName,
                                rules: [
                                    {
                                        required: true, message: '注册名称-不能为空.',
                                    },
                                    validationRule.noSpace(),
                                    validationRule.checkExistRegName(data.registName),
                                    validationRule.stringByteMaxLength(80),
                                ],
                            })(
                                <Input placeholder="请输入签注册名称" disabled={isDetail}/>
                            )}
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col {...threeColLayout}>
                        <FormItem
                            style={{width: formItemWidth}}
                            {...formItemLayout}
                            label="商户等级"
                        >
                            {getFieldDecorator('mecNormalLevel', {
                                initialValue: data.mecNormalLevel,
                                onChange: this.handleMecNormalLevelChange,
                                rules: [
                                    {
                                        required: true, message: '商户等级-不能为空.',
                                    },
                                ],
                            })(
                                <Select placeholder="请选择商户等级" disabled={isDetail}>
                                    <Option value="10">普通商户</Option>
                                    <Option value="20">一类小微</Option>
                                </Select>
                            )}
                        </FormItem>
                    </Col>
                </Row>
                <Address
                    form={form}
                    data={data}
                    isDetail={isDetail}
                    isModify={isModify}
                    label="注册地址"
                    streetLabel="注册地址街道"
                    provinceField="registAddressProvince"
                    cityField="registAddressCity"
                    areaField="registAddressArea"
                    streetField="registAddressStreet"
                    provinceMessage="注册地址(省)-不能为空."
                    cityMessage="注册地址(市)-不能为空."
                    areaMessage="注册地址(区)-不能为空."
                    streetMessage="注册地址街道-不能为空."
                />

                <Address
                    form={form}
                    data={data}
                    isDetail={isDetail}
                    isModify={isModify}
                    provinceField="bindAddressProvince"
                    cityField="bindAddressCity"
                    areaField="bindAddressArea"
                    streetField="bindAddressStreet"
                />
                <Row>
                    <Col {...threeColLayout}>
                        <FormItem
                            style={{width: formItemWidth}}
                            {...formItemLayout}
                            label="主营业务"
                        >
                            {getFieldDecorator('mainManageBusiness', {
                                initialValue: data.mainManageBusiness,
                                rules: [
                                    {
                                        required: true, message: '主营业务-不能为空.',
                                    },
                                    validationRule.noSpace(),
                                    validationRule.stringByteMaxLength(200, '最多输入{max}个字符.'),
                                ],
                            })(
                                <Input placeholder="请输入主营业务" disabled={isDetail}/>
                            )}
                        </FormItem>
                    </Col>
                    <Col {...threeColLayout}>
                        <FormItem
                            style={{width: formItemWidth}}
                            {...formItemLayout}
                            label="注册登记号"
                        >
                            {getFieldDecorator('registCode', {
                                initialValue: data.registCode,
                                rules: [
                                    {
                                        required: true, message: '注册登记号-不能为空.',
                                    },
                                    validationRule.noSpace(),
                                    validationRule.checkExitRegNumber(data.registCode),
                                    validationRule.stringByteMaxLength(60),
                                ],
                            })(
                                <Input placeholder="请输入注册登记号" disabled={isDetail}/>
                            )}
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col {...threeColLayout}>
                        <FormItem
                            style={{width: formItemWidth}}
                            {...formItemLayout}
                            label="业务员名称"
                        >
                            {getFieldDecorator('salesmanCode', {
                                initialValue: data.salesmanCode || defaultSalesmanCode,
                                onChange: (value) => {
                                    const salesman = this.state.clerkList.find(item => item.userCode === value);
                                    let salesmanName = '';
                                    if (salesman) salesmanName = salesman.remarkName;
                                    this.props.form.setFieldsValue({salesmanName});
                                },
                                rules: [
                                    {
                                        required: true, message: '业务员名称-不能为空.',
                                    },
                                ],
                            })(
                                <Select
                                    placeholder="请选择业务员"
                                    showSearch
                                    optionFilterProp="children"
                                    disabled={isDetail}>
                                    {this.renderClerk()}
                                </Select>
                            )}
                        </FormItem>
                        {getFieldDecorator('salesmanName', {
                            initialValue: defaultSalesmanName,
                        })(
                            <Input type="hidden"/>
                        )}
                    </Col>
                    <Col {...threeColLayout}>
                        <FormItem
                            style={{width: formItemWidth}}
                            {...formItemLayout}
                            label="法人姓名"
                        >
                            {getFieldDecorator('legalPersonName', {
                                initialValue: data.legalPersonName,
                                rules: [
                                    {
                                        required: true, message: '法人姓名-不能为空.',
                                    },
                                    validationRule.noSpace(),
                                    validationRule.stringByteMaxLength(30, '最多输入{max}个字符.'),
                                ],
                            })(
                                <Input placeholder="请输入法人姓名" disabled={isDetail}/>
                            )}
                        </FormItem>
                    </Col>
                    <Col {...threeColLayout}>
                        <FormItem
                            style={{width: formItemWidth}}
                            {...formItemLayout}
                            label="法人证件号"
                        >
                            {getFieldDecorator('legalPersonCode', {
                                initialValue: data.legalPersonCode,
                                rules: [
                                    {
                                        required: getFieldValue('mecNormalLevel') === '10', message: '法人证件号-不能为空.',
                                    },
                                    validationRule.noSpace(),
                                    validationRule.cardNumber('法人证件号-格式不正确.'),
                                ],
                            })(
                                <Input placeholder="请输入法人证件号" disabled={isDetail}/>
                            )}
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col {...threeColLayout}>
                        <FormItem
                            style={{width: formItemWidth}}
                            {...formItemLayout}
                            label="联系人手机号"
                        >
                            {getFieldDecorator('linkmanMobileNo', {
                                initialValue: data.linkmanMobileNo,
                                rules: [
                                    {
                                        required: true, message: '联系人手机号-不能为空.',
                                    },
                                    validationRule.noSpace(),
                                    validationRule.mobile('请输入11位手机号.'),
                                ],
                            })(
                                <Input placeholder="请输入联系人手机号" disabled={isDetail}/>
                            )}
                        </FormItem>
                    </Col>
                    <Col {...threeColLayout}>
                        <FormItem
                            style={{width: formItemWidth}}
                            {...formItemLayout}
                            label="结算人身份证"
                        >
                            {getFieldDecorator('settleManidNumber', {
                                initialValue: data.settleManidNumber,
                                rules: [
                                    {
                                        required: true, message: '结算人身份证-不能为空.',
                                    },
                                    validationRule.noSpace(),
                                    validationRule.checkSettlementPerson(data.settleManidNumber),
                                    validationRule.cardNumber('请输入15或18位身份证号'),
                                ],
                            })(
                                <Input placeholder="请输入结算人身份证" disabled={isDetail}/>
                            )}
                        </FormItem>
                    </Col>
                    <Col {...threeColLayout}>
                        <FormItem
                            style={{width: formItemWidth}}
                            {...formItemLayout}
                            label="行业大类"
                        >
                            {getFieldDecorator('businessClassify', {
                                onChange: this.handleBusinessClassifyChange,
                                initialValue: data.businessClassify,
                                rules: [
                                    {
                                        required: true, message: '行业大类-不能为空.',
                                    },
                                ],
                            })(
                                <Select placeholder="请选择行业大类" disabled={isDetail}>
                                    <Option value="1">餐娱类</Option>
                                    <Option value="2">一般类</Option>
                                    <Option value="3">民生类</Option>
                                    <Option value="4">房产汽车类</Option>
                                    <Option value="5">批发类</Option>
                                    <Option value="6">公益类</Option>
                                </Select>
                            )}
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col {...threeColLayout}>
                        <FormItem
                            style={{width: formItemWidth}}
                            {...formItemLayout}
                            label="银行合作"
                        >
                            {getFieldDecorator('bankTeamwork', {
                                initialValue: data.bankTeamwork,
                                rules: [],
                            })(
                                <Select
                                    allowClear
                                    placeholder="请选择银行合作"
                                    disabled={isDetail}
                                >
                                    {this.renderBankTeamwork()}
                                </Select>
                            )}
                        </FormItem>
                    </Col>
                    <Col {...threeColLayout}>
                        <FormItem
                            style={{width: formItemWidth, display: 'relative'}}
                            {...formItemLayout}
                            label="自定义分类"
                        >
                            {getFieldDecorator('customClassify', {
                                initialValue: data.customClassify ? data.customClassify.split(',') : undefined,
                                rules: [
                                    validationRule.arrayMaxLength(15, '最多只能选择{max}个标签'),
                                ],
                            })(
                                <Select
                                    mode="multiple"
                                    optionFilterProp="children"
                                    placeholder="请选择自定义分类"
                                    disabled={isDetail}
                                >
                                    {this.renderCustomClassify()}
                                </Select>
                            )}
                            <Button
                                style={{position: 'absolute', right: -50}}
                                onClick={this.showCustomClassifyModal}
                                disabled={isDetail}
                            >
                                <FontIcon type="edit"/>
                            </Button>
                        </FormItem>
                    </Col>
                </Row>
                {
                    getFieldValue('bankTeamwork') === '1' ?
                        <Row>
                            <Col {...threeColLayout}>
                                <FormItem
                                    style={{width: formItemWidth}}
                                    {...formItemLayout}
                                    label="所在银行"
                                >
                                    {getFieldDecorator('customerManagerBank', {
                                        initialValue: data.customerManagerBank,
                                        onChange: this.handleCustomerManagerBankChange,
                                        rules: [
                                            {
                                                required: true, message: '所在银行-不能为空.',
                                            },
                                        ],
                                    })(
                                        <Select placeholder="请选择所在银行" disabled={isDetail}>
                                            {this.renderCustomerManagerBank()}
                                        </Select>
                                    )}
                                </FormItem>
                            </Col>
                            <Col {...threeColLayout}>
                                <FormItem
                                    style={{width: formItemWidth}}
                                    {...formItemLayout}
                                    label="合作经理"
                                >
                                    {getFieldDecorator('customerManager', {
                                        initialValue: data.customerManager,
                                        rules: [
                                            {
                                                required: true, message: '合作经理-不能为空.',
                                            },
                                        ],
                                    })(
                                        <Select placeholder="请选择合作经理" disabled={isDetail}>
                                            {this.renderCustomerManager()}
                                        </Select>
                                    )}
                                </FormItem>
                            </Col>
                        </Row>
                        : null
                }
                {
                    getFieldValue('bankTeamwork') === '2' ?
                        <Row>
                            <Col {...threeColLayout}>
                                <FormItem
                                    style={{width: formItemWidth, display: 'relative'}}
                                    {...formItemLayout}
                                    label="银行合作标识"
                                >
                                    {getFieldDecorator('bankTeamworkSign', {
                                        initialValue: data.bankTeamworkSign,
                                        rules: [
                                            {
                                                required: true, message: '银行合作标识-不能为空.',
                                            },
                                        ],
                                    })(
                                        <Select
                                            placeholder="请选择银行合作标识"
                                            disabled={isDetail}
                                        >
                                            {this.renderBankTeamworkSignText()}
                                        </Select>
                                    )}
                                    <Button
                                        style={{position: 'absolute', right: -50}}
                                        onClick={this.showBankTeamworkSignTextModal}
                                        disabled={isDetail}
                                    >
                                        <FontIcon type="edit"/>
                                    </Button>
                                </FormItem>
                            </Col>
                        </Row>
                        : null
                }
                <Modal
                    title="自定义分类管理"
                    visible={this.state.customClassifyModalVisible}
                    footer={
                        <Button onClick={this.hideCustomClassifyModal}>关闭</Button>
                    }
                    onCancel={this.hideCustomClassifyModal}
                >
                    <CustomClassify labelType="3" userCode={userCode} orgNo={orgNo} onChange={this.handleCustomClassifyChange}/>
                </Modal>

                <Modal
                    title="合作银行标识管理"
                    visible={this.state.bankTeamworkSignTextModalVisible}
                    footer={
                        <Button onClick={this.hideBankTeamworkSignTextModal}>关闭</Button>
                    }
                    onCancel={this.hideBankTeamworkSignTextModal}
                >
                    <CustomClassify labelType="2" userCode={userCode} orgNo={orgNo} onChange={this.handleBankTeamworkSignTextChange}/>
                </Modal>
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
