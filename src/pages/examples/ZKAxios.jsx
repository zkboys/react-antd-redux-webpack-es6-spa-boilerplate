import React, {Component} from 'react';
import {Button, Spin} from 'antd';
import {PageContent} from 'zk-tookit/antd';
import ZkAxios from '../../../zk-axios';
import createAjaxHoc from '../../../zk-axios/react-hoc';
import {isMock} from '../../commons';
import './style.less';

// TODO 这些初始化工作应该放到commons中
const zkAxios = new ZkAxios({
    isMock,
});

// 创建高阶组件
const ajax = createAjaxHoc(zkAxios);

// mockjs使用的axios实例
export const mockInstance = zkAxios.mockInstance;


export const PAGE_ROUTE = '/example/zk-axios';
export const INIT_STATE = {
    scope: 'promiseAjax',
    sync: true,
    a: {
        b: {
            c: ['ccc'],
            c2: 'c2',
        },
        b1: [],
        b2: 'b2',
    },
    d: 'd',
    e: 'e',
};

@ajax()
export default class PromiseAjaxExample extends Component {
    state = {
        timeOutGetting: false,
        getting: false,
        posting: false,
        single1: false,
        single2: false,
    };
    handleSendGetTimeout = () => {
        console.log('this.props.$ajax');
        this.setState({
            timeOutGetting: true,
        });
        this.props.$ajax.get('/mock/ajax/get').then(res => {
            console.log('get success', res);
        }).catch(err => {
            console.log('get error', err);
        }).finally(() => {
            console.log('get finally');
            this.setState({
                timeOutGetting: false,
            });
        });
    }
    handleSendGet = () => {
        const data = {
            a: 1,
            b: 2,
        };
        const options = {
            successTip: '11111请求数据成功！！！',
        };
        this.setState({
            getting: true,
        });
        this.ajaxGet = this.props.$ajax.get('/mock/ajax/get', data, options);

        this.ajaxGet.then(res => {
            console.log('get success1111', res);
        }).catch(err => {
            console.log('get error', err);
        }).finally(() => {
            console.log('get finally');
            this.setState({
                getting: false,
            });
        });
    }

    handleCancelGet = () => {
        console.log('取消了');
        this.setState({
            getting: false,
        });

        if (this.ajaxGet) {
            this.ajaxGet.cancel();
        }
    }

    handleSendPost = () => {
        const data = {
            a: 1,
            b: 2,
        };
        const options = {
            successTip: '请求数据成功！！！',
        };
        this.setState({
            posting: true,
        });
        this.ajaxPost = this.props.$ajax.post('/mock/ajax/post', data, options);
        this.ajaxPost.then(res => {
            console.log('post success', res);
        }).catch(err => {
            console.log('post error', err);
        }).finally(() => {
            console.log('post finally');
            this.setState({
                posting: false,
            });
        });
    }

    handleCancelPost = () => {
        console.log('取消了11');
        this.setState({
            posting: false,
        });

        if (this.ajaxPost) {
            this.ajaxPost.cancel();
        }
    }
    handleSendSingleGet = () => {
        console.log(1);
        this.setState({
            single1: true,
        });
        this.props.$ajax.singleGet('/mock/ajax/single/get').then(() => {
            console.log('single get success');
        }).catch(() => {
            console.log('single get error');
        }).finally(() => {
            console.log('single get finally');
            this.setState({
                single1: false,
            });
        });
    }
    handleSendSingleGet2 = () => {
        console.log(2);
        this.setState({
            single2: true,
        });
        this.props.$ajax.singleGet('/mock/ajax/single/get2').then(() => {
            console.log('single2 get success');
        }).catch(() => {
            console.log('single2 get error');
        }).finally(() => {
            console.log('single2 get finally');
            this.setState({
                single2: false,
            });
        });
    }

    componentWillUnmount() {
    }

    render() {
        return (
            <PageContent className="example-promise-ajax">

                <Button
                    type="ghost"
                    size="large"
                    onClick={this.handleSendGetTimeout}
                >
                    <Spin size="small" spinning={this.state.timeOutGetting}/>
                    发送一个超时的get请求
                </Button>
                <br/>
                <br/>
                <Button
                    type="ghost"
                    size="large"
                    onClick={this.handleSendGet}
                >
                    <Spin size="small" spinning={this.state.getting}/>
                    发送一个get请求
                </Button>
                <Button type="primary" size="large" style={{marginLeft: 16}} onClick={this.handleCancelGet}>取消get请求</Button>

                <br/>
                <br/>
                <Button
                    type="ghost"
                    size="large"
                    onClick={this.handleSendPost}
                >
                    <Spin size="small" spinning={this.state.posting}/>
                    发送一个post请求
                </Button>
                <Button type="primary" size="large" style={{marginLeft: 16}} onClick={this.handleCancelPost}>取消post请求</Button>

                <br/>
                <br/>
                <Button
                    type="ghost"
                    size="large"
                    onClick={this.handleSendSingleGet}
                >
                    <Spin size="small" spinning={this.state.single1}/>
                    多次发送相同url的get请求，只保留最后一次
                </Button>
                <Button
                    type="primary"
                    size="large"
                    onClick={this.handleSendSingleGet2}
                    style={{marginLeft: 16}}
                >
                    <Spin size="small" spinning={this.state.single2}/>
                    多次发送相同url的get请求，只保留最后一次
                </Button>
            </PageContent>
        );
    }
}
