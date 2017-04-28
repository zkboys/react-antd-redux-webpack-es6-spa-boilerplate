import React, {Component} from 'react';
import 'cropperjs/dist/cropper.css';
import Cropper from 'cropperjs';
import {Row, Col, Slider, Button, Radio} from 'antd';
import {FontIcon} from 'zk-react/antd';
import {throttle} from 'lodash/function';
import './style.less';
import picture from './picture.jpeg';

const RadioGroup = Radio.Group;
export default class extends Component {
    state = {
        resultCanvas: <canvas/>,
        previewImageUrl: '',
        originalImageWidth: 1000,
        originalImageHeight: 800,
        resultImageSize: 0,
        compressPercent: 80,
        previewImageStyle: {},
        cropData: {},
        scaleX: 1,
        scaleY: 1,
        aspectRatio: 'free',
    }

    static defaultProps = {
        width: 800,
        height: 500,
    }

    componentDidMount() {
    }

    handleImageLoad = () => {
        this.initCropper();
    }

    initCropper(options = {}) {
        const image = this.image;
        const handleGetCroppedCanvas = this.handleGetCroppedCanvas;

        this.setState({
            originalImageWidth: image.width,
            originalImageHeight: image.height,
        });

        if (this.cropper) {
            this.cropper.destroy();
        }

        this.cropper = new Cropper(image, {
            // aspectRatio: 16 / 9,
            // preview: '.img-preview',
            crop: throttle((e) => {
                // console.log(e.detail.x);
                // console.log(e.detail.y);
                // console.log(e.detail.width);
                // console.log(e.detail.height);
                // console.log(e.detail.rotate);
                // console.log(e.detail.scaleX);
                // console.log(e.detail.scaleY);

                this.setState({
                    cropData: e.detail,
                });
                handleGetCroppedCanvas();
            }, 300),
            ready() {
                handleGetCroppedCanvas();
            },
            ...options,
        });
    }

    handleGetCroppedCanvas = () => {
        setTimeout(() => {
            const {compressPercent, cropData: {width, height}} = this.state;
            const resultImageWidth = Math.round(width * (compressPercent / 100));
            const resultImageHeight = Math.round(height * (compressPercent / 100));
            let previewImageStyle = {
                width: '100%',
            };
            if (width < height) {
                previewImageStyle = {
                    height: '100%',
                };
            }
            this.setState({
                resultImageWidth,
                resultImageHeight,
                previewImageStyle,
            });
            // console.log(compressPercent, originalImageWidth, width);
            const resultCanvas = this.cropper.getCroppedCanvas({
                width: resultImageWidth,
            });
            // console.log(resultCanvas);
            resultCanvas.toBlob((blob) => {
                const size = (blob.size / 1024).toFixed(2);
                const urlCreator = window.URL || window.webkitURL;
                const previewImageUrl = blob ? urlCreator.createObjectURL(blob) : '';
                let resultImageSize = `${size}KB`;
                if (size > 1000) {
                    resultImageSize = `${(size / 1024).toFixed(2)}MB`;
                }
                this.setState({previewImageUrl, resultImageSize});
            });
        });
    }

    handleSliderChange = (value) => {
        this.setState({compressPercent: value}, () => {
            this.handleGetCroppedCanvas();
        });
    }

    handleRotateLeft = () => {
        this.cropper.rotate(-90);
    }

    handleRotateRight = () => {
        this.cropper.rotate(90);
    }

    handleScaleX = () => {
        const {scaleX} = this.state;
        this.cropper.scaleX(-scaleX);
        this.setState({
            scaleX: -scaleX,
        });
    }

    handleScaleY = () => {
        const {scaleY} = this.state;
        this.cropper.scaleY(-scaleY);
        this.setState({
            scaleY: -scaleY,
        });
    }

