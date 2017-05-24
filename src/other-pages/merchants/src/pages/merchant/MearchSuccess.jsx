import React, {Component} from 'react';
import {Button} from 'antd';
import {ajax} from 'zk-react';

export const PAGE_ROUTE = '/merchants/success';
export const INIT_STATE = {
    scope: 'mearchSuccess',
    taskCode: '123',
    registName: '123',
    salesmanName: '123',
    isAdd: '',
    isModify: '',
    isReturn: '',
    isDraft: '',
    userCode: '110665',
    orgNo: '5138497260',
};
@ajax()
export class LayoutComponent extends Component {
    state = {
        draftCount: 0,
    }

    componentDidMount() {
        const {$ajax, userCode, orgNo} = this.props;
        const params = {
            createUserId: userCode,
            salesmanCode: userCode,
            orgNo,
        };
        $ajax.get('/draft/list', params).then(data => {
            if (data.dataList && data.dataList.length) {
                this.setState({draftCount: data.dataList.length});
            }
        });
    }

    render() {
        const {draftCount} = this.state;
        const {
            taskCode,
            registName,
            salesmanName,
            userCode,
            orgNo,
        } = this.props;
        // TODO 是否根据 isAdd isModify isReturn等情况，区分不同显示？
        return (
            <div className="merchant-success">
                <div className="merchant-success-wrap">
                    <h1 style={{color: 'green'}}>新增商户成功，请耐心等待审核结果！</h1>
                    <div className="message">
                        <span className="label">任务编号：</span>
                        <span className="value">{taskCode}</span>
                    </div>
                    <div className="message">
                        <span className="label">注册名称：</span>
                        <span className="value">{registName}</span>
                    </div>
                    <div className="message">
                        <span className="label">业务员名称：</span>
                        <span className="value">{salesmanName}</span>
                    </div>
                    <Button
                        style={{marginRight: 8}}
                        onClick={() => {
                            this.props.router.replace(`/merchants/+add_edit/:merchId?userCode=${userCode}&orgNo=${orgNo}`);
                        }}
                    >继续录入</Button>
                    <Button
                        type="primary"
                        onClick={() => {
                            this.props.router.replace(`/merchants/?userCode=${userCode}&orgNo=${orgNo}`);
                        }}
                    >
                        查看草稿({draftCount})
                    </Button>
                </div>
            </div>
        );
    }
}

export function mapStateToProps(state) {
    return {
        ...state.pageState.mearchSuccess,
    };
}
