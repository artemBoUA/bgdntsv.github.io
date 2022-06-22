import Login from './Login'
import {Route, Routes} from 'react-router-dom'
import {Home} from './Home'
import {Header} from './Header'
import {useEffect} from 'react'
import {useDispatch} from 'react-redux'
import {bindActionCreators} from 'redux'
import {actionCreators} from './redux/actionCreators.js'
import {ErrorPage} from './404'
import {Report} from './Report'
import {YourReports} from './YourReports'

function App() {
    const dispatch = useDispatch()

    useEffect(() => {
        const user = window.sessionStorage.getItem('_user_Avtostroy_report_project')
        if (user) {
            const AC = bindActionCreators(actionCreators, dispatch)
            AC.setUserActionCreator(JSON.parse(user))
        }
    }, [dispatch])

    return <>
        <Header/>
        <Routes>
            <Route path="/" element={<Home/>}/>
            <Route path="/login" element={<Login/>}/>
            <Route path="/report" element={<Report/>}/>
            <Route path="/your-reports" element={<YourReports/>}/>
            <Route path="*" element={<ErrorPage/>} replace/>
        </Routes>
    </>
}

export default App
