import React, {Component} from 'react';
import {Form, Card, Row, Col, Switch, Spin, Tabs, Checkbox} from 'antd';
import {PageContent} from 'zk-react/antd';
import {promiseAjax} from 'zk-react';
import './style.less';

const TabPane = Tabs.TabPane;
export const PAGE_ROUTE = '/base-information/business/users/+detail/:userId';

class Detail extends Component {
    state = {
        systemRoles: {},
        gettingUser: false,
        user: {},
        systems: [],
        roleIds: [],
        gettingRoles: false,
    }

    componentWillMount() {
        const {params: {userId}} = this.props;
        this.setState({
            gettingUser: true,
        });
        promiseAjax.get('/user/findById', {id: userId}).then(data => {
            if (data) {
                if (data.gender === 0) {
                    data.gender = '男';
                } else {
                    data.gender = '女';
                }

                if (data.userProperty === '0') {
                    data.userProperty = '内部人员';
                } else {
                    data.userProperty = '外部人员';
                }
                const roleIds = data.roleId ? data.roleId.split(',') : [];
                const systemIds = data.systemId ? data.systemId.split(',') : [];

                this.setState({
                    roleIds,
                    systemIds,
                    user: data,
                });
            }
        }).finally(() => {
            this.setState({
                gettingUser: false,
            });
        });
        promiseAjax.get(`/admins/onlyForFind/${userId}`).then(data => {
            console.log(data);
            if (data && data.systems && data.systems.length) {
                const systems = data.systems.filter(sys => sys.code !== 'PORTAL');
                const activeSystemTabKey = systems[0].id;

                this.setState({
                    systems,
                    activeSystemTabKey,
                });
                this.handleSystemTabClick(activeSystemTabKey);
            }
        });
    }

    handleSystemTabClick = (key) => {
        const {systemRoles} = this.state;
        if (!systemRoles[key]) {
            this.setState({
                gettingRoles: true,
            });
            promiseAjax.get('/role/getRoleBySysId', {systemId: key}).then(data => {
                const roles = data;
                if (roles && roles.length) {
                    systemRoles[key] = roles;
                    this.setState({systemRoles});
                }
            }).finally(() => {
                this.setState({
                    gettingRoles: false,
                });
            });
        }

        this.setState({
            activeSystemTabKey: key,
        });
    }
    renderDetailTabPanes = () => {
        const {systems, systemRoles, roleIds} = this.state;
        const roleLayout = {
            xs: 8,
            sm: 6,
            md: 4,
            lg: 4,
            xl: 2,
        };
        return systems.map(sys => {
            const roles = systemRoles[sys.id] || [];
            const {params: {userId}} = this.props;
            if (userId !== ':userId') {
                return (
                    <TabPane tab={sys.name} key={sys.id}>
                        <Row>
                            {roles.map(role => {
                                const checked = roleIds.indexOf(role.id) > -1;
                                return (
                                    checked ?
                                        <Col {...roleLayout} key={role.id}>
                                            <Checkbox
                                                checked={checked}
                                            >
                                                {role.name}
                                            </Checkbox>
                                        </Col>
                                        :
                                        null
                                );
                            })}
                        </Row>
                    </TabPane>
                );
            }
            return null;
        });
    }

