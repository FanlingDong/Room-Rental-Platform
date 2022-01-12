import React, {useState, useCallback, useEffect,} from 'react';
import {Modal, Form, Input, message, Button,} from 'antd';
import {useNavigate,} from "react-router";
import request from '../../tools/request';

function LoginRegisterModal({type = 'login', visible = false, setVisible,}) {
    const [inType, setInType,] = useState(type);
    const [form,] = Form.useForm();
    const navigate = useNavigate();
    useEffect(() => {
        setInType(type);
    }, [type,]);

    const Title = useCallback(() => {
        if (inType === 'login') {
            return (
                <>
                    Welcome to login airbrb!
                    {/*eslint-disable-next-line*/}
                    <a style={{marginLeft: 6, fontSize: 12,}} onClick={() => setInType('register')}>
                        New to airbrb?
                    </a>
                </>
            );
        } else {
            return (
                <>
                    Please register!
                    {/*eslint-disable-next-line*/}
                    <a style={{marginLeft: 6, fontSize: 12,}} onClick={() => setInType('login')}>
                        Already have an account?
                    </a>
                </>
            );
        }
    }, [inType,]);

    const Success = async (values) => {
        let specificUrl;
        if (inType === 'register') {
            specificUrl = '/user/auth/register';
        } else {
            specificUrl = '/user/auth/login';
        }
        const response = await request('POST', values, specificUrl);
        if (response) {
            message.success(`${inType === 'register' ? 'Register successfully!' : 'Login successfully!'}`);
            const {email, name,} = values;
            const user = {email, name,};
            localStorage.setItem('user_email', email);
            localStorage.setItem('airbrb_user', JSON.stringify(user));
            localStorage.setItem('airbrb_token', response.token);
            setVisible(false);
            if (inType === 'login') {
                navigate(`/user`);
            }
        }
    };

    const Cancel = () => {
        form.resetFields();
        setVisible(false);
    };

    return (
        <Modal
            title={<Title/>}
            visible={visible}
            onCancel={Cancel}
            footer={null}
        >
            <Form
                name="login-register"
                form={form}
                labelCol={{span: 8,}}
                wrapperCol={{span: 16,}}
                onFinish={Success}
            >
                <Form.Item
                    label="E-mail"
                    name="email"
                    rules={[{
                        required: true,
                        message: 'Please input your email!',
                    }, {type: 'email',},]}
                >
                    <Input/>
                </Form.Item>
                <Form.Item
                    label="Password"
                    name="password"
                    rules={[{
                        required: true,
                        message: 'Please input your password!',
                    },]}
                    hasFeedback
                >
                    <Input.Password/>
                </Form.Item>
                {
                    inType === 'register' &&
                    <>
                        <Form.Item
                            label="Confirm Password"
                            name="confirm"
                            dependencies={['password',]}
                            hasFeedback
                            rules={[{
                                required: true,
                                message: 'Please confirm your password!',
                            }, ({getFieldValue,}) => ({
                                validator(_, value) {
                                    if (!value || getFieldValue('password') === value) {
                                        return Promise.resolve();
                                    }
                                    return Promise.reject(new Error('The two passwords that you entered do not match!'));
                                },
                            }),
                            ]}
                        >
                            <Input.Password/>
                        </Form.Item>
                        <Form.Item
                            label="Username"
                            name="name"
                            rules={[{
                                required: true,
                                message: 'Please input your username!',
                            },]}
                        >
                            <Input/>
                        </Form.Item>
                    </>
                }
                <Form.Item wrapperCol={{offset: 8, span: 16,}}>
                    <Button onClick={Cancel} style={{marginRight: 30,}}>
                        Cancel
                    </Button>
                    <Button type="primary" htmlType="submit">
                        {inType === 'register' ? 'Register' : 'Login'}
                    </Button>
                </Form.Item>
            </Form>
        </Modal>
    );
}

export default LoginRegisterModal;
