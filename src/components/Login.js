import { useState } from 'react';
import axios from 'axios';

function Login() {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // call API untuk Login
      const res = await axios.post(
        "http://localhost:3000/auth/token", 
        {
          email, 
          password
        }
      )

      // simpan Token ke local storeage
      localStorage.setItem("user", JSON.stringify(res.data.data))
      window.location.href = "/";
      
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div className="container mt-5">
      <form onSubmit={handleSubmit}>
        <h3>Login</h3>

        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            className="form-control"
            placeholder="Enter email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>Password</label>
          <input
            type="password"
            className="form-control"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button type="submit" className="mt-1 btn btn-primary btn-block">
          Submit
        </button>
      </form>
    </div>
  );
}

export default Login;
