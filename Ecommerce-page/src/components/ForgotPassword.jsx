import { useState } from "react"
import { useNavigate } from "react-router-dom"

const ForgotPassword=()=>{
    const navigate=useNavigate()
    const [email,setEmail]=useState("")

    const handleSubmit=()=>{
        e.preventDefault()
        alert(`Reset link sent to: ${email}`)
    }

    return(
        <>
            <div className="main">
                <fieldset className="box">
                    <legend>Forgot Password</legend>
                    <form onSubmit={handleSubmit} className="form">
                        <label>Email</label>
                        <input type="email" required 
                               className="input"
                               value={email}
                               placeholder="enter the registed email"
                               onChange={(e)=>setEmail(e.target.value)}></input>
                            <br></br><br></br>
                        <button type="submit" className="button">Send Reset Link</button>
                    </form>
                    <div className="links">
                        <p className="link" onClick={()=>navigate("/")}>Back to Login</p>
                    </div>
                </fieldset>
            </div>

        </>
    )
}
export default ForgotPassword