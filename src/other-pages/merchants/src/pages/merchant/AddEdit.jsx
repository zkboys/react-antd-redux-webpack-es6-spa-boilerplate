import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Form, Card, Button, Modal} from 'antd';
import {ajax, isDev} from 'zk-react';
import {PageContent, FontIcon} from 'zk-react/antd';
import './style.less';
import BaseInfo from './BaseInfo';
import RateInfo from './RateInfo';
import BillingPrivate from './BillingPrivate';
import BillingPublic from './BillingPublic';
import OtherFunction from './OtherFunction';
import Remark from './Remark';
import UploadAttachment from './UploadAttachment';
import OperateHistory from './OperateHistory';

export const PAGE_ROUTE = '/merchants/+add_edit/:merchId';

@ajax()
class AddEdit extends Component {
    static contextTypes = {
        router: PropTypes.object,
    };

    state = {
        isSaved: false,
        saving: false,
        savingDraft: false,
        taskCode: null,
        userCode: '',
        orgNo: '',
        merchant: {
            baseInfoVo: undefined,
            billingInfoVo: undefined,
            file: undefined,
            functionInfoVo: undefined,
            imageInfoVo: undefined,
            rateInfoVo: undefined,
        },
    }
    /*
     * http://localhost:9090/merchants/+add_edit/:merchId?isReturn=true&isDetail=true&userCode=110665&orgNo=5138497260
     * http://localhost:9090/merchants/+add_edit/:merchId?isReturn=true&isModify=true&userCode=110665&orgNo=5138497260
     * */
    componentWillMount() {
        const {params, location} = this.props;
        let isAdd = false;
        let isDetail = false;
        let isModify = false;
        let isDraft = false; // 是否为草稿
        let isReturn = false; // 是否为退件
        let merchId = '';
        if (location && location.query) {
            const query = location.query;
            isDraft = query.isDraft === 'true';
            isReturn = query.isReturn === 'true';
            isDetail = query.isDetail === 'true';
            isModify = query.isModify === 'true';
            isAdd = !isDetail && !isModify;
            const {userCode, orgNo} = query;
            this.setState({userCode, orgNo});
        }

        if (params.merchId !== ':merchId') {
            merchId = params.merchId;
        }
        this.setState({merchId, isAdd, isModify, isDetail, isDraft, isReturn});
        console.log(123);
        console.log(888);
    }

    componentDidMount() {
        const {isAdd, isDraft, isDetail, isModify} = this.state;

        if (isDraft && (isDetail || isModify)) this.getDraftMerchant();

        if (!isDraft && (isDetail || isModify)) this.getMerchant();

        if (isAdd) this.getTaskCode();

        if (isAdd || (isDraft && isModify)) this.handleSaveDraft();
    }

    componentWillUnmount() {
        if (this.saveDraftIt) clearInterval(this.saveDraftIt);
    }

    // 获取草稿数据
    getDraftMerchant() {
        const {$ajax} = this.props;
        const {merchId} = this.state;
        $ajax.get(`/draft/detail/${merchId}`).then(res => {
            this.setState({merchant: res});
        });
    }

    // 获取真实数据
    getMerchant() {
        const {$ajax} = this.props;
        const {merchId} = this.state;
        $ajax.get(`/merch/detail/${merchId}`).then(res => {
            this.setState({merchant: res});
        });
    }

    getTaskCode() {
        const {$ajax} = this.props;
        const {merchant} = this.state;
        $ajax.get('/binfo/getTaskCode/01').then(res => {
            if (!merchant.baseInfoVo) merchant.baseInfoVo = {taskCode: res};
            this.setState({merchant});
        });
    }

