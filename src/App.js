import './App.css';

// Inisiasi Css Bootstrap
import "bootstrap/dist/css/bootstrap.min.css";

// Calll Component
import Login from './components/Login';
import { useEffect, useState } from 'react';
import Dashboard from './components/Dashboard';

function App() {

  const [user, setUser] = useState({});

  useEffect(() => {
    const storedToken = localStorage.getItem('user');
    if (storedToken) {
      setUser(JSON.parse(storedToken));
    } else {
      setUser(null);
    }
  }, []);

  return (
    <div>
      {
        user ? (
          <Dashboard user={user}/>
        ) : (
          <Login />
        )
      }
    </div>
  );
}

export default App;
