import { Alert, Snackbar } from '@mui/material';
import { Box } from '@shared/ui/Box';
import { Input } from '@shared/ui/Input';
import { Select } from '@shared/ui/Select';
import { Button } from '@shared/ui/Button';
import cls from './login-page.module.scss';
import useAuth from '@shared/hooks/useAuth';
import { instance } from '@shared/utils/axios-instance';
import { AxiosError } from 'axios';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const roles = [
    {
        content: 'TS',
        id: 'TS',
    },
    {
        content: 'VS',
        id: 'VS',
    },
];

const LoginPage = () => {
    const [windowNumber, setWindowNumber] = useState<string | undefined>('');
    const [role, setRole] = useState<string | undefined>(roles[0].content);
    const [username, setUsername] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [responseLoading, setResponseLoading] = useState<boolean>(false);
    const [openSnackbar, setOpenSnackbar] = useState<boolean>(false);
    const [snackbarMessage, setSnackbarMessage] = useState<string>('');
    const [snackbarSeverity, setSnackbarSeverity] = useState<
        'success' | 'error'
    >('success');

    const { userId, roleName } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (userId) {
            navigate(roleName);
        }
    }, []);

    const handleLogin = async () => {
        setResponseLoading(true);
        try {
            const response = await instance.post('auth', {
                username,
                password,
                ticketsType: role,
                windowNumber,
            });

            if (!response.data) {
                setSnackbarMessage('Ошибка при входе в систему');
                setOpenSnackbar(true);
                setSnackbarSeverity('error');
                setResponseLoading(false);
            } else {
                setRole('');
                setUsername('');
                setPassword('');
                setSnackbarMessage('Пользователь успешно вошел');
                setSnackbarSeverity('success');
                localStorage.setItem('token', response.data.accessToken);
                setResponseLoading(false);
                navigate(response.data.path);
            }
        } catch (error) {
            if (error instanceof AxiosError) {
                console.log(error);
                setSnackbarMessage(error.response?.data.message);
                setSnackbarSeverity('error');
                setOpenSnackbar(true);
                setResponseLoading(false);
            }
        }
    };

    const handleCloseSnackbar = () => {
        setOpenSnackbar(false);
    };

    return (
        <>
            <Box
                classNames={cls.wrapper}
                direction="column"
                justify="center"
                align="center"
            >
                <Box
                    shadow
                    card
                    classNames={cls.login}
                    direction="column"
                    justify="center"
                    align="center"
                >
                    <Input
                        label="Логин"
                        type="text"
                        fullWidth
                        disabled={responseLoading}
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                    <Input
                        label="Пароль"
                        type="password"
                        fullWidth
                        disabled={responseLoading}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <Select
                        items={roles}
                        onChange={(value) => setRole(value.content)}
                        classNames={cls.windowNumber}
                        fullWidth
                    />
                    <Input
                        label="Номер окна"
                        type="number"
                        fullWidth
                        disabled={responseLoading}
                        value={windowNumber}
                        onChange={(e) => setWindowNumber(e.target.value)}
                    />
                    <Button
                        fullWidth
                        disabled={responseLoading}
                        onClick={handleLogin}
                        variant="secondary"
                        classNames={cls.button}
                    >
                        Войти
                    </Button>
                </Box>
            </Box>
            <Snackbar
                open={openSnackbar}
                autoHideDuration={6000}
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
                <Alert
                    onClose={handleCloseSnackbar}
                    severity={snackbarSeverity}
                    sx={{ width: '100%' }}
                >
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </>
    );
};

export default LoginPage;