    draftFormData = {};
    savedDraftJsonStr = '';
    handleSaveDraft = () => {
        const {$ajax} = this.props;
        const {isAdd, isModify} = this.state;
        this.saveDraftIt = setInterval(() => {
            const {savingDraft, saving} = this.state;
            if (saving || savingDraft) return;
            Object.keys(this.dealFormData).forEach(item => {
                const values = this[item].getFieldsValue();
                this.draftFormData[this.dealFormData[item].prop] = this.dealFormData[item].handler(values);
            });
            this.handleFinalFormData(this.draftFormData);

            // 对比，如果没有改动，就不保存
            let draftFormDataJsonStr = JSON.stringify(this.draftFormData);
            // 费率中的startDate为时间戳，每次都不一样，这里要过滤掉，否者对比失败
            const startDateIndex = draftFormDataJsonStr.indexOf('startDate');
            const startDateStr = draftFormDataJsonStr.substr(startDateIndex, 30);
            draftFormDataJsonStr = draftFormDataJsonStr.replace(startDateStr, '');

            // 修改页面，如果刚进入 savedDraftJsonStr 为空 设置 savedDraftJsonStr 否者对比失败
            if (isModify && !this.savedDraftJsonStr) {
                this.savedDraftJsonStr = draftFormDataJsonStr;
            }

            if (this.savedDraftJsonStr === draftFormDataJsonStr) return;


            /** 发起ajax自动保存草稿信息:
             * 一下五个字段任意一个填写了，就自动保存
             * <签购单名称、注册名称、主营业务、法人姓名、联系人手机号>
             * */
            const receiptsName = this.draftFormData.baseInfoVo.receiptsName;
            const registName = this.draftFormData.baseInfoVo.registName;
            const mainManageBusiness = this.draftFormData.baseInfoVo.mainManageBusiness;
            const legalPersonName = this.draftFormData.baseInfoVo.legalPersonName;
            const linkmanMobileNo = this.draftFormData.baseInfoVo.linkmanMobileNo;
            if (
                receiptsName
                || registName
                || mainManageBusiness
                || legalPersonName
                || linkmanMobileNo
            ) {
                let url = '/draft/save';
                if (isAdd) {
                    url = '/draft/save';
                }
                if (isModify) {
                    url = '/draft/update';
                }
                this.setState({savingDraft: true});
                $ajax.post(url, this.draftFormData, {timeout: 15 * 1000, successTip: '草稿保存成功！', errorTip: false}).then(() => {

                }).finally(() => {
                    this.savedDraftJsonStr = draftFormDataJsonStr;
                    this.setState({savingDraft: false});
                });
            }
        }, isDev ? 5 * 1000 : 20 * 1000); // 开发环境5秒一次，方便调试
    };

