import React, {Component} from 'react';
import {Form, Checkbox} from 'antd';
import {ajax} from 'zk-react';
import {checkboxGroupCheckOne} from './common';

export const PAGE_ROUTE = '';
const FormItem = Form.Item;
const CheckboxGroup = Checkbox.Group;

@ajax()
export default class HappyPay extends Component {
    state = {
        happyList: [],
    }

    componentDidMount() {
        this.getHappyPayList();
    }

    getHappyPayList = () => {
        const {orgNo} = this.props;
        this.props.$ajax.get(`/func/getHappyPayList/${orgNo}`).then(res => {
            if (res && res.length) {
                const happyList = res.map(item => ({label: item.NAME, value: String(item.ID)}));
                this.setState({happyList});
            }
        });
    }

    handleHappyChange = (value) => {
        // 只选中一个，也可以都不选
        checkboxGroupCheckOne(value, this.props.form, 'huanlezu');
    }

    render() {
        const {form: {getFieldDecorator}, isDetail, data = {}} = this.props;
        const {happyList} = this.state;
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
        // 修改 、查看回显数据
        let initValue;
        if (data.huanlezu) initValue = [data.huanlezu];

        return (
            <div>
                <h3>欢乐租 (首次开户商户可参加,商户开户后不可参加或退出,同一商户只能参与一个欢乐租活动)</h3>
                <FormItem
                    {...formItemLayout}
                    label=" "
                    colon={false}
                >
                    {getFieldDecorator('huanlezu', {
                        initialValue: initValue,
                        onChange: this.handleHappyChange,
                    })(
                        <CheckboxGroup options={happyList} disabled={isDetail}/>
                    )}
                </FormItem>
            </div>
        );
    }
}
