//new
import Webcam from 'react-webcam';
import { useRef, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { supabase } from '../services/supabase';
import styled from 'styled-components';

const BeforeExamContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 90vh; // Increased height to accommodate instructions
  background: ${({ theme }) => theme.cardBg};
  color: ${({ theme }) => theme.text};
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 8px 20px ${({ theme }) => theme.shadow};
  width: 80%;
  max-width: 600px;
  margin: 20px auto; // Reduced top margin
`;

const Title = styled.h2`
  color: ${({ theme }) => theme.primary};
  margin-bottom: 1rem;
`;

const Instructions = styled.p`
  margin-bottom: 2rem;
  text-align: left; // Align instructions to the left
  width: 100%; // Make instructions span full width
`;

const WebcamWrapper = styled.div`
  margin-bottom: 2rem;
  border: 2px solid ${({ theme }) => theme.border};
  border-radius: 8px;
  overflow: hidden;
  width: 460px;
  height: 420px;
`;

const AuthButton = styled.button`
  padding: 1rem 2rem;
  background: blue;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  cursor: pointer;
  transition: background 0.3s ease;

  &:disabled {
    background: ${({ theme }) => theme.disabled};
    cursor: not-allowed;
  }

  &:hover {
    background: ${({ theme }) => theme.primaryDark};
  }
`;

const BeforeExam = () => {
  const navigation = useNavigate();
  const webcamRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const userId = sessionStorage.getItem('userId');
  const [user, setUser]= useState(null);
  
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
          navigation('/login');
        }
      } else {
        navigation('/login');
      }
    };

    fetchUser();
  }, [navigation, userId]);

  const cosineSimilarity = (vecA, vecB) => {
    const dotProduct = vecA.reduce((sum, a, i) => sum + a * vecB[i], 0);
    const normA = Math.sqrt(vecA.reduce((sum, a) => sum + a * a, 0));
    const normB = Math.sqrt(vecB.reduce((sum, b) => sum + b * b, 0));
    return dotProduct / (normA * normB);
  };

  const handleFaceAuth = async () => {
    setLoading(true);

    const userId = sessionStorage.getItem('userId');

    try {
      const { data, error } = await supabase
        .from('users')
        .select('embedding')
        .eq('id', userId);

      if (error) throw error;
      if (!data || data.length === 0) {
        alert('Invalid user or embedding not found.');
        return;
      }

      const userEmbedding = data[0].embedding;

      const imageSrc = webcamRef.current.getScreenshot();
      if (!imageSrc) throw new Error('Failed to capture image');

      const blob = await fetch(imageSrc).then((res) => res.blob());
      const formData = new FormData();
      formData.append('image', blob, 'face.jpg');

      const response = await axios.post('http://127.0.0.1:5000/register', formData);
      if (response.data.error) throw new Error(response.data.error);

      const currentEmbedding = response.data.embedding;

      console.log('Embeddings in database:', userEmbedding);
      console.log('Current face embeddings:', currentEmbedding);

      const similarity = cosineSimilarity(userEmbedding, currentEmbedding);
      console.log('Similarity Score:', similarity);

      if (similarity >= 0.94) {
        alert('Authentication successfull.');
        window.location.href = '/exam';
      } else {
        alert('Face authentication failed. Please try again.');
      }
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <BeforeExamContainer>
      <Title>Pre-Exam Verification</Title>
      <Instructions>
        <strong>Please follow these instructions for a successful verification:</strong>
        <ol>
          <li>Ensure you are alone in a well-lit room.</li>
          <li>Position your face clearly within the webcam frame.</li>
          <li>Avoid wearing hats, sunglasses, or anything that obscures your face.</li>
          <li>Move your head slightly to ensure all angles are captured.</li>
          <li>Do not leave the webcam frame during the verification process.</li>
          <li>Close any other applications that might interfere with the webcam.</li>
        </ol>
        <p>Once you are ready, click the 'Authenticate' button.</p>
      </Instructions>
      <WebcamWrapper>
        <Webcam ref={webcamRef} screenshotFormat="image/jpeg" width={460} height={420} />
      </WebcamWrapper>
      <AuthButton onClick={handleFaceAuth} disabled={loading}>
        {loading ? 'Verifying...' : 'Authenticate'}
      </AuthButton>
    </BeforeExamContainer>
  );
};

export default BeforeExam;