    // 处理每个form的数据，数据拼接，后端接口所需字段拼接等，不涉及校验
    dealFormData = {
        baseInfoForm: {
            prop: 'baseInfoVo',
            handler: values => {
                let {customClassify} = values;
                if (customClassify && customClassify.length) customClassify = customClassify.join(',');
                if (!customClassify || !customClassify.length) customClassify = '';
                return {
                    ...values,
                    customClassify,
                };
            },
        },
        billingPrivateInfoForm: {
            prop: 'billingPrivateInfoVo',
            handler: values => values,
        },
        billingPublicInfoForm: {
            prop: 'billingPublicInfoVo',
            handler: values => values,
        },
        functionInfoForm: {
            prop: 'functionInfoVo',
            handler: values => {
                let {functionAcceptanceSettle, settleType} = values;
                // 功能受理 一般刷卡 预授权 在线退货
                if (functionAcceptanceSettle && functionAcceptanceSettle.length) functionAcceptanceSettle = functionAcceptanceSettle.join(',');
                if (!functionAcceptanceSettle || !functionAcceptanceSettle.length) functionAcceptanceSettle = '';

                let ifSuiYiTongSettle = 0; // 随意通结算
                let ifNonworkdaySettle = 0; // 非工作日结算
                let ifIntradaySettle = 0; // 即日付
                if (settleType && settleType.length) {
                    if (settleType.indexOf('ifSuiYiTongSettle') > -1) ifSuiYiTongSettle = 1;
                    if (settleType.indexOf('ifNonworkdaySettle') > -1) ifNonworkdaySettle = 1;
                    if (settleType.indexOf('ifIntradaySettle') > -1) ifIntradaySettle = 1;
                }
                const functionInfoVo = {
                    ...values,
                    functionAcceptanceSettle,
                    ifSuiYiTongSettle,
                    ifNonworkdaySettle,
                    ifIntradaySettle,
                };

                // 处理欢乐租数据
                const huanlezu = values.huanlezu;
                if (huanlezu && huanlezu.length) {
                    functionInfoVo.huanlezu = huanlezu[0];
                }

                // 随意通结算：
                // 自动结算时间
                let {automaticSettleTime = ''} = values;
                if (automaticSettleTime && automaticSettleTime.length) automaticSettleTime = automaticSettleTime.join(',');
                functionInfoVo.automaticSettleTime = automaticSettleTime;

                // POS维护费 维护通
                let {maintainFeeOfPosAndWeiHuTong} = values;
                if (maintainFeeOfPosAndWeiHuTong && maintainFeeOfPosAndWeiHuTong.length) {
                    if (maintainFeeOfPosAndWeiHuTong.indexOf('ifMaintainFeeOfPos') > -1) {
                        functionInfoVo.feeInfomation = 1;
                    }
                    if (maintainFeeOfPosAndWeiHuTong.indexOf('ifWeiHuTong') > -1) {
                        functionInfoVo.feeInfomation = 2;
                    }
                }

                // 其他消费
                functionInfoVo.ifOtherConsumption = '1';

                return functionInfoVo;
            },
        },
        imageInfoForm: {
            prop: 'imageInfoVo',
            handler: values => values,
        },
        rateInfoForm: {
            prop: 'rateInfoVo',
            handler: values => {
                const {ifPosMd} = values;

                const getRateInfomationStr = () => {
                    const infoJson = {
                        current: {
                            startDate: `${new Date().getTime()}`, // TODO 这个startDate是什么鬼？
                            currentGoodsId: '',
                            goodsList: [],
                        },
                    };

                    const {billingWay, chargingInfo} = values;
                    if (!chargingInfo) return '';
                    const good = chargingInfo.goodsList[billingWay];
                    if (!good) return '';
                    infoJson.current.currentGoodsId = good.goodsId;
                    const goodsList = {};
                    goodsList.goodsId = good.goodsId;
                    goodsList.goodsName = good.goodsName;
                    goodsList.sections = [];
                    Object.keys(good.sections).forEach(key => {
                        const section = good.sections[key];
                        const {pricSectionId, rateId, sectionName, rateInfo} = section;
                        const rateInfos = {};
                        const rateInfoKeys = Object.keys(rateInfo);
                        rateInfoKeys.forEach(k => {
                            const rate = rateInfo[k];
                            const {/* label, */modfElemtNm, modDwn, modfFlg, modfUp, recommendValue, required, uuid, visiable} = rate;
                            if (uuid) {
                                const value = values[`${uuid}-fee`] || values[`${uuid}-rate`];

                                if (value) {
                                    rateInfos[k] = [
                                        `${value}`,
                                        modfElemtNm,
                                        modfFlg,
                                        modfUp,
                                        modDwn,
                                        recommendValue,
                                        visiable,
                                        required,
                                        uuid,
                                    ];
                                }
                            }
                        });
                        goodsList.sections.push({
                            pricSectionId,
                            rateId,
                            sectionName,
                            rateInfo: rateInfos,
                        });
                    });
                    infoJson.current.goodsList.push(goodsList);
                    return JSON.stringify(infoJson);
                };

                let posmdstr = '';
                if (ifPosMd) { // 开通闪电到账
                    const {rate, maxFee, fixedFee = 0, monthFee = 0, foreignCard, billingMdWay} = values;
                    posmdstr = `${rate},${maxFee},${fixedFee},${monthFee},${foreignCard},${billingMdWay}`;
                }
                return {
                    ifPosmd: ifPosMd ? '00' : '01', // 00为开通， 01 为关闭, // 是否开通闪电到账
                    rateInfomation: getRateInfomationStr(), // 拼接的费率字符串
                    posmdstr, //  秒到拼接的字符串
                };
            },
        },
        userInfoForm: {
            prop: 'userInfoVo',
            handler: values => values,
        },
        remarkForm: {
            prop: 'remarkInfoVo',
            handler: values => values,
        },
    };

    // 处理最终的formData，数据拼接，不涉及校验
    handleFinalFormData(formData) {
        const {userCode, orgNo} = this.props.location.query;
        // 数据处理： 合并billingInfoVo
        formData.billingInfoVo = {
            ...formData.billingPrivateInfoVo,
            ...formData.billingPublicInfoVo,
        };
        Reflect.deleteProperty(formData, 'billingPrivateInfoVo');
        Reflect.deleteProperty(formData, 'billingPublicInfoVo');

        // 数据处理：处理备注
        formData.baseInfoVo.suggestion = formData.remarkInfoVo.suggestion;
        Reflect.deleteProperty(formData, 'remarkInfoVo');

        // 数据处理：统一处理处理taskCode orgNo
        const taskCode = formData.userInfoVo.taskCode;
        Object.keys(formData).forEach(key => {
            formData[key].taskCode = taskCode;
            formData[key].orgNo = orgNo;
        });

        // 数据处理：处理userInfo
        formData.userInfoVo.userCode = userCode;

        // 数据处理：一些默认值
        formData.baseInfoVo.jinjianChannel = '3';
        formData.baseInfoVo.roleIdentity = 'ROLE_IDENTITY_ADMIN'; // TODO 需要系统传值
        formData.baseInfoVo.jinjianType = '1'; // 进件类型  二类小微 2
    }


