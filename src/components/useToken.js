import { useState } from "react";

const useToken = () => 
{
    const getToken = () => 
    {
        const token = localStorage.getItem("token");
        return token;
    };

    const [token, setToken] = useState(getToken());

    const saveToken = userToken =>
    {
        localStorage.setItem("token", userToken);
        setToken(userToken);
    };

    return {
        setToken: saveToken,
        token
    }
}
export default useToken;