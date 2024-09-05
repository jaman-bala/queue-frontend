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

const SpectatorPage = () => {
    const [ticketsTs, setTicketsTs] = useState<string[]>([]);
    const [ticketsVs, setTicketsVs] = useState<string[]>([]);
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

    useEffect(() => {
        socket.emit('join-department', departmentIdAuth);
        socket.on('ticket-added', (data) => {
            const { ticket } = data;
            console.log(ticket);
            if (ticket.type === 'TS') {
                setTicketsTs((prev) => [...prev, ticket.ticketNumber]);
            } else if (ticket.type === 'VS') {
                setTicketsVs((prev) => [...prev, ticket.ticketNumber]);
            }
        });

        socket.on('specialist-available', (data) => {
            const { windowNumber } = data;
            setInProgressTickets((prev = []) => {
                return prev.filter((t) => t.windowNumber !== windowNumber);
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
                const updatedItem = prev.find(
                    (item) => item.windowNumber === windowNumber,
                );

                const newArray = [
                    ...prev.filter(
                        (item) => item.windowNumber !== windowNumber,
                    ),
                    ...(updatedItem
                        ? [
                              {
                                  ...updatedItem,
                                  ticketNumber: ticket.ticketNumber,
                              },
                          ]
                        : []),
                    ...prev.filter(
                        (item) =>
                            item.windowNumber !== windowNumber &&
                            item.ticketNumber !== ticket.ticketNumber,
                    ),
                ];

                return newArray;
            });
        });

        return () => {
            socket.off('ticket-added');
            socket.off('ticket-in-progress');
        };
    }, []);

    useEffect(() => {
        getAllWaitingQueues();
    }, []);

    const getAllWaitingQueues = async () => {
        try {
            const response = await instance.get(`queues/${departmentIdAuth}`);

            if (!response.data) {
                setSnackbarMessage(
                    'Не могу загрузить данные. Попробуйте обновить страницу.',
                );
                setSnackbarSeverity('error');
                setOpenSnackbar(true);
            } else {
                const ticketNumbersTs = response.data.tsTickets.map(
                    (ticket: QueueResponse) => ticket.ticketNumber,
                );
                const ticketNumbersVs = response.data.vsTickets.map(
                    (ticket: QueueResponse) => ticket.ticketNumber,
                );
                setTicketsTs(ticketNumbersTs);
                setTicketsVs(ticketNumbersVs);
                setInProgressTickets(response.data.inProgressTickets);
            }
        } catch (error) {
            setTicketsTs([]);
            setTicketsVs([]);
            setSnackbarMessage('Ошибка при загрузке данных');
            setSnackbarSeverity('error');
            setOpenSnackbar(true);
        }
    };

    const handleAddQueue = (ticketType: 'TS' | 'VS') => {
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
                        justifyContent: 'center',
                        alignItems: 'center',
                        flexDirection: 'column',
                    }}
                >
                    <QueueCards items={ticketsVs} ticketType="ВС" />
                </Box>
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}
                >
                    <InProgressQueue items={inProgressTickets} />
                </Box>
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        flexDirection: 'column',
                    }}
                >
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

export default SpectatorPage;
