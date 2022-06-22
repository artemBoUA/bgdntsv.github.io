import {initializeApp} from 'firebase/app'
import {initializeAppCheck, ReCaptchaV3Provider} from 'firebase/app-check'

export const firebaseConfig = {
    apiKey: 'AIzaSyDoKU775cHGrp7EYwiB8AHbjx3tJufKBxg',
    authDomain: 'avtostroy-4453b.firebaseapp.com',
    projectId: 'avtostroy-4453b',
    storageBucket: 'avtostroy-4453b.appspot.com',
    messagingSenderId: '559501486643',
    appId: '1:559501486643:web:9ee75fc0b554288ff41146',
    measurementId: 'G-TZ6W9QS06X'
}
export const firebaseApp = initializeApp(firebaseConfig)
export const appCheck = () => {
    return initializeAppCheck(firebaseApp, {
        provider: new ReCaptchaV3Provider('6LdPDIUgAAAAACKm4Zkaz_0Z8BQdiEyXiPMw7EKQ'),
        isTokenAutoRefreshEnabled: true
    })
}
