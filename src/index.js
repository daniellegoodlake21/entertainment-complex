import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./views/Home";
import Layout from "./views/Layout";
import MyAccount from "./views/MyAccount";
import Login from "./views/Login";
import Checkout from "./views/Checkout";
import Register from "./views/Register";
import Basket from "./views/Basket";
import IceSkating from "./views/IceSkating";
import Bowling from "./views/Bowling";
import Theatre from "./views/Theatre";
import Cinema from "./views/Cinema";
import NoPage from "./views/NoPage";

export default function App() {
    return (
        <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="my-account" element={<MyAccount />} />
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register/>}/>
            <Route path="basket" element={<Basket/>}/>
            <Route path="checkout" element={<Checkout/>}/>
            <Route path="ice-skating" element={<IceSkating/>}/>
            <Route path="bowling" element={<Bowling/>}/>
            <Route path="theatre" element={<Theatre/>}/>
            <Route path="cinema" element={<Cinema/>}/>
            <Route path="*" element={<NoPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    );
};
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);

