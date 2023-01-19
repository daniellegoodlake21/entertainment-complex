import { useLocation, Outlet, Navigate } from 'react-router-dom';
import useToken from './useToken.js';
const GuestWrapper = () =>
{
    const { token , setToken } = useToken();
    alert(token);
    if (token != undefined)
    {
        return null;
    }
    return <Outlet/>;
}
export default GuestWrapper;