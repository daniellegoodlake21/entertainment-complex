import useToken from './useToken.js';
import { Outlet } from 'react-router-dom';
const UserWrapper = () =>
{
    const { token , setToken } = useToken();
    if (token == undefined)
    {
        return null;
    }
    return <Outlet/>;
}
export default UserWrapper;