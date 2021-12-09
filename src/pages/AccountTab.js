
import { Table, Tag, Form, Button, Popconfirm, Switch, DatePicker, Modal, Space, notification, Divider, Descriptions, message } from 'antd';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { ethers, Wallet } from 'ethers'
import { useEffect, useState } from 'react';
import moment from 'moment';
import { getUsers, updateUser, getAuthentication } from './api/AuthAPI';

let provider = null
let defWsOpen = null
let defWsClose = null
let keepAliveInterval = null
let KEEP_ALIVE_CHECK_INTERVAL = 1000

const tailLayout = {
    wrapperCol: { offset: 8, span: 16 },
};

const openNotificationWithIcon = (type, message) => {
    notification[type]({ message });
};

const AccountTab = ({ accounts, setAccounts, nodeUrl, setNodeUrl, inFo }) => {

    const [isModalVisible, setIsModalVisible] = useState(false);
    const [user, setUser] = useState({});
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        load();
    }, [])
    // console.log('node',nodeUrl)
    // console.log('node quick_node')


    const load = async () => {
        let user = getAuthentication();
        setLoading(true)
        getUsers(user.username, user.token).then(resp => {
            if (resp.data.code === 1) {
                console.log('users ', resp.data.users)
                setData(resp.data.users)
            } else {
                message.error(resp.data.message)
            }
        }).finally(()=> {
            setLoading(false)
        })
    }

    const onWsOpen = async (event) => {
        // console.log('Connected to the WebSocket!')
        keepAliveInterval = setInterval(() => {
            if (provider._websocket.readyState === WebSocket.OPEN || provider._websocket.readyState === WebSocket.OPENING) {
                return
            }
            provider._websocket.close()
        }, KEEP_ALIVE_CHECK_INTERVAL)

        if (defWsOpen) defWsOpen(event)
    }

    const onWsClose = (event) => {
        // console.log('WebSocket connection lost! Reconnecting...')
        clearInterval(keepAliveInterval)
        load()

        if (defWsClose) defWsClose(event)
    }

    const getAccountInfoStr = (fieldKey) => {
        let account = accounts.get(fieldKey);
        return `Address: ${account ? account.address : 'N/A'} - Balance: ${account ? account.bnbAmount : 'N/A'} BNB`;
    }

    const columns = [
        {
            title: 'User Name',
            dataIndex: 'username',
            key: 'username',
            render: text => <a>{text}</a>,
        },
        {
            title: 'Trạng Thái',
            dataIndex: 'login',
            key: 'login',
            render: login => (
                <Tag color={login ? 'green' : 'red'}>
                    {login ? 'ONLINE' : 'OFFLINE'}
                </Tag>
            ),
        },
        {
            title: 'Ngày hết hạn',
            dataIndex: 'expireDate',
            key: 'expireDate',
        },
        {
            title: 'Status',
            key: 'status',
            dataIndex: 'status',
            render: status => (
                <Tag color={status !== 1 ? 'red' : 'green'} key={status}>
                    {status !== 1 ? 'IN ACTIVE' : 'ACTIVE'}
                </Tag>
            ),
        },
        {
            title: 'Hành động',
            key: 'action',
            render: (text, record) => (
                <Space size="middle">
                    <a onClick={() => {
                        setUser(record)
                        showModal()
                    }}>Edit</a>
                </Space>
            ),
        },
    ];

    const showModal = () => {
        setIsModalVisible(true);
    };
    // console.log('data ', data)
    return (
        <>
            <Table columns={columns} dataSource={data} loading={loading}/>
            <ModalUser user={user} isModalVisible={isModalVisible} setIsModalVisible={setIsModalVisible} reloadData={load}/>
        </>
    )
}

const ModalUser = ({ user, isModalVisible, setIsModalVisible, reloadData }) => {

    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState(0);
    const [expireDate, setExpiredDate] = useState();

    useEffect(() => {
        // console.log('useEffect ',user.expiredDate )
        setExpiredDate(new moment(user.expiredDate))
        setStatus(user.status)
    }, [user])

    const handleSave = () => {
        setLoading(true)
        console.log('user ', user.username)
        console.log('status ', status)
        console.log('expireDate ', expireDate.format("YYYY-MM-DD HH:mm:ss"))
        let auth = getAuthentication();
        updateUser(auth.token, user.username, status, expireDate.format("YYYY-MM-DD HH:mm:ss")).then(resp => {
            if (resp.data.code === 1) {
                message.success('Cập nhật thành công')
                reloadData()
            } else {
                message.error('Cập nhật thất bại')
            }
        }).finally(() => {
            setLoading(false)
        })
    }

    const handleOk = () => {
        setIsModalVisible(false);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };


    return (
        <>
            <Modal
                title="Modal"
                visible={isModalVisible}
                onCancel={handleCancel}
                confirmLoading={loading}
                okText={<Popconfirm
                    title="Are you sure?"
                    onConfirm={() => handleSave()}
                    okText="Yes"
                    cancelText="No"
                >
                    Save
                </Popconfirm>}
            >
                <p>Username: {user.username}</p>
                <p>Status: <Switch
                    checkedChildren="1" unCheckedChildren="0"
                    checked={status}
                    onChange={checked => {
                        // console.log(`switch to ${checked}`);
                        setStatus(checked ? 1 : 0)
                    }}
                /></p>
                <p>Ngày hết hạn:
                    <DatePicker format="YYYY-MM-DD HH:mm:ss" showTime value={expireDate} onChange={value => { setExpiredDate(value) }} />
                </p>
            </Modal>
        </>
    )
}

export default AccountTab;