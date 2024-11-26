import React, { useState } from 'react';
import axios from 'axios';
import { MdEmail } from 'react-icons/md';
import { FaLock } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { validateEmail, validatePassword } from './Validation';
import Form from './Form';
import '../style/auth.css';
import { toast } from 'react-toastify';



const Login: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [emailError, setEmailError] = useState<string>('');
  const [passwordError, setPasswordError] = useState<string>('');
  const [token, setToken] = useState<string | null>(null); 


  const handleBlur = (type: 'email' | 'password') => {
    if (type === 'email') {
      if (!validateEmail(email)) {
        setEmailError('Veuillez entrer un email valide.');
      } else {
        setEmailError('');
      }
    } else if (type === 'password') {
      if (!validatePassword(password)) {
        setPasswordError('Le mot de passe doit comporter au moins 6 caractères.');
      } else {
        setPasswordError('');
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    let valid = true;

    if (!validateEmail(email)) {
      setEmailError('Veuillez entrer un email valide.');
      valid = false;
    } else {
      setEmailError('');
    }

    if (!validatePassword(password)) {
      setPasswordError('Le mot de passe doit comporter au moins 6 caractères.');
      valid = false;
    } else {
      setPasswordError('');
    }

    if (valid) {
      try {
        const response = await axios.post('http://localhost:3000/api/auth/login', {
          email,
          password,
        });

        const data = response.data;

      
        if (data.token) {
          setToken(data.token); 
          toast.success('Connexion réussie!');
        } else {
          toast.error('Token manquant dans la réponse.');
        }
      } catch (error: any) {
        if (error.response && error.response.data) {
          toast.error(error.response.data.message || 'Erreur lors de la connexion.');
        } else {
          toast.error('Une erreur est survenue, veuillez réessayer plus tard.');
        }
      }
    }
  };

  const inputs = [
    {
      type: 'email',
      placeholder: 'Email',
      value: email,
      onChange: (e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value),
      onBlur: () => handleBlur('email'),
      icon: <MdEmail className="icon" />,
      errorMessage: emailError,
    },
    {
      type: 'password',
      placeholder: 'Password',
      value: password,
      onChange: (e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value),
      onBlur: () => handleBlur('password'),
      icon: <FaLock className="icon" />,
      errorMessage: passwordError,
    },
  ];

  return (
    <div className="wrapper login-page">
      <div className="form-box login">
        <Form onSubmit={handleSubmit} inputs={inputs} title="Login">
          {/* No additional children */}
        </Form>

        <div className="register-link">
          <p>
            Don't have an account? <Link to="/register">Register</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
