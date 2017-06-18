import React, {Component} from 'react';
import {PageContent, ImageCropperModal} from 'zk-tookit/antd';
import {getImageData} from 'zk-tookit/utils/image-utils';
import {Button} from 'antd';

export const PAGE_ROUTE = '/example/crop-image';
export class LayoutComponent extends Component {
    state = {}

    componentDidMount() {
    }

    render() {
        return (
            <PageContent>
                <img id="preview" src="" alt="预览"/>

                <Button onClick={() => this.imgInput.click()}>上传文件</Button>

                <input
                    ref={node => this.imgInput = node}
                    type="file"
                    multiple
                    style={{display: 'none'}}
                    // accept="image/*" // 慢
                    onChange={(e) => {
                        console.log(e.target.files);
                        const files = e.target.files;
                        const file = files[0];
                        getImageData(file).then(data => {
                            const preview = document.querySelector('#preview');
                            preview.src = data;
                            this.setState({imgUrl: data});
                        });
                    }}
                />

                <ImageCropperModal
                    src={this.state.imgUrl}
                    onOK={data => {
                        console.log(data);
                        const preview = document.querySelector('#preview');
                        preview.src = data.src;
                    }}
                >
                    <Button>编辑图片</Button>
                </ImageCropperModal>
            </PageContent>
        );
    }
}

export function mapStateToProps(state) {
    return {
        ...state,
    };
}
