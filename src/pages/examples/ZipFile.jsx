import React, {Component} from 'react';
import {compressImageToSize, getImageFileInfo} from 'zk-tookit/utils/image-utils';

export const PAGE_ROUTE = '/example/zip-file';
export class LayoutComponent extends Component {
    state = {
        images: [],
    }

    componentDidMount() {

    }

    handleChange = (e) => {
        const images = [...this.state.images];
        if (!e.target.files) return;
        Array.from(e.target.files).forEach(f => getImageFileInfo(f, (err, results) => {
            if (err) return;
            if (results && results.length) {
                results.forEach(info => {
                    compressImageToSize({
                        data: info.data,
                        type: info.type,
                    }).then(imageData => {
                        images.push(<span><img src={imageData} alt={info.name}/> data size: {imageData.length / 1024} K</span>);
                        this.setState({images});
                    });
                });
            }
        }));
        // 清空value 允许上传相同文件
        e.target.value = '';
    }

    render() {
        const {images} = this.state;
        return (
            <div>
                <p>图片等比压缩、固定大小压缩、获取zip中图片并处理等功能</p>
                <input type="file" multiple onChange={this.handleChange}/>
                {images.map((item, index) => <div key={index}>{item}</div>)}
            </div>
        );
    }
}

export function mapStateToProps(state) {
    return {
        ...state,
    };
}
