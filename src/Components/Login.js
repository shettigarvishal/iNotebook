import React,{useState} from 'react'
import Alert from './Alert';
import {useNavigate} from 'react-router-dom';

const Login = () => {

    const [cridential, setCridential] = useState({email:"",passowrd:""});
    let history=useNavigate();

    const handlesubmit=async (e)=>{
        e.preventDefault();

const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
      },
      body: JSON.stringify({ email:cridential.email,password:cridential.password }),
      });
    
    const json=await response.json();
    console.log(json);
    if(json.success){
        //save auth token and redirect
        localStorage.setItem('token',json.authtoken);
        history("/")
    }
    else
    {
        <Alert>Invalid Password or email</Alert>
    }
    console.log("success")
    }
  const onchange = (e) => {
   // console.log("updating");
    setCridential({ ...cridential, [e.target.name]: e.target.value });
  }


  return (
    <div>
      <form onSubmit={handlesubmit}>
  <div className="mb-3">
    <label htmlFor="email" className="form-label">Email address</label>
    <input type="email" className="form-control" id="email" value={cridential.email} onChange={onchange} name="email" aria-describedby="emailHelp"/>
    <div id="emailHelp" className="form-text">We'll never share your email with anyone else.</div>
  </div>
  <div className="mb-3">
    <label htmlFor="password" className="form-label">Password</label>
    <input type="password" className="form-control" value={cridential.password} onChange={onchange} id="password" name="password"/>
  </div>
  <div className="mb-3 form-check">
    <input type="checkbox" className="form-check-input" id="exampleCheck1"/>
    <label className="form-check-label" htmlFor="exampleCheck1">Check me out</label>
  </div>
  <button type="submit" className="btn btn-primary" >Submit</button>
</form>
    </div>
  )
}

export default Login;
