import { jwtDecode } from 'jwt-decode';

export type UserRoles = 'specialist' | 'spectator' | 'operator' | 'admin';

interface UserInfoPayload {
    UserInfo: {
        user: string;
        username: string;
        role: UserRoles;
        ticketsType: 'TS' | 'VS';
    };
    DepartmentInfo: {
        departmentId: string;
        name: string;
    };
    SessionInfo: { sessionId: string; windowNumber: number };
}

const useAuth = () => {
    const token = localStorage.getItem('token');
    let username = '';
    let roleName: string = '';
    let userId = '';
    let departmentId = '';
    let departmentName = '';
    let sessionId = '';
    let ticketsType = '';
    let windowNumber = 0;

    try {
        if (token) {
            const decoded = jwtDecode<UserInfoPayload>(token);

            const {
                user: decodedUserId,
                username: decodedUsername,
                role: decodedRoles,
                ticketsType: decodedTicketsType,
            } = decoded.UserInfo;

            const {
                departmentId: decodedDepartmentId,
                name: decodedDepartmentName,
            } = decoded.DepartmentInfo;

            const {
                sessionId: decodedSessionId,
                windowNumber: decodedWindowNumber,
            } = decoded.SessionInfo;

            userId = decodedUserId;
            username = decodedUsername;
            roleName = decodedRoles;
            departmentId = decodedDepartmentId;
            departmentName = decodedDepartmentName;
            sessionId = decodedSessionId;
            ticketsType = decodedTicketsType;
            windowNumber = decodedWindowNumber;
        }
    } catch (error) {
        console.error('Error decoding token:', error);
        localStorage.removeItem('token');
    }

    return {
        username,
        roleName,
        departmentName,
        departmentId,
        userId,
        sessionId,
        ticketsType,
        windowNumber,
    };
};

export default useAuth;
