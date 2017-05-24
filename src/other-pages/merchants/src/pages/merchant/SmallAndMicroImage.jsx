import React, {Component} from 'react';
import {Form, Upload, Row, Col} from 'antd';
import connectComponent from 'zk-react/redux/store/connectComponent';
import {validateImage, handleImageChange} from './common';

const Dragger = Upload.Dragger;
const FormItem = Form.Item;

@Form.create()
class LayoutComponent extends Component {
    state = {}

    componentDidMount() {
        const {getForm, form} = this.props;
        getForm(form);
    }

    handleChange = (e, field) => {
        handleImageChange(e, field, this.props.form);
    }

    render() {
        const {form: {getFieldDecorator, getFieldValue}} = this.props;
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
        const files = [
            {text: '＊结算人身份证正面', message: '请上传结算人身份证正面!', field: 'settlePersonIdcardPositiveBase64Img', index: 6, required: true},
            {text: '＊结算人身份证反面', message: '请上传结算人身份证反面!', field: 'settlePersonIdcardOppositeBase64Img', index: 7, required: true},
            {text: '银行卡正面', field: 'bankCardPositivePicBase64Img', index: 9, required: false},
            {text: '＊商户协议照片', message: '请上传商户协议照片!', field: 'merchantAgreementPicBase64Img', index: 11, required: true},
            {text: '＊手持身份证照片', message: '请上传手持身份证照片!', field: 'handIdcardPicBase64Img', index: 22, required: true},
        ];

        return (
            <Row>
                {
                    files.map(item => {
                        const wrapStyle = {
                            backgroundImage: 'none',
                        };
                        const imageData = getFieldValue(item.field);
                        if (imageData && typeof imageData === 'string' && imageData.startsWith('data:image')) {
                            wrapStyle.backgroundImage = `url(${imageData})`;
                        }
                        return (
                            <Col key={item.index} span={6} className={`upload-file ${item.required ? 'required' : ''}`}>
                                <FormItem
                                    {...formItemLayout}
                                    label=" "
                                    colon={false}
                                >
                                    {getFieldDecorator(item.field, {
                                        rules: [
                                            {
                                                required: item.required, message: item.message,
                                            },
                                            validateImage(),
                                        ],
                                    })(
                                        <Dragger
                                            name="file"
                                            multiple
                                            showUploadList={false}
                                            customRequest={e => this.handleChange(e, item.field)}
                                        >
                                            <div className="upload-file-wrap" style={wrapStyle}>
                                                <div className="upload-file-wrap-inner">
                                                    <p
                                                        className="upload-file-name"
                                                        style={{marginTop: 32, marginBottom: 48}}
                                                    >{item.text}</p>
                                                </div>
                                            </div>
                                        </Dragger>
                                    )}
                                </FormItem>
                            </Col>
                        );
                    })
                }
            </Row>
        );
    }
}

function mapStateToProps(state) {
    return {
        ...state,
    };
}

export default connectComponent({LayoutComponent, mapStateToProps});
