
import { Form, Input, Button, Space, Row, Col, Checkbox, InputNumber, Radio, Card, message, } from 'antd';
import { useEffect, useState } from 'react';
import { ethers, Wallet } from 'ethers'
import { differenceInMilliseconds, differenceInSeconds, isAfter } from 'date-fns'
import { NOTIFICATION_DURATION_SECONDS, TIMES_TO_BUY, BUY_TYPE, COUNTER_PER_BLOCK } from './constant/DxSaleConfig';
import { isAddress, openNotificationWithIcon, formatDate, isNumeric } from './utils/utils';
import { TEST_BNB_AMOUNT, TEST_GAS_PRICE } from './constant';

// connection
let provider = null
let defWsOpen = null
let defWsClose = null
let keepAliveInterval = null
let KEEP_ALIVE_CHECK_INTERVAL = 1000
let oldNodeUrl = null;

// buy on time
let boughtTimeStones = new Set();
// spam
let spamIntervalId = 1;
let intervalId = 0;
let lastSpamTime = 0;
let spamCounter = 0;
let completedCount = 0;

const tailLayout = {
    wrapperCol: { offset: 8, span: 16 },
};

const DxSaleTab = ({ accounts, nodeUrl }) => {

    // side effect
    const [buyType, setBuyType] = useState(BUY_TYPE.onTimeSale)
    const [logs, setLogs] = useState('')
    const [countdown, setCountdown] = useState(0)
    const [form] = Form.useForm();

    // business data
    const [presaleStartTime, setPresaleStartTime] = useState()
    const [presaleAddress, setPresaleAddress] = useState('')
    const [presaleEnded, setPresaleEnded] = useState(false)
    const [bnbAmount, setBnbAmount] = useState(TEST_BNB_AMOUNT)
    const [gasPrice, setGasPrice] = useState('10')
    const [gasLimit, setGasLimit] = useState('250000')
    const [limitPerBlock, setLimitPerBlock] = useState(COUNTER_PER_BLOCK)
    const [isBuying, setIsBuying] = useState(false)
    const [checkedAccounts, setCheckedAccounts] = useState([]);
    const [timesToBuy, setTimesToBuy] = useState([TIMES_TO_BUY[0]])
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
        // console.log('nodeUrl  has changed ', nodeUrl, ' ', oldNodeUrl);
        // oldNodeUrl = nodeUrl;
        // clearInterval(keepAliveInterval)
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
        const getPresaleStartTime = async () => {
            if (isAddress(presaleAddress)) {
                try {
                    const DxSaleContract = new ethers.Contract(
                        presaleAddress,
                        ['function presaleStartTime() external view returns (uint256)'],
                        provider
                    )
                    // setPresaleStartTime(Date.now() + 15000);
                    const pst = (await DxSaleContract.presaleStartTime()).toNumber();
                    const pstDate = pst * 1000;
                    console.log('presaleStartTime ', pstDate)
                    if (isAfter(new Date(), new Date(pstDate))) {
                        setPresaleEnded(true)
                    } else {
                        setPresaleEnded(false)
                        setPresaleStartTime(pstDate)
                    }
                } catch (error) {
                    console.log(error)
                    message.error('Error fetching presale start time');
                }
            }
        }
        getPresaleStartTime();
    }, [presaleAddress])

    // only for type 'buy at middle of presale - spam'
    useEffect(() => {
        spamIntervalId = setInterval(() => {
            if (buyType === BUY_TYPE.spam && isBuying) {
                let current = Date.now();
                if (lastSpamTime === 0) lastSpamTime = Date.now()
                let gap = (current - lastSpamTime) / 1000
                console.log(`${lastSpamTime} - ${current} gap ${gap} counter ${spamCounter}`)
                if (gap > 1) {
                    console.log(`${lastSpamTime} - ${current} reset counter`)
                    spamCounter = 0;
                    lastSpamTime = current;
                    return;
                }
                if (spamCounter === limitPerBlock) {
                    console.log(`${lastSpamTime} - ${current} reach limit`)
                    return;
                }
                spamCounter++;
                let accts = checkedAccounts.filter(acc => accounts.get(acc.fieldKey) !== undefined);
                for (let account of accts) {
                    console.log(`Buy at middle of presale - spam, account: ${account.address} is buying at presale adress: ${presaleAddress}`)
                    buyToken(account.privateKey, presaleAddress, bnbAmount, gasPrice, false);
                }
            }
        }, 10)
        return () => {
            clearInterval(spamIntervalId)
        }
    }, [isBuying])

    // only for type 'buy time when start'
    const getCountdown = () => {
        const gap = differenceInMilliseconds(presaleStartTime, new Date())
        if (gap > 0 && buyType === BUY_TYPE.onTimeSale && isBuying) {
            let gapSecond = gap / 1000
            for (let time of timesToBuy) {
                // console.log('gapSecond ', gapSecond, ' gapSecond roud up ', Math.ceil(gapSecond), ' ', time.second, ' boughtTimeStones ', boughtTimeStones)
                if (gapSecond <= time.second && Math.ceil(gapSecond) === time.second && !boughtTimeStones.has(time.second)) {
                    boughtTimeStones.add(time.second) // mark buy token at this time
                    let accts = checkedAccounts.filter(acc => accounts.get(acc.fieldKey) !== undefined);
                    for (let account of accts) {
                        console.log(`Buy time when start, account: ${account.address} is buying at presale adress: ${presaleAddress}`)
                        buyToken(account.privateKey, presaleAddress, bnbAmount, gasPrice, false);
                    }
                    break;
                }
            }
            if (completedCount === checkedAccounts.length) {
                completedCount = 0;
                setIsBuying(false)
            }
        }

        const second = 1000
        const minute = second * 60
        const hour = minute * 60
        const day = hour * 24
        let countdown = {}

        if (gap > 0) {
            countdown = {
                day: Math.floor(gap / day),
                hour: Math.floor((gap % day) / hour),
                minute: Math.floor((gap % hour) / minute),
                second: Math.floor((gap % minute) / second),
            }
        }

        return countdown
    }

    useEffect(() => {
        intervalId =  setTimeout(() => {
            setCountdown(getCountdown())
        }, 500)
        return () => {
            clearInterval(intervalId)
        }
    }, [countdown])

    const onTestBuy = async () => {

        let testAccounts = checkedAccounts.filter(acc => accounts.get(acc.fieldKey) !== undefined)
        for (let account of testAccounts) {
            console.log(`TestBuy account: ${account.address} is buying at presale adress: ${presaleAddress}`)
            buyToken(account.privateKey, presaleAddress, TEST_BNB_AMOUNT, TEST_GAS_PRICE, true)
        }
    }

    const buyToken = async (privateKey, receiverAddress, bnbAmount = TEST_BNB_AMOUNT, gasPrice = TEST_GAS_PRICE, showErrorNoti = false) => {
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
        // console.log(`bnb ${bnbAmount} gasPrice ${gasPrice} ${gasLimit}`)

        try {
            const presaleContract = new ethers.Contract(
                receiverAddress,
                ['function tokenPurchase(address _beneficiary, uint256 _amount) external payable'],
                account
            )
            presaleContract.tokenPurchase(senderAdress, 0, {
                gasLimit: Number(gasLimit.toString()),
                gasPrice: ethers.utils.parseUnits(gasPrice.toString(), 'gwei'),
                value: ethers.utils.parseEther(bnbAmount.toString(), 18)
            }).then(tx => {
                setLogs((log) =>
                    `${log}${new Date(Date.now()).toISOString()} Account: ${senderAdress} Hash: ${tx.hash}, nonce: ${tx.nonce}, gasPrice: ${ethers.utils.formatUnits(tx.gasPrice, 'gwei')}, gasLimit: ${tx.gasLimit},waiting for transaction to be executed...\n`
                )
                tx.wait().then(receipt => {
                    setLogs((log) => `${log}${new Date(Date.now()).toISOString()} Account: ${senderAdress} Buying successfully, Transaction receipt : https://www.bscscan.com/tx/${receipt.transactionHash}\n`)
                    message.success('Buy successfully');
                    completedCount++;
                }).catch(error => {
                    console.log("Transaction receipt has error ", error);
                    setLogs((log) =>`${log}${new Date(Date.now()).toISOString()} ${error}\n`)
                })
            }).catch(error => {
                console.log('tokenPurchase async error ', error)
                setLogs((log) =>`${log}${new Date(Date.now()).toISOString()} ${error}\n`)
            })
        } catch (error) {
            console.log("TokenPurchase has error ", error);
            if (error?.code === 'INSUFFICIENT_FUNDS') {
                if (showErrorNoti) { openNotificationWithIcon('error', `Account: ${account.address} buy token failed - "INSUFFICIENT_FUNDS\n`); }
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
                name="DxSaleTab_form"
                className="content_form"
                layout="vertical"
            >
                <Row style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Col span={14}>
                        <Form.Item
                            label="Presale URL"
                            name="presale address"
                            rules={[{ required: true, message: 'Please input presale address!' }]}
                        >
                            <Input
                                placeholder="Presale URL"
                                disabled={isBuying}
                                onChange={(e) => {
                                    setPresaleEnded(false)
                                    setPresaleStartTime(0)
                                    setCountdown({})
                                    setPresaleAddress(e.target.value)
                                }}
                            />
                        </Form.Item>
                        <p style={{ marginTop: '10px', display: 'flex', justifyContent: 'space-between' }}>
                            <span><b>Start at:</b> {presaleEnded ? <b style={{ color: 'red' }}>Presale has already been over!</b>
                                : isAddress(presaleAddress) && presaleStartTime ? formatDate(presaleStartTime) : '---'}</span>
                            <span><b>Countdown:</b> {presaleStartTime && !presaleEnded && 'hour' in countdown
                                ? `${countdown.day}:${countdown.hour}:${countdown.minute}:${countdown.second}` : '---'}</span>
                        </p>
                        <Form.Item
                            label="BNB amount"
                            name="BNB_amount"
                            rules={[{ required: true, message: 'Please input BNB amount!' }]}
                            initialValue={bnbAmount}
                            step="0.1"
                        >
                            <InputNumber
                                min={0}
                                style={{ width: '100%' }}
                                disabled={isBuying}
                                onChange={(value) => setBnbAmount(value)}
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

                        
                    </Col>
                    <Col span={8}>
                        <Card title="Accounts" bordered={true}>
                            <Checkbox.Group disabled={isBuying} onChange={checkedValues => setCheckedAccounts(checkedValues)}>
                                <Space direction="vertical">
                                    {[...accounts.values()].map((accountInfo, index) => (
                                        <Checkbox key={accountInfo.address} value={accountInfo}>Account {index + 1} - {accountInfo.bnbAmount} <b>BNB</b></Checkbox>
                                    ))}
                                </Space>
                            </Checkbox.Group>
                        </Card>
                    </Col>
                </Row>
                {/* <Form.Item {...tailLayout}>
                    <Button
                        disabled={checkedAccounts.length === 0}
                        type="primary"
                        style={{ width: '200px' }}
                        onClick={() => onTestBuy()}
                    >
                        Test
                    </Button>
                </Form.Item> */}
                <Form.Item {...tailLayout}>
                    <Space >
                        <Button
                            type="primary"
                            style={{ width: '100px' }}
                            disabled={isBuying || !shouldSubmit}
                            onClick={() => {
                                form.validateFields().then((values) => {
                                    setIsBuying(true)
                                })
                            }}
                            loading={isBuying}
                        >
                            {isBuying ? (buyType === BUY_TYPE.onTimeSale ? 'Waiting' : 'Buying') : 'Buy'}
                        </Button>
                        <Button
                            type="dashed"
                            danger style={{ width: '100px' }}
                            onClick={() => {
                                setIsBuying(false);
                                boughtTimeStones = new Set();
                                spamCounter = 0;
                                lastSpamTime = 0;
                                completedCount = 0;
                            }}
                        >
                            Stop
                        </Button>
                    </Space>
                </Form.Item>
            </Form >
            <Input.TextArea rows={11} placeholder="logs..." value={logs} />
        </>
    )
}

export default DxSaleTab;