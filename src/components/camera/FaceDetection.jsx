//new
import { useEffect, useRef } from 'react';
import styled from 'styled-components';
import { FaceMesh } from '@mediapipe/face_mesh';
import { Camera } from '@mediapipe/camera_utils';

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

  useEffect(() => {
    let faceMesh;
    let camera;

    const initializeFaceMesh = async () => {
      try {
        const wasmUrl = `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/face_mesh_solution_simd_wasm_bin.js?v=${Date.now()}`;

        faceMesh = new FaceMesh({
          locateFile: (file) => {
            if (file.endsWith('face_mesh_solution_simd_wasm_bin.js')) {
              return wasmUrl;
            }
            return `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`;
          },
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
              console.error('Multiple faces detected! Test will terminate.');
              onGazeChange('Multiple Faces Detected');
              setTimeout(() => {
                window.location.href = '/login';
              }, 1000);
              return;
            }

            const faceLandmarks = results.multiFaceLandmarks[0];

            // Blink detection
            if (isBlinking(faceLandmarks)) {
              lastBlinkTime = Date.now(); // Update last blink time
            }

            if (Date.now() - lastBlinkTime > 12000) { // If no blink detected for 12 seconds
              console.error('No blinking detected - possible photo! Test will terminate.');
              onGazeChange('Possible Photo Detected');
              setTimeout(() => {
                window.location.href = '/login'; 
              }, 1000);
              return;
            }

            const gazeDirection = calculateGazeDirection(faceLandmarks);
            onGazeChange(gazeDirection);
            if(gazeDirection == 'No Face Detected'){
              console.error('No Face Detected! Test will terminate.');
              setTimeout(() => {
                window.location.href = '/login'; 
              }, 1000);
              return;
            }
          } else {
            onGazeChange('No Face Detected');
          }
        });
      } catch (faceMeshError) {
        console.error('Error initializing FaceMesh:', faceMeshError);
        onGazeChange('FaceMesh Initialization Error');
        return;
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
      } catch (cameraError) {
        console.error('Error initializing Camera:', cameraError);
        onGazeChange('Camera Initialization Error');
        if (faceMesh) {
          faceMesh.close();
        }
      }
    };

    initializeFaceMesh();

    return () => {
      if (camera) {
        camera.stop();
      }
      if (faceMesh) {
        faceMesh.close();
      }
    };
  }, [onGazeChange]);

  let awayTimer;
  const maxAwayTime = 3000; // 3 seconds in milliseconds

    document.addEventListener("visibilitychange", () => {
        if (document.visibilityState === "hidden") {
            // Start the timer when the tab is hidden
            awayTimer = setTimeout(() => {
                alert("You have changed the tab or minimized the window. Logging you out...");
                window.location.href = "/login"; 
            }, maxAwayTime);
        } else if (document.visibilityState === "visible") {
            // Clear the timer when the tab is visible again
            clearTimeout(awayTimer);
        }
    });

  const isBlinking = (landmarks) => {
    if (!landmarks || landmarks.length < 468) {
      return false;
    }

    const leftEyeTop = landmarks[159].y;
    const leftEyeBottom = landmarks[145].y;
    const rightEyeTop = landmarks[386].y;
    const rightEyeBottom = landmarks[374].y;

    const leftEyeHeight = Math.abs(leftEyeTop - leftEyeBottom);
    const rightEyeHeight = Math.abs(rightEyeTop - rightEyeBottom);

    return leftEyeHeight < 0.02 && rightEyeHeight < 0.02; // Adjust threshold if needed
  };

  const calculateGazeDirection = (landmarks) => {
    if (!landmarks || landmarks.length < 263) {
      return 'No Face Detected';
    }

    const leftEye = landmarks[33];
    const rightEye = landmarks[263];
    const nose = landmarks[1];

    if (!leftEye || !rightEye || !nose) {
      return 'No Face Detected';
    }

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
