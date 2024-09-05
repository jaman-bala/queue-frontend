import {
    Alert,
    Box,
    Button,
    FormControl,
    InputLabel,
    MenuItem,
    Paper,
    Select,
    Snackbar,
    TextField,
    Typography,
} from '@mui/material';
import useAuth from '@shared/hooks/useAuth';
import { instance } from '@shared/utils/axios-instance';
import { AxiosError } from 'axios';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const roles = ['TS', 'VS'];

const LoginPage = () => {
    const [windowNumber, setWindowNumber] = useState<string | undefined>('');
    const [role, setRole] = useState<string | undefined>('');
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
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'flex-start',
                    margin: '20px 200px',
                }}
            >
                <Typography variant="h3" component="h3" sx={{ width: '600px' }}>
                    Добро пожаловать в систему отслеживания очередей!
                </Typography>
                <Paper
                    sx={{
                        backgroundColor: '#fff',
                        padding: '20px',
                        borderRadius: '10px',
                        width: '600px',
                        boxShadow: '2px 2px 10px 2px',
                    }}
                >
                    <TextField
                        fullWidth
                        label="Логин"
                        variant="outlined"
                        disabled={responseLoading}
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        sx={{
                            backgroundColor: '#fff',
                            borderRadius: '10px',
                            borderBottom: 'none',
                        }}
                    />
                    <TextField
                        fullWidth
                        label="Пароль"
                        type="password"
                        variant="outlined"
                        disabled={responseLoading}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        sx={{
                            backgroundColor: '#fff',
                            borderRadius: '10px',
                            marginTop: '30px',
                        }}
                    />
                    <FormControl
                        fullWidth
                        sx={{
                            marginTop: '30px',
                            minWidth: 120,
                            backgroundColor: '#fff',
                            borderRadius: '10px',
                        }}
                        variant="outlined"
                        disabled={responseLoading}
                    >
                        <InputLabel id="role-label-id">Роль</InputLabel>
                        <Select
                            labelId="role-label-id"
                            value={role}
                            label="Роль"
                            disabled={responseLoading}
                            onChange={(e) => setRole(e.target.value)}
                        >
                            {roles.map((role) => {
                                return (
                                    <MenuItem key={role} value={role}>
                                        {role}
                                    </MenuItem>
                                );
                            })}
                        </Select>
                    </FormControl>
                    <TextField
                        fullWidth
                        label="Номер окна"
                        type="number"
                        variant="outlined"
                        disabled={responseLoading}
                        value={windowNumber}
                        onChange={(e) => setWindowNumber(e.target.value)}
                        sx={{
                            backgroundColor: '#fff',
                            borderRadius: '10px',
                            marginTop: '30px',
                        }}
                    />
                    <Button
                        fullWidth
                        sx={{ mt: '30px', height: '50px', fontWeight: '600' }}
                        variant="outlined"
                        disabled={responseLoading}
                        onClick={handleLogin}
                    >
                        Войти
                    </Button>
                </Paper>
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
