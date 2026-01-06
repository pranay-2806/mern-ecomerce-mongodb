import { useState } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"

const Register=()=>{
    const [username,setUsername]=useState("")
    const [email,setEmail]=useState("")
    const [password,setPassword]=useState("")
    const navigate=useNavigate()

    const handleRegister=async()=>{
        //alert("Registed!\n"+"username:"+ username+"\n"+"Email:"+email)
        if(!username || !email || !password){
            alert("All fields are required!")
            return
        }
        try{
            const response=await axios.post("https://pranay-mern-ecomerce-mongodb.onrender.com/api/auth/register",
                {username,email,password})

            console.log("Registration successful",response.data)
            alert("Registration successful")

            navigate("/")
        }catch(err){
            console.error("Registration failed",err)

            alert(err.response?.data?.err || "Registration Failed")
        }
    }

    return(
        <>
            <div className="main">
                <fieldset className="box"> 
                    <legend>Register</legend>
                    <label>Username</label>
                    <input className="input"
                            value={username}
                            onChange={(e)=>setUsername(e.target.value)}></input>
                    <label>Email</label>
                    <input className="input"
                            value={email}
                            onChange={(e)=>setEmail(e.target.value)}></input>
                    <label>Password</label>
                    <input className="input"
                            type="password"
                            value={password}
                            onChange={(e)=>setPassword(e.target.value)}></input>
                    <br></br><br></br>
                    <button className="button" onClick={handleRegister}>Create Account</button>
                    <p className="link" onClick={()=>navigate("/")}>Back to Login</p>
                </fieldset>
            </div>
        </>
    )

}
export default Register