import AppBar from '@mui/material/AppBar'
import Box from '@mui/material/Box'
import Toolbar from '@mui/material/Toolbar'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import Menu from '@mui/material/Menu'
import MenuIcon from '@mui/icons-material/Menu'
import Container from '@mui/material/Container'
import Avatar from '@mui/material/Avatar'
import Button from '@mui/material/Button'
import Tooltip from '@mui/material/Tooltip'
import MenuItem from '@mui/material/MenuItem'
import {initializeApp} from 'firebase/app'
import {getAuth, signOut} from 'firebase/auth'
import {useState} from 'react'
import {useNavigate} from 'react-router-dom'
import {useDispatch, useSelector} from 'react-redux'
import logo from '../rdsLogo.png'
import {bindActionCreators} from 'redux'
import {actionCreators} from '../redux/actionCreators.js'
import {firebaseConfig} from '../firebaseHelper'

export const Header = () => {
    const [anchorElNav, setAnchorElNav] = useState(null)
    const [anchorElUser, setAnchorElUser] = useState(null)
    const navigate = useNavigate()
    const {user} = useSelector(state => state.user)
    const dispatch = useDispatch()
    const {deleteUserActionCreator} = bindActionCreators(actionCreators, dispatch)

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
        window.sessionStorage.removeItem('_user_Avtostroy_report_project')
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
                                <Typography textAlign="center">Report</Typography>
                            </MenuItem>
                            <MenuItem onClick={() => {
                                navigate('/your-reports')
                                setAnchorElNav(null)
                            }}>
                                <Typography textAlign="center">Your reports</Typography>
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
                        <img src={logo} height='25px' alt="RDS"/>
                    </Typography>
                    <Box sx={{flexGrow: 1, display: {xs: 'none', md: 'flex'}}}>
                            <Button onClick={()=>navigate('/report')}
                                    sx={{my: 2, color: 'white', display: 'block'}}>
                                Report</Button>
                            <Button onClick={()=>navigate('/your-reports')}
                                    sx={{my: 2, color: 'white', display: 'block'}}>
                                Your reports</Button>

                    </Box>

                    <Box sx={{flexGrow: 0}}>
                        <Tooltip title={user ? 'Open settings' : ''}>
                            <IconButton onClick={(e) => user ? handleOpenUserMenu(e) : navigate('/login')}
                                        sx={{fontSize: '14px', borderRadius: '1rem', padding: '0 0.5rem'}}
                                        color="inherit">
                                {user ? user?.displayName.split(' ')[0] || user?.email.split('@')[0] : 'sign in'}
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
                                <Typography textAlign="center">Logout</Typography>
                            </MenuItem>

                        </Menu>
                    </Box>
                </Toolbar>
            </Container>
        </AppBar>
    )
}
