import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Modal} from 'antd';

export default class ModalComponent extends Component {
    static defaultProps = {
        onOk: () => true,
        onCancel: () => true,
    };

    static propTypes = {
        visible: PropTypes.bool,
        onOk: PropTypes.func,
        onCancel: PropTypes.func,
    };

    state = {};

    componentWillMount() {
        // 页面初始化时，Modal没有打开，这个周期函数也会触发
        console.log('componentWillMount');
    }

    componentDidMount() {

    }

    componentWillReceiveProps(nextProps) {
        if (!this.props.visible && nextProps.visible) {
            // 打开时，重新请求数据，保证Modal每次开启都使用最新的数据
            this.handleBeforeOpen();
        }
    }

    // 弹框第一次打开、再次打开前触发，可以用来从新获取最新数据，初始化弹窗状态
    handleBeforeOpen() {
        console.log('弹框打开，可以进行弹框内容初始化工作');
    }

    // 弹窗关闭后出发的回调，可以用来清理弹框数据
    handleAfterClose = () => {
        console.log('弹框关闭，可以进行弹框内容清理');
    };

    // 响应 点击确定按钮
    handleOk = () => {
        this.props.onOk && this.props.onOk();
    };

    // 响应 点击取消按钮、右上角关闭、点击遮盖层
    handleCancel = () => {
        this.props.onCancel && this.props.onCancel();
    };


    render() {
        const {visible} = this.props;
        return (
            <Modal
                title="弹框示例"
                width={900}
                visible={visible}
                onOk={this.handleOk}
                onCancel={this.handleCancel}
                afterClose={this.handleAfterClose}
            >
                这里是弹框内容
            </Modal>
        );
    }
}
