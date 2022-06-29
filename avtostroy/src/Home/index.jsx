import {useSelector} from 'react-redux'
import {Box, Grid, Typography} from '@mui/material'
import * as animation from './report_animation.json'
import Lottie from 'react-lottie'
import CheckBoxIcon from '@mui/icons-material/CheckBox'
import {translation} from '../localization'

export const Home = () => {
    const {user} = useSelector(state => state.user)
    const {language} = useSelector(state => state.language)
    return <Box p="1rem">
        {user&&<Typography variant="h4" component="h3"
                     p="1rem 0">{translation('HI', language)}, {user?.displayName || user?.email}</Typography>}
        <Grid container>
            <Grid item xs={12} md={8} justifyContent="center" display="flex" flexDirection="column">
                <Typography variant="h5" component="p"
                            p="0 0 2rem 0">{translation('HOME_INTRO', language)}?</Typography>
                <Typography sx={{display: 'flex'}} variant="body1" component="p" p="0 0 .6rem 1rem">
                    <CheckBoxIcon sx={{mr: '1rem'}} color="primary"/>{translation('ADD_LOCATION_OF_WORK', language)}
                </Typography>
                <Typography sx={{display: 'flex'}} variant="body1" component="p" p="0 0 .6rem 1rem">
                    <CheckBoxIcon sx={{mr: '1rem'}} color="primary"/>{translation('ADD_PHOTO_OF_WORK', language)}
                </Typography>
                <Typography sx={{display: 'flex'}} variant="body1" component="p" p="0 0 .6rem 1rem">
                    <CheckBoxIcon sx={{mr: '1rem'}} color="primary"/>{translation('ADD_DETAILS_OF_WORK', language)}
                </Typography>
                <Typography variant="caption"
                            mb="2rem">*{translation('ALL_POINTS_ARE_REQUIRED', language)}</Typography>
            </Grid>
            <Grid item xs={12} md={4}>
                <Lottie options={{animationData: animation}}/>
            </Grid>
        </Grid>
    </Box>
}
