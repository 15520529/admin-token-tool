import { notification } from 'antd';

import { format } from 'date-fns'
import { ethers } from 'ethers'

export const isAddress = (address) => {
    return ethers.utils.isAddress(address)
}

export const formatDate = (timestamp, dateFormat = 'dd MMM yyyy', timeFormat = 'hh:mm aaa') => {
    return `${format(new Date(timestamp), dateFormat)} at ${format(new Date(timestamp), timeFormat)}`
}

export const openNotificationWithIcon = (type, message, duration = 4.5) => {
    notification[type]({ message, duration });
};

export const isNumeric = (str) => {
    return (
        !isNaN(String(str)) && // use type coercion to parse the _entirety_ of the string (`parseFloat` alone does not do this)...
        !isNaN(parseFloat(String(str)))
    ) // ...and ensure strings of whitespace fail
}
