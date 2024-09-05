import { Outlet } from 'react-router-dom';
import Menu from '@modules/Menu/menu-ui';

const LayoutPage = () => {
    return (
        <>
            <Menu />
            <Outlet />;
        </>
    );
};

export default LayoutPage;
