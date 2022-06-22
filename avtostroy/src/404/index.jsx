import React from 'react'
import Lottie from 'react-lottie'
import * as animation from './errorAnimation.json'
import {Button, Grid, Typography} from '@mui/material'
import styles from './404.module.css'
import {useNavigate} from 'react-router-dom'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'

export const ErrorPage = () => {
    const navigate = useNavigate()
    return <Grid container spacing={2} className={styles.page}>
        <Grid item xs={12} md={6}>
            <Typography variant="h3" component="h1" className={styles.title}>Page not found <br/> <b>Error
                404</b>
                <Button sx={{marginTop:'1.5rem'}} color="primary" variant="contained" endIcon={<ArrowBackIcon/>}
                        onClick={() => navigate(-1)}>Come back to previous page</Button>
            </Typography>

        </Grid>
        <Grid item xs={12} md={6}>
            <Lottie options={{loop: true, autoplay: true, animationData: animation}}/>
        </Grid>
    </Grid>
}
