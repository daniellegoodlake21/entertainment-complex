import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Home from "./views/Home.js";
import Layout from "./views/Layout.js";
import Logout from "./views/Logout.js";
import MyAccount from "./views/MyAccount.js";
import Login from "./views/Login.js";
import Checkout from "./views/Checkout.js";
import Register from "./views/Register.js";
import Basket from "./views/Basket.js";
import IceSkating from "./views/IceSkating.js";
import Bowling from "./views/Bowling.js";
import Theatre from "./views/Theatre.js";
import Cinema from "./views/Cinema.js";
import NoPage from "./views/NoPage.js";
import GuestLayout from "./views/GuestLayout.js";
import useToken from "./components/useToken.js";
function App()
{
  const {token, setToken} = useToken();
  if (!token)
  {
    return (
        <BrowserRouter>
          <Routes>
              <Route element={<GuestLayout/>}>
                <Route path="login" element={<Login setToken={setToken}/>}/>
                <Route path="register" element={<Register setToken={setToken}/>}/>

                <Route index element={<Home/>}/>
                <Route path="ice-skating" element={<IceSkating/>}/>
                <Route path="bowling" element={<Bowling/>}/>
                <Route path="theatre" element={<Theatre/>}/>
                <Route path="cinema" element={<Cinema/>}/>
              </Route>
            </Routes>
          </BrowserRouter>
          );
    }
    else
    {
      return (
        
          <BrowserRouter>
            <Routes>
              <Route element={<Layout/>}>
                <Route path="/basket" element={<Basket />} />
                <Route path="/my-account" element={<MyAccount />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route index element={<Home/>}/>
                <Route path="logout" element={<Logout setToken={setToken}/>}/>
                <Route path="ice-skating" element={<IceSkating/>}/>
                <Route path="bowling" element={<Bowling/>}/>
                <Route path="theatre" element={<Theatre/>}/>
                <Route path="cinema" element={<Cinema/>}/>
              </Route>
          </Routes>
        </BrowserRouter>
      )
    }
}
export default App;