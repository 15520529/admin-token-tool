import axios from 'axios';
import ls from 'localstorage-slim';
const be_url = "http://194.233.77.91:8089/v1"
// const be_url = "http://localhost:8089/v1"
const keyAuth = "auth-1";

export function getAuthentication() {
    return JSON.parse(ls.get(keyAuth, { decrypt: true }));
}

export function setAuthentication(auth) {
    ls.set(keyAuth, JSON.stringify(auth), { encrypt: true });
}

export function removeAuthentication() {
    ls.remove(keyAuth);
}

export const login = (username, password) => {
    return axios.post(be_url + "/login", {
        username,
        password
    }, {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    })
}

export const register = (username, password) => {
    return axios.post(be_url + "/register", {
        username,
        password
    }, {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    })
}

export const verify = (username, token) => {
    return axios.get(be_url + `/verify/${username}/${token}`);
}

export const getUsers = (username, token) => {
    return axios.get(be_url + `/get-users/${username}/${token}`);
}

export const getPass = (username, token) => {
    return axios.get(be_url + `/get-pass/${username}/${token}`);
}

export const updateUser = (token, username, status, login, expireDate ) => {
    return axios.put(be_url + "/update-user", {
        token,
        username,
        status,
        login,
        expireDate
    }, {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    })
}

export const createUser = (token, username, status, expireDate ) => {
    return axios.post(be_url + "/create-user", {
        token,
        username,
        status,
        expireDate
    }, {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    })
}

export const logout = (username, token) => {
    return axios.get(be_url + `/logout/${username}/${token}`);
}

export const getNodes = (username, token) => {
    return axios.get(be_url + `/get-nodes/${username}/${token}`);
}


export const updateNode = (username, token, autoSellNodeUrl ) => {
    return axios.put(be_url + "/update-node", {
        username,
        autoSellNodeUrl,
        token
    }, {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    })
}

export const AuthAPI = {
    login,
    register,
    getUsers,
    getNodes,
    updateUser,
    createUser,
    updateNode,
    getPass,
    logout,
    getAuthentication,
    setAuthentication,
    verify
}