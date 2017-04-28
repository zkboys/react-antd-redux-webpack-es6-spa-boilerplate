import React, {Component} from 'react';
import 'cropperjs/dist/cropper.css';
import './style.less';
import ImageCropper from './image-cropper/ImageCropper';

export const PAGE_ROUTE = '/example/crop-image';
export class LayoutComponent extends Component {
    state = {}

    componentDidMount() {
    }

    render() {
        return (
            <div style={{background: 'green', padding: 20}}>
                <ImageCropper/>
            </div>
        );
    }
}

export function mapStateToProps(state) {
    return {
        ...state,
    };
}
