import React, {useState} from 'react'
import styles from './login.module.css'
import {initializeApp} from 'firebase/app'
import {getAuth, signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup} from 'firebase/auth'
import {useFormik} from 'formik'
import * as yup from 'yup'
import {
    Button,
    FormControl,
    IconButton,
    Input,
    InputAdornment,
    InputLabel,
    TextField, Typography
} from '@mui/material'
import {Visibility, VisibilityOff, Google} from '@mui/icons-material'
import {useDispatch} from 'react-redux'
import {firebaseConfig, appCheck} from '../utils/firebaseHelper'
import {setUser} from '../redux/slices/userSlice'
import {setMessage} from '../redux/slices/messageSlice'
import {getErrorMessage} from '../utils/utils'
import {useTranslation} from 'react-i18next'

const Login = () => {
    const dispatch = useDispatch()
    const [showPassword, setShowPassword] = useState(false)
    const firebaseApp = initializeApp(firebaseConfig)
    const auth = getAuth(firebaseApp)
    const provider = new GoogleAuthProvider()
    const {t} = useTranslation()

    const validationSchema = yup.object({
        email: yup
            .string()
            .email(t('ENTER_A_VALID_EMAIL') as string)
            .required(t('REQUIRED_FIELD') as string),
        password: yup
            .string()
            .min(8, t('PASSWORD_SHOULD_BE') as string)
            .required(t('REQUIRED_FIELD') as string)
    })

    const formik = useFormik({
        initialValues: {
            email: '',
            password: ''
        },
        validationSchema: validationSchema,
        onSubmit: async (values, {setSubmitting}) => {
            let userCredentials
            try {
                appCheck()
                userCredentials = await signInWithEmailAndPassword(auth, values.email, values.password)
                dispatch(setUser(userCredentials.user))
            } catch (error) {
                const errorMessage = getErrorMessage(error)
                showError(errorMessage)
            } finally {
                setSubmitting(false)
            }
        }
    })

    const signInGoogle = async () => {
        try {
            appCheck()
            const result = await signInWithPopup(auth, provider)
            dispatch(setUser(result.user))
        } catch (error) {
            showError(getErrorMessage(error))
        }
    }

    const showError = (error: string) => {
        dispatch(setMessage({text: error, type: 'error'}))
    }

    const handleShowPassword = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault()
        setShowPassword(prev => !prev)
    }

    return <div className={styles.page}>
        <Typography variant="h4" component="h1">{t('PLEASE_LOGIN')}!</Typography>
        <form onSubmit={formik.handleSubmit} className={styles.form}>
            <FormControl sx={{m: 1, width: '30ch'}} variant="standard">
                <TextField
                    id="email"
                    name="email"
                    label="Email"
                    value={formik.values.email}
                    onChange={formik.handleChange}
                    error={formik.touched.email && Boolean(formik.errors.email)}
                    helperText={formik.touched.email && formik.errors.email}
                    variant="standard"
                    margin="dense"
                />
            </FormControl>
            <FormControl sx={{m: 1, width: '30ch'}} variant="standard">
                <InputLabel htmlFor="standard-adornment-password">{t('PASSWORD')}</InputLabel>
                <Input
                    id="standard-adornment-password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    value={formik.values.password}
                    onChange={formik.handleChange}
                    endAdornment={
                        <InputAdornment position="end">
                            <IconButton
                                aria-label="toggle password visibility"
                                onClick={formik.handleChange}
                                name="showPassword"
                                id="showPassword"
                                onMouseDown={handleShowPassword}>
                                {showPassword ? <VisibilityOff/> : <Visibility/>}
                            </IconButton>
                        </InputAdornment>
                    }
                />
            </FormControl>
            <div className={styles.buttons}>
                <Button color="primary" variant="contained" type="submit">{t('SUBMIT')}</Button>
                <Button onClick={signInGoogle} startIcon={<Google
                    sx={{height: '25px'}}/>}>{t('SIGN_IN_WITH_GOOGLE')}</Button>
            </div>
        </form>
    </div>
}

export default React.memo(Login)
