import styled from 'styled-components';
import { useContext } from 'react';
import { ThemeContext } from '../../context/ThemeContext';
import Header from './Header';

const Container = styled.div`
  min-height: 100vh;
  background: ${({ theme }) => theme.background};
  color: ${({ theme }) => theme.text};
  transition: all 0.3s ease;
`;

const Main = styled.main`
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
`;

const MainLayout = ({ children }) => {
  const { theme } = useContext(ThemeContext);

  return (
    <Container theme={theme}>
      <Header />
      <Main>{children}</Main>
    </Container>
  );
};

export default MainLayout;