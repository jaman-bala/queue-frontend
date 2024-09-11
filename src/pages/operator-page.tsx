import AddQueue from '@modules/Queue/add-queue-ui';
import QueueCards from '@modules/Queue/queue-cards-ui';
import { Alert, Box, Snackbar } from '@mui/material';
import useAuth from '@shared/hooks/useAuth';
import { instance } from '@shared/utils/axios-instance';
import { socket } from '@shared/utils/socket';
import { useState, useEffect, useContext } from 'react';
import { QueueResponse } from '@shared/utils/types';
import { useNavigate } from 'react-router-dom';
import { PrintContext } from '@app/providers/print-provider/print-provider';
import { formattedDate } from '@shared/utils/date-helpers';
import InProgressQueue from '@modules/Queue/in-progress-queue';

const OperatorPage = () => {
    const [ticketsTs, setTicketsTs] = useState<string[]>([]);
    const [ticketsVs, setTicketsVs] = useState<string[]>([]);
    const [responseLoading, setResponseLoading] = useState<boolean>(false);
    const { setPrintData } = useContext(PrintContext);
    const [inProgressTickets, setInProgressTickets] = useState<
        {
            windowNumber: string;
            ticketNumber: string;
        }[]
    >();

    const [openSnackbar, setOpenSnackbar] = useState<boolean>(false);
    const [snackbarMessage, setSnackbarMessage] = useState<string>('');
    const [snackbarSeverity, setSnackbarSeverity] = useState<
        'success' | 'error'
    >('success');
    const { departmentId: departmentIdAuth } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        socket.emit('join-department', departmentIdAuth);
        socket.on('ticket-added', (data) => {
            const { ticket } = data;
            if (ticket.type === 'TS') {
                setTicketsTs((prev) => [...prev, ticket.ticketNumber]);
            } else if (ticket.type === 'VS') {
                setTicketsVs((prev) => [...prev, ticket.ticketNumber]);
            }
            if (setPrintData) {
                setPrintData({
                    ticket: data.ticket.ticketNumber,
                    createdAt: formattedDate(data.ticket.createdAt),
                });
            }
            navigate('/print');
            setResponseLoading(false);
        });

        socket.on('specialist-available', (data) => {
            const { windowNumber } = data;
            setInProgressTickets((prev = []) => {
                return prev.filter((t) => t.windowNumber !== windowNumber);
            });
        });

        socket.on('take-pause-specialist', (data) => {
            const { windowNumber } = data;
            setInProgressTickets((prev = []) => {
                return prev.filter(
                    (item) => item.windowNumber !== windowNumber,
                );
            });
        });

        socket.on('logout-specialist-frontend', (data) => {
            const { windowNumber } = data;
            console.log(windowNumber);
            setInProgressTickets((prev = []) => {
                return prev.filter(
                    (item) => item.windowNumber !== windowNumber,
                );
            });
        });

        socket.on('ticket-in-progress', (data) => {
            const { ticket, windowNumber, hasQueues } = data;

            console.log(data);

            if (ticket.type === 'TS') {
                setTicketsTs((prev) =>
                    prev.filter((t) => t !== ticket.ticketNumber),
                );
            } else if (ticket.type === 'VS') {
                setTicketsVs((prev) =>
                    prev.filter((t) => t !== ticket.ticketNumber),
                );
            }
            setInProgressTickets((prev = []) => {
                let updatedItem = prev.find(
                    (item) => item.windowNumber === windowNumber,
                );

                console.log(windowNumber);

                if (!updatedItem) {
                    updatedItem = {
                        windowNumber: windowNumber,
                        ticketNumber: ticket.ticketNumber,
                    };
                }

                if (updatedItem) {
                    updatedItem.ticketNumber = ticket.ticketNumber;
                }

                const newArray = [
                    ...(updatedItem ? [updatedItem] : []),
                    ...prev.filter(
                        (item) => item.windowNumber !== windowNumber,
                    ),
                ];

                return newArray;
            });
            setResponseLoading(false);
            if (hasQueues) {
                if (setPrintData) {
                    setPrintData({
                        ticket: data.ticket.ticketNumber,
                        createdAt: formattedDate(data.ticket.createdAt),
                    });
                }
                navigate('/print');
            }
        });

        return () => {
            socket.off('ticket-added');
            socket.off('ticket-in-progress');
            socket.off('logout-specialist-frontend');
            socket.off('take-pause-specialist');
            socket.off('specialist-available');
        };
    }, []);

    useEffect(() => {
        getAllWaitingQueues();
    }, []);

    const getAllWaitingQueues = async () => {
        setResponseLoading(true);
        try {
            const response = await instance.get(`queues/${departmentIdAuth}`);

            if (!response.data) {
                setSnackbarMessage(
                    'Не могу загрузить данные. Попробуйте обновить страницу.',
                );
                setSnackbarSeverity('error');
                setOpenSnackbar(true);
                setResponseLoading(false);
            } else {
                console.log(response);
                const ticketNumbersTs = response.data.tsTickets.map(
                    (ticket: QueueResponse) => ticket.ticketNumber,
                );
                const ticketNumbersVs = response.data.vsTickets.map(
                    (ticket: QueueResponse) => ticket.ticketNumber,
                );
                setTicketsTs(ticketNumbersTs);
                setTicketsVs(ticketNumbersVs);
                setInProgressTickets(response.data.inProgressTickets);
                setResponseLoading(false);
            }
        } catch (error) {
            setTicketsTs([]);
            setTicketsVs([]);
            console.log(error);
            setSnackbarMessage('Ошибка при загрузке данных');
            setSnackbarSeverity('error');
            setOpenSnackbar(true);
            setResponseLoading(false);
        }
    };

    const handleAddQueue = (ticketType: 'TS' | 'VS') => {
        setResponseLoading(true);
        const departmentId = departmentIdAuth;
        socket.emit('add-new-ticket', {
            departmentId,
            ticketType,
        });
    };

    const handleCloseSnackbar = () => {
        setOpenSnackbar(false);
    };

    return (
        <>
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'space-around',
                    paddingTop: '30px',
                }}
            >
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        flexDirection: 'column',
                    }}
                >
                    <AddQueue
                        ticketType="VS"
                        onAddQueue={handleAddQueue}
                        loading={responseLoading}
                    ></AddQueue>
                    <QueueCards items={ticketsVs} ticketType="ВС" />
                </Box>
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'center',
                    }}
                >
                    <InProgressQueue items={inProgressTickets} />
                </Box>
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        flexDirection: 'column',
                    }}
                >
                    <AddQueue
                        ticketType="TS"
                        onAddQueue={handleAddQueue}
                        loading={responseLoading}
                    ></AddQueue>
                    <QueueCards items={ticketsTs} ticketType="ТС" />
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

export default OperatorPage;
