import React from 'react';
import {Link,} from 'react-router-dom';
import { useNavigate,} from 'react-router';
import { Avatar, Dropdown, Menu,} from 'antd';
import {PageHeader, Button, message,} from 'antd';
import {UserOutlined,} from '@ant-design/icons';
import request from "../../tools/request";
import UserListingsPage from '../user/user-listings-page';

function UserPage() {
    const navigate = useNavigate();
    const handleMenuClick = ({key,}) => {
        if (key === 'logout') {
            const specificUrl = '/user/auth/logout';
            const response = request('POST', undefined, specificUrl);
            if (response) {
                localStorage.removeItem('airbrb_token');
                localStorage.removeItem('airbrb_user');
                message.success('Logout successfully');
                navigate('/', {replace: true,});
            }
        }
    };

    return (
        <>
            <PageHeader
                className="site-page-header"
                title="Airbrb"
                subTitle="From here travel to everywhere!"
                extra={[
                    <Button key="1" type="primary">
                        <Link to="/host">Host</Link>
                    </Button>,
                    <Dropdown
                        overlay={
                            <Menu onClick={handleMenuClick}>
                                <Menu.Item key="logout">
                                    Logout
                                </Menu.Item>
                            </Menu>
                        }
                        trigger="click"
                    >
                        <Avatar size={50} style={{backgroundColor: '#87d068',}} icon={<UserOutlined/>}/>
                    </Dropdown>,
                ]}
            >
            </PageHeader>
            <div className="user-page-container">
                <UserListingsPage/>
            </div>
        </>
    );
}

export default UserPage;
