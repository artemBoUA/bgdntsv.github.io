import {
    Select,
    Button,
    Avatar,
    Tooltip,
    Container,
    MenuItem,
    Menu,
    Typography,
    IconButton,
    Toolbar,
    Box
} from '@mui/material'
import AppBar from '@mui/material/AppBar'
import MenuIcon from '@mui/icons-material/Menu'
import {initializeApp} from 'firebase/app'
import {getAuth, signOut} from 'firebase/auth'
import {useState} from 'react'
import {useNavigate} from 'react-router-dom'
import {useDispatch, useSelector} from 'react-redux'
import logo from '../rdsLogo.png'
import {bindActionCreators} from 'redux'
import {actionCreators} from '../redux/actionCreators.js'
import {firebaseConfig} from '../firebaseHelper'
import TranslateIcon from '@mui/icons-material/Translate'
import {translation} from '../localization'

export const Header = () => {
    const [anchorElNav, setAnchorElNav] = useState(null)
    const [anchorElUser, setAnchorElUser] = useState(null)
    const navigate = useNavigate()
    const {user} = useSelector(state => state.user)
    const {language} = useSelector(state => state.language)
    const dispatch = useDispatch()
    const {deleteUserActionCreator, setLanguageActionCreator} = bindActionCreators(actionCreators, dispatch)

    const handleSetLanguage = ({target}) => {
        setLanguageActionCreator(target.value)
    }

    const handleOpenNavMenu = (event) => {
        setAnchorElNav(event.currentTarget)
    }
    const handleOpenUserMenu = (event) => {
        setAnchorElUser(event.currentTarget)
    }

    const handleCloseNavMenu = () => {
        setAnchorElNav(null)
    }

    const handleCloseUserMenu = () => {
        setAnchorElUser(null)
    }

    const logOut = async () => {
        const firebaseApp = initializeApp(firebaseConfig)
        const auth = getAuth(firebaseApp)
        await signOut(auth)
        await deleteUserActionCreator()
        navigate('/login', {replace: true})
        handleCloseUserMenu()
        // window.sessionStorage.removeItem('_user_Avtostroy_report_project')
    }

    return (
        <AppBar position="static">
            <Container maxWidth="xl">
                <Toolbar disableGutters>
                    <Typography
                        variant="h6"
                        noWrap
                        component="a"
                        onClick={() => navigate('/')}
                        sx={{
                            mr: 2, display: {xs: 'none', md: 'flex'}, fontFamily: 'monospace', fontWeight: 700,
                            letterSpacing: '.3rem', color: 'inherit', textDecoration: 'none'
                        }}>
                        <img src={logo} alt="RDS" height="25px"/>
                    </Typography>

                    <Box sx={{flexGrow: 1, display: {xs: 'flex', md: 'none'}}}>
                        <IconButton size="large" aria-label="account of current user" aria-controls="menu-appbar"
                                    aria-haspopup="true" onClick={handleOpenNavMenu} color="inherit">
                            <MenuIcon/>
                        </IconButton>
                        <Menu
                            id="menu-appbar"
                            anchorEl={anchorElNav}
                            anchorOrigin={{vertical: 'bottom', horizontal: 'left'}}
                            keepMounted
                            transformOrigin={{vertical: 'top', horizontal: 'left'}}
                            open={Boolean(anchorElNav)}
                            onClose={handleCloseNavMenu}
                            sx={{display: {xs: 'block', md: 'none'}}}>
                            <MenuItem onClick={() => {
                                navigate('/report')
                                setAnchorElNav(null)
                            }}>
                                <Typography textAlign="center">{translation('REPORT', language)}</Typography>
                            </MenuItem>
                            <MenuItem onClick={() => {
                                navigate('/your-reports')
                                setAnchorElNav(null)
                            }}>
                                <Typography textAlign="center">{translation('YOUR_REPORTS', language)}</Typography>
                            </MenuItem>

                        </Menu>

                    </Box>
                    <Typography
                        variant="h5"
                        noWrap
                        component="a"
                        onClick={() => navigate('/')}
                        sx={{
                            mr: 2, display: {xs: 'flex', md: 'none'}, flexGrow: 1, fontFamily: 'monospace',
                            fontWeight: 700, letterSpacing: '.3rem', color: 'inherit', textDecoration: 'none'
                        }}>
                        <img src={logo} height="25px" alt="RDS"/>
                    </Typography>
                    <Box sx={{flexGrow: 1, display: {xs: 'none', md: 'flex'}}}>
                        <Button onClick={() => navigate('/report')}
                                sx={{my: 2, color: 'white', display: 'block'}}>
                            {translation('REPORT', language)}</Button>
                        <Button onClick={() => navigate('/your-reports')}
                                sx={{my: 2, color: 'white', display: 'block'}}>
                            {translation('YOUR_REPORTS', language)}</Button>

                    </Box>
                    <Select
                        variant="standard"
                        value={language}
                        IconComponent={TranslateIcon}
                        onChange={handleSetLanguage}
                        inputProps={{'aria-label': 'Without label'}}>
                        <MenuItem value={'ua'}>UA</MenuItem>
                        <MenuItem value={'en'}>EN</MenuItem>
                    </Select>
                    <Box sx={{flexGrow: 0}}>
                        <Tooltip title={user ? translation('OPEN_SETTINGS', language) : ''}>
                            <IconButton onClick={(e) => user ? handleOpenUserMenu(e) : navigate('/login')}
                                        sx={{fontSize: '14px', borderRadius: '1rem', padding: '0 0.5rem'}}
                                        color="inherit">
                                {user ? user?.displayName.split(' ')[0] || user?.email.split('@')[0] : translation('SIGN_IN', language)}
                                <Avatar sx={{marginLeft: '8px'}} alt={user?.displayName || user?.email}
                                        src={user?.photoURL} referrerPolicy="no-referrer"/>
                            </IconButton>
                        </Tooltip>
                        <Menu
                            sx={{mt: '45px'}}
                            id="menu-appbar"
                            anchorEl={anchorElUser}
                            anchorOrigin={{vertical: 'top', horizontal: 'right'}}
                            keepMounted
                            transformOrigin={{vertical: 'top', horizontal: 'right'}}
                            open={Boolean(anchorElUser)}
                            onClose={handleCloseUserMenu}>
                            <MenuItem onClick={logOut}>
                                <Typography textAlign="center">{translation('LOGOUT', language)}</Typography>
                            </MenuItem>
                        </Menu>
                    </Box>
                </Toolbar>
            </Container>
        </AppBar>
    )
}
