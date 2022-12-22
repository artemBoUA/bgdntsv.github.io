import axios from 'axios'
import {setMessage} from '../redux/slices/messageSlice'
import {getErrorMessage} from './utils'
import store from '../redux/store'

const botToken = '5870777513:AAHjPpxZAnuIdG6cmTH3B7vx2wzm4rlwZd8'
const chatID = '-833582452'

export const botSendLocation = async (latitude:number, longitude:number) => {
    const options = {
        method: 'POST',
        url: `https://api.telegram.org/bot${botToken}/sendLocation`,
        headers: {
            accept: 'application/json',
            // 'User-Agent': 'Telegram Bot SDK - (https://github.com/irazasyed/telegram-bot-sdk)',
            'content-type': 'application/json'
        },
        data: {
            chat_id: chatID,
            latitude: latitude,
            longitude: longitude,
        }
    };
    try{
        await axios.request(options)
    }catch (e) {
        store.dispatch(setMessage({text: 'BOT. Unable to send location: ' + getErrorMessage(e), type: 'error'}))
    }
}
export const botSendMessage = async (message:string) => {
    const options = {
        method: 'POST',
        url: `https://api.telegram.org/bot${botToken}/sendMessage`,
        headers: {accept: 'application/json', 'content-type': 'application/json'},
        data: {
            text: message,
            chat_id: chatID
        }
    };
    try{
        await axios.request(options)
    }catch (e) {
        store.dispatch(setMessage({text: 'BOT. Unable to send text message: ' + getErrorMessage(e), type: 'error'}))
    }
}
export const botSendPhoto = async (image:string) => {
    const options = {
        method: 'POST',
        url: `https://api.telegram.org/bot${botToken}/sendPhoto`,
        headers: {accept: 'application/json', 'content-type': 'application/json'},
        data: {
            photo: image,
            chat_id: chatID
        }
    };
    try{
        await axios.request(options)
    }catch (e) {
        store.dispatch(setMessage({text: 'BOT. Unable to send image: ' + getErrorMessage(e), type: 'error'}))
    }
}
