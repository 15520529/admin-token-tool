import React from 'react';
import { Form, Modal, Typography, message } from 'antd';
import { useEffect, useState } from 'react';
import { getAuthentication, getConfig as getConfig, updateConfig } from './api/AuthAPI';
import { ExclamationCircleOutlined } from '@ant-design/icons';

const { Paragraph } = Typography;
const { confirm } = Modal;

const CONFIG_TYPE = {
    DEFAULT: 'DEFAULT',
    AUTOSELL: 'AUTOSELL',
    TRIAL_DAYS: 'TRIAL_DAYS'
}

const SystemTab = ({ accounts, setAccounts, nodeUrl, setNodeUrl, inFo }) => {
    const [nodeAutoSellUrl, setNodeAutoSellUrl] = useState('')
    const [trialDays, setTrialDays] = useState('')
    const [nodeDefaultUrl, setNodeDefaultUrl] = useState('')


    useEffect(() => {
        let auth = getAuthentication();
        getConfig(auth.username, auth.token).then(resp => {
            if (resp.data.code === 1) {
                setNodeAutoSellUrl(resp.data.autoSellNodeUrl)
                setNodeDefaultUrl(resp.data.defaultUrl)
                setTrialDays(resp.data.trialDays)
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
                updateConfig(auth.username, auth.token, value, CONFIG_TYPE.AUTOSELL).then(resp => {
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
                updateConfig(auth.username, auth.token, value, CONFIG_TYPE.DEFAULT).then(resp => {
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

    function showTrialDaysConfirm(value) {
        confirm({
            title: 'Do you Want to update number trial days ?',
            icon: <ExclamationCircleOutlined />,
            onOk() {
                console.log('OK ', value);
                let auth = getAuthentication();
                updateConfig(auth.username, auth.token, value, CONFIG_TYPE.TRIAL_DAYS).then(resp => {
                    if (resp.data.code === 1) {
                        setTrialDays(value)
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
            <b>Number trial days when register</b>
            <Paragraph editable={{ onChange: value => showTrialDaysConfirm(value) }}>{trialDays}</Paragraph>
        </Form>
    )
}
export default SystemTab;