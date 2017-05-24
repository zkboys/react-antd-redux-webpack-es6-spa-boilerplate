import React, {Component} from 'react';
import {Form, Upload, Row, Col, Button, Popconfirm, Spin, Tooltip, Modal, Alert} from 'antd';
import {event} from 'zk-react';
import {FontIcon} from 'zk-react/antd';
import {compressImageToSize, getImageSizeByBase64} from 'zk-react/utils/image-utils';
import connectComponent from 'zk-react/redux/store/connectComponent';
import {
    validateImage,
    handleImageChange,
    imageConfig,
    IMAGE_SIZE,
    billingPrivateHasValue,
    billingPublicHasValue,
} from './common';

const FormItem = Form.Item;

@Form.create()
@event()
class LayoutComponent extends Component {
    state = {
        spinnings: {},
        isYiLeiXiaoWei: false,
        previewVisible: false,
        isPosMd: false,
    };

    componentDidMount() {
        const {
            getForm,
            form,
            form: {setFieldsValue, validateFields},
            $on,
        } = this.props;
        getForm(form);

        $on('merchant-upload-image-zip', (images = []) => {
            const values = {};
            images.forEach(value => {
                const {field, data, type} = value;
                values[field] = value.data;
                console.log('压缩前大小：', getImageSizeByBase64(data));
                compressImageToSize({
                    data,
                    type,
                    size: IMAGE_SIZE,
                }).then(result => {
                    console.log('压缩后大小：', getImageSizeByBase64(result));
                    setFieldsValue({[field]: result});
                    validateFields([field]); // 赋值之后，触发一次校验，否则赋值操作把错误提示去掉了
                });
            });
        });

        $on('merchants-mec-normal-level-change', value => {
            const isYiLeiXiaoWei = value === '20';
            this.setState({isYiLeiXiaoWei});
        });

        $on('merchant-pos-md-change', value => {
            this.setState({isPosMd: value});
        });
    }

    handleChange = (e, field) => {
        const {spinnings} = this.state;
        spinnings[field] = true;
        this.setState({spinnings});
        handleImageChange(e, field, this.props.form, () => {
            spinnings[field] = false;
            this.setState({spinnings});
        });
    }

    handleDelete = (field) => {
        const {setFieldsValue} = this.props.form;
        setFieldsValue({[field]: undefined});
    }

    handlePreviewImageClick = (imageData) => {
        this.setState({
            previewImage: imageData,
            previewVisible: true,
        });
    }
    handlePreviewCancel = () => this.setState({previewVisible: false});

    render() {
        const {
            spinnings,
            isYiLeiXiaoWei,
            isPosMd,
            previewImage,
            previewVisible,
        } = this.state;
        const {
            form: {getFieldDecorator, getFieldValue},
            isDetail,
            imageInfoVo,
            billingPrivate,
            billingPublic,
        } = this.props;
        const formItemLayout = {
            labelCol: {
                xs: {span: 24},
                sm: {span: 6},
            },
            wrapperCol: {
                xs: {span: 24},
                sm: {span: 18},
            },
        };
        let openingAccountLicensePicBase64ImgRequired = false;
        if (!billingPrivateHasValue(billingPrivate) && billingPublicHasValue(billingPublic)) { // 未写对私 写了对公
            openingAccountLicensePicBase64ImgRequired = true;
        }
        return (
            <div>
                <Alert message="注：上传图片如果超过300K，系统会自动压缩到300K以下，您可以点击上传之后的预览图，查看压缩后的图片是否清晰。" type="info"/>
                <Row>
                    {
                        imageConfig.map(item => {
                            let imageData = '';
                            let spinning = spinnings[item.field];
                            let {required, text} = item;
                            if (isYiLeiXiaoWei && (item.field === 'legalPersonidPositivePicBase64Img' || item.field === 'legalPersonidOppositePicBase64Img')) {
                                required = false;
                            }
                            // 未开通秒到，手持身份证号为非必填；若开通秒到，手持身份证号为必填
                            if (!isPosMd && item.field === 'handIdcardPicBase64Img') {
                                required = false;
                            }

                            if (openingAccountLicensePicBase64ImgRequired && item.field === 'openingAccountLicensePicBase64Img') {
                                required = true;
                            }
                            if (required) text = `＊${text}`;

                            const data = getFieldValue(item.field);
                            if (data && typeof data === 'string' && data.startsWith('data:image')) {
                                imageData = data;
                            }

                            // 图片回显
                            let initialValue = imageInfoVo && imageInfoVo[item.field.replace('Base64Img', '')];

                            if (initialValue) {
                                initialValue = `/${initialValue}`;
                            }

                            imageData = imageData || initialValue;
                            let preView = imageData ?
                                (
                                    <Tooltip title={text} placement="bottom">
                                        <img
                                            style={{display: 'block', width: '100%', height: '100%', cursor: 'pointer'}}
                                            src={imageData}
                                            alt={text}
                                            onClick={() => {
                                                this.handlePreviewImageClick(imageData);
                                            }}
                                        />
                                    </Tooltip>
                                )
                                :
                                (
                                    <div className="upload-file-wrap-inner">
                                        <p className="upload-file-name">{text}</p>
                                        <p className="upload-file-index"><span>{item.index}</span></p>
                                    </div>
                                );
                            preView = spinning ? <Spin style={{marginTop: 40}}/> : preView;

                            return (
                                <Col key={item.index} span={6} className={`upload-file ${required ? 'required' : ''}`}>
                                    <FormItem
                                        style={{height: 222}}
                                        {...formItemLayout}
                                        label=" "
                                        colon={false}
                                    >
                                        {getFieldDecorator(item.field, {
                                            initialValue,
                                            rules: [
                                                {
                                                    required, message: `请上传${text.replace('＊', '')}！`,
                                                },
                                                validateImage(),
                                            ],
                                        })(
                                            <div>
                                                <div className="upload-file-wrap">
                                                    {preView}
                                                </div>
                                                <Row>
                                                    <Col span={12}>
                                                        <Upload
                                                            name="file"
                                                            multiple
                                                            accept="image/*"
                                                            showUploadList={false}
                                                            customRequest={e => this.handleChange(e, item.field)}
                                                        >
                                                            <Button size="small" disabled={isDetail}>
                                                                <FontIcon type="upload"/> {imageData ? '重新上传' : '上传'}
                                                            </Button>
                                                        </Upload>
                                                    </Col>
                                                    <Col span={12} style={{textAlign: 'right'}}>
                                                        {
                                                            imageData ?
                                                                <Popconfirm
                                                                    title={`确定删除${text}？`}
                                                                    okText="确定"
                                                                    cancelText="取消"
                                                                    onConfirm={() => this.handleDelete(item.field)}
                                                                >
                                                                    <Button type="danger" size="small" disabled={isDetail}>
                                                                        <FontIcon type="delete"/>删除
                                                                    </Button>
                                                                </Popconfirm>
                                                                : null
                                                        }
                                                    </Col>
                                                </Row>
                                            </div>
                                        )}
                                    </FormItem>
                                </Col>
                            );
                        })
                    }
                </Row>
                <Modal maskClosable width={800} visible={previewVisible} footer={null} onCancel={this.handlePreviewCancel}>
                    <div className="preview-wrap">
                        <img alt="preview" src={previewImage}/>
                    </div>
                </Modal>
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        billingPrivate: state.pageState.billingPrivate,
        billingPublic: state.pageState.billingPublic,
    };
}

export default connectComponent({LayoutComponent, mapStateToProps});
