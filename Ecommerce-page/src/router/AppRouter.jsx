import { BrowserRouter,Route, Routes } from "react-router-dom";
import LoginPage from "../components/LoginPage";
import Register from "../components/Register";
import ForgotPassword from "../components/ForgotPassword";
import Dashboard from "../components/Dashboard";
import CartPage from "../components/Cart";
import Checkout from "../components/Checkout";

const AppRouter=()=>{
    return(
        <>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<LoginPage></LoginPage>}></Route>
                    <Route path="/dashboard" element={<Dashboard></Dashboard>}></Route>
                    <Route path="/cart" element={<CartPage></CartPage>}></Route>
                    <Route path="/register" element={<Register></Register>}></Route>
                    <Route path="/forgot" element={<ForgotPassword></ForgotPassword>}></Route>
                    <Route path="/checkout" element={<Checkout></Checkout>}></Route>
                </Routes>
            </BrowserRouter>
        </>
    )
}
export default AppRouter