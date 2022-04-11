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

export const updatePassword = (username, newPassword, admin, token) => {
    return axios.post(be_url + "/admin/update-password", {
        username,
        newPassword,
        admin,
        token
    }, {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    })
}

export const updateUser = (token, username, status, login, expireDate, teleId ) => {
    return axios.put(be_url + "/update-user", {
        token,
        username,
        status,
        login,
        expireDate,
        teleId
    }, {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    })
}

export const createUser = (token, username, status, expireDate, teleId ) => {
    return axios.post(be_url + "/create-user", {
        token,
        username,
        status,
        expireDate,
        teleId
    }, {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    })
}

export const deleteUser = (token, username ) => {
    return axios.put(be_url + "/delete-user", {
        token,
        username,
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

export const getConfig = (username, token) => {
    return axios.get(be_url + `/get-config/${username}/${token}`);
}


export const updateConfig = (username, token, value, configType) => {
    return axios.put(be_url + "/update-config", {
        username,
        value,
        token,
        configType
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
    getNodes: getConfig,
    updateUser,
    createUser,
    deleteUser,
    updateNode: updateConfig,
    getPass,
    updatePassword,
    logout,
    getAuthentication,
    setAuthentication,
    verify
}