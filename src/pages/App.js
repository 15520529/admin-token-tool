import { Tabs, Card, Menu, Layout, Button, message } from 'antd';
import { Header } from 'antd/lib/layout/layout';
import { BrowserRouter as Router } from 'react-router-dom';
import { PoweroffOutlined } from '@ant-design/icons';

import AccountTab from './AccountTab';
import NodeTab from './NodeTab';
import LoginForm from './Login';
import { verify, logout, getAuthentication, removeAuthentication } from './api/AuthAPI';

import '../asset/App.css';
import { useEffect, useState } from 'react';

const { TabPane } = Tabs;
const { Content } = Layout;

let intervalId = 0;
function App() {

  // maping adress -> {bnbAmount}
  const [accounts, setAccounts] = useState(new Map())
  // const [nodeUrl, setNodeUrl] = useState(REACT_APP_DEFAULT_NODE_URL);
  const [nodeUrl, setNodeUrl] = useState('wss://restless-lively-sun.bsc.quiknode.pro/f3908c5d1d1cc8eb179a478c3cacc37a45e83e7e/')
  const [isLogin, setIsLogin] = useState(getAuthentication() ? true : false)
  const [alertMsg, setAlertMsg] = useState('')
  const [inFo, setInfo] = useState('')
  // console.log('isLogin ', isLogin, ' ', getAuthentication())

  useEffect(() => {
    intervalId = setInterval(() => {
      let user = getAuthentication();
      // console.log('intervalId ', user)
      if (user) {
        verify(user.username, user.token).then(resp => {
          // console.log('resp ', resp)
          if (!resp.data.noneExpired) {
            setAlertMsg("Vui lòng gia hạn để tiếp tục sử dụng tool!")
            logout(user.username, user.token)
            removeAuthentication()
            setIsLogin(false)
          } else if (!resp.data.validToken) {
            removeAuthentication()
            setIsLogin(false)
            setAlertMsg("Vui lòng đăng nhập lại!")
            logout(user.username, user.token)
          } else if (resp.data.status !== 1) {
            removeAuthentication()
            setIsLogin(false)
            setAlertMsg("Tài khoản đã bị khoá!")
            logout(user.username, user.token)
          } else {
            setInfo({ expireDate: resp.data.expireDate, username: resp.data.username })
          }
        }).catch(err => {
          // removeAuthentication()
          // setIsLogin(false)
          // message.warn("Vui lòng đăng nhập lại!")
        })
      } else {
        // console.log('isLogin ', isLogin)
        // if (isLogin) {
        //   removeAuthentication()
        //   setIsLogin(false)
        //   setAlertMsg("Hết phiên sử dụng, vui lòng đăng nhập lại!")
        // }
      }
    }, 10000)
    return () => {
      // console.log('clearInterval ', intervalId)
      clearInterval(intervalId)
    }
  })

  return (
    <Router>
      <Layout>
        <Header style={{ backgroundColor: 'white', display: 'flex', justifyContent: 'space-between' }} >
          <div></div>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <div style={{ height: '100px' }}>
              <a href="https://gemslab.news/">
                <img style={{ height: '50px' }} alt="logo" src="https://gemslab.news/wp-content/uploads/2021/08/logo-GEMS-LAB-01.png" />

              </a>
            </div>
            <div>
              <Menu mode="horizontal" style={{ backgroundColor: 'white', width: '100%', marginTop: '1px' }} >
                <Menu.Item key="1"><a href="https://gemslab.news/">Homepage</a></Menu.Item>
                <Menu.Item key="2"><a href="https://tools.gemslab.news/">Gemslab Tools</a></Menu.Item>
              </Menu>
            </div>
          </div>
          <Button
            icon={<PoweroffOutlined />}
            onClick={() => {
              let user = getAuthentication();
              removeAuthentication();
              setIsLogin(false);
              logout(user.username, user.token)
            }}
            style={{ marginTop: '20px' }}
            type="link" danger
          >
            Logout
          </Button>
        </Header>
        <div style={{ height: '50px', textAlign: 'center', backgroundColor: 'white' }}>
          <p style={{ marginTop: '10px' }}>Discussion - Q&A - Tools Manual, please visit the telegram group at <a href="https://t.me/gemslab">https://t.me/gemslab</a></p>
        </div>
        <Content style={{ backgroundColor: 'white' }}>
          {
            isLogin ? (
              <div className="App">
                <Card>
                  <Tabs type="card" tabPosition="left" size="large" defaultActiveKey="1">
                    <TabPane tab="Account" key="1">
                      <AccountTab
                        inFo={inFo}
                        accounts={accounts}
                        setAccounts={setAccounts}
                        nodeUrl={nodeUrl}
                        setNodeUrl={setNodeUrl} />

                    </TabPane>
                    <TabPane tab="Node" key="2">
                      < NodeTab />
                    </TabPane>
                  </Tabs>
                </Card>
              </div>
            ) : <LoginForm setIsLogin={setIsLogin} alertMsg={alertMsg} setAlertMsg={setAlertMsg} />
          }
        </Content>
      </Layout>
    </Router>
  );
}

export default App;
