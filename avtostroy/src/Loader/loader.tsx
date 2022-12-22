import React from 'react'
import {Box, CircularProgress} from '@mui/material'
import styles from './loader.module.scss'

const Loader = () => {
    return <div className={styles.loader}>
        <Box sx={{display: 'flex', justifyContent:'center', alignItems:'center', mt:'2rem'}}>
            <CircularProgress/>
        </Box>
    </div>
}
export default Loader
