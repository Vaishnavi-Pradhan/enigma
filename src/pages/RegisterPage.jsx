import { useState } from 'react';
import { supabase } from '../services/supabase';
import MainLayout from '../components/layout/MainLayout';
import styled from 'styled-components';

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
`;

const RegisterBox = styled.div`
  background: ${({ theme }) => theme.cardBg};
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 10px ${({ theme }) => theme.shadow};
  width: 320px;
  max-width: 90%;
  text-align: center;
`;

const Title = styled.h2`
  margin-bottom: 1.5rem;
  color: ${({ theme }) => theme.primary};
`;

const FormGroup = styled.div`
  margin-bottom: 1rem;
  text-align: left;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.8rem;
  border: 1px solid ${({ theme }) => theme.inputBorder};
  border-radius: 4px;
  background: ${({ theme }) => theme.inputBg};
  color: ${({ theme }) => theme.text};
`;

const Button = styled.button`
  width: 100%;
  padding: 0.8rem;
  background: #0000ff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background: ${({ theme }) => theme.primaryDark};
  }
`;

const LoginLink = styled.p`
  margin-top: 1rem;
  font-size: 0.9rem;
  color: ${({ theme }) => theme.textSecondary};

  a {
    color: ${({ theme }) => theme.primary};
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }
  }
`;

const RegisterPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Check if username exists
      const { data: existingUser } = await supabase
        .from('login')
        .select('*')
        .eq('username', username)
        .single();

      if (existingUser) {
        alert('Username already exists');
        return;
      }

      // Register user
      const { error } = await supabase
        .from('login')
        .insert([{ username, password }]);

      if (error) throw error;

      alert('Registration successful! Redirecting to login...');
      window.location.href = '/login';
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainLayout>
      <Container>
        <RegisterBox>
          <Title>Register</Title>
          <form onSubmit={handleRegister}>
            <FormGroup>
              <label htmlFor="username">Username</label>
              <Input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </FormGroup>
            <FormGroup>
              <label htmlFor="password">Password</label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </FormGroup>
            <Button type="submit" disabled={loading}>
              {loading ? 'Registering...' : 'Register'}
            </Button>
          </form>
          <LoginLink>
            Already have an account? <a href="/login">Login here</a>
          </LoginLink>
        </RegisterBox>
      </Container>
    </MainLayout>
  );
};

export default RegisterPage;