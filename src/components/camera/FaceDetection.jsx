// //new threshold
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
    if (warningsRef.current >= 5) return; // Prevent extra calls

  warningsRef.current += 1; // Increment warning count
  if (warningsRef.current >= 5) {
    alert(`${message}\nMax warnings reached. Test will be terminated.`);
    window.location.href = '/login';
  } else {
    alert(`${message}\nWarning ${warningsRef.current}/5`);
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










//new threshold working
// import { useEffect, useRef, useState } from 'react';
// import styled from 'styled-components';
// import { FaceMesh } from '@mediapipe/face_mesh';
// import { Camera } from '@mediapipe/camera_utils';
// import { useNavigate } from 'react-router-dom';
// import axios from 'axios';

// const VideoContainer = styled.div`
//   width: 300px;
//   height: 225px;
//   border-radius: 12px;
//   overflow: hidden;
//   box-shadow: 0 4px 15px ${({ theme }) => theme.shadow};
//   position: relative;
// `;

// const VideoElement = styled.video`
//   width: 100%;
//   height: 100%;
//   object-fit: cover;
// `;

// const FaceDetection = ({ onGazeChange }) => {
//   const videoRef = useRef(null);
//   let lastBlinkTime = Date.now();
//   let awayTimer;
//   const navigate = useNavigate();
//   const maxAwayTime = 1000; // 1 seconds
//   const warningsRef = useRef(0);
//   const [loading, setLoading] = useState(false);

//   const issueWarning = (message) => {
//     if (warningsRef.current >= 3) return; // Prevent extra calls

//   warningsRef.current += 1; // Increment warning count
//   if (warningsRef.current >= 3) {
//     alert(`${message}\nMax warnings reached. Test will be terminated.`);
//     window.location.href = '/login';
//   } else {
//     alert(`${message}\nWarning ${warningsRef.current}/3`);
//   }
//   };

//   useEffect(() => {
//     if (sessionStorage.getItem('reloaded')) {
//       sessionStorage.removeItem('reloaded');
//       navigate('/login');
//     } else {
//       sessionStorage.setItem('reloaded', 'true');
//     }

//     return () => {
//       sessionStorage.removeItem('reloaded');
//     }

//  },[navigate]);
  

//   useEffect(() => {
//     let faceMesh;
//     let camera;

//     const initializeFaceMesh = async () => {
//       try {
//         const wasmUrl = `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/face_mesh_solution_simd_wasm_bin.js?v=${Date.now()}`;

//         faceMesh = new FaceMesh({
//           locateFile: (file) => (file.endsWith('face_mesh_solution_simd_wasm_bin.js') ? wasmUrl : `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`),
//         });

//         faceMesh.setOptions({
//           maxNumFaces: 2,
//           refineLandmarks: true,
//           minDetectionConfidence: 0.5,
//           minTrackingConfidence: 0.5,
//         });

//         faceMesh.onResults((results) => {
//           if (results.multiFaceLandmarks) {
//             if (results.multiFaceLandmarks.length > 1) {
//               console.warn('Multiple faces detected!');
//               issueWarning('Multiple faces detected.');
//               return;
//             }

//             const faceLandmarks = results.multiFaceLandmarks[0];

//             if (isBlinking(faceLandmarks)) {
//               lastBlinkTime = Date.now();
//             }

//             if (Date.now() - lastBlinkTime > 20000) {
//               console.warn('No blinking detected - possible photo!');
//               issueWarning('No blinking detected. Possible photo.');
//               return;
//             }

//             const gazeDirection = calculateGazeDirection(faceLandmarks);
//             onGazeChange(gazeDirection);

//             if (gazeDirection === 'No Face Detected') {
//               console.warn('No Face Detected!');
//               issueWarning('No face detected.');
//             }
//           } else {
//             onGazeChange('No Face Detected');
//           }
//         });
//       } catch (error) {
//         console.error('Error initializing FaceMesh:', error);
//         onGazeChange('FaceMesh Initialization Error');
//       }

//       try {
//         camera = new Camera(videoRef.current, {
//           onFrame: async () => {
//             await faceMesh.send({ image: videoRef.current });
//           },
//           width: 300,
//           height: 225,
//         });

//         camera.start();
//       } catch (error) {
//         console.error('Error initializing Camera:', error);
//         onGazeChange('Camera Initialization Error');
//         if (faceMesh) faceMesh.close();
//       }
//     };

//     initializeFaceMesh();

//     return () => {
//       if (camera) camera.stop();
//       if (faceMesh) faceMesh.close();
//     };
//   }, [onGazeChange]);

//   document.addEventListener('visibilitychange', () => {
//     if (document.visibilityState === 'hidden') {
//       awayTimer = setTimeout(() => {
//         console.warn('Tab change detected!');
//         issueWarning('You have changed the tab or minimized the window.');
//       }, maxAwayTime);
//     } else {
//       clearTimeout(awayTimer);
//     }
//   });


//   //frequent user authentication
//   const cosineSimilarity = (vecA, vecB) => {
//     const dotProduct = vecA.reduce((sum, a, i) => sum + a * vecB[i], 0);
//     const normA = Math.sqrt(vecA.reduce((sum, a) => sum + a * a, 0));
//     const normB = Math.sqrt(vecB.reduce((sum, b) => sum + b * b, 0));
//     return dotProduct / (normA * normB);
//   };
  
//   const handleFaceAuth = async () => {
//     setLoading(true);
  
//     try {
//       const userEmbedding = sessionStorage.getItem('userEmbedding');
  
//       const imageSrc = webcamRef.current.getScreenshot();
//       if (!imageSrc) throw new Error('Failed to capture image');
  
//       const blob = await fetch(imageSrc).then((res) => res.blob());
//       const formData = new FormData();
//       formData.append('image', blob, 'face.jpg');
  
//       const response = await axios.post('http://127.0.0.1:5000/register', formData);
//       if (response.data.error) throw new Error(response.data.error);
  
//       const currentEmbedding = response.data.embedding;
  
//       console.log('Embeddings in database:', userEmbedding);
//       console.log('Current face embeddings:', currentEmbedding);
  
//       const similarity = cosineSimilarity(userEmbedding, currentEmbedding);
//       console.log('Similarity Score:', similarity);
  
//       if (similarity >= 0.94) {
//         console.log('Authentication successful.');
//       } else {
//         alert('Face authentication failed. Test will be terminated.');
//         window.location.href = '/login';
//       }
//     } catch (error) {
//       alert(error.message);
//     } finally {
//       setLoading(false);
//     }
//   };
  
//   // Run face authentication every 1 minute
//   useEffect(() => {
//     const intervalId = setInterval(() => {
//       handleFaceAuth();
//     }, 10000); // 10000ms = 10 sec
  
//     return () => clearInterval(intervalId); // Cleanup on unmount
//   }, []);

//   const isBlinking = (landmarks) => {
//     if (!landmarks || landmarks.length < 468) return false;

//     const leftEyeTop = landmarks[159].y;
//     const leftEyeBottom = landmarks[145].y;
//     const rightEyeTop = landmarks[386].y;
//     const rightEyeBottom = landmarks[374].y;

//     const leftEyeHeight = Math.abs(leftEyeTop - leftEyeBottom);
//     const rightEyeHeight = Math.abs(rightEyeTop - rightEyeBottom);

//     return leftEyeHeight < 0.02 && rightEyeHeight < 0.02;
//   };

//   const calculateGazeDirection = (landmarks) => {
//     if (!landmarks || landmarks.length < 263) return 'No Face Detected';

//     const leftEye = landmarks[33];
//     const rightEye = landmarks[263];
//     const nose = landmarks[1];

//     if (!leftEye || !rightEye || !nose) return 'No Face Detected';

//     const eyeMidX = (leftEye.x + rightEye.x) / 2;
//     const diff = eyeMidX - nose.x;

//     if (diff < -0.04) return 'Looking Left';
//     if (diff > 0.04) return 'Looking Right';
//     return 'Looking Straight';
//   };

//   return (
//     <VideoContainer>
//       <VideoElement ref={videoRef} autoPlay playsInline />
//     </VideoContainer>
//   );
// };

// export default FaceDetection;





//WIP

// import { useEffect, useRef, useState } from 'react';
// import styled from 'styled-components';
// import { FaceMesh } from '@mediapipe/face_mesh';
// import { Camera } from '@mediapipe/camera_utils';
// import { useNavigate } from 'react-router-dom';
// import axios from 'axios';
// import { supabase } from '../../services/supabase'; // adjust path as needed
// import Webcam from 'react-webcam';

// // Styled components
// const FaceDetectionContainer = styled.div`
//   background: ${({ theme }) => theme.cardBg};
//   padding: 2rem;
//   border-radius: 12px;
//   box-shadow: 0 8px 20px ${({ theme }) => theme.shadow};
//   width: 400px;
//   max-width: 90%;
//   margin: 2rem auto;
//   border: 1px solid ${({ theme }) => theme.border};
// `;

// const VideoContainer = styled.div`
//   width: 300px;
//   height: 225px;
//   border-radius: 12px;
//   overflow: hidden;
//   box-shadow: 0 4px 15px ${({ theme }) => theme.shadow};
//   position: relative;
//   margin: 0 auto;
// `;

// const VideoElement = styled.video`
//   width: 100%;
//   height: 100%;
//   object-fit: cover;
// `;

// const StatusMessage = styled.p`
//   text-align: center;
//   color: ${({ theme }) => theme.textSecondary};
//   margin-top: 1rem;
// `;

// // Helper: Convert base64 dataURL to Blob
// const dataURLtoBlob = (dataurl) => {
//   const arr = dataurl.split(',');
//   const mimeMatch = arr[0].match(/:(.*?);/);
//   const mime = mimeMatch ? mimeMatch[1] : 'image/jpeg';
//   const bstr = atob(arr[1]);
//   let n = bstr.length;
//   const u8arr = new Uint8Array(n);
//   while (n--) {
//     u8arr[n] = bstr.charCodeAt(n);
//   }
//   return new Blob([u8arr], { type: mime });
// };

// const FaceDetection = ({ onGazeChange }) => {
//   const videoRef = useRef(null);
//   const webcamRef = useRef(null);
//   const navigate = useNavigate();
//   const [loading, setLoading] = useState(false);
//   const [status, setStatus] = useState('');
//   const warningsRef = useRef(0);
//   const errorCountRef = useRef(0); // Counter for detection errors
//   let lastBlinkTime = Date.now();
//   let awayTimer;
//   const maxAwayTime = 1000; // 1 second

//   // -------- Issue Warning --------
//   const issueWarning = (message) => {
//     alert(message);
//   };

//   // -------- Check Tab Switch --------
//   useEffect(() => {
//     const handleVisibilityChange = () => {
//       if (document.visibilityState === 'hidden') {
//         awayTimer = setTimeout(() => {
//           issueWarning('You have changed the tab or minimized the window.');
//         }, maxAwayTime);
//       } else {
//         clearTimeout(awayTimer);
//       }
//     };
//     document.addEventListener('visibilitychange', handleVisibilityChange);
//     return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
//   }, []);

//   // -------- Check Page Reload --------
//   useEffect(() => {
//     if (sessionStorage.getItem('reloaded')) {
//       sessionStorage.removeItem('reloaded');
//       navigate('/login');
//     } else {
//       sessionStorage.setItem('reloaded', 'true');
//     }
//     return () => sessionStorage.removeItem('reloaded');
//   }, [navigate]);

//   // -------- Eye Blink & Gaze Detection --------
//   useEffect(() => {
//     let faceMesh;
//     let camera;
//     const initializeFaceMesh = async () => {
//       try {
//         const wasmUrl = `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/face_mesh_solution_simd_wasm_bin.js?v=${Date.now()}`;
//         faceMesh = new FaceMesh({
//           locateFile: (file) =>
//             file.endsWith('face_mesh_solution_simd_wasm_bin.js')
//               ? wasmUrl
//               : `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`,
//         });
//         faceMesh.setOptions({
//           maxNumFaces: 2,
//           refineLandmarks: true,
//           minDetectionConfidence: 0.5,
//           minTrackingConfidence: 0.5,
//         });
//         faceMesh.onResults((results) => {
//           if (results.multiFaceLandmarks) {
//             if (results.multiFaceLandmarks.length > 1) {
//               console.warn('Multiple faces detected!');
//               issueWarning('Multiple faces detected.');
//               return;
//             }
//             const faceLandmarks = results.multiFaceLandmarks[0];
//             if (isBlinking(faceLandmarks)) {
//               lastBlinkTime = Date.now();
//             }
//             if (Date.now() - lastBlinkTime > 20000) {
//               console.warn('No blinking detected - possible photo!');
//               issueWarning('No blinking detected. Possible photo.');
//               return;
//             }
//             const gazeDirection = calculateGazeDirection(faceLandmarks);
//             onGazeChange(gazeDirection);
//             if (gazeDirection === 'No Face Detected') {
//               issueWarning('No face detected.');
//             }
//           } else {
//             onGazeChange('No Face Detected');
//           }
//         });
//       } catch (error) {
//         console.error('Error initializing FaceMesh:', error);
//         onGazeChange('FaceMesh Initialization Error');
//       }
//       try {
//         camera = new Camera(videoRef.current, {
//           onFrame: async () => {
//             await faceMesh.send({ image: videoRef.current });
//           },
//           width: 300,
//           height: 225,
//         });
//         camera.start();
//       } catch (error) {
//         console.error('Error initializing Camera:', error);
//         onGazeChange('Camera Initialization Error');
//         if (faceMesh) faceMesh.close();
//       }
//     };

//     initializeFaceMesh();
//     return () => {
//       if (camera) camera.stop();
//       if (faceMesh) faceMesh.close();
//     };
//   }, [onGazeChange]);

//   // -------- Similarity Function --------
//   const cosineSimilarity = (vecA, vecB) => {
//     const dotProduct = vecA.reduce((sum, a, i) => sum + a * vecB[i], 0);
//     const normA = Math.sqrt(vecA.reduce((sum, a) => sum + a * a, 0));
//     const normB = Math.sqrt(vecB.reduce((sum, b) => sum + b * b, 0));
//     return dotProduct / (normA * normB);
//   };

//   // -------- Frequent Face Authentication --------
//   const handleFaceAuth = async () => {
//     setLoading(true);
//     setStatus('Authenticating face...');
//     const userId = sessionStorage.getItem('userId');

//     try {
//       // Fetch stored embedding from Supabase
//       const { data, error } = await supabase
//         .from('users')
//         .select('embedding')
//         .eq('id', userId);
//       if (error) throw error;
//       if (!data || data.length === 0) {
//         alert('Invalid user or embedding not found.');
//         return;
//       }
//       const userEmbedding = data[0].embedding;
//       console.log('Stored Embedding:', userEmbedding);

//       // Capture image from webcam
//       const imageSrc = webcamRef.current.getScreenshot();
//       console.log('Captured Image:', imageSrc);
//       if (!imageSrc) throw new Error('Failed to capture image');

//       // Convert base64 image to Blob
//       const blob = dataURLtoBlob(imageSrc);
//       console.log('Image Blob:', blob);
//       if (blob.size === 0) {
//         throw new Error('Captured image is empty');
//       }

//       // Create FormData and append the image Blob
//       const formData = new FormData();
//       formData.append('image', blob, 'face.jpg');
//       console.log('FormData Content:', formData.get('image'));

//       // Send image to API for face embedding extraction
//       const response = await axios.post('http://127.0.0.1:5000/register', formData, {
//         headers: { 'Content-Type': 'multipart/form-data' },
//       });
//       if (response.data.error) throw new Error(response.data.error);
//       const currentEmbedding = response.data.embedding;
//       console.log('Current Face Embedding:', currentEmbedding);

//       // Compute similarity
//       const similarity = cosineSimilarity(userEmbedding, currentEmbedding);
//       console.log('Similarity Score:', similarity);

//       // If similarity threshold is met, authenticate; else do nothing here
//       if (similarity >= 0.94) {
//         setStatus('Authentication successful.');
//         // alert('Authentication successful.');
//         // window.location.href = '/exam';
//       } else {
//         setStatus('Face authentication failed.');
//         alert('Face authentication failed. Please try again.');
//         // Increase error counter if authentication fails
//         errorCountRef.current += 1;
//       }
//     } catch (error) {
//       alert(error.message);
//       console.error('Face Auth Error:', error);
//       setStatus('Authentication error.');
//       errorCountRef.current += 1;
//     } finally {
//       setLoading(false);
//       // If errors occur more than 5 times, terminate the exam
//       if (errorCountRef.current >= 5) {
//         alert('Multiple face detection errors. The exam will be terminated.');
//         window.location.href = '/login';
//       }
//     }
//   };

//   useEffect(() => {
//     const intervalId = setInterval(() => {
//       handleFaceAuth();
//     }, 10000); // Every 10 seconds
//     return () => clearInterval(intervalId);
//   }, []);

//   // -------- Helpers --------
//   const isBlinking = (landmarks) => {
//     if (!landmarks || landmarks.length < 468) return false;
//     const leftEyeTop = landmarks[159].y;
//     const leftEyeBottom = landmarks[145].y;
//     const rightEyeTop = landmarks[386].y;
//     const rightEyeBottom = landmarks[374].y;
//     const leftEyeHeight = Math.abs(leftEyeTop - leftEyeBottom);
//     const rightEyeHeight = Math.abs(rightEyeTop - rightEyeBottom);
//     return leftEyeHeight < 0.02 && rightEyeHeight < 0.02;
//   };

//   const calculateGazeDirection = (landmarks) => {
//     if (!landmarks || landmarks.length < 263) return 'No Face Detected';
//     const leftEye = landmarks[33];
//     const rightEye = landmarks[263];
//     const nose = landmarks[1];
//     if (!leftEye || !rightEye || !nose) return 'No Face Detected';
//     const eyeMidX = (leftEye.x + rightEye.x) / 2;
//     const diff = eyeMidX - nose.x;
//     if (diff < -0.04) return 'Looking Left';
//     if (diff > 0.04) return 'Looking Right';
//     return 'Looking Straight';
//   };

//   return (
//     <FaceDetectionContainer>
//       <VideoContainer>
//         <VideoElement ref={videoRef} autoPlay playsInline />
//       </VideoContainer>
//       {/* For debugging, the webcam feed is visible. Hide it when confirmed working */}
//       <Webcam 
//         ref={webcamRef} 
//         screenshotFormat="image/jpeg" 
//         style={{ width: '300px', height: '225px', marginTop: '1rem' }} 
//       />
//       {status && <StatusMessage>{status}</StatusMessage>}
//     </FaceDetectionContainer>
//   );
// };

// export default FaceDetection;
