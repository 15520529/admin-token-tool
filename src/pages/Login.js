import { Form, Input, Button, message, Modal,  } from 'antd';
import { useState } from 'react';
import { login, setAuthentication, register } from './api/AuthAPI';
import '../asset/App.css';

const LoginForm = ({ setIsLogin, alertMsg, setAlertMsg }) => {

    const [form] = Form.useForm()
    const [loadingLogin, setLoadingLogin] = useState(false)
    const [loadingRegister, setLoadingRegister] = useState(false)

    const onFinish = (values) => {
        setLoadingLogin(true)
        const { username, password } = values
        login(username, password).then(resp => {
            console.log('resp ', resp)
            if (resp.data.code === 1) {
                message.success(resp.data.message)
                setAuthentication({
                    token: resp.data.token,
                    username: resp.data.username,
                    expireDate: resp.data.expireDate
                })
                setIsLogin(true)
            } else {
                setAlertMsg(resp.data.message)
            }
        }).catch(err => {
            console.log('err ', err)
        }).finally(() => {
            setLoadingLogin(false)
        })
    };


    const onRegister = () => {
        form.validateFields().then((values) => {
            setLoadingRegister(true)
            const { username, password } = values
            console.log('username ', username)
            register(username, password).then(resp => {
                console.log('resp ', resp)
                if (resp.data.code === 1) {
                    message.success(resp.data.message)
                    setAuthentication({
                        token: resp.data.token,
                        username: resp.data.username,
                        expireDate: resp.data.expireDate
                    })
                    setIsLogin(true)
                } else {
                    setAlertMsg(resp.data.message)
                }
            }).catch(err => {
                console.log('err ', err)
            }).finally(() => {
                setLoadingRegister(false)
            })
        })
    }

    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };

    return (
        <Modal title="" visible={true} width={700} footer={null} closable={false}>
            <Form
                name="basi1c"
                labelCol={{
                    span: 6,
                }}
                wrapperCol={{
                    span: 12,
                }}
                initialValues={{
                    remember: true,
                }}
                form={form}
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
            >
                {/* <Divider></Divider> */}

                <Form.Item
                    label="Username"
                    name="username"
                    rules={[
                        {
                            required: true,
                            message: 'Please input your username!',
                        },
                    ]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    label="Password"
                    name="password"
                    rules={[
                        {
                            required: true,
                            message: 'Please input your password!',
                        },
                    ]}
                >
                    <Input.Password />
                </Form.Item>

                {alertMsg ?
                    <Form.Item
                        wrapperCol={{
                            offset: 6,
                            span: 16,
                        }}
                    >
                        <p style={{ color: 'red' }}>{alertMsg}</p>
                    </Form.Item> : null}

                <Form.Item
                    wrapperCol={{
                        offset: 6,
                        span: 16,
                    }}
                >
                    <Button type="primary" htmlType="submit" loading={loadingLogin}>
                        Đăng nhập
                    </Button>
                    
                    <Button htmlType="button" style={{ margin: '0 8px' }} onClick={() => onRegister()}>
                        Đăng ký
                    </Button>
                </Form.Item>
            </Form>
        </Modal >
    )
}

export default LoginForm;