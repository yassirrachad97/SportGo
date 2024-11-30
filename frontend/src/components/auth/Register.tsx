import React, { useState } from 'react';
import axios from 'axios';
import { MdEmail } from "react-icons/md";
import { FaLock, FaUser} from "react-icons/fa";
import { Link, useNavigate } from 'react-router-dom';
import { validateUsername, validateEmail, validatePassword } from './Validation';
import Form from './Form';
import '../style/auth.css'; 
import { toast } from 'react-toastify';



const Register: React.FC = () => {
    const navigate = useNavigate();
    
 
    const [username, setUsername] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [loading, setLoading] = useState(false);
   

   
    const [usernameError, setUsernameError] = useState<string>('');
    const [emailError, setEmailError] = useState<string>('');
    const [passwordError, setPasswordError] = useState<string>('');
   

  
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        let valid = true;

       
        if (!validateUsername(username)) {
            setUsernameError('Veuillez entrer un nom d\'utilisateur valide.');
            valid = false;
        } else {
            setUsernameError('');
        }

      

    
        if (!validateEmail(email)) {
            setEmailError('Veuillez entrer un email valide.');
            valid = false;
        } else {
            setEmailError('');
        }

        if (!validatePassword(password)) {
          
            if (password.length < 8) {
                setPasswordError('Le mot de passe doit comporter au moins 8 caractères.');
            } else {
                
                setPasswordError('Le mot de passe doit contenir au moins un chiffre, une majuscule et une minuscule.');
            }
            valid = false;
        } else {
            setPasswordError('');
        }

        
        if (valid) {
            try {
                const response = await axios.post('http://localhost:3000/api/auth/signup', {
                    username,
                    email,
                    password,
                   
                });

          
                toast.success(response.data.message || 'Inscription réussie!');
                setUsername('');
                setEmail('');
                setPassword('');
                navigate('/login');

             
          
            } catch (error: any) {
                
                if (axios.isAxiosError(error)) {
                    
                    const errorMessage = error.response?.data?.message || 'Une erreur s\'est produite.';
                    toast.error(errorMessage);
                } else {
                    toast.error('Erreur inconnue.');
                }
            }
        }
        setLoading(false);
     
    };

  
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
        <div className="auth-background">
        <div className="wrapper register-page">
            <div className="form-box register">
                <Form onSubmit={handleSubmit} inputs={inputs} title="Register" loading={loading}/>
                
                <div className="register-link">
                    <p>
                        Already have an account? <Link to="/login">Login</Link>
                    </p>
                </div>
            </div>
        </div>
        </div>
    );
};

export default Register;
