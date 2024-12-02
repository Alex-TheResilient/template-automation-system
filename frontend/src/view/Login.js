// frontend/src/Login.js
import React, { useState } from 'react';
import axios from 'axios';
import '../styles/styles.css';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            console.log("Attempting login with:", { username, password }); // Log de depuración
            const response = await axios.post("http://localhost:5000/api/auth/login", {
                username,
                password,
            });
            console.log("Login successful, token received:", response.data.token);
            localStorage.setItem("token", response.data.token);
            navigate("/menuOrganizaciones");
        } catch (err) {
            console.error("Login error:", err);
            setError(err.response ? err.response.data.message : "Login failed");
        }
    };
    

    return (
        <div className="l-container">
            <span className="title">ReqWizards App</span>
            <form onSubmit={handleLogin}>
                <span className="User">Usuario</span>
                <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
                <span className="contraseña">Contraseña</span>
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <button type="submit">Login</button>
            </form>
            {error && <p>{error}</p>}
            <p>¿Olvidaste tu contraseña?</p>
        </div>
    );
};

export default Login;
