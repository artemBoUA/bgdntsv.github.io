import React, {useEffect, useState} from 'react'
import styles from './login.module.css'
import {initializeApp} from 'firebase/app'
import {getAuth, signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup} from 'firebase/auth'
import {replace, useFormik} from 'formik'
import * as yup from 'yup'
import {
    Alert, Box,
    Button,
    Collapse,
    FormControl,
    IconButton,
    Input,
    InputAdornment,
    InputLabel,
    TextField, Typography
} from '@mui/material'
import {Visibility, VisibilityOff, Google} from '@mui/icons-material'
import {useDispatch, useSelector} from 'react-redux'
import {bindActionCreators} from 'redux'
import {actionCreators} from '../redux/actionCreators.js'
import {useNavigate} from 'react-router-dom'
import {firebaseConfig} from '../firebaseHelper'
import CloseIcon from '@mui/icons-material/Close'
import {translation} from '../localization'
import {appCheck} from '../firebaseHelper'
const Login = () => {
    const navigate = useNavigate()
    const {user} = useSelector(state => state.user)
    const {language} = useSelector(state => state.language)
    const dispatch = useDispatch()
    const {setUserActionCreator} = bindActionCreators(actionCreators, dispatch)
    const [showPassword, setShowPassword] = useState(false)
    const [error, setError] = useState('')

    useEffect(() => {
        if (user) {
            navigate('/', replace)
        }
    }, [user, navigate])

    const firebaseApp = initializeApp(firebaseConfig)
    const auth = getAuth(firebaseApp)
    const provider = new GoogleAuthProvider()

    const validationSchema = yup.object({
        email: yup
            .string('Enter your email')
            .email('Enter a valid email')
            .required('Email is required'),
        password: yup
            .string('Enter your password')
            .min(8, 'Password should be of minimum 8 characters length')
            .required('Password is required')
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
                setUserActionCreator(userCredentials.user)
            } catch (error) {
                showError(error.message)
            } finally {
                setSubmitting(false)
            }
        }
    })

    const signInGoogle = () => {
        appCheck()
        signInWithPopup(auth, provider)
            .then((result) => {
                setUserActionCreator(result.user)
            }).catch((error) => {
            showError(error.message)
        })
    }

    const showError = (error) => {
        setError(error)
        setTimeout(() => {
            setError('')
        }, 3000)
    }

    const handleShowPassword = (e) => {
        e.preventDefault()
        setShowPassword(prev => !prev)
    }

    return <div className={styles.page}>
        <Box sx={{width: '100%'}}>
            <Collapse in={!!error}>
                <Alert
                    severity={'error'}
                    action={
                        <IconButton
                            aria-label="close"
                            color="inherit"
                            size="small"
                            onClick={() => setError('')}>
                            <CloseIcon fontSize="inherit"/>
                        </IconButton>
                    }
                    sx={{mb: 2}}>
                    {error}
                </Alert>
            </Collapse>
        </Box>
        <Typography variant="h4" component="h1">{translation('PLEASE_LOGIN', language)}!</Typography>
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
                <InputLabel htmlFor="standard-adornment-password">{translation('PASSWORD', language)}</InputLabel>
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
                <Button color="primary" variant="contained" type="submit">{translation('SUBMIT', language)}</Button>
                <Button onClick={signInGoogle} startIcon={<Google
                    sx={{height: '25px'}}/>}>{translation('SIGN_IN_WITH_GOOGLE', language)}</Button>
            </div>
        </form>
    </div>
}

export default React.memo(Login)
