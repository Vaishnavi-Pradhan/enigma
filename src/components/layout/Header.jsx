import styled from 'styled-components';
import { useContext } from 'react';
import { ThemeContext } from '../../context/ThemeContext';

const HeaderContainer = styled.header`
  padding: 1.5rem;
  box-shadow: 0 2px 10px ${({ theme }) => theme.shadow};
  background: ${({ theme }) => theme.headerBg};
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: sticky;
  top: 0;
  z-index: 100;
`;

const Title = styled.h1`
  margin: 0;
  font-size: 1.5rem;
  background: linear-gradient(90deg, #4CAF50, #388E3C);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;

const ThemeButton = styled.button`
  background: ${({ theme }) => theme.buttonBg};
  color: ${({ theme }) => theme.buttonText};
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: bold;
  transition: all 0.3s ease;
  
  &:hover {
    transform: scale(1.05);
    box-shadow: 0 0 15px ${({ theme }) => theme.buttonHover};
  }
`;

const Header = () => {
  const { theme, toggleTheme } = useContext(ThemeContext);

  return (
    <HeaderContainer theme={theme}>
      <Title>ExamProctor</Title>
      <ThemeButton onClick={toggleTheme} theme={theme}>
        {theme === 'light' ? '🌙 Dark' : '☀️ Light'}
      </ThemeButton>
    </HeaderContainer>
  );
};

export default Header;