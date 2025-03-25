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
          maxNumFaces: 1,
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
  
            const gazeDirection = calculateGazeDirection(results.multiFaceLandmarks[0]);
            onGazeChange(gazeDirection);
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
  }, [onGazeChange]); // Add calculateGazeDirection to dependency array if needed.

  //   const initializeFaceMesh = async () => {
  //     try {
  //       faceMesh = new FaceMesh({
  //         locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`,
  //       });

  //       faceMesh.setOptions({
  //         maxNumFaces: 1,
  //         refineLandmarks: true,
  //         minDetectionConfidence: 0.5,
  //         minTrackingConfidence: 0.5,
  //       });

  //       faceMesh.onResults((results) => {
  //         if (results.multiFaceLandmarks) {
  //           if (results.multiFaceLandmarks.length > 1) {
  //             console.error('Multiple faces detected! Test will terminate.');
  //             // Display error in component UI instead of alert
  //             onGazeChange('Multiple Faces Detected');
  //             setTimeout(() => {
  //               window.location.href = '/login';
  //             }, 1000);
  //             return;
  //           }

  //           const gazeDirection = calculateGazeDirection(results.multiFaceLandmarks[0]);
  //           onGazeChange(gazeDirection);
  //         } else {
  //           onGazeChange('No Face Detected');
  //         }
  //       });
  //       camera = new Camera(videoRef.current, {
  //         onFrame: async () => {
  //           await faceMesh.send({ image: videoRef.current });
  //         },
  //         width: 300,
  //         height: 225,
  //       });

  //       camera.start();
  //     } catch (error) {
  //       console.error('Error initializing FaceMesh or Camera:', error);
  //       onGazeChange('Initialization Error');
  //     }
  //   };
  //   initializeFaceMesh();

  //   return () => {
  //     if (camera) {
  //       camera.stop();
  //     }
  //     if (faceMesh) {
  //       faceMesh.close();
  //     }
  //   };
  // }, [onGazeChange]);

  

  const calculateGazeDirection = (landmarks) => {
    if (!landmarks || landmarks.length < 263) {
      return 'Gaze Detection Error';
    }
    const leftEye = landmarks[33];
    const rightEye = landmarks[263];
    const nose = landmarks[1];

    if (!leftEye || !rightEye || !nose) {
        return 'Gaze Detection Error';
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