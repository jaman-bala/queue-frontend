import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import logo from '@shared/assets/logo.png';
import useAuth from '@shared/hooks/useAuth';
import { instance } from '@shared/utils/axios-instance';
import { AxiosResponse } from 'axios';
import { useNavigate } from 'react-router-dom';
import { socket } from '@shared/utils/socket';

export default function Menu() {
    const { userId, sessionId, roleName, departmentId } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            const response: AxiosResponse = await instance.post(
                '/auth/logout',
                {
                    sessionId,
                    userId,
                },
            );
            if (!response.data) {
                return console.log('something went wrong when logout');
            }
            if (roleName === 'specialist') {
                socket.emit('logout-specialist-backend', {
                    userId,
                    sessionId,
                    departmentId,
                });
            }
            localStorage.removeItem('token');
            navigate('/');
        } catch (error) {
            console.log(error);
        }
    };
    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar position="static">
                <Toolbar
                    sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        backgroundColor: '#1976d2',
                    }}
                >
                    <Box sx={{ display: 'flex', flexDirection: 'row' }}>
                        <IconButton
                            size="large"
                            edge="start"
                            color="inherit"
                            aria-label="menu"
                            sx={{ mr: 2 }}
                        >
                            <img src={logo} alt="logo" width={50} />
                        </IconButton>
                        <Typography
                            variant="h6"
                            component="div"
                            sx={{ width: '400px', fontSize: '16px' }}
                        >
                            Государственное агентство по регистрации
                            транспортных средств и водительского состава при
                            Кабинете Министров Кыргызской Республики
                        </Typography>
                    </Box>
                    {userId ? (
                        <Button onClick={handleLogout} color="inherit">
                            Выйти
                        </Button>
                    ) : null}
                </Toolbar>
            </AppBar>
        </Box>
    );
}