    render() {
        let {user, gettingUser, activeSystemTabKey, gettingRoles} = this.state;
        const cardStyle = {
            marginBottom: 16,
        };
        const labelStyle = {
            textAlign: 'right',
            marginBottom: 18,
        };
        return (
            <PageContent className="base-business-user-detail">
                <Form>
                    <Spin spinning={gettingUser}>
                        <Card title="账号信息" style={cardStyle}>
                            <Row>
                                <Col span={12}>
                                    <Row>
                                        <Col span={6} style={labelStyle}>
                                            登陆名称：
                                        </Col>
                                        <Col span={18}>
                                            {user.loginName}
                                        </Col>
                                    </Row>
                                </Col>
                                <Col span={12}>
                                    <Row>
                                        <Col span={6} style={labelStyle}>
                                            账号是否可用：
                                        </Col>
                                        <Col span={18}>
                                            <Switch checked={user.enabled === 1} checkedChildren={'是'} unCheckedChildren={'否'}/>
                                        </Col>
                                    </Row>
                                </Col>
                            </Row>
                            <Row>
                                <Col span={12}>
                                    <Row>
                                        <Col span={6} style={labelStyle}>
                                            人员属性：
                                        </Col>
                                        <Col span={18}>
                                            {user.userProperty}
                                        </Col>
                                    </Row>
                                </Col>
                                <Col span={12}>
                                    <Row>
                                        <Col span={6} style={labelStyle}>
                                            账户是否过期
                                        </Col>
                                        <Col span={18}>
                                            <Switch checked={user.accountExpired === 1} checkedChildren={'是'} unCheckedChildren={'否'}/>
                                        </Col>
                                    </Row>
                                </Col>
                            </Row>
                            <Row>
                                <Col span={12}>
                                    <Row>
                                        <Col span={6} style={labelStyle}>
                                            账户是否锁定
                                        </Col>
                                        <Col span={18}>
                                            <Switch checked={user.accountLocked === 1} checkedChildren={'是'} unCheckedChildren={'否'}/>
                                        </Col>
                                    </Row>
                                </Col>
                            </Row>
                        </Card>
                        <Card title="基本信息" style={cardStyle}>
                            <Row>
                                <Col span={12}>
                                    <Row>
                                        <Col span={6} style={labelStyle}>
                                            员工编号：
                                        </Col>
                                        <Col span={18}>
                                            {user.deptNo}
                                        </Col>
                                    </Row>
                                </Col>
                                <Col span={12}>
                                    <Row>
                                        <Col span={6} style={labelStyle}>
                                            姓名：
                                        </Col>
                                        <Col span={18}>
                                            {user.idCardName}
                                        </Col>
                                    </Row>
                                </Col>
                            </Row>
                            <Row>
                                <Col span={12}>
                                    <Row>
                                        <Col span={6} style={labelStyle}>
                                            性别：
                                        </Col>
                                        <Col span={18}>
                                            {user.gender}
                                        </Col>
                                    </Row>
                                </Col>
                                <Col span={12}>
                                    <Row>
                                        <Col span={6} style={labelStyle}>
                                            出生日期：
                                        </Col>
                                        <Col span={18}>
                                            {user.birthDate}
                                        </Col>
                                    </Row>
                                </Col>
                            </Row>
                            <Row>
                                <Col span={12}>
                                    <Row>
                                        <Col span={6} style={labelStyle}>
                                            归属机构：
                                        </Col>
                                        <Col span={18}>
                                            {user.orgNo}
                                        </Col>
                                    </Row>
                                </Col>
                                <Col span={12}>
                                    <Row>
                                        <Col span={6} style={labelStyle}>
                                            归属部门：
                                        </Col>
                                        <Col span={18}>
                                            {user.deptNo}
                                        </Col>
                                    </Row>
                                </Col>
                            </Row>
                            <Row>
                                <Col span={12}>
                                    <Row>
                                        <Col span={6} style={labelStyle}>
                                            手机号：
                                        </Col>
                                        <Col span={18}>
                                            {user.phone}
                                        </Col>
                                    </Row>
                                </Col>
                                <Col span={12}>
                                    <Row>
                                        <Col span={6} style={labelStyle}>
                                            邮箱：
                                        </Col>
                                        <Col span={18}>
                                            {user.email}
                                        </Col>
                                    </Row>
                                </Col>
                            </Row>
                        </Card>
                        <Card title="角色信息" style={cardStyle}>
                            <Spin spinning={gettingRoles}>
                                <Tabs type="card" activeKey={activeSystemTabKey} onTabClick={this.handleSystemTabClick}>
                                    {this.renderDetailTabPanes()}
                                </Tabs>
                            </Spin>
                        </Card>
                    </Spin>
                </Form>
            </PageContent>
        );
    }
}

export const LayoutComponent = Form.create()(Detail);