    handleAspectRadioChange = (e) => {
        const value = e.target.value;
        console.log(value);
        this.setState({
            aspectRatio: value,
        });
        let aspectRatio = NaN;
        if (value !== 'free') {
            const values = value.split(':');
            aspectRatio = values[0] / values[1];
        }
        this.initCropper({
            aspectRatio,
        });
    }

    handleZoomPlus = () => {
        this.cropper.zoom(0.1);
    }

    handleZoomMinus = () => {
        this.cropper.zoom(-0.1);
    }

    handleReset = () => {
        this.setState({
            aspectRatio: 'free',
            compressPercent: 80,
        });
        this.initCropper();
    }

    handleOK = () => {
        const {resultImageWidth} = this.state;
        this.cropper.getCroppedCanvas({
            width: resultImageWidth,
        }).toBlob((blob) => {
            console.log(blob);
        });
    }

    render() {
        const {
            height,
            width,
        } = this.props;
        const {
            previewImageUrl,
            compressPercent,
            previewImageStyle,
            resultImageWidth,
            resultImageHeight,
            resultImageSize,
            aspectRatio,
        } = this.state;

        return (
            <div className="image-cropper-wrapper" style={{height, width}}>
                <Row>
                    <Col span={16}>
                        <div className="image-cropper-container" style={{width: width * (16 / 24), height}}>
                            <img ref={node => this.image = node} src={picture} alt="图片" onLoad={this.handleImageLoad}/>
                        </div>
                    </Col>
                    <Col span={8}>
                        <div className="image-cropper-preview cropper-bg" style={{width: width * (8 / 24), height: width * (8 / 24)}}>
                            <img src={previewImageUrl} alt="预览图片" style={previewImageStyle}/>
                        </div>
                        <div className="image-cropper-operator">
                            <div className="image-cropper-result">调整后像素为：{resultImageWidth} * {resultImageHeight} ≈ {resultImageSize}</div>
                            <Row>
                                <Col span={4} className="label">压缩：</Col>
                                <Col span={20}>
                                    <Slider min={5} step={5} value={compressPercent} onChange={this.handleSliderChange}/>
                                </Col>
                                <Col span={4} className="label">旋转：</Col>
                                <Col span={20}>
                                    <span onClick={this.handleRotateLeft}><FontIcon type="fa-rotate-left"/></span>
                                    <span onClick={this.handleRotateRight}><FontIcon type="fa-rotate-right"/></span>
                                    <span onClick={this.handleScaleX}><FontIcon type="fa-arrows-h"/></span>
                                    <span onClick={this.handleScaleY}><FontIcon type="fa-arrows-v"/></span>
                                </Col>

                                <Col span={4} className="label">比例：</Col>
                                <Col span={20}>
                                    <RadioGroup value={aspectRatio} size="small" onChange={this.handleAspectRadioChange}>
                                        <Col span={6}>
                                            <Radio value="free">自由</Radio>
                                        </Col>
                                        <Col span={6}>
                                            <Radio value="16:9">16:9</Radio>
                                        </Col>
                                        <Col span={6}>
                                            <Radio value="4:3">4:3</Radio>
                                        </Col>
                                        <Col span={6}>
                                            <Radio value="1:1">1:1</Radio>
                                        </Col>
                                    </RadioGroup>
                                </Col>
                                <Col span={4} className="label">缩放：</Col>
                                <Col span={20}>
                                    <span onClick={this.handleZoomPlus}><FontIcon type="fa-search-plus"/></span>
                                    <span onClick={this.handleZoomMinus}><FontIcon type="fa-search-minus"/></span>
                                </Col>
                            </Row>
                        </div>
                    </Col>
                </Row>
                <div className="image-cropper-buttons">
                    <Button type="ghost" size="default" style={{marginRight: 16}} onClick={this.handleReset}>重置</Button>
                    <Button type="primary" size="default" onClick={this.handleOK}>确定</Button>
                </div>
            </div>
        );
    }
}
