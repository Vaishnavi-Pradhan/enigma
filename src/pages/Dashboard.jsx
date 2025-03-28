//new
import React, { useState, useEffect, useContext } from 'react';
import { supabase } from '../services/supabase';
import styled from 'styled-components';
import ProfilePic from './profile.jpg';
import { useNavigate } from 'react-router-dom';
import { FaPlayCircle, FaUser, FaSignOutAlt, FaSun, FaMoon } from 'react-icons/fa';
import { ThemeContext } from '../context/ThemeContext';

const DashboardContainer = styled.div`
  background: ${({ theme }) => theme.cardBg};
  padding: 2.5rem;
  border-radius: 16px;
  box-shadow: 0 12px 30px ${({ theme }) => theme.shadow};
  width: 90%;
  max-width: 1200px;
  margin: 8rem auto;
  border: 1px solid ${({ theme }) => theme.border};
  position: relative;
  transition: all 0.3s ease-in-out;
  overflow: hidden;
`;

const ProfileSection = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 2.5rem;
  border-bottom: 1px solid ${({ theme }) => theme.border};
  padding-bottom: 1.5rem;
`;

const ProfilePhoto = styled.img`
  width: 110px;
  height: 110px;
  border-radius: 50%;
  margin-right: 1.8rem;
  object-fit: cover;
  border: 3px solid ${({ theme }) => theme.primary};
  transition: transform 0.3s ease;

  &:hover {
    transform: scale(1.05);
  }
`;

const ProfileInfo = styled.div`
  h2 {
    font-size: 2rem;
    color: ${({ theme }) => theme.primary};
    margin: 0;
    display: flex;
    align-items: center;
    svg {
      margin-right: 0.6rem;
      font-size: 1.5rem;
    }
  }
  
  h4 {
    color: ${({ theme }) => theme.textSecondary};
  }
`;

const TestCardsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2rem;
`;
const TestCard = styled.div`
  background: #ffffff; /* White background for cards */
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-height: 180px;
  position: relative; /* For pseudo-element positioning */

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  }

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(59, 130, 246, 0.1); /* Soft blue overlay */
    border-radius: 12px;
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  &:hover::before {
    opacity: 1;
  }

  h3 {
    font-size: 1.5rem;
    color:black;
    margin-bottom: 1rem;
    display: flex;
    align-items: center;
    svg {
      margin-right: 0.5rem;
      font-size: 1.5rem;
    }
  }

  button {
    background:green;
    color: white;
    border: none;
    padding: 0.8rem 1.2rem;
    border-radius: 8px;
    cursor: pointer;
    font-size: 1rem;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background 0.3s ease, transform 0.3s ease;

    svg {
      margin-left: 0.5rem;
      font-size: 1.2rem;
    }

    &:hover {
      background: #2563eb; /* Darker blue on hover */
      transform: scale(1.05);
    }
  }
`;



const LogoutButton = styled.button`
  position: absolute;
  top: 1rem;
  right: 1rem;
  background:blue; /* Red for logout */
  color: white;
  border: none;
  padding: 0.6rem 1rem;
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  transition: background 0.3s ease;

  svg {
    margin-right: 0.5rem;
    font-size: 1rem;
  }

  &:hover {
    background: #dc2626; /* Darker red on hover */
  }
`;

const ThemeToggleButton = styled.button`
  position: absolute;
  top: 1rem;
  right: 8rem;
  background: ${({ theme }) => theme.toggleBg};
  color: ${({ theme }) => theme.text}; /* Changed from toggleText to text */
  border: none;
  padding: 0.6rem 1rem;
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  transition: all 0.3s ease;

  svg {
    margin-right: 0.5rem;
    font-size: 1rem;
    color: ${({ theme }) => theme.text}; /* Ensure icon color matches text */
  }

  &:hover {
    background: ${({ theme }) => theme.toggleBgHover};
    transform: scale(1.05);
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1); /* Added subtle shadow on hover */
  }
`;

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const userId = sessionStorage.getItem('userId');
  const { theme, toggleTheme } = useContext(ThemeContext);

  useEffect(() => {
    const fetchUser = async () => {
      if (userId) {
        const { data, error } = await supabase
          .from('users')
          .select('*')
          .eq('id', userId)
          .single();

        if (data) {
          setUser({ username: data.username, name: data.name });
        } else {
          console.error('Error fetching user data:', error);
          navigate('/login');
        }
      } else {
        navigate('/login');
      }
    };

    fetchUser();
  }, [navigate, userId]);

  const handleTestClick = (testRoute) => {
    navigate(testRoute);
  };

  const handleLogout = () => {
    sessionStorage.removeItem('userId');
    navigate('/login');
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <DashboardContainer theme={theme}>
      <ThemeToggleButton onClick={toggleTheme} theme={theme}>
        {theme.mode === 'dark' ? <FaSun /> : <FaMoon />}
        {theme.mode === 'dark' ? 'Light Mode' : 'Dark Mode'}
      </ThemeToggleButton>
      
      
      <LogoutButton onClick={handleLogout} theme={theme}>
        <FaSignOutAlt /> Logout
      </LogoutButton>
      
      <ProfileSection>
        <ProfilePhoto src={ProfilePic} alt="Profile" theme={theme} />
        <ProfileInfo theme={theme}>
          <h2>Hello {user.name}</h2>
          <h4><FaUser /> Email: {user.username}</h4>
        </ProfileInfo>
      </ProfileSection>
      
      <TestCardsContainer>
        <TestCard onClick={() => handleTestClick('/StartExam')} theme={theme}>
          <h3><FaPlayCircle /> Test 1</h3>
          <button>Start Test <FaPlayCircle /></button>
        </TestCard>
        <TestCard onClick={() => handleTestClick('/StartExam')} theme={theme}>
          <h3><FaPlayCircle /> Test 2</h3>
          <button>Start Test <FaPlayCircle /></button>
        </TestCard>
        <TestCard onClick={() => handleTestClick('/StartExam')} theme={theme}>
          <h3><FaPlayCircle /> Test 3</h3>
          <button>Start Test <FaPlayCircle /></button>
        </TestCard>
      </TestCardsContainer>
    </DashboardContainer>
  );
};

export default Dashboard;