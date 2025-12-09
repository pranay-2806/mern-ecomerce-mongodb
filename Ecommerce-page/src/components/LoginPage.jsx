import "./loginPage.css"
import { useState } from "react"
import {useNavigate} from "react-router-dom"
import axios from "axios"


const LoginPage=()=>{
    const navigate=useNavigate()
    const [username,setUsername]=useState("")
    const [password,setPassword]=useState("")


    const handleLogin=async(e)=>{
        e.preventDefault()
        alert("Login clicked:\n"+username)
    

    if(!username || !password){ 
        alert("Please enter username and password");
      return;
    }
    try{
        const response=await axios.post("http://localhost:5000/api/auth/login",{
            username,password
        })
        console.log("login success",response.data)

        const token=response.data.token
        if(!token){
            alert("No token is recieved from server")
            return
        }
        localStorage.setItem("token",token)

        alert("login successful")
        navigate("/dashboard")
    }catch(err){
        console.error("Login error:",err)

        alert(err.response?.data?.error || "Invalid Credentials");
    }
}
return(
    <>
    <div className="main">
        <fieldset className="box">
        <legend>LOGIN</legend>
        <div>
            <label>Username: </label>
        <input className="input" type="text" 
               value={username} 
               onChange={(e)=>setUsername(e.target.value)}
               placeholder="enter the username"></input>
        </div>
        <br></br>
        <div>
            <label>Password: </label>
        <input className="input" type="password" 
               value={password}
               onChange={(e)=>setPassword(e.target.value)} 
               placeholder="enter the password"></input>
        </div>
        <br></br><br></br>
        <button className="button" onClick={handleLogin}>Login</button>
        <br></br><br></br>
        <p className="link" onClick={()=>navigate("/register")}>Register</p>
        <p className="link" onClick={()=>navigate("/forgot")}>Forgot password</p>
        </fieldset>
    </div>
    </>

)
}
export default LoginPage