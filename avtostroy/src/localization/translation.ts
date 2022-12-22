import english from './en.json'
import ukrainian from './ua.json'
import i18next from 'i18next'
import {initReactI18next} from 'react-i18next'
i18next
    .use(initReactI18next)
    .init({
        fallbackLng: 'ua',
        resources:{
            ua:{
                translation: ukrainian
            },
            en: {
                translation: english
            }
        }
    })

export type languageType = 'ua' | 'en'
