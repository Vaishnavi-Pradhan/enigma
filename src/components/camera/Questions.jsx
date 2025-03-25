import styled, { keyframes } from 'styled-components';
import { useContext } from 'react';
import { ThemeContext } from '../../context/ThemeContext';

const slideIn = keyframes`
  from { transform: translateX(-20px); opacity: 0; }
  to { transform: translateX(0); opacity: 1; }
`;

const QuestionContainer = styled.div`
  flex: 1;
  max-width: 800px;
  animation: ${slideIn} 0.5s ease-out;
`;

const QuestionItem = styled.div`
  background: ${({ theme }) => theme.cardBg};
  padding: 1.5rem;
  border-radius: 12px;
  margin-bottom: 1.5rem;
  box-shadow: 0 4px 10px ${({ theme }) => theme.shadow};
  border: 1px solid ${({ theme }) => theme.border};
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 6px 15px ${({ theme }) => theme.hoverShadow};
  }
`;

const QuestionText = styled.h3`
  margin: 0 0 1rem 0;
  color: ${({ theme }) => theme.primary};
`;

const OptionsList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const OptionItem = styled.li`
  margin: 0.5rem 0;
`;

const RadioLabel = styled.label`
  display: flex;
  align-items: center;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 6px;
  transition: all 0.2s ease;
  
  &:hover {
    background: ${({ theme }) => theme.hoverBg};
  }
  
  input:checked + & {
    background: ${({ theme }) => theme.primaryLight};
    font-weight: 600;
  }
`;

const SubmitButton = styled.button`
  background: #0000ff;
  color: white;
  border: none;
  padding: 1rem 2rem;
  font-size: 1rem;
  font-weight: 600;
  border-radius: 8px;
  cursor: pointer;
  margin-top: 1rem;
  transition: all 0.3s ease;
  
  &:hover {
    background: ${({ theme }) => theme.primaryDark};
    transform: translateY(-2px);
    box-shadow: 0 4px 10px ${({ theme }) => theme.shadow};
  }
  
  &:active {
    transform: translateY(0);
  }
`;

const Questions = ({ answers, onAnswerSelect, onSubmit }) => {
  const { theme } = useContext(ThemeContext);
  const questions = [
    {
      id: 'q1',
      text: 'What is the capital of France?',
      options: ['Paris', 'London', 'Berlin', 'Madrid']
    },
    {
      id: 'q2',
      text: 'Which language runs in a web browser?',
      options: ['Java', 'C', 'Python', 'JavaScript']
    },
    {
      id: 'q3',
      text: 'What does CSS stand for?',
      options: [
        'Creative Style Sheets',
        'Cascading Style Sheets',
        'Computer Style Sheets',
        'Colorful Style Sheets'
      ]
    }
  ];

  return (
    <QuestionContainer>
      {questions.map((question) => (
        <QuestionItem key={question.id} theme={theme}>
          <QuestionText theme={theme}>{question.text}</QuestionText>
          <OptionsList>
            {question.options.map((option, index) => (
              <OptionItem key={`${question.id}-${index}`}>
                <input
                  type="radio"
                  id={`${question.id}-${index}`}
                  name={question.id}
                  value={option}
                  checked={answers[question.id] === option}
                  onChange={() => onAnswerSelect(question.id, option)}
                  style={{ display: 'none' }}
                />
                <RadioLabel 
                  htmlFor={`${question.id}-${index}`}
                  theme={theme}
                >
                  {option}
                </RadioLabel>
              </OptionItem>
            ))}
          </OptionsList>
        </QuestionItem>
      ))}
      <SubmitButton onClick={onSubmit} theme={theme}>
        Submit Exam
      </SubmitButton>
    </QuestionContainer>
  );
};

export default Questions;