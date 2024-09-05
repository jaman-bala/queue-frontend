import { Box, List, ListItem, ListItemText, Typography } from '@mui/material';

interface InProgressQueueProps {
    items:
        | {
              windowNumber: string;
              ticketNumber: string;
          }[]
        | undefined;
}

const InProgressQueue = (props: InProgressQueueProps) => {
    const { items } = props;

    const length = items ? items.length > 0 : false;

    const content = length ? (
        <List>
            {items &&
                items.slice(0, 5).map((item) => (
                    <ListItem
                        key={item.ticketNumber}
                        sx={{
                            backgroundColor: '#3e78e8',
                            borderRadius: '10px',
                            marginBottom: '10px',
                            color: '#fff',
                        }}
                    >
                        <ListItemText
                            primary={`${item.ticketNumber} - ${item.windowNumber}`}
                        />
                    </ListItem>
                ))}
        </List>
    ) : (
        <Typography
            variant="h5"
            align="center"
            sx={{ color: '#3e78e8', mt: '30px' }}
        >
            Нет никого на окошке
        </Typography>
    );

    return (
        <Box
            sx={{
                width: '400px',
                padding: '30px',
                boxShadow: '2px 2px 10px 2px',
                borderRadius: '10px',
            }}
        >
            {content}
        </Box>
    );
};

export default InProgressQueue;
