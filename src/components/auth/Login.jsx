import styled, { keyframes } from 'styled-components';
import { useState, useContext } from 'react';
import { ThemeContext } from '../../context/ThemeContext';
import { supabase } from '../../services/supabase';
import * as faceapi from 'face-api.js'; // Load face recognition library
import { css } from 'styled-components';

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const pulse = keyframes`
  0% { box-shadow: 0 0 0 0 rgba(76, 175, 80, 0.4); }
  70% { box-shadow: 0 0 0 10px rgba(76, 175, 80, 0); }
  100% { box-shadow: 0 0 0 0 rgba(76, 175, 80, 0); }
`;

const LoginContainer = styled.div`
  background: ${({ theme }) => theme.cardBg};
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 8px 20px ${({ theme }) => theme.shadow};
  width: 400px;
  max-width: 90%;
  margin: 2rem auto;
  animation: ${css`${fadeIn} 0.6s ease-out`}; 
  border: 1px solid ${({ theme }) => theme.border};
`;

const LoginTitle = styled.h2`
  text-align: center;
  margin-bottom: 1.5rem;
  color: ${({ theme }) => theme.primary};
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    bottom: -10px;
    left: 50%;
    transform: translateX(-50%);
    width: 50px;
    height: 3px;
    background: ${({ theme }) => theme.primary};
  }
`;

const FormGroup = styled.div`
  margin-bottom: 1.2rem;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.8rem 1rem;
  border: 2px solid ${({ theme }) => theme.inputBorder};
  border-radius: 8px;
  background: ${({ theme }) => theme.inputBg};
  color: ${({ theme }) => theme.text};
  font-size: 1rem;
  transition: all 0.3s ease;
  
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.primary};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.focusShadow};
  }
`;

const SubmitButton = styled.button`
  width: 100%;
  padding: 0.8rem;
  background: #0000ff;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  margin-top: 1rem;
  transition: all 0.3s ease;
  
  &:hover {
    background: ${({ theme }) => theme.primaryDark};
    transform: translateY(-2px);
  }
  
  &:active {
    transform: translateY(0);
  }
  
  &:disabled {
    background: ${({ theme }) => theme.disabled};
    cursor: not-allowed;
  }
  
  ${({ $loading }) => 
    $loading && css`
      animation: ${pulse} 1.5s infinite; 
    `
  }
`;

const AuthLink = styled.p`
  text-align: center;
  margin-top: 1.5rem;
  color: ${({ theme }) => theme.textSecondary};
  
  a {
    color: ${({ theme }) => theme.primary};
    text-decoration: none;
    font-weight: 500;
    
    &:hover {
      text-decoration: underline;
    }
  }
`;

// const LoginForm = () => {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [loading, setLoading] = useState(false);
//   const { theme } = useContext(ThemeContext);

//   // const handleLogin = async (e) => {
//   //   e.preventDefault();
//   //   setLoading(true);
  
//   //   try {
//   //     // Check if the user exists in the 'login' table
//   //     const { data, error: queryError } = await supabase
//   //       .from('users')                                             //changed login table to users table 
//   //       .select('*')
//   //       .eq('username', email) // Assuming you are using 'email' as username
//   //       .eq('password', password);
  
//   //     if (queryError) throw queryError;
  
//   //     if (data && data.length > 0) {
  
//   //       window.location.href = '/exam';
//   //     } else {
//   //       // User not found in the 'login' table
//   //       alert('Invalid email or password.');
//   //     }
//   //   } catch (error) {
//   //     alert(error.message);
//   //   } finally {
//   //     setLoading(false);
//   //   }
//   // };

//   const handleLogin = async (e) => {
//     e.preventDefault();
//     setLoading(true);

//     try {
//         // Fetch stored user data from Supabase
//         const { data, error: queryError } = await supabase
//             .from('users')
//             .select('password, embedding')
//             .eq('username', email)
//             .single(); // Fetch single user entry

//         if (queryError) throw queryError;
//         if (!data) {
//             alert('Invalid email or password.');
//             return;
//         }

//         // Validate password
//         if (data.password !== password) {
//             alert('Invalid email or password.');
//             return;
//         }

//         // Convert stored embeddings from string to float array
//         const storedEmbedding = data.embedding.replace(/[{}]/g, "").split(",").map(Number);

//         // Capture live face embedding
//         const liveEmbedding = await captureLiveFaceEmbedding();

//         if (!liveEmbedding) {
//             alert("Face not detected. Please try again.");
//             return;
//         }

//         // Compute Euclidean distance between stored and live embeddings
//         const distance = calculateEuclideanDistance(storedEmbedding, liveEmbedding);

//         console.log(`Distance: ${distance}`);
        
//         // Define threshold (adjust based on accuracy testing)
//         const THRESHOLD = 0.6;

//         if (distance < THRESHOLD) {
//             alert("✅ Login successful!");
//             window.location.href = '/exam';
//         } else {
//             alert("❌ Face not recognized. Access denied.");
//         }

//     } catch (error) {
//         alert(error.message);
//     } finally {
//         setLoading(false);
//     }
// };

// // Function to capture live face embedding using face-api.js
// const captureLiveFaceEmbedding = async () => {
//     const video = document.createElement("video");

//     // Request webcam access
//     const stream = await navigator.mediaDevices.getUserMedia({ video: true });
//     video.srcObject = stream;
//     await video.play();

//     // Wait for face-api.js to detect face
//     const detections = await faceapi.detectSingleFace(video).withFaceLandmarks().withFaceDescriptor();

