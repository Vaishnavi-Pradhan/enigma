import { useState } from 'react';
import MainLayout from '../components/layout/MainLayout';
import FaceDetection from '../components/camera/FaceDetection';
import Questions from '../components/camera/Questions';

const ExamPage = () => {
  const [gazeStatus, setGazeStatus] = useState('Analyzing...');
  const [answers, setAnswers] = useState({});

  const handleAnswerSelect = (questionId, answer) => {
    setAnswers(prev => ({ ...prev, [questionId]: answer }));
  };

  const submitAnswers = () => {
    console.log('Submitted answers:', answers);
    alert('Exam submitted successfully!');
    window.location.href = '/dashboard';
  };

  return (
    <MainLayout>
      <div style={{ display: 'flex', gap: '2rem' }}>
        <Questions 
          answers={answers}
          onAnswerSelect={handleAnswerSelect}
          onSubmit={submitAnswers}
        />
        <FaceDetection onGazeChange={setGazeStatus} />
      </div>
      <div style={{ 
        position: 'fixed', 
        bottom: '20px', 
        right: '20px',
        padding: '0.5rem 1rem',
        background: gazeStatus === 'Looking Straight' ? '#4CAF50' : '#F44336',
        color: 'white',
        borderRadius: '20px',
        fontWeight: 'bold'
      }}>
        Gaze: {gazeStatus}
      </div>
    </MainLayout>
  );
};

export default ExamPage;