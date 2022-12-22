import {useSelector} from 'react-redux'
import {Box, Grid, Typography} from '@mui/material'
import * as animation from './report_animation.json'
import Lottie from 'lottie-react'
import CheckBoxIcon from '@mui/icons-material/CheckBox'
import React from 'react'
import {useTranslation} from 'react-i18next'
import {rootStateType} from '../redux/store'

const Home = () => {
    const {user} = useSelector((state: rootStateType) => state.user)
    const {t} = useTranslation()

    return <Box p="1rem">
        {user && <Typography variant="h4" component="h3"
                             p="1rem 0">{t('HI')}, {user?.displayName || user?.email}</Typography>}
        <Grid container>
            <Grid item xs={12} md={8} justifyContent="center" display="flex" flexDirection="column">
                <Typography variant="h5" component="p"
                            p="0 0 2rem 0">{t('HOME_INTRO')}?</Typography>
                <Typography sx={{display: 'flex'}} variant="body1" component="p" p="0 0 .6rem 1rem">
                    <CheckBoxIcon sx={{mr: '1rem'}} color="primary"/>{t('ADD_LOCATION_OF_WORK')}
                </Typography>
                <Typography sx={{display: 'flex'}} variant="body1" component="p" p="0 0 .6rem 1rem">
                    <CheckBoxIcon sx={{mr: '1rem'}} color="primary"/>{t('ADD_PHOTO_OF_WORK')}
                </Typography>
                <Typography sx={{display: 'flex'}} variant="body1" component="p" p="0 0 .6rem 1rem">
                    <CheckBoxIcon sx={{mr: '1rem'}} color="primary"/>{t('ADD_DETAILS_OF_WORK')}
                </Typography>
                {/*<Typography variant="caption"*/}
                {/*            mb="2rem">*{translation('ALL_POINTS_ARE_REQUIRED')}</Typography>*/}
            </Grid>
            <Grid item xs={12} md={4}>
                <Lottie animationData={animation}/>
            </Grid>
        </Grid>
    </Box>
}

export default React.memo(Home)