//     if (!detections) return null;

//     // Stop video stream after capturing
//     stream.getTracks().forEach(track => track.stop());

//     return Array.from(detections.descriptor); // Return 128D face embedding
// };

// // Function to calculate Euclidean distance
// const calculateEuclideanDistance = (embedding1, embedding2) => {
//     return Math.sqrt(embedding1.reduce((sum, val, i) => sum + Math.pow(val - embedding2[i], 2), 0));
// };


const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { theme } = useContext(ThemeContext);

  // Load face-api models once
  const loadModels = async () => {
      await faceapi.nets.tinyFaceDetector.loadFromUri('/models');
      await faceapi.nets.faceLandmark68Net.loadFromUri('/models');
      await faceapi.nets.faceRecognitionNet.loadFromUri('/models');
  };

  // Capture live face embedding
  const captureLiveFaceEmbedding = async () => {
      let video = document.createElement("video");
      document.body.appendChild(video);

      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      video.srcObject = stream;
      await video.play();

      return new Promise((resolve, reject) => {
          const interval = setInterval(async () => {
              const detections = await faceapi.detectSingleFace(video, new faceapi.TinyFaceDetectorOptions())
                  .withFaceLandmarks()
                  .withFaceDescriptor();

              if (detections) {
                  stream.getTracks().forEach(track => track.stop());
                  video.remove();
                  clearInterval(interval);
                  resolve(Array.from(detections.descriptor)); // Convert embedding to array
              }
          }, 500);
      });
  };

  // Convert stored embeddings from Supabase format to an array
  const parseStoredEmbedding = (embeddingStr) => {
      return embeddingStr.replace(/[{}]/g, "").split(",").map(Number);
  };

  // Calculate cosine similarity between two embeddings
  const cosineSimilarity = (vecA, vecB) => {
      const dotProduct = vecA.reduce((sum, a, i) => sum + a * vecB[i], 0);
      const magA = Math.sqrt(vecA.reduce((sum, a) => sum + a * a, 0));
      const magB = Math.sqrt(vecB.reduce((sum, b) => sum + b * b, 0));
      return dotProduct / (magA * magB);
  };

  // Handle login process
  // const handleLogin = async (e) => {
  //     e.preventDefault();
  //     setLoading(true);

  //     try {
  //         // Load models
  //         await loadModels();

  //         // Capture live face embedding
  //         const liveEmbedding = await captureLiveFaceEmbedding();
  //         if (!liveEmbedding) {
  //             alert("Face not detected! Please try again.");
  //             setLoading(false);
  //             return;
  //         }

  //         // Fetch stored embedding from Supabase
  //         const { data, error } = await supabase
  //             .from('users') // Assuming 'users' table stores face embeddings
  //             .select('embedding')
  //             .eq('username', email)
  //             .eq('password', password)
  //             .single();

  //         if (error || !data) {
  //             alert("Invalid email or password.");
  //             setLoading(false);
  //             return;
  //         }

  //         // Convert stored embedding to an array
  //         const storedEmbedding = parseStoredEmbedding(data.face_embedding);

  //         // Compare embeddings
  //         const similarity = cosineSimilarity(liveEmbedding, storedEmbedding);
  //         console.log("Similarity Score:", similarity);

  //         // Threshold for authentication
  //         if (similarity > 0.6) {
  //             alert("Login Successful!");
  //             window.location.href = '/exam';
  //         } else {
  //             alert("Face does not match! Try again.");
  //         }
  //     } catch (error) {
  //         alert("Error: " + error.message);
  //     } finally {
  //         setLoading(false);
  //     }
  // };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Load models
    const modelsLoaded = await loadModels();
    if (!modelsLoaded) {
        alert("Failed to load face detection models.");
        setLoading(false);
        return;
    }

    // Capture live face embedding
    const liveEmbedding = await captureLiveFaceEmbedding();
    if (!liveEmbedding) {
        alert("Face not detected! Please try again.");
        setLoading(false);
        return;
    }

    // Fetch stored embedding from Supabase
    const { data, error } = await supabase
        .from('users')
        .select('embedding')
        .eq('username', email)
        .eq('password', password)
        .single();

    if (error || !data) {
        alert("Invalid email or password.");
        setLoading(false);
        return;
    }

    // Parse stored embedding
    const storedEmbedding = parseStoredEmbedding(data.embedding);
    if (!storedEmbedding) {
        alert("Error parsing stored face data.");
        setLoading(false);
        return;
    }

    // Compare embeddings
    const similarity = cosineSimilarity(liveEmbedding, storedEmbedding);
    console.log("Similarity Score:", similarity);

    if (similarity > 0.6) {
        alert("Login Successful!");
        window.location.href = '/exam';
    } else {
        alert("Face does not match! Try again.");
    }

    setLoading(false);
};



  return (
    <LoginContainer theme={theme}>
      <LoginTitle theme={theme}>Login</LoginTitle>
      <form onSubmit={handleLogin}>
        <FormGroup>
          <Input
            // type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            required
            theme={theme}
          />
        </FormGroup>
        <FormGroup>
          <Input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            required
            theme={theme}
          />
        </FormGroup>
        <SubmitButton 
          //type="submit" 
          onClick={handleLogin}
          disabled={loading}
          $loading={loading}
          theme={theme}
        >
          {loading ? 'Logging in...' : 'Login'}
        </SubmitButton>
      </form>
      <AuthLink theme={theme}>
        Don't have an account? <a href="/register">Register</a>
      </AuthLink>
    </LoginContainer>
  );
};

export default LoginForm;