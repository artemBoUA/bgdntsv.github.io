import Login from './Login'
import {Route, Routes} from 'react-router-dom'
import {Home} from './Home'
import {Header} from './Header'
import {useSelector} from 'react-redux'
import {ErrorPage} from './404'
import {Report} from './Report'
import {YourReports} from './YourReports'
import {useLoadScript} from '@react-google-maps/api'
import {GOOGLE_API_KEY} from './googleMapHelper'
import {Box, CircularProgress} from '@mui/material'

function App() {
    const {user} = useSelector(state => state.user)
    const {isLoaded} = useLoadScript({
        googleMapsApiKey: GOOGLE_API_KEY
    })
    const LoadingComponent = <Box sx={{display: 'flex', justifyContent:'center', alignItems:'center', mt:'2rem'}}>
        <CircularProgress/>
    </Box>
    return <>
        <Header/>
        <Routes>
            <Route path="/" element={<Home/>}/>
            <Route path="/login" element={user ? <Home/> : <Login/>}/>
            <Route path="/report" element={user ? isLoaded
                    ? <Report user={user}/>
                    : LoadingComponent
                : <Login/>}/>
            <Route path="/your-reports" element={user ? isLoaded
                    ? <YourReports user={user}/>
                    : LoadingComponent
                : <Login/>}/>
            <Route path="*" element={<ErrorPage/>} replace/>
        </Routes>
    </>
}

export default App
