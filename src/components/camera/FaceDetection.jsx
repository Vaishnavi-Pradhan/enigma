//new threshold
import { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { FaceMesh } from '@mediapipe/face_mesh';
import { Camera } from '@mediapipe/camera_utils';
import { useNavigate } from 'react-router-dom';

const VideoContainer = styled.div`
  width: 300px;
  height: 225px;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 15px ${({ theme }) => theme.shadow};
  position: relative;
`;

const VideoElement = styled.video`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const FaceDetection = ({ onGazeChange }) => {
  const videoRef = useRef(null);
  let lastBlinkTime = Date.now();
  let awayTimer;
  const navigate = useNavigate();
  const maxAwayTime = 1000; // 1 seconds
  const warningsRef = useRef(0);

  const issueWarning = (message) => {
    if (warningsRef.current >= 3) return; // Prevent extra calls

  warningsRef.current += 1; // Increment warning count
  if (warningsRef.current >= 3) {
    alert(`${message}\nMax warnings reached. Test will be terminated.`);
    window.location.href = '/login';
  } else {
    alert(`${message}\nWarning ${warningsRef.current}/3`);
  }
  };

  useEffect(() => {
    if (sessionStorage.getItem('reloaded')) {
      sessionStorage.removeItem('reloaded');
      navigate('/login');
    } else {
      sessionStorage.setItem('reloaded', 'true');
    }

    return () => {
      sessionStorage.removeItem('reloaded');
    }

 },[navigate]);
  

  useEffect(() => {
    let faceMesh;
    let camera;

    const initializeFaceMesh = async () => {
      try {
        const wasmUrl = `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/face_mesh_solution_simd_wasm_bin.js?v=${Date.now()}`;

        faceMesh = new FaceMesh({
          locateFile: (file) => (file.endsWith('face_mesh_solution_simd_wasm_bin.js') ? wasmUrl : `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`),
        });

        faceMesh.setOptions({
          maxNumFaces: 2,
          refineLandmarks: true,
          minDetectionConfidence: 0.5,
          minTrackingConfidence: 0.5,
        });

        faceMesh.onResults((results) => {
          if (results.multiFaceLandmarks) {
            if (results.multiFaceLandmarks.length > 1) {
              console.warn('Multiple faces detected!');
              issueWarning('Multiple faces detected.');
              return;
            }

            const faceLandmarks = results.multiFaceLandmarks[0];

            if (isBlinking(faceLandmarks)) {
              lastBlinkTime = Date.now();
            }

            if (Date.now() - lastBlinkTime > 20000) {
              console.warn('No blinking detected - possible photo!');
              issueWarning('No blinking detected. Possible photo.');
              return;
            }

            const gazeDirection = calculateGazeDirection(faceLandmarks);
            onGazeChange(gazeDirection);

            if (gazeDirection === 'No Face Detected') {
              console.warn('No Face Detected!');
              issueWarning('No face detected.');
            }
          } else {
            onGazeChange('No Face Detected');
          }
        });
      } catch (error) {
        console.error('Error initializing FaceMesh:', error);
        onGazeChange('FaceMesh Initialization Error');
      }

      try {
        camera = new Camera(videoRef.current, {
          onFrame: async () => {
            await faceMesh.send({ image: videoRef.current });
          },
          width: 300,
          height: 225,
        });

        camera.start();
      } catch (error) {
        console.error('Error initializing Camera:', error);
        onGazeChange('Camera Initialization Error');
        if (faceMesh) faceMesh.close();
      }
    };

    initializeFaceMesh();

    return () => {
      if (camera) camera.stop();
      if (faceMesh) faceMesh.close();
    };
  }, [onGazeChange]);

  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') {
      awayTimer = setTimeout(() => {
        console.warn('Tab change detected!');
        issueWarning('You have changed the tab or minimized the window.');
      }, maxAwayTime);
    } else {
      clearTimeout(awayTimer);
    }
  });

  const isBlinking = (landmarks) => {
    if (!landmarks || landmarks.length < 468) return false;

    const leftEyeTop = landmarks[159].y;
    const leftEyeBottom = landmarks[145].y;
    const rightEyeTop = landmarks[386].y;
    const rightEyeBottom = landmarks[374].y;

    const leftEyeHeight = Math.abs(leftEyeTop - leftEyeBottom);
    const rightEyeHeight = Math.abs(rightEyeTop - rightEyeBottom);

    return leftEyeHeight < 0.02 && rightEyeHeight < 0.02;
  };

  const calculateGazeDirection = (landmarks) => {
    if (!landmarks || landmarks.length < 263) return 'No Face Detected';

    const leftEye = landmarks[33];
    const rightEye = landmarks[263];
    const nose = landmarks[1];

    if (!leftEye || !rightEye || !nose) return 'No Face Detected';

    const eyeMidX = (leftEye.x + rightEye.x) / 2;
    const diff = eyeMidX - nose.x;

    if (diff < -0.04) return 'Looking Left';
    if (diff > 0.04) return 'Looking Right';
    return 'Looking Straight';
  };

  return (
    <VideoContainer>
      <VideoElement ref={videoRef} autoPlay playsInline />
    </VideoContainer>
  );
};

export default FaceDetection;

