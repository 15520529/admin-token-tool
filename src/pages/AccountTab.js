
import React from 'react';
import { Table, Tag, Input, Form, Button, Popconfirm, Switch, DatePicker, Modal, Space, notification, Typography, Divider, Descriptions, message } from 'antd';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { ethers, Wallet } from 'ethers'
import { useEffect, useState } from 'react';
import moment from 'moment';
import { getUsers, updateUser, createUser, getPass, getAuthentication } from './api/AuthAPI';
import Highlighter from 'react-highlight-words';
import { SearchOutlined } from '@ant-design/icons';
import { EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';
var CryptoJS = require("crypto-js");
let provider = null
let defWsOpen = null
let defWsClose = null
let keepAliveInterval = null
let KEEP_ALIVE_CHECK_INTERVAL = 1000
const MODAL_TYPE = {
    edit: 'edit',
    create: 'create'
}
const tailLayout = {
    wrapperCol: { offset: 8, span: 16 },
};
const { Paragraph } = Typography;

const openNotificationWithIcon = (type, message) => {
    notification[type]({ message });
};

const AccountTab = ({ accounts, setAccounts, nodeUrl, setNodeUrl, inFo }) => {

    const [isModalVisible, setIsModalVisible] = useState(false);
    const [modalType, setModalType] = useState('edit');
    const [user, setUser] = useState({});
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);

    // var ciphertext = CryptoJS.AES.encrypt('1', '123456').toString();
    // console.log('ciphertext ', ciphertext)
    // console.log('decrypt ', CryptoJS.AES.decrypt("MFsV0KyUWVKTQ9NYW2NypA==", '123456').toString(CryptoJS.enc.Utf8))
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
        }).finally(() => {
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

    const showModal = (type) => {
        setIsModalVisible(true)
        setModalType(type);
    };


    // console.log('data ', data)
    return (
        <>
            {/* <Table columns={columns} dataSource={data} loading={loading}/> */}
            <CustomTable data={data} loading={loading} setUser={setUser} showModal={showModal} />
            <ModalUser user={user} isModalVisible={isModalVisible} setIsModalVisible={setIsModalVisible} reloadData={load} modalType={modalType} />
        </>
    )
}

class CustomTable extends React.Component {
    state = {
        searchText: '',
        searchedColumn: '',
    };

    state = {
        searchText: '',
        searchedColumn: '',
    };

    getColumnSearchProps = dataIndex => ({
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
            <div style={{ padding: 8 }}>
                <Input
                    ref={node => {
                        this.searchInput = node;
                    }}
                    placeholder={`Search ${dataIndex}`}
                    value={selectedKeys[0]}
                    onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                    onPressEnter={() => this.handleSearch(selectedKeys, confirm, dataIndex)}
                    style={{ marginBottom: 8, display: 'block' }}
                />
                <Space>
                    <Button
                        type="primary"
                        onClick={() => this.handleSearch(selectedKeys, confirm, dataIndex)}
                        icon={<SearchOutlined />}
                        size="small"
                        style={{ width: 90 }}
                    >
                        Search
                    </Button>
                    <Button onClick={() => this.handleReset(clearFilters)} size="small" style={{ width: 90 }}>
                        Reset
                    </Button>
                    <Button
                        type="link"
                        size="small"
                        onClick={() => {
                            confirm({ closeDropdown: false });
                            this.setState({
                                searchText: selectedKeys[0],
                                searchedColumn: dataIndex,
                            });
                        }}
                    >
                        Filter
                    </Button>
                </Space>
            </div>
        ),
        filterIcon: filtered => <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />,
        onFilter: (value, record) =>
            record[dataIndex]
                ? record[dataIndex].toString().toLowerCase().includes(value.toLowerCase())
                : '',
        onFilterDropdownVisibleChange: visible => {
            if (visible) {
                setTimeout(() => this.searchInput.select(), 100);
            }
        },
        render: text =>
            this.state.searchedColumn === dataIndex ? (
                <Highlighter
                    highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
                    searchWords={[this.state.searchText]}
                    autoEscape
                    textToHighlight={text ? text.toString() : ''}
                />
            ) : (
                text
            ),
    });

    handleSearch = (selectedKeys, confirm, dataIndex) => {
        confirm();
        this.setState({
            searchText: selectedKeys[0],
            searchedColumn: dataIndex,
        });
    };

    handleReset = clearFilters => {
        clearFilters();
        this.setState({ searchText: '' });
    };

    render() {
        const columns = [
            {
                title: 'User Name',
                dataIndex: 'username',
                key: 'username',
                render: text => <a>{text}</a>,
                ...this.getColumnSearchProps('username'),
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
                filters: [
                    {
                        text: 'OFFLINE',
                        value: false,
                    },
                    {
                        text: 'ONLINE',
                        value: true,
                    },
                ],
                onFilter: (value, record) => record.login === value
            },
            {
                title: 'Ngày hết hạn',
                dataIndex: 'expireDate',
                key: 'expireDate',
                ...this.getColumnSearchProps('expireDate'),
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
                filters: [
                    {
                        text: 'IN ACTIVE',
                        value: 0,
                    },
                    {
                        text: 'ACTIVE',
                        value: 1,
                    },
                ],
                onFilter: (value, record) => record.status === value
            },
            {
                title: 'Hành động',
                key: 'action',
                render: (text, record) => (
                    <Space size="middle">
                        <a onClick={() => {
                            this.props.setUser(record)
                            this.props.showModal(MODAL_TYPE.edit)
                        }}>Edit</a>
                    </Space>
                ),
            },
        ];

        return <>
            <Space style={{ marginBottom: 16 }}>
                <Button type='primary' onClick={() => this.props.showModal(MODAL_TYPE.create)}>New User</Button>
            </Space>
            <Table columns={columns} dataSource={this.props.data} loading={this.props.loading} pagination={{ pageSize: 20 }} />
        </>
    }
}

const ModalUser = ({ user, isModalVisible, setIsModalVisible, reloadData, modalType }) => {

    const [loading, setLoading] = useState(false);
    const [username, setUsername] = useState(user.username);
    const [pass, setPass] = useState('');
    const [status, setStatus] = useState(user.status);
    const [login, setLogin] = useState(user.login);
    const [expireDate, setExpiredDate] = useState();

    useEffect(() => {
        // console.log('useEffect ', user)
        setExpiredDate(new moment(user.expireDate))
        setStatus(user.status)
        setUsername(user.username)
        setPass('')
        setLogin(user.login)
    }, [user.expireDate, user.status, user.username, user.login])

    const handleSave = () => {
        setLoading(true)
        // console.log('modalType ', modalType)
        // console.log('user ', username)
        // console.log('status ', status)
        // console.log('login ', login)
        // console.log('expireDate ', expireDate.format("YYYY-MM-DD HH:mm:ss"))

        let auth = getAuthentication();
        if (modalType === MODAL_TYPE.edit) {
            updateUser(auth.token, user.username, status, login, expireDate.format("YYYY-MM-DD HH:mm:ss")).then(resp => {
                if (resp.data.code === 1) {
                    message.success('Cập nhật thành công')
                    reloadData()
                } else {
                    message.error('Cập nhật thất bại')
                }
            }).finally(() => {
                setLoading(false)
            })
        } else if (modalType === MODAL_TYPE.create) {
            createUser(auth.token, username, status, expireDate.format("YYYY-MM-DD HH:mm:ss")).then(resp => {
                if (resp.data.code === 1) {
                    message.success('Tạo mới thành công')
                    reloadData()
                } else {
                    message.error(resp.data.message)
                }
            }).finally(() => {
                setLoading(false)
            })
        }
    }

    const handleCancel = () => {
        setIsModalVisible(false);
    };


    return (
        <>
            <Modal
                title={modalType === MODAL_TYPE.edit ? 'Update user' : 'Create user'}
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
                {modalType === MODAL_TYPE.edit ? <p>Username: {user.username}</p> : <p><Form.Item label="Username" > <Input onChange={(e) => setUsername(e.target.value)} /></Form.Item></p>}
                <p>Status: <Switch
                    checkedChildren="1" unCheckedChildren="0"
                    checked={status}
                    onChange={checked => {
                        // console.log(`switch to ${checked}`);
                        setStatus(checked ? 1 : 0)
                    }}
                /></p>
                <p>Trạng thái: <Switch
                    checkedChildren="1" unCheckedChildren="0"
                    checked={login}
                    onChange={checked => {
                        // console.log(`switch to ${checked}`);
                        setLogin(checked ? 1 : 0)
                    }}
                /></p>
                <p>Ngày hết hạn:
                    <DatePicker format="YYYY-MM-DD HH:mm:ss" showTime value={expireDate} onChange={value => { setExpiredDate(value) }} />
                </p>
                {
                    modalType === MODAL_TYPE.edit ? (
                        <p>
                            <a onClick={() => {
                                let auth = getAuthentication();
                                getPass(username, auth.token).then(resp => {
                                    if (resp.data.code === 1) {
                                        setPass(resp.data.sign)
                                    }
                                })
                            }}>Get Password</a>
                            {pass !== '' ? <Paragraph copyable>{pass}</Paragraph> : null}
                        </p>
                    ) : null
                }
            </Modal>
        </>
    )
}

export default AccountTab;