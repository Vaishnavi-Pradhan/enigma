import { useRef, useState } from 'react';
import MainLayout from '../components/layout/MainLayout';
import styled from 'styled-components';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem;
`;

const Title = styled.h1`
  text-align: center;
  margin-bottom: 2rem;
`;

const Video = styled.video`
  display: block;
  margin: 1rem auto;
  border: 2px solid ${({ theme }) => theme.border};
  max-width: 100%;
`;

const Canvas = styled.canvas`
  display: none;
`;

const Button = styled.button`
  display: block;
  margin: 1rem auto;
  padding: 0.8rem 1.5rem;
  background: ${({ theme }) => theme.primary};
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: ${({ theme }) => theme.primaryDark};
  }

  &:disabled {
    background: ${({ theme }) => theme.disabled};
    cursor: not-allowed;
  }
`;

const CapturePage = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const [captureCount, setCaptureCount] = useState(0);

  const startWebcam = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      videoRef.current.srcObject = stream;
    } catch (err) {
      console.error('Error accessing webcam:', err);
      alert('Could not access webcam');
    }
  };

  const captureImages = () => {
    setIsCapturing(true);
    setCaptureCount(0);
    
    const totalImages = 20;
    const interval = 500; // 0.5 seconds between captures
    
    const captureInterval = setInterval(() => {
      if (captureCount >= totalImages) {
        clearInterval(captureInterval);
        setIsCapturing(false);
        alert('Capture complete!');
        return;
      }

      // Capture image
      const canvas = canvasRef.current;
      const video = videoRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      canvas.getContext('2d').drawImage(video, 0, 0);
      
      // Convert to blob and download
      canvas.toBlob((blob) => {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `capture_${captureCount + 1}.png`;
        a.click();
        URL.revokeObjectURL(url);
      });

      setCaptureCount(prev => prev + 1);
    }, interval);
  };

  // Start webcam on component mount
  useState(() => {
    startWebcam();
    return () => {
      if (videoRef.current?.srcObject) {
        videoRef.current.srcObject.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  return (
    <MainLayout>
      <Container>
        <Title>Webcam Capture</Title>
        <Video ref={videoRef} autoPlay muted />
        <Canvas ref={canvasRef} />
        <Button 
          onClick={captureImages} 
          disabled={isCapturing}
        >
          {isCapturing ? `Capturing... (${captureCount}/20)` : 'Start Capture'}
        </Button>
      </Container>
    </MainLayout>
  );
};

export default CapturePage;