import { PrintContext } from '@app/providers/print-provider/print-provider';
import { Box, Typography } from '@mui/material';
import { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const PrintPage = () => {
    const { printData } = useContext(PrintContext);

    console.log(printData);
    const navigate = useNavigate();
    useEffect(() => {
        window.print();
        const timer = setTimeout(() => {
            navigate('/operator');
        }, 2000);

        return () => {
            clearTimeout(timer);
        };
    }, []);
    return (
        <Box
            sx={{
                height: '100dvh',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
            }}
        >
            <Typography
                variant="body1"
                textAlign="center"
                sx={{ mb: '20px', width: '320px' }}
            >
                Кыргыз Республикасынын Министрлер Кабинетине караштуу Транспорт
                каражаттарын жана айдоочулук курамды каттоо боюнча мамлекеттик
                агенттик
            </Typography>
            <Typography
                variant="body1"
                textAlign="center"
                sx={{ mb: '20px', width: '320px' }}
            >
                {printData?.departmentName}
            </Typography>
            <Typography variant="h1" sx={{ mb: '30px' }}>
                {printData?.ticket}
            </Typography>
            <Typography variant="h5">{printData?.createdAt}</Typography>
        </Box>
    );
};

export default PrintPage;
