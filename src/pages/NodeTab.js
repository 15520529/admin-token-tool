import React from 'react';
import { Form, Modal, Typography, message } from 'antd';
import { useEffect, useState } from 'react';
import { getAuthentication, getNodes, updateNode } from './api/AuthAPI';
import { ExclamationCircleOutlined } from '@ant-design/icons';

const { Paragraph } = Typography;
const { confirm } = Modal;

const NODE_TYPE = {
    DEFAULT: 'DEFAULT',
    AUTOSELL: 'AUTOSELL'
}

const NodeTab = ({ accounts, setAccounts, nodeUrl, setNodeUrl, inFo }) => {
    const [nodeAutoSellUrl, setNodeAutoSellUrl] = useState('')
    const [nodeDefaultUrl, setNodeDefaultUrl] = useState('')
    const [visible, setVisible] = useState(false)


    useEffect(() => {
        let auth = getAuthentication();
        getNodes(auth.username, auth.token).then(resp => {
            if (resp.data.code === 1) {
                setNodeAutoSellUrl(resp.data.autoSellNodeUrl)
                setNodeDefaultUrl(resp.data.defaultUrl)
            } else {
                message.error(resp.data.message)
            }
        })
    }, [])

    function showAutosellConfirm(value) {
        confirm({
            title: 'Do you Want to update autoSell nodeUrl?',
            icon: <ExclamationCircleOutlined />,
            onOk() {
                console.log('OK ', value);
                let auth = getAuthentication();
                updateNode(auth.username, auth.token, value, NODE_TYPE.AUTOSELL).then(resp => {
                    if (resp.data.code === 1) {
                        setNodeAutoSellUrl(value)
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

    function showDefaultUrlConfirm(value) {
        confirm({
            title: 'Do you Want to update default nodeUrl?',
            icon: <ExclamationCircleOutlined />,
            onOk() {
                console.log('OK ', value);
                let auth = getAuthentication();
                updateNode(auth.username, auth.token, value, NODE_TYPE.DEFAULT).then(resp => {
                    if (resp.data.code === 1) {
                        setNodeDefaultUrl(value)
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
        <Form>
            <b>Auto-Sell Node URL</b>
            <Paragraph editable={{ onChange: value => showAutosellConfirm(value) }}>{nodeAutoSellUrl}</Paragraph>
            <b>Default Node URL (all tabs exluded Auto-Sell)</b>
            <Paragraph editable={{ onChange: value => showDefaultUrlConfirm(value) }}>{nodeDefaultUrl}</Paragraph>
        </Form>
    )
}
export default NodeTab;