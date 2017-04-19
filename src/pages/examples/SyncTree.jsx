import React, {Component} from 'react';
import * as syncTreeUtils from 'zk-react/utils/tree-sync-utils';
import './style.less';

export const PAGE_ROUTE = '/example/sync-tree';

export default class extends Component {
    state = {};

    render() {
        const data = [
            {
                key: '1',
                text: '顶级节点1',
                icon: 'fa-user',
                path: '',
                url: '',
            },
            {
                key: '11',
                parentKey: '1',
                text: '子节点11',
                icon: 'fa-user',
                path: '/example/1',
                url: '',
            },
            {
                key: '12',
                parentKey: '1',
                text: '子节点22',
                icon: 'fa-user',
                path: '/user/add',
                url: '',
            },
            {
                key: '123',
                parentKey: '12',
                text: '子节点123',
                icon: 'fa-user',
                path: '/user/add/adsf',
                url: '',
            },
            {
                key: '2',
                text: '顶级节点2',
                icon: 'fa-user',
                path: '',
                url: '',
            },
            {
                key: '21',
                parentKey: '2',
                text: '子节点21',
                icon: 'fa-user',
                path: '/role/list',
                url: '',
            },
        ];
        const treeData = syncTreeUtils.convertToTree(data);
        console.log(treeData);
        const topNode = syncTreeUtils.getTopNodeByNode(treeData, {parentKey: '12'});
        console.log(topNode);
        console.log(syncTreeUtils.getNodeByKey(treeData, '12'));
        console.log(syncTreeUtils.getNodeByKeyValue(treeData, 'path', '/role/list'));
        return (
            <div> tree</div>
        );
    }
}