    formData = {};
    handleSubmit = (e) => {
        e.preventDefault();
        this.formData = {};
        Object.keys(this.dealFormData).forEach(item => {
            this[item].validateFieldsAndScroll((err, values) => {
                if (err && item === 'imageInfoForm') {
                    return Modal.error({
                        title: '提示',
                        content: '您有必传图片未上传！请查看 其他信息->图片上传',
                    });
                }
                if (!err) {
                    this.formData[this.dealFormData[item].prop] = this.dealFormData[item].handler(values);
                    this.save();
                }
            });
        });
    }

    save() {
        const {$ajax} = this.props;
        const {saving} = this.state;
        if (saving) return;

        const keys = Object.keys(this.dealFormData).map(item => this.dealFormData[item].prop);
        for (let key of keys) {
            if (!Reflect.has(this.formData, key)) {
                return;
            }
        }
        const {userCode, orgNo} = this.props.location.query;

        // 结算人身份证
        const settleManidNumber = this.formData.baseInfoVo.settleManidNumber;
        // 法人身份证号：
        const legalPersonCode = this.formData.baseInfoVo.legalPersonCode;
        // 对私结算账户名
        const toPrivateAccountName = this.formData.billingPrivateInfoVo.toPrivateAccountName;
        // 法人姓名
        const legalPersonName = this.formData.baseInfoVo.legalPersonName;

        // 商户等级
        const mecNormalLevel = this.formData.baseInfoVo.mecNormalLevel;
        // 校验：对私结算商户结算人身份证号=法人身份证号，结算账户名不等于法人姓名   界面校验提示：法人姓名和对私结算户名不一致请修改

        if (
            toPrivateAccountName
            && settleManidNumber === legalPersonCode
            && toPrivateAccountName !== legalPersonName
            && mecNormalLevel === '10' // 普通商户进行校验
        ) {
            return Modal.error({
                title: '提示',
                content: '法人姓名和对私结算户名不一致请修改',
            });
        }

        // 校验：结算人身份证号不等于法人身份证号，结算账户名等于法人姓名   界面校验提示：法人姓名和对私结算户名不可一致请修改
        if (
            toPrivateAccountName
            && settleManidNumber !== legalPersonCode
            && toPrivateAccountName === legalPersonName
            && mecNormalLevel === '10' // 普通商户进行校验
        ) {
            return Modal.error({
                title: '提示',
                content: '法人姓名和对私结算户名不可一致请修改',
            });
        }

        // 校验： 个体结算 与 对公结算，至少填写一组并且必须整组填写！
        function checkBillingInfo(billing) {
            const billingKeys = Object.keys(billing);
            let hasValue = false;
            let hasAllValue = true;
            for (let key of billingKeys) {
                if (key !== 'toPublicOpenbankInfomationSelect' && key !== 'toPrivateOpenbankInfomationSelect') {
                    const value = billing[key];

                    if (value && !hasValue) hasValue = true;
                    if (!value) hasAllValue = false;
                }
            }
            return {hasValue, hasAllValue};
        }

        const {hasValue: hasPrivateValue, hasAllValue: privateComplete} = checkBillingInfo(this.formData.billingPrivateInfoVo);
        const {hasValue: hasPublicValue, hasAllValue: publicComplete} = checkBillingInfo(this.formData.billingPublicInfoVo);
        if (
            (!hasPrivateValue && !hasPublicValue) // 一组也没填写
            || (hasPrivateValue && !privateComplete) // 填写了 对私 但是不完整
            || (hasPublicValue && !publicComplete) // 填写了 对公 但是不完整
        ) {
            return Modal.error({
                title: '提示',
                content: '个体结算 与 对公结算，至少填写一组并且必须整组填写！',
            });
        }
        // 只填写对公结算信息，不填写对私结算信息时，不允许开通即日付，点击提交时提示“默认账户非对私类型不允许开通即日付!”，不允许提交成功
        const ifIntradaySettle = this.formData.functionInfoVo.ifIntradaySettle;
        if (hasPublicValue && !hasPrivateValue && ifIntradaySettle === 1) {
            return Modal.error({
                title: '提示',
                content: '默认账户非对私类型不允许开通即日付!',
            });
        }

        // 只填写对公结算信息，不填写对私结算信息，开户许可证图片必上传
        const {openingAccountLicensePicBase64Img, openingAccountLicensePic} = this.formData.imageInfoVo;

        if (
            hasPublicValue && !hasPrivateValue
            && !(openingAccountLicensePicBase64Img || openingAccountLicensePic)
        ) {
            return Modal.error({
                title: '提示',
                content: '请上传开户许可证!',
            });
        }

        // 处理数据
        this.handleFinalFormData(this.formData);

        // TODO 异步请求，校验5个字段重复次数
        // 保存数据
        this.setState({saving: true});
        $ajax.post('/merch/save', this.formData, {timeout: 60 * 1000}).then(() => {
            const {router, actions} = this.props;
            const {isAdd, isModify, isReturn, isDraft} = this.state;
            actions.setState('mearchSuccess', {
                taskCode: this.formData.baseInfoVo.taskCode,
                registName: this.formData.baseInfoVo.registName,
                salesmanName: this.formData.baseInfoVo.salesmanName,
                isAdd,
                isModify,
                isReturn,
                isDraft,
                userCode,
                orgNo,
            });
            router.replace('/merchants/success');
        }).catch(err => {
            let content = '保存数据失败！';
            if (err && err.response && err.response.message) {
                content = err.response.message;
            }
            Modal.error({
                title: '提示',
                content,
            });
        }).finally(() => {
            this.setState({saving: false});
        });
    }

