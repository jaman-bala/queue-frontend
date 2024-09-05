import { Box, Button, Typography } from '@mui/material';

interface AddQueueProps {
    ticketType: 'TS' | 'VS';
    onAddQueue: (e: 'TS' | 'VS') => void;
    loading: boolean;
}

const AddQueue = (props: AddQueueProps) => {
    const { ticketType, onAddQueue, loading } = props;
    const handleClick = () => {
        onAddQueue(ticketType);
    };
    return (
        <Box
            sx={{
                padding: '20px',
                backgroundColor: '#fff',
                borderRadius: '10px',
                boxShadow: '2px 2px 10px 2px',
                marginRight: ticketType === 'TS' ? '20px' : 0,
            }}
        >
            <Typography
                variant="h4"
                sx={{ textAlign: 'center', color: '#1976d2' }}
            >
                {ticketType}
            </Typography>
            <Button
                fullWidth
                sx={{ mt: '10px', height: '50px', width: '230px' }}
                variant="contained"
                disabled={loading}
                onClick={handleClick}
            >
                Новый клиент
            </Button>
        </Box>
    );
};

export default AddQueue;
