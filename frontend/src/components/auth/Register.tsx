import React, { useState } from 'react';
import axios from 'axios';
import { MdEmail } from "react-icons/md";
import { FaLock, FaUser, FaPhone } from "react-icons/fa";
import { Link, useNavigate } from 'react-router-dom';
import { validateUsername, validateEmail, validatePassword } from './Validation';
import Form from './Form';
import '../style/auth.css'; 
import { toast } from 'react-toastify';



const Register: React.FC = () => {
    const navigate = useNavigate();
    
    // State hooks for input fields
    const [username, setUsername] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [phoneNumber, setPhone] = useState<string>('');

    // State hooks for error messages
    const [usernameError, setUsernameError] = useState<string>('');
    const [emailError, setEmailError] = useState<string>('');
    const [passwordError, setPasswordError] = useState<string>('');
    const [phoneError, setPhoneError] = useState<string>('');

    // Handle form submission
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        let valid = true;

        // Validate username
        if (!validateUsername(username)) {
            setUsernameError('Veuillez entrer un nom d\'utilisateur valide.');
            valid = false;
        } else {
            setUsernameError('');
        }

        // Validate phone number
        if (!validatePhoneNumber(phoneNumber)) {
            setPhoneError('Veuillez entrer un numéro de téléphone valide.');
            valid = false;
        } else {
            setPhoneError('');
        }

        // Validate email
        if (!validateEmail(email)) {
            setEmailError('Veuillez entrer un email valide.');
            valid = false;
        } else {
            setEmailError('');
        }

        // Validate password
        if (!validatePassword(password)) {
            setPasswordError('Le mot de passe doit comporter au moins 6 caractères.');
            valid = false;
        } else {
            setPasswordError('');
        }

        // If all fields are valid, proceed to API call
        if (valid) {
            try {
                const response = await axios.post('http://localhost:3000/api/auth/register', {
                    username,
                    email,
                    password,
                    phoneNumber,
                });

                // Handle successful registration
                toast.success(response.data.message || 'Inscription réussie!');
                setUsername('');
                setEmail('');
                setPassword('');
                setPhone('');

                // Navigate to login page after successful registration
                navigate('/login');
            } catch (error: any) {
                if (error.response && error.response.data) {
                    // Handle error response from server
                    toast.error(error.response.data.message || 'Une erreur s\'est produite.');
                } else {
                    // Handle network or other errors
                    toast.error('Erreur de connexion au serveur.');
                }
            }
        }
    };

    // Define form input fields
    const inputs = [
        {
            type: "text",
            placeholder: "Username",
            value: username,
            onChange: (e: React.ChangeEvent<HTMLInputElement>) => setUsername(e.target.value),
            icon: <FaUser className='icon' />,
            errorMessage: usernameError 
        },
        {
            type: "email",
            placeholder: "Email",
            value: email,
            onChange: (e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value),
            icon: <MdEmail className='icon' />,
            errorMessage: emailError
        },
        {
            type: "password",
            placeholder: "Password",
            value: password,
            onChange: (e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value),
            icon: <FaLock className='icon' />,
            errorMessage: passwordError
        }
      
    ];

    return (
        <div className="wrapper register-page">
            <div className="form-box register">
                <Form onSubmit={handleSubmit} inputs={inputs} title="Register" />
                <div className="register-link">
                    <p>
                        Already have an account? <Link to="/login">Login</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Register;