    render() {
        const {merchant, isAdd, isModify, isDetail, isReturn, isDraft, saving, savingDraft, userCode, orgNo} = this.state;
        const commonProps = {isAdd, isModify, isDetail, userCode, orgNo, isReturn, isDraft};
        return (
            <PageContent className="merchant-add-edit">
                <h1 className="title">创建商户信息录入</h1>
                <Form onSubmit={this.handleSubmit}>
                    <UploadAttachment
                        getForm={f => this.userInfoForm = f}
                        data={merchant.baseInfoVo}
                        {...commonProps}
                    />
                    <Card title="基础信息" className="block">
                        <BaseInfo
                            getForm={f => this.baseInfoForm = f}
                            getfunctionInfoForm={() => this.functionInfoForm}
                            data={merchant.baseInfoVo}
                            {...commonProps}
                        />
                    </Card>
                    <Card title="费率信息" className="block">
                        <RateInfo
                            getForm={f => this.rateInfoForm = f}
                            getFunctionInfoForm={() => this.functionInfoForm}
                            data={merchant.rateInfoVo}
                            {...commonProps}
                        />
                    </Card>
                    <Card
                        title={<span>个体结算信息 <span className="tip">个体结算信息必须整组填写（对公结算信息同理），点击“开户行信息输入框查询结算银行”可以补全联行行号及开户行信息.</span></span>}
                        className="block">
                        <BillingPrivate
                            getForm={f => this.billingPrivateInfoForm = f}
                            data={merchant.billingInfoVo}
                            {...commonProps}
                        />
                    </Card>
                    <Card title="对公结算信息" className="block">
                        <BillingPublic
                            getForm={f => this.billingPublicInfoForm = f}
                            getBaseInfoForm={() => this.baseInfoForm}
                            getBillingPrivateInfoForm={() => this.billingPrivateInfoForm}
                            data={merchant.billingInfoVo}
                            {...commonProps}
                        />
                    </Card>
                    <Card title="其他信息" className="block no-padding">
                        <OtherFunction
                            getFuncForm={f => this.functionInfoForm = f}
                            getImageForm={f => this.imageInfoForm = f}
                            getBaseInfoForm={() => this.baseInfoForm}
                            getRateInfoForm={() => this.rateInfoForm}
                            data={merchant.functionInfoVo}
                            imageInfoVo={merchant.imageInfoVo}
                            {...commonProps}
                        />
                    </Card>
                    {
                        isReturn ?
                            <Card title="操作历史" className="block no-padding">
                                <OperateHistory
                                    data={merchant.operationHisList}
                                    {...commonProps}
                                />
                            </Card>
                            : null
                    }
                    <Card title="备注" className="block no-padding">
                        <Remark
                            getForm={f => this.remarkForm = f}
                            data={merchant.baseInfoVo}
                            {...commonProps}
                        />
                    </Card>
                    {
                        isDetail ?
                            <Button
                                style={{marginRight: 8}}
                                size="large"
                                onClick={() => this.props.router.goBack()}
                            ><FontIcon type="rollback"/>返回</Button>
                            :
                            <Button
                                disabled={isDetail || saving || savingDraft}
                                loading={saving || savingDraft}
                                type="primary"
                                htmlType="submit" size="large">
                                {saving ? null : <FontIcon type="save"/>}
                                {savingDraft ? '保存草稿中' : <span style={{display: 'inline-block', width: 70}}>提交</span>}
                            </Button>
                    }
                </Form>
            </PageContent>
        );
    }
}

export const LayoutComponent = Form.create()(AddEdit);

export function mapStateToProps(state) {
    return {
        ...state,
    };
}
