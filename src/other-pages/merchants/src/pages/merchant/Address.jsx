import React, {Component} from 'react';
import {Form, Input, Select} from 'antd';
import {ajax} from 'zk-react';
import validationRule from '../../commons/validation-rule';

const FormItem = Form.Item;
const Option = Select.Option;

@ajax()
export default class BindAddress extends Component {
    state = {
        province: [], // 省
        city: [], // 市
        area: [], // 区
    }

    componentWillReceiveProps(nextProps) {
        const {provinceField, cityField} = this.props;
        const {isDetail, isModify, data = {}} = nextProps;
        if ((isDetail || isModify) && data[provinceField]) {
            this.getCity(data[provinceField]);
        }

        if ((isDetail || isModify) && data[cityField]) {
            this.getArea(data[cityField]);
        }
    }

    componentDidMount() {
        this.getProvince();
    }


    // 获取省份下拉数据
    getProvince() {
        const {$ajax} = this.props;
        $ajax.get('/binfo/getProvince').then(res => {
            this.setState({province: res});
        });
    }

    // 渲染省份下拉列表
    renderProvince() {
        const {province} = this.state;
        return province.map(item => <Option key={item.areaId} value={String(item.areaId)}>{item.areaNm}</Option>);
    }


    // 处理注册地址省份改变事件，级联获取市列表
    handleProvinceChange = (value) => {
        const {cityField, areaField} = this.props;
        this.props.form.setFieldsValue({[cityField]: undefined, [areaField]: undefined});
        this.getCity(value);
    }

    // 获取市或者区公共方法
    getDownTown(id) {
        const {$ajax} = this.props;
        return $ajax.get(`/binfo/getDownTown/${id}`);
    }

    // 获取注册地址市下拉列表
    getCity(provinceId) {
        this.getDownTown(provinceId).then(res => {
            this.setState({city: res});
        });
    }

    // 渲染注册地址市下拉列表
    renderCity() {
        return this.state.city.map(item => <Option key={item.areaId} value={String(item.areaId)}>{item.areaNm}</Option>);
    }

    // 处理注册地址市改变事件，级联获取区列表
    handleCityChange = (value) => {
        const {areaField} = this.props;
        this.props.form.setFieldsValue({[areaField]: undefined});
        this.getArea(value);
    }

    // 获取注册地址区下拉列表
    getArea(cityId) {
        this.getDownTown(cityId).then(res => {
            this.setState({area: res});
        });
    }

    // 渲染注册地址区下拉列表
    renderArea() {
        return this.state.area.map(item => <Option key={item.areaId} value={String(item.areaId)}>{item.areaNm}</Option>);
    }


    render() {
        const {
            form: {getFieldDecorator},
            data,
            isDetail,
            label = '装机地址',
            streetLabel = '装机地址街道',
            provinceField,
            cityField,
            areaField,
            streetField,
            provinceMessage = '装机地址(省)-不能为空.',
            cityMessage = '装机地址(市)-不能为空.',
            areaMessage = '装机地址(区)-不能为空.',
            streetMessage = '装机地址街道-不能为空.',
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
        const formItemWidth = 300;
        return (
            <div>
                <FormItem
                    style={{display: 'inline-block', width: formItemWidth, marginRight: 8}}
                    {...formItemLayout}
                    label={label}
                >
                    {getFieldDecorator(provinceField, {
                        initialValue: data[provinceField],
                        onChange: this.handleProvinceChange,
                        rules: [
                            {
                                required: true, message: provinceMessage,
                            },
                        ],
                    })(
                        <Select placeholder="请选择省" disabled={isDetail} showSearch optionFilterProp="children">
                            {this.renderProvince()}
                        </Select>
                    )}
                </FormItem>
                <FormItem
                    style={{display: 'inline-block', width: 225, marginRight: 8}}
                    colon={false}
                >
                    {getFieldDecorator(cityField, {
                        initialValue: data[cityField],
                        onChange: this.handleCityChange,
                        rules: [
                            {
                                required: true, message: cityMessage,
                            },
                        ],
                    })(
                        <Select placeholder="请选择市" disabled={isDetail} showSearch optionFilterProp="children">
                            {this.renderCity()}
                        </Select>
                    )}
                </FormItem>
                <FormItem
                    style={{display: 'inline-block', width: 225}}
                    colon={false}
                >
                    {getFieldDecorator(areaField, {
                        initialValue: data[areaField],
                        rules: [
                            {
                                required: true, message: areaMessage,
                            },
                        ],
                    })(
                        <Select placeholder="请选择区" disabled={isDetail} showSearch optionFilterProp="children">
                            {this.renderArea()}
                        </Select>
                    )}
                </FormItem>
                <FormItem
                    labelCol={{span: 5}}
                    wrapperCol={{span: 16}}
                    style={{width: 608}}
                    label={streetLabel}
                >
                    {getFieldDecorator(streetField, {
                        initialValue: data[streetField],
                        rules: [
                            {
                                required: true, message: streetMessage,
                            },
                            validationRule.noSpace(),
                            validationRule.stringByteMaxLength(60, '最多输入{max}个字符.'),
                        ],
                    })(
                        <Input placeholder="请输入街道" disabled={isDetail}/>
                    )}
                </FormItem>
            </div>
        );
    }
}
