import React, {Component} from 'react';
import {Form, Checkbox, Modal} from 'antd';
import {event} from 'zk-react';
import {PageContent} from 'zk-react/antd';
import connectComponent from 'zk-react/redux/store/connectComponent';
import RateInfoUnOpen from './RateInfoUnOpen';
import RateInfoOpen from './RateInfoOpen';

const FormItem = Form.Item;

@Form.create()
@event()
class LayoutComponent extends Component {
    state = {}

    componentDidMount() {
        const {getForm, form} = this.props;
        getForm(form);
    }

    handleIfPosMdChange = (e) => {
        const value = e.target.checked;
        const {getFunctionInfoForm, $emit} = this.props;
        const functionInfoForm = getFunctionInfoForm();
        const functionValue = functionInfoForm.getFieldValue('settleType');
        $emit('merchant-pos-md-change', value);
        if (value && functionValue && (functionValue.indexOf('ifSuiYiTongSettle') > -1 || functionValue.indexOf('ifIntradaySettle') > -1)) {
            return Modal.error({
                title: '提示',
                content: '闪电到账-自动秒到不能与随意通结算/即日付 同时开通!',
                onOk: () => {
                    this.props.form.setFieldsValue({ifPosMd: false});
                },
            });
        }
    }

    render() {
        const {
            form,
            form: {getFieldDecorator, getFieldValue},
            userCode,
            orgNo,
            isAdd,
            isModify,
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
        const ifPosMd = getFieldValue('ifPosMd');
        const commonProps = {
            data,
            form,
            userCode,
            orgNo,
            isAdd,
            isModify,
            isDetail,
        };
        return (
            <PageContent className="rate-info">
                <FormItem
                    {...formItemLayout}
                    colon={false}
                >
                    {getFieldDecorator('ifPosMd', {
                        initialValue: data.ifPosmd === '00', // '00' 开通  '01' 未开通
                        onChange: this.handleIfPosMdChange,
                        valuePropName: 'checked',
                    })(
                        <Checkbox disabled={isDetail}>开通闪电到账-自动秒到</Checkbox>
                    )}
                </FormItem>
                {!ifPosMd ?
                    <RateInfoUnOpen {...commonProps}/>
                    :
                    <div>
                        <RateInfoOpen {...commonProps}/>
                        <h3 style={{marginBottom: 16}}>保底费率信息(秒到产品关闭后自动启用保底费率)</h3>
                        <RateInfoUnOpen isBaoDi {...commonProps}/>
                    </div>
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
