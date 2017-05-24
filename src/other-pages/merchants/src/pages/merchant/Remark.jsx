import React, {Component} from 'react';
import {Form, Input} from 'antd';
import {PageContent} from 'zk-react/antd';
import connectComponent from 'zk-react/redux/store/connectComponent';
import validationRule from '../../commons/validation-rule';

const FormItem = Form.Item;

@Form.create()
class LayoutComponent extends Component {
    state = {}

    componentDidMount() {
        const {getForm, form} = this.props;
        getForm(form);
    }

    render() {
        const {form: {getFieldDecorator}, isDetail, data = {}} = this.props;
        return (
            <PageContent>
                <FormItem
                    colon={false}
                >
                    {getFieldDecorator('suggestion', {
                        initialValue: data.suggestion,
                        rules: [
                            validationRule.stringByteMaxLength(200, '最多输入{max}个字符.'),
                        ],
                    })(
                        <Input style={{height: 100}} type="textarea" placeholder="请输入备注" disabled={isDetail}/>
                    )}
                </FormItem>
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
