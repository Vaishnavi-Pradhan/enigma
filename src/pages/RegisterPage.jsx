//new bcrypt
import { useState, useRef } from 'react';
import { supabase } from '../services/supabase';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import Webcam from 'react-webcam';
import axios from 'axios';
import bcrypt from 'bcryptjs';

const RegisterContainer = styled.div`
  background: ${({ theme }) => theme.cardBg};
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 8px 20px ${({ theme }) => theme.shadow};
  width: 400px;
  max-width: 90%;
  margin: 2rem auto;
  border: 1px solid ${({ theme }) => theme.border};
`;

const RegisterTitle = styled.h2`
  text-align: center;
  margin-bottom: 1.5rem;
  color: ${({ theme }) => theme.primary};
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    bottom: -10px;
    left: 50%;
    transform: translateX(-50%);
    width: 50px;
    height: 3px;
    background: ${({ theme }) => theme.primary};
  }
`;

const FormGroup = styled.div`
  margin-bottom: 1.2rem;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.8rem 1rem;
  border: 2px solid ${({ theme }) => theme.inputBorder};
  border-radius: 8px;
  background: ${({ theme }) => theme.inputBg};
  color: ${({ theme }) => theme.text};
  font-size: 1rem;
  transition: all 0.3s ease;
  
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.primary};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.focusShadow};
  }
`;

const SubmitButton = styled.button`
  width: 100%;
  padding: 0.8rem;
  background: blue;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  margin-top: 1rem;
  transition: all 0.3s ease;
  
  &:hover {
    background: ${({ theme }) => theme.primaryDark};
    transform: translateY(-2px);
  }
  
  &:active {
    transform: translateY(0);
  }
  
  &:disabled {
    background: ${({ theme }) => theme.disabled};
    cursor: not-allowed;
  }
`;

const AuthLink = styled.p`
  text-align: center;
  margin-top: 1.5rem;
  color: ${({ theme }) => theme.textSecondary};
  
  a {
    color: ${({ theme }) => theme.primary};
    text-decoration: none;
    font-weight: 500;
    
    &:hover {
      text-decoration: underline;
    }
  }
`;

const Register = () => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const webcamRef = useRef(null);

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Capture image from webcam
      const imageSrc = webcamRef.current.getScreenshot();
      if (!imageSrc) throw new Error('Failed to capture image');

      // Convert base64 to blob
      const blob = await fetch(imageSrc).then(res => res.blob());
      const formData = new FormData();
      formData.append("image", blob, "face.jpg");

      // Send data to backend to process face embedding
      const response = await axios.post("http://127.0.0.1:5000/register", formData);
      if (response.data.error) throw new Error(response.data.error);

      const embedding = response.data.embedding; // Receive embedding from backend

      // Hash the password using bcryptjs
      const salt = bcrypt.genSaltSync(10);
      const hashedPassword = bcrypt.hashSync(password, salt);

      // Save user details and embedding in Supabase
      const { error: supabaseError } = await supabase.from("users").insert({
        username: email,
        name: name,
        password: hashedPassword,
        embedding: embedding
      });
      if (supabaseError) throw new Error(supabaseError.message);

      alert('Registration successful! Please check your email for verification.');
      navigate('/login');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <RegisterContainer>
      <RegisterTitle>Create Account</RegisterTitle>
      {error && <div style={{ color: 'red', marginBottom: '1rem' }}>{error}</div>}
      <form onSubmit={handleRegister}>
        <FormGroup>
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            required
          />
        </FormGroup>
        <FormGroup>
          <Input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Name"
            required
          />
        </FormGroup>
        <FormGroup>
          <Input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            required
            minLength="4"
          />
        </FormGroup>
        {/* Webcam Preview */}
        <FormGroup>
          <Webcam ref={webcamRef} screenshotFormat="image/jpeg" width={330} height={300} />
        </FormGroup>
        <SubmitButton type="submit" disabled={loading}>
          {loading ? 'Registering...' : 'Register'}
        </SubmitButton>
      </form>
      <AuthLink>
        Already have an account? <a href="/login">Login here</a>
      </AuthLink>
    </RegisterContainer>
  );
};

export default Register;
