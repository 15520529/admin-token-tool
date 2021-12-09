
import { Form, Input, Button, Space, Row, Col, InputNumber, Radio, message, Card, Checkbox } from 'antd'
import { useEffect, useState } from 'react'
import { ethers, Wallet, BigNumber } from 'ethers'
import { BUY_TYPE } from './constant/UniCryptConfig'
import { isAddress, openNotificationWithIcon, isNumeric } from './utils/utils'
import { UnicryptAPI } from './api/UnicryptAPI';
import { UNICRYPT_ABI_V3 } from './abis/UniscryptAbi'
import { TEST_BNB_AMOUNT } from './constant'

// connection
let provider = null
let defWsOpen = null
let defWsClose = null
let keepAliveInterval = null
let KEEP_ALIVE_CHECK_INTERVAL = 1000

let getLstBlockIntervalId = 1;
let isRealBuy = false;
let comppletedCount = 0;

const tailLayout = {
    wrapperCol: { offset: 8, span: 16 },
};

const UniCryptTab = ({ accounts, nodeUrl }) => {

    // side effect
    const [buyType, setBuyType] = useState(BUY_TYPE.buyRoundOne)
    const [logs, setLogs] = useState('')
    const [form] = Form.useForm();

    // business data
    const [blockOpenR1, setBlockOpenR1] = useState()
    const [presaleAddress, setPresaleAddress] = useState('')
    const [bnbAmount, setBnbAmount] = useState(TEST_BNB_AMOUNT)
    const [gasPrice, setGasPrice] = useState('10')
    const [gasLimit, setGasLimit] = useState('250000')
    const [isBuying, setIsBuying] = useState(false)
    const [checkedAccounts, setCheckedAccounts] = useState([]);
    const [latestBlock, setLatestBlock] = useState('')

    // const shouldSubmit = true;

    const shouldSubmit =
        checkedAccounts.length > 0 &&
        isAddress(presaleAddress) &&
        isNumeric(bnbAmount) &&
        isNumeric(gasLimit) &&
        isNumeric(gasPrice) &&
        parseFloat(bnbAmount) > 0 &&
        parseFloat(gasLimit) > 0 &&
        parseFloat(gasPrice)

    useEffect(() => {
        load();
    }, [nodeUrl])

    const load = async () => {
        provider = new ethers.providers.WebSocketProvider(nodeUrl)
        defWsOpen = provider._websocket.onopen
        defWsClose = provider._websocket.onclose

        provider._websocket.onopen = (event) => onWsOpen(event)
        provider._websocket.onclose = (event) => onWsClose(event)
    }

    const onWsOpen = async (event) => {
        console.info(`%c Connected to the WebSocket!`, 'color: green')
        keepAliveInterval = setInterval(() => {
            if (provider._websocket.readyState === WebSocket.OPEN || provider._websocket.readyState === WebSocket.OPENING) {
                return
            }
            provider._websocket.close()
        }, KEEP_ALIVE_CHECK_INTERVAL)

        if (defWsOpen) defWsOpen(event)
    }

    const onWsClose = (event) => {
        console.info(`%c WebSocket connection lost! Reconnecting...`, 'color: yellow')
        clearInterval(keepAliveInterval)
        load()
        if (defWsClose) defWsClose(event)
    }

    useEffect(() => {
        const getBlock = async () => {
            provider.getBlockNumber().then(block => {
                setLatestBlock(block)
            })
        }
        getLstBlockIntervalId = setInterval(() => {
            getBlock()
        }, 500)
        return function cleanup() {
            clearInterval(getLstBlockIntervalId)
        }
    }, [])

    useEffect(() => {
        const getPresaleStartBlock = async () => {
            if (isAddress(presaleAddress)) {
                try {
                    UnicryptAPI.getPresaleInfo(presaleAddress).then(resp => {
                        const blockOpenR1 = resp.data.start_block;
                        console.log("blockOpenR1: " + blockOpenR1);
                        setBlockOpenR1(blockOpenR1);

                    }).catch(err => {
                        message.error('Error fetching presale blockOpen');
                    })
                    // test
                    // let blockLatest = await provider.getBlockNumber();
                    // setBlockOpenR1(blockLatest + 10);
                } catch (error) {
                    console.log(error)
                }
            }
        }
        getPresaleStartBlock();
    }, [presaleAddress])

    // only for type 'buy one round - one shot'
    const checkBlockNumberAndBuy = async () => {
        if (buyType === BUY_TYPE.buyRoundOne) {
            provider.on('block', async (blockLatest) => {
                // console.log(`buy one round - one shot, blockLatest:${blockLatest} - blockOpenR1: ${blockOpenR1}`)
                if (blockLatest === blockOpenR1 - 2 && isRealBuy) {
                    isRealBuy = false; // mark buy token at this t-block
                    let accts = checkedAccounts.filter(acc => accounts.get(acc.fieldKey) !== undefined);
                    for (let account of accts) {
                        buyToken(account.privateKey)
                    }
                }
                if (comppletedCount === checkedAccounts.length) {
                    comppletedCount = 0;
                    setIsBuying(false)
                    isRealBuy = false;
                }
            })
        }
    }

    const buyToken = async (privateKey) => {
        let senderAdress = null
        let account = null
        try {
            account = new Wallet(privateKey, provider)
            senderAdress = account.address
        } catch (error) {
            console.log("error fetching account ", error)
            setLogs((log) => `${log}${new Date(Date.now()).toISOString()} Account: ${account.address} error fetching, check your private key!\n`)
            return;
        }
        try {
            console.log(`${account.address} sell gasLimit: ${gasLimit}, gasPrice: ${gasPrice} bnbAmount: ${bnbAmount} `)
            comppletedCount++;
            const unicryptContract = new ethers.Contract(presaleAddress, ['function userDeposit(uint256 _amount) external payable'], account)
            unicryptContract.userDeposit(
                '0',
                {
                    gasLimit: gasLimit.toString(),
                    gasPrice: ethers.utils.parseUnits(gasPrice.toString(), 'gwei'),
                    value: ethers.utils.parseEther(bnbAmount.toString(), 18),
                }
            ).then(tx => {
                setLogs((log) =>
                    `${log}${new Date(Date.now()).toISOString()} Account: ${senderAdress} Hash: ${tx.hash}, nonce: ${tx.nonce}, gasPrice: ${ethers.utils.formatUnits(tx.gasPrice, 'gwei')}, gasLimit: ${tx.gasLimit}, waiting for transaction to be executed...\n`
                )
                tx.wait().then(receipt => {
                    setLogs((log) => `${log}${new Date(Date.now()).toISOString()} Account: ${senderAdress} Buying successfully, Transaction receipt : https://www.bscscan.com/tx/${receipt.transactionHash}\n`)
                    message.success('Buy successfully');
                    comppletedCount++;
                }).catch(error => {
                    console.log("Transaction receipt has error ", error);
                    setLogs((log) =>`${log}${new Date(Date.now()).toISOString()} ${error}\n`)
                })
            }).catch(error => {
                console.log('userDeposit async error ', error)
                setLogs((log) =>`${log}${new Date(Date.now()).toISOString()} ${error}\n`)
            })
        } catch (error) {
            console.log("TokenPurchase has error ", error);
            if (error?.code === 'INSUFFICIENT_FUNDS') {
                setLogs((log) =>
                    `${log}${new Date(Date.now()).toISOString()} Account: ${account.address} buy token failed - "INSUFFICIENT_FUNDS\n`
                )
                return;
            }
            setLogs((log) =>`${log}${new Date(Date.now()).toISOString()} ${error}\n`)
        }
    }

    return (
        <>
            <Form
                form={form}
                name="UniCrypt_form"
                className="content_form"
                layout="vertical"
            >
                <Row style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Col span={14}>
                        <Form.Item
                            label="Presale URL"
                            name="Url"
                            rules={[{ required: true, message: 'Please input presale address!' }]}
                            defaultValue={presaleAddress}
                        >
                            <Input
                                placeholder="Presale URL"
                                disabled={isBuying}
                                onChange={(e) => {
                                    setBlockOpenR1(0)
                                    setPresaleAddress(e.target.value)
                                }}
                            />
                        </Form.Item>
                        <p style={{ marginTop: '10px', display: 'flex', justifyContent: 'space-between' }}>
                            <span><b>BlockStart:</b> {blockOpenR1}</span>
                            <span><b>LatestBlock:</b> {latestBlock}</span>
                            <span><b>Countdown: { blockOpenR1 - latestBlock > 0 && blockOpenR1 > 0 ? blockOpenR1 - latestBlock : 0}</b></span>
                        </p>

                        <Form.Item
                            label="BNB amount"
                            name="BNB_amount"
                            rules={[{ required: true, message: 'Please input BNB amount!' }]}
                            initialValue={bnbAmount}
                        >
                            <InputNumber
                                min={0}
                                style={{ width: '100%' }}
                                disabled={isBuying}
                                onChange={(value) => setBnbAmount(value)}
                                step="0.1"
                            />
                        </Form.Item>
                        <Form.Item
                            label="Gas price"
                            name="Gas_price (gwei)"
                            rules={[{ required: true, message: 'Please input Gas price!' }]}
                            initialValue={gasPrice}
                        >
                            <InputNumber
                                min={1}
                                style={{ width: '100%' }}
                                disabled={isBuying}
                                onChange={(value) => setGasPrice(value)}
                            />
                        </Form.Item>

                        <Form.Item
                            label="Gas limit (gwei)"
                            name="Gas_limit"
                            rules={[{ required: true, message: 'Please input Gas limit!' }]}
                            style={{ marginTop: '30px' }}
                            initialValue={gasLimit}
                        >
                            <InputNumber
                                min={1}
                                style={{ width: '100%' }}
                                disabled={isBuying}
                                onChange={(value) => setGasLimit(value)}
                            />
                        </Form.Item>
                        Buy at <b>Round one</b>
                        {/* <Form.Item
                            name="BuyType"
                            label="Buying Type"
                            initialValue={buyType}
                        >
                            <Radio.Group
                                onChange={e => setBuyType(e.target.value)}
                                value={buyType}
                                disabled={isBuying}
                            >
                                <Space direction="vertical">
                                    <Radio value={BUY_TYPE.buyRoundOne}>
                                        <Space direction="vertical">
                                            Buy at round one
                                        </Space>
                                    </Radio>
                                </Space>
                            </Radio.Group>
                        </Form.Item> */}
                    </Col>
                    <Col span={8}>
                        <Form.Item>
                            <Card title="Accounts" bordered={true}>
                                <Checkbox.Group onChange={checkedValues => setCheckedAccounts(checkedValues)}>
                                    <Space direction="vertical">
                                        {[...accounts.values()].map((accountInfo, index) => (
                                            <Checkbox key={accountInfo.address} value={accountInfo}>Account {index + 1} - {accountInfo.bnbAmount} <b>BNB</b></Checkbox>
                                        ))}
                                    </Space>
                                </Checkbox.Group>
                            </Card>
                        </Form.Item>
                    </Col>
                </Row>
                <Form.Item {...tailLayout}>
                    <Space >
                        <Button
                            type="primary"
                            style={{ width: '100px' }}
                            disabled={isBuying || !shouldSubmit}
                            onClick={() => {
                                form.validateFields().then((values) => {
                                    setIsBuying(true)
                                    isRealBuy = true;
                                    checkBlockNumberAndBuy()
                                })
                            }}
                            loading={isBuying}
                        >
                            {isBuying ? 'Waiting' : 'Buy'}
                        </Button>
                        <Button
                            type="dashed"
                            danger style={{ width: '100px' }}
                            onClick={() => {
                                setIsBuying(false);
                                isRealBuy = false;
                                comppletedCount = 0;
                            }}
                        >
                            Stop
                        </Button>
                    </Space>
                </Form.Item>
            </Form >
            <Input.TextArea rows={20} placeholder="logs..." value={logs} />
        </>
    )
}

export default UniCryptTab;