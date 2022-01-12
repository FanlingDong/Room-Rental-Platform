import React from 'react';
import {Link,} from 'react-router-dom';
import {Avatar, Dropdown, Menu, message,} from 'antd';
import {PageHeader, Button,} from 'antd';
import {UserOutlined,} from '@ant-design/icons';
import HostListings from "../host/host-listings-page";
import {useNavigate,} from 'react-router';
import request from '../../tools/request';

function HostPage() {
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
                subTitle="You’ll be a Host soon! Just add the last few details to your listing!"
                extra={[
                    <Button key="1" type="light">
                        <Link to="/user">User</Link>
                    </Button>,
                    <Dropdown
                        overlay={
                            <Menu onClick={handleMenuClick}>
                                <Menu.Item key="logout">
                                    <Link to="/">Logout</Link>
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
            <div className="host-page-container">
                <HostListings/>
            </div>
        </>
    );
}

export default HostPage;
