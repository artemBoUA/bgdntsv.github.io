import React from 'react'
import Lottie from 'lottie-react'
import * as animation from './errorAnimation.json'
import {Button, Grid, Typography} from '@mui/material'
import styles from './404.module.css'
import {useNavigate} from 'react-router-dom'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import {useTranslation} from 'react-i18next'

const ErrorPage = () => {
    const navigate = useNavigate()
    const {t} = useTranslation()
    return <Grid container spacing={2} className={styles.page}>
        <Grid item xs={12} md={6}>
            <Typography variant="h3" component="h1" className={styles.title}>Page not found <br/> <b>Error
                404</b>
                <Button sx={{marginTop: '1.5rem'}} color="primary" variant="contained" endIcon={<ArrowBackIcon/>}
                        onClick={() => navigate(-1)}>{t('COME_BACK_TO_PREVIOUS_PAGE')}</Button>
            </Typography>

        </Grid>
        <Grid item xs={12} md={6}>
            <Lottie loop={true} animationData={animation} autoplay={true}/>
        </Grid>
    </Grid>
}
export default React.memo(ErrorPage)
