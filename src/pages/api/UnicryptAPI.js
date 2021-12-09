
import axios from 'axios';
import { unicryptAntibotRound1Api, unicryptGetPresaleInfoApi } from '../constant/UniCryptConfig';

export const getAntiBotKey = (googleToken, senderAddress, presaleAddress) => {
    return axios.post(unicryptAntibotRound1Api, {
        contract_version: 4,
        hcaptcha_token: googleToken,
        presale_contract: presaleAddress,
        user: senderAddress
    })
}

export const getPresaleInfo = (presaleAddress) => {
    return axios.get(unicryptGetPresaleInfoApi + presaleAddress);
}

export const UnicryptAPI = {
    getAntiBotKey,
    getPresaleInfo
}