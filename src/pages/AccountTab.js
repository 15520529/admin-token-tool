
import React from 'react';
import { Table, Tag, Input, Form, Button, Popconfirm, Switch, DatePicker, Modal, Space, Typography, message } from 'antd';
import { useEffect, useState } from 'react';
import moment from 'moment';
import { getUsers, updateUser, createUser, deleteUser, getPass, updatePassword, getAuthentication } from './api/AuthAPI';
import Highlighter from 'react-highlight-words';
import { SearchOutlined, ExclamationCircleOutlined } from '@ant-design/icons';

const MODAL_TYPE = {
    edit: 'edit',
    create: 'create',
    delete: 'delete',
}

const { Paragraph, Text } = Typography;
const { confirm } = Modal;

const AccountTab = ({ }) => {

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

    const showModal = (type) => {
        setIsModalVisible(true)
        setModalType(type);
    };

    // console.log('data ', data)
    return (
        <>
            {/* <Table columns={columns} dataSource={data} loading={loading}/> */}
            <CustomTable data={data} loading={loading} setUser={setUser} reloadData={load} showModal={showModal} />
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
                title: 'Tài khoản',
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
                        {login ? 'Online' : 'Offline'}
                    </Tag>
                ),
                filters: [
                    {
                        text: 'Offline',
                        value: false,
                    },
                    {
                        text: 'Online',
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
                sorter: (a, b) => moment(a.expireDate).diff(moment(), "days") - moment(b.expireDate).diff(moment(), "days"),
            },
            {
                title: 'Số ngày sử dụng còn lại',
                dataIndex: 'expireDate',
                key: 'expireDate',
                // ...this.getColumnSearchProps('expireDate'),
                sorter: (a, b) => moment(a.expireDate).diff(moment(), "days") - moment(b.expireDate).diff(moment(), "days"),
                render: expireDate => (
                    <p>{moment(expireDate).diff(moment(), "days") + 1}</p>
                ),
            },
            {
                title: 'TelegramID',
                dataIndex: 'telegramId',
                key: 'telegramId',
                ...this.getColumnSearchProps('telegramId')
            },
            {
                title: 'Tình trạng',
                key: 'status',
                dataIndex: 'status',
                render: status => (
                    <Tag color={status !== 1 ? 'red' : 'green'} key={status}>
                        {status !== 1 ? 'Bị khoá' : 'Mở khoá'}
                    </Tag>
                ),
                filters: [
                    {
                        text: 'Bị khoá',
                        value: 0,
                    },
                    {
                        text: 'Mở khoá',
                        value: 1,
                    },
                ],
                onFilter: (value, record) => record.status === value
            },
            {
                title: 'Lần online gần nhất',
                dataIndex: 'lastActive',
                key: 'lastActive',
                ...this.getColumnSearchProps('lastActive'),
                render: (value, record) => {
                    return <p>{moment(record.lastActive).format("YYYY-MM-DD HH:mm:ss")}</p>;
                }
            },
            {
                title: 'Hành động',
                key: 'action',
                render: (text, record) => (
                    <Space size="middle">
                        <Text type='success' style={{ cursor: 'pointer' }} onClick={() => {
                            this.props.setUser(record)
                            this.props.showModal(MODAL_TYPE.edit)
                        }}>Edit</Text>
                        <Popconfirm
                            placement="topLeft"
                            title="Do you want to delete"
                            onConfirm={() => {
                                let auth = getAuthentication();
                                this.props.reloadData()
                                deleteUser(auth.token, record.username).then(resp => {
                                    if (resp.data.code === 1) {
                                        message.success("Delete thành công")
                                        this.props.reloadData()
                                    } else {
                                        message.error(resp.data.message)
                                    }
                                })
                            }}
                            okText="Yes"
                            cancelText="No">
                            <Text type='danger' style={{ cursor: 'pointer' }}>Delete</Text>
                        </Popconfirm>
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
    const [teleId, setTeleId] = useState('');

    useEffect(() => {
        // console.log('useEffect ', user)
        setExpiredDate(new moment(user.expireDate))
        setStatus(user.status)
        setUsername(user.username)
        setPass('')
        setLogin(user.login)
        setTeleId(user.telegramId)
    }, [user.expireDate, user.status, user.username, user.login])

    const handleSave = () => {
        // console.log('modalType ', modalType)
        // console.log('user ', username)
        // console.log('status ', status)
        // console.log('login ', login)
        // console.log('expireDate ', expireDate.format("YYYY-MM-DD HH:mm:ss"))
        if (!expireDate) {
            message.warn("Nhập đúng expireDate")
            return;
        }
        setLoading(true)
        let auth = getAuthentication();
        if (modalType === MODAL_TYPE.edit) {
            updateUser(auth.token, user.username, status, login, expireDate.format("YYYY-MM-DD HH:mm:ss"), teleId).then(resp => {
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
            createUser(auth.token, username, status, expireDate.format("YYYY-MM-DD HH:mm:ss"), teleId).then(resp => {
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

    function showChangePassConfirm(newPass) {
        confirm({
            title: 'Do you want to update password?',
            icon: <ExclamationCircleOutlined />,
            onOk() {
                console.log('OK ', newPass);
                let auth = getAuthentication();
                updatePassword(username, newPass, auth.username, auth.token).then(resp => {
                    if (resp.data.code === 1) {
                        setPass(newPass)
                        message.success("Cập nhật thành công")
                    } else {
                        message.error(resp.data.message)
                    }
                })
            },
            onCancel() {
                console.log('Cancel');
            },
        });
    }

    return (
        <>
            <Modal
                title={modalType === MODAL_TYPE.edit ? 'Cập nhật' : 'Tạo mới'}
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
                <p>Tình trạng: <Switch
                    checkedChildren="Mở khoá"
                    unCheckedChildren="Bị khoá"
                    checked={status}
                    onChange={checked => {
                        setStatus(checked ? 1 : 0)
                    }}
                /></p>
                <p>Trạng thái: <Switch
                    checkedChildren="Online" unCheckedChildren="Offline"
                    checked={login}
                    onChange={checked => {
                        setLogin(checked ? 1 : 0)
                    }}
                /></p>
                <p>Ngày hết hạn:
                    <DatePicker format="YYYY-MM-DD HH:mm:ss" showTime value={expireDate} onChange={value => { setExpiredDate(value) }} />
                </p>
                <p>TelegramID:
                    <Input value={teleId} onChange={e => { setTeleId(e.target.value) }} />
                </p>
                {
                    modalType === MODAL_TYPE.edit ? (
                        <p>
                            <Text type='success' style={{ cursor: 'pointer' }} onClick={() => {
                                let auth = getAuthentication();
                                getPass(username, auth.token).then(resp => {
                                    if (resp.data.code === 1) {
                                        setPass(resp.data.sign)
                                    }
                                })
                            }}>Lấy mật khẩu</Text>
                            {pass !== '' ? <Paragraph editable={{ onChange: value => showChangePassConfirm(value) }}>{pass}</Paragraph> : null}
                        </p>
                    ) : null
                }
            </Modal>
        </>
    )
}

export default AccountTab;