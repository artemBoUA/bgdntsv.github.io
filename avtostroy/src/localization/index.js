import * as english from './en.json'
import * as ukrainian from './ua.json'

export const translation = (variant, language) => {
    return language === 'ua'
        ? ukrainian[variant]
        : english[variant]
}
