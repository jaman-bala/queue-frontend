export interface QueueResponse {
    _id: string;
    ticketNumber: string;
    type: 'TS' | 'VS';
    status: 'waiting' | 'in-progress' | 'completed';
    createdAt: string;
    department: string;
}
