import React, {Component} from 'react';
import {Form, Upload, Button, Input, Row, Col, Modal, message, Alert} from 'antd';
import {ajax, event} from 'zk-react';
import {getImageFileInfo} from 'zk-react/utils/image-utils';
import {PageContent, FontIcon} from 'zk-react/antd';
import connectComponent from 'zk-react/redux/store/connectComponent';
import {imageConfig} from './common';

const FormItem = Form.Item;

/*
 function getFileExt(fileName) {
 if (typeof fileName !== 'string') return '';
 const lastIndex = fileName.lastIndexOf('.');
 return fileName.substr(lastIndex + 1);
 }
 */

function getFileName(fileName) {
    if (typeof fileName !== 'string') return '';
    fileName = fileName.split('/').pop();
    const lastIndex = fileName.lastIndexOf('.');
    return fileName.substring(0, lastIndex);
}

@Form.create()
@ajax()
@event()
class LayoutComponent extends Component {
    state = {
        uploading: false,
    }

    componentDidMount() {
        const {getForm, form} = this.props;
        getForm(form);
    }

    handleUpload = (e) => {
        if (e.file && e.file.size > 5 * 1000 * 1000) {
            return Modal.error({
                title: '提示',
                content: '请上传小于5M的文件！',
            });
        }
        this.setState({uploading: true});
        getImageFileInfo(e.file, (err, results) => {
            if (err) {
                this.setState({uploading: false});
                return message.error(
                    <div>
                        <div>图片处理出错！</div>
                        <div>请上传压缩包，或图片格式文件！</div>
                        <div>错误文件：{e.file.name}</div>
                    </div>, 5);
            }
            if (results && results.length) {
                const matchResults = [];
                const unMatchResults = [];
                results.forEach(info => {
                    let {name, data, type} = info;
                    const fileName = getFileName(name);
                    const mr = imageConfig.find(item => {
                        // 匹配算法
                        return fileName === item.text || fileName === item.spell || Number(fileName) === item.index;
                    });
                    if (mr) { // 匹配成功
                        matchResults.push({
                            field: mr.field,
                            data,
                            type,
                        });
                    } else { // 匹配失败
                        unMatchResults.push(name);
                    }
                });
                // ios 打包之后，每个文件都会有这个文件，过滤掉
                const um = unMatchResults.filter(item => !item.startsWith('__MACOSX'));
                if (um && um.length) {
                    Modal.error({
                        title: '您有未匹配文件',
                        content: um.map((item, index) => <div key={index}>{item}</div>),
                    });
                }
                this.props.$emit('merchant-upload-image-zip', matchResults);
            }
            message.success('图片处理完成！', 3);
            this.setState({uploading: false});
        });
    }

    render() {
        const {uploading} = this.state;
        const {
            form: {getFieldDecorator},
            data = {},
            isDetail,
        } = this.props;
        const formItemLayout = {
            labelCol: {
                sm: {span: 6},
            },
            wrapperCol: {
                sm: {span: 14},
            },
        };
        return (
            <PageContent>
                <Row>
                    <Col span={8}>
                        <FormItem
                            {...formItemLayout}
                            label="任务编号"
                        >
                            {getFieldDecorator('taskCode', {
                                initialValue: data.taskCode,
                            })(
                                <Input disabled style={{width: 230}}/>
                            )}
                        </FormItem>
                    </Col>
                    <Col span={16}>
                        <FormItem
                            style={{float: 'left'}}
                            {...formItemLayout}
                            label="上传文件"
                        >
                            <Upload
                                multiple
                                showUploadList={false}
                                customRequest={this.handleUpload}
                            >
                                <Button loading={uploading} disabled={isDetail || uploading} style={{width: 200}} size="large">
                                    {
                                        !uploading ?
                                            <FontIcon type="upload"/>
                                            : null
                                    }
                                    点击上传文件
                                </Button>
                            </Upload>
                        </FormItem>
                        <div style={{float: 'left'}}>
                            <Alert
                                message="注：提前批量上传图片附件减少等待时间，系统根据文件中文名称或英文名称和顺序编号自动匹配，自动显示至图片对应位置，如有对应错误可以修正，上传文件出现重名时以最后一个为准。上传图片文件(jpg、jpeg、png、gif、bmp)！ 例如：营业执照照片对应文件名为:“营业执照”、“yingyezhizhao”、“1”。可以上传图片或者压缩包，支持单个文件或者多个文件同时上传。单张图片如果超过300K，系统会自动压缩到300K以下，您可以点击上传之后的预览图，查看压缩后的图片是否清晰。"
                                type="info"/>
                        </div>
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

export default connectComponent({LayoutComponent, mapStateToProps});
