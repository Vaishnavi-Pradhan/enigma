// import { useState } from 'react';
// import { supabase } from '../services/supabase';
// import MainLayout from '../components/layout/MainLayout';
// import styled from 'styled-components';

// const Container = styled.div`
//   display: flex;
//   justify-content: center;
//   align-items: center;
//   height: 100vh;
// `;

// const RegisterBox = styled.div`
//   background: ${({ theme }) => theme.cardBg};
//   padding: 2rem;
//   border-radius: 8px;
//   box-shadow: 0 2px 10px ${({ theme }) => theme.shadow};
//   width: 320px;
//   max-width: 90%;
//   text-align: center;
// `;

// const Title = styled.h2`
//   margin-bottom: 1.5rem;
//   color: ${({ theme }) => theme.primary};
// `;

// const FormGroup = styled.div`
//   margin-bottom: 1rem;
//   text-align: left;
// `;

// const Input = styled.input`
//   width: 100%;
//   padding: 0.8rem;
//   border: 1px solid ${({ theme }) => theme.inputBorder};
//   border-radius: 4px;
//   background: ${({ theme }) => theme.inputBg};
//   color: ${({ theme }) => theme.text};
// `;

// const Button = styled.button`
//   width: 100%;
//   padding: 0.8rem;
//   background: #0000ff;
//   color: white;
//   border: none;
//   border-radius: 4px;
//   cursor: pointer;
//   transition: background-color 0.3s ease;

//   &:hover {
//     background: ${({ theme }) => theme.primaryDark};
//   }
// `;

// const LoginLink = styled.p`
//   margin-top: 1rem;
//   font-size: 0.9rem;
//   color: ${({ theme }) => theme.textSecondary};

//   a {
//     color: ${({ theme }) => theme.primary};
//     text-decoration: none;

//     &:hover {
//       text-decoration: underline;
//     }
//   }
// `;

// const RegisterPage = () => {
//   const [username, setUsername] = useState('');
//   const [password, setPassword] = useState('');
//   const [loading, setLoading] = useState(false);

//   const handleRegister = async (e) => {
//     e.preventDefault();
//     setLoading(true);

//     try {
//       // Check if username exists
//       const { data: existingUser } = await supabase
//         .from('login')
//         .select('*')
//         .eq('username', username)
//         .single();

//       if (existingUser) {
//         alert('Username already exists');
//         return;
//       }

//       // Register user
//       const { error } = await supabase
//         .from('login')
//         .insert([{ username, password }]);

//       if (error) throw error;

//       alert('Registration successful! Redirecting to login...');
//       window.location.href = '/login';
//     } catch (error) {
//       alert(error.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <MainLayout>
//       <Container>
//         <RegisterBox>
//           <Title>Register</Title>
//           <form onSubmit={handleRegister}>
//             <FormGroup>
//               <label htmlFor="username">Username</label>
//               <Input
//                 id="username"
//                 type="text"
//                 value={username}
//                 onChange={(e) => setUsername(e.target.value)}
//                 required
//               />
//             </FormGroup>
//             <FormGroup>
//               <label htmlFor="password">Password</label>
//               <Input
//                 id="password"
//                 type="password"
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//                 required
//               />
//             </FormGroup>
//             <Button type="submit" disabled={loading}>
//               {loading ? 'Registering...' : 'Register'}
//             </Button>
//           </form>
//           <LoginLink>
//             Already have an account? <a href="/login">Login here</a>
//           </LoginLink>
//         </RegisterBox>
//       </Container>
//     </MainLayout>
//   );
// };

// export default RegisterPage;










//new for face embeddings
import { useState, useRef } from 'react';
import { supabase } from '../services/supabase';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import Webcam from 'react-webcam';
import axios from 'axios';

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
  background: ${({ theme }) => theme.primary};
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
      formData.append("email", email);
      formData.append("password", password);

      // Send data to backend to process face embedding
      const response = await axios.post("http://127.0.0.1:5000/register", formData);
      if (response.data.error) throw new Error(response.data.error);

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
            //type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
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
          <Webcam ref={webcamRef} screenshotFormat="image/jpeg" />
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
