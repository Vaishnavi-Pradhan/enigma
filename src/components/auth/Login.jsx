import styled, { keyframes } from 'styled-components';
import { useState, useContext } from 'react';
import { ThemeContext } from '../../context/ThemeContext';
import { supabase } from '../../services/supabase';

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const pulse = keyframes`
  0% { box-shadow: 0 0 0 0 rgba(76, 175, 80, 0.4); }
  70% { box-shadow: 0 0 0 10px rgba(76, 175, 80, 0); }
  100% { box-shadow: 0 0 0 0 rgba(76, 175, 80, 0); }
`;

const LoginContainer = styled.div`
  background: ${({ theme }) => theme.cardBg};
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 8px 20px ${({ theme }) => theme.shadow};
  width: 400px;
  max-width: 90%;
  margin: 2rem auto;
  animation: ${fadeIn} 0.6s ease-out;
  border: 1px solid ${({ theme }) => theme.border};
`;

const LoginTitle = styled.h2`
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
  background: #0000ff;
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
  
  ${({ $loading }) => $loading && `
    animation: ${pulse} 1.5s infinite;
  `}
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

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { theme } = useContext(ThemeContext);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
  
    try {
      // Check if the user exists in the 'login' table
      const { data, error: queryError } = await supabase
        .from('users')                                             //changed login table to users table 
        .select('*')
        .eq('username', email) // Assuming you are using 'email' as username
        .eq('password', password);
  
      if (queryError) throw queryError;
  
      if (data && data.length > 0) {
  
        window.location.href = '/exam';
      } else {
        // User not found in the 'login' table
        alert('Invalid email or password.');
      }
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <LoginContainer theme={theme}>
      <LoginTitle theme={theme}>Login</LoginTitle>
      <form onSubmit={handleLogin}>
        <FormGroup>
          <Input
            // type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            required
            theme={theme}
          />
        </FormGroup>
        <FormGroup>
          <Input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            required
            theme={theme}
          />
        </FormGroup>
        <SubmitButton 
          type="submit" 
          disabled={loading}
          $loading={loading}
          theme={theme}
        >
          {loading ? 'Logging in...' : 'Login'}
        </SubmitButton>
      </form>
      <AuthLink theme={theme}>
        Don't have an account? <a href="/register">Register</a>
      </AuthLink>
    </LoginContainer>
  );
};

export default LoginForm;