import React, {Component} from 'react';
import service from '../../services/service-hoc';

export const PAGE_ROUTE = '/example/async-await';

@service()
export default class AsyncAwait extends Component {
    state = {
        loading: false,
    };

    async componentWillMount() {
        this.setState({loading: true});
        // 不进行try-catch ，出错会导致之后的代码都不执行。
        // 将try-catch 封装到service层，view层不必写try-catch
        const users = await this.props.$service.userService.getUsersByPage(
            null,
            // {pageSize: 100, pageNum: 1},
            {errorTip: '有问题！'}
        );
        console.log('后续操作');
        console.log(users);
        this.setState({loading: false});
    }

    componentDidMount() {

    }

    render() {
        return (
            <div>
                loading: {this.state.loading ? '加载中。。。' : '加载完成！'}
            </div>
        );
    }
}
