import React, {Component} from 'react';
import {Tree} from 'antd';
import {
    renderNode,
    convertToTree,
    // getTopNodeByNode,
    // getNodeByKey,
    // getNodeByKeyValue,
    // getGenerationalNodesByKey,
    getCheckedKeys,
} from 'zk-react/utils/tree-utils';

import './style.less';

const TreeNode = Tree.TreeNode;

export const PAGE_ROUTE = '/example/sync-tree';
export default class extends Component {
    state = {
        data: [
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
                text: '子节点12',
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
                key: '124',
                parentKey: '12',
                text: '子节点124',
                icon: 'fa-user',
                path: '/user/add/adsf',
                url: '',
            },
            {
                key: '1241',
                parentKey: '124',
                text: '子节点1241',
                icon: 'fa-user',
                path: '/user/add/adsf',
                url: '',
            },
            {
                key: '1242',
                parentKey: '124',
                text: '子节点1242',
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
            {
                key: '22',
                parentKey: '2',
                text: '子节点22',
                icon: 'fa-user',
                path: '/role/list',
                url: '',
            },
        ],
        treeData: [],
        checkedKeys: [],
    };

    handleCheck = (checkedKeys, e) => {
        const checked = e.checked;
        const checkNodeKey = e.node.props.eventKey;
        const {treeData} = this.state;
        // Tree 要使用 checkStrictly 属性
        const allKeys = getCheckedKeys(treeData, checkedKeys, checked, checkNodeKey);
        this.setState({checkedKeys: allKeys});
    }

    componentWillMount() {
        const treeData = convertToTree(this.state.data);
        this.setState({treeData});
    }

    render() {
        const {treeData, checkedKeys} = this.state;
        // console.log(treeData);
        // const topNode = getTopNodeByNode(treeData, {parentKey: '12'});
        // console.log(topNode);
        // console.log(getNodeByKey(treeData, '12'));
        // console.log(getNodeByKeyValue(treeData, 'path', '/role/list'));

        const treeNode = renderNode(treeData, (item, children) => {
            if (children) {
                return (
                    <TreeNode key={item.key} title={item.text}>
                        {children}
                    </TreeNode>
                );
            }
            return <TreeNode key={item.key} title={item.text}/>;
        });
        return (
            <Tree
                checkable
                checkStrictly
                checkedKeys={{checked: checkedKeys}}
                onCheck={this.handleCheck}
            >
                {treeNode}
            </Tree>
        );
    }
}
