import React, {Component} from 'react';
import 'cropperjs/dist/cropper.css';
import './style.less';
import ImageCropper from './image-cropper/ImageCropper';
import picture from './picture.jpeg';

export const PAGE_ROUTE = '/example/crop-image';
export class LayoutComponent extends Component {
    state = {}

    componentDidMount() {
    }

    render() {
        return (
            <div style={{background: 'green', padding: 20}}>
                <ImageCropper src={picture} onOK={(bold) => console.log(111, bold)}/>
            </div>
        );
    }
}

export function mapStateToProps(state) {
    return {
        ...state,
    };
}
