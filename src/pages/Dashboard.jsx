// import React, { useState, useEffect } from 'react';
// import { supabase } from '../services/supabase';
// import styled from 'styled-components';
// import { useNavigate } from 'react-router-dom';

// const DashboardContainer = styled.div`
//   background: ${({ theme }) => theme.cardBg};
//   padding: 2rem;
//   border-radius: 12px;
//   box-shadow: 0 8px 20px ${({ theme }) => theme.shadow};
//   width: 80%;
//   max-width: 1200px;
//   margin: 2rem auto;
//   border: 1px solid ${({ theme }) => theme.border};
// `;

// const ProfileSection = styled.div`
//   display: flex;
//   align-items: center;
//   margin-bottom: 2rem;
// `;

// const ProfilePhoto = styled.img`
//   width: 100px;
//   height: 100px;
//   border-radius: 50%;
//   margin-right: 1.5rem;
//   object-fit: cover;
//   border: 2px solid ${({ theme }) => theme.primary};
// `;

// const ProfileInfo = styled.div`
//   h2 {
//     color: ${({ theme }) => theme.primary};
//     margin-bottom: 0.5rem;
//   }
//   p {
//     color: ${({ theme }) => theme.textSecondary};
//   }
// `;

// const TestCardsContainer = styled.div`
//   display: grid;
//   grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
//   gap: 1.5rem;
// `;

// const TestCard = styled.div`
//   background: ${({ theme }) => theme.inputBg};
//   padding: 1.5rem;
//   border-radius: 8px;
//   box-shadow: 0 4px 8px ${({ theme }) => theme.shadow};
//   cursor: pointer;
//   transition: transform 0.3s ease, box-shadow 0.3s ease;

//   &:hover {
//     transform: translateY(-5px);
//     box-shadow: 0 6px 12px ${({ theme }) => theme.shadow};
//   }

//   h3 {
//     color: ${({ theme }) => theme.primary};
//     margin-bottom: 0.8rem;
//   }
//   p {
//     color: ${({ theme }) => theme.text};
//   }
// `;

// const Dashboard = () => {
//   const [user, setUser] = useState(null);
//   const navigate = useNavigate();
//   const userId = sessionStorage.getItem('userId'); //get username from local storage.

//   useEffect(() => {
//     const fetchUser = async () => {
//       if (userId) {
//         const { data, error } = await supabase
//           .from('users')
//           .select('username')
//           .eq('id', userId)
//           .single();

//         if (data) {
//           setUser({ username: data.username });
//         } else {
//           console.error('Error fetching user data:', error);
//           navigate('/login'); //redirect to login if username does not exist.
//         }
//       } else {
//         navigate('/login'); //redirect to login if username is null.
//       }
//     };

//     fetchUser();
//   }, [navigate, userId]);

//   const handleTestClick = (testRoute) => {
//     navigate(testRoute);
//   };

//   if (!user) {
//     return <div>Loading...</div>;
//   }

//   return (
//     <DashboardContainer>
//       <ProfileSection>
//         <ProfilePhoto src="https://via.placeholder.com/100" alt="Profile" />
//         <ProfileInfo>
//           <h2>{user.username}</h2>
//         </ProfileInfo>
//       </ProfileSection>

//       <TestCardsContainer>
//         <TestCard onClick={() => handleTestClick('/test1')}>
//           <h3>Test 1</h3>
//           <p>Description of Test 1.</p>
//         </TestCard>
//         <TestCard onClick={() => handleTestClick('/test2')}>
//           <h3>Test 2</h3>
//           <p>Description of Test 2.</p>
//         </TestCard>
//         <TestCard onClick={() => handleTestClick('/test3')}>
//           <h3>Test 3</h3>
//           <p>Description of Test 3.</p>
//         </TestCard>
//         {/* Add more test cards as needed */}
//       </TestCardsContainer>

//       {/* Add other dashboard elements here */}
//     </DashboardContainer>
//   );
// };

// export default Dashboard;





















// //new
// import React, { useState, useEffect } from 'react';
// import { supabase } from '../services/supabase';
// import styled from 'styled-components';
// import ProfilePic from './profile.jpg';
// import { useNavigate } from 'react-router-dom';
// import { FaPlayCircle, FaUser, FaSignOutAlt } from 'react-icons/fa'; // Import icons

// const DashboardContainer = styled.div`
//   background: ${({ theme }) => theme.cardBg};
//   padding: 2rem;
//   border-radius: 12px;
//   box-shadow: 0 8px 20px ${({ theme }) => theme.shadow};
//   width: 80%;
//   max-width: 1200px;
//   margin: 2rem auto;
//   border: 1px solid ${({ theme }) => theme.border};
//   position: relative; // For logout button positioning
// `;

// const ProfileSection = styled.div`
//   display: flex;
//   align-items: center;
//   margin-bottom: 2rem;
// `;

// const ProfilePhoto = styled.img`
//   width: 100px;
//   height: 100px;
//   border-radius: 50%;
//   margin-right: 1.5rem;
//   object-fit: cover;
//   border: 2px solid ${({ theme }) => theme.primary};
// `;

// const TestPhoto = styled.img`
//   width: 100px;
//   height: 100px;
//   border-radius: 10%;
//   margin-right: 1.5rem;
//   object-fit: cover;
//   border: 2px solid ${({ theme }) => theme.primary};
// `;

// const ProfileInfo = styled.div`
//   h2 {
//     color: ${({ theme }) => theme.primary};
//     margin-bottom: 0.5rem;
//   }
// `;

// const TestCardsContainer = styled.div`
//   display: grid;
//   grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); // Increased card width
//   gap: 1.5rem;
// `;

// const TestCard = styled.div`
//   background: ${({ theme }) => theme.inputBg};
//   padding: 1.5rem;
//   border-radius: 8px;
//   box-shadow: 0 4px 8px ${({ theme }) => theme.shadow};
//   cursor: pointer;
//   transition: transform 0.3s ease, box-shadow 0.3s ease;
//   display: flex;
//   flex-direction: column;
//   justify-content: space-between;
//   min-height: 150px;

//   &:hover {
//     transform: translateY(-5px);
//     box-shadow: 0 6px 12px ${({ theme }) => theme.shadow};
//   }

//   h3 {
//     color: ${({ theme }) => theme.primary};
//     margin-bottom: 0.8rem;
//     display: flex;
//     align-items: center;
//     svg {
//       margin-right: 0.5rem;
//     }
//   }

//   button {
//     background: ${({ theme }) => theme.primary};
//     color: blue;
//     border: none;
//     padding: 0.7rem 1rem;
//     border-radius: 6px;
//     cursor: pointer;
//     display: flex;
//     align-items: center;
//     justify-content: center;
//     svg {
//       margin-left: 0.5rem;
//     }
//   }
// `;


// const LogoutButton = styled.button`
//   position: absolute;
//   top: 1rem;
//   right: 1rem;
//   background: ${({ theme }) => theme.error};
//   color: red;
//   border: none;
//   padding: 0.5rem 1rem;
//   border-radius: 6px;
//   cursor: pointer;
//   display: flex;
//   align-items: center;
//   svg {
//     margin-right: 0.5rem;
//   }
// `;

// const Dashboard = () => {
//   const [user, setUser] = useState(null);
//   const navigate = useNavigate();
//   const userId = sessionStorage.getItem('userId'); // Get userId from sessionStorage

//   useEffect(() => {
//     const fetchUser = async () => {
//       if (userId) {
//         const { data, error } = await supabase
//           .from('users')
//           .select('username')
//           .eq('id', userId) // Fetch by userId
//           .single();

//         if (data) {
//           setUser({ username: data.username });
//         } else {
//           console.error('Error fetching user data:', error);
//           navigate('/login');
//         }
//       } else {
//         navigate('/login');
//       }
//     };

//     fetchUser();
//   }, [navigate, userId]);

//   const handleTestClick = (testRoute) => {
//     navigate(testRoute);
//   };

//   const handleLogout = () => {
//     sessionStorage.removeItem('userId'); // Clear userId
//     navigate('/login');
//   };

//   if (!user) {
//     return <div>Loading...</div>;
//   }

//   return (
//     <DashboardContainer>
//       <LogoutButton onClick={handleLogout}>
//         <FaSignOutAlt /> Logout
//       </LogoutButton>
//       <ProfileSection>
//         <ProfilePhoto src={ProfilePic} alt="Profile" />
//         <ProfileInfo>
//           <h2><FaUser/>{user.username}</h2>
//         </ProfileInfo>
//       </ProfileSection>

//       <TestCardsContainer>
//         <TestCard onClick={() => handleTestClick('/test1')}>
//           <h3>Test 1</h3>
//           <button>Start Test <FaPlayCircle/></button>
//         </TestCard>
//         <TestCard onClick={() => handleTestClick('/test2')}>
//           <h3>Test 2</h3>
//           <button>Start Test <FaPlayCircle/></button>
//         </TestCard>
//         <TestCard onClick={() => handleTestClick('/test3')}>
//           <h3>Test 3</h3>
//           <button>Start Test <FaPlayCircle/></button>
//         </TestCard>
//       </TestCardsContainer>
//     </DashboardContainer>
//   );
// };

// export default Dashboard;



//newui

// import React, { useState, useEffect } from 'react';
// import { supabase } from '../services/supabase';
// import styled from 'styled-components';
// import ProfilePic from './profile.jpg';
// import { useNavigate } from 'react-router-dom';
// import { FaPlayCircle, FaUser, FaSignOutAlt } from 'react-icons/fa';

// const DashboardContainer = styled.div`
//   background: ${({ theme }) => theme.cardBg};
//   padding: 2.5rem;
//   border-radius: 16px;
//   box-shadow: 0 12px 30px ${({ theme }) => theme.shadow};
//   width: 90%;
//   max-width: 1200px;
//   margin: 8rem auto;
//   border: 1px solid ${({ theme }) => theme.border};
//   position: relative;
//   transition: all 0.3s ease-in-out;
// `;

// const ProfileSection = styled.div`
//   display: flex;
//   align-items: center;
//   margin-bottom: 2.5rem;
//   border-bottom: 1px solid ${({ theme }) => theme.border};
//   padding-bottom: 1.5rem;
// `;

// const ProfilePhoto = styled.img`
//   width: 110px;
//   height: 110px;
//   border-radius: 50%;
//   margin-right: 1.8rem;
//   object-fit: cover;
//   border: 3px solid ${({ theme }) => theme.primary};
// `;

// const ProfileInfo = styled.div`
//   h2 {
//     font-size: 1.8rem;
//     color: ${({ theme }) => theme.primary};
//     margin: 0;
//     display: flex;
//     align-items: center;
//     svg {
//       margin-right: 0.6rem;
//       font-size: 1.2rem;
//     }
//   }
// `;

// const TestCardsContainer = styled.div`
//   display: grid;
//   grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
//   gap: 2rem;
// `;

// const TestCard = styled.div`
//   background: ${({ theme }) => theme.inputBg};
//   padding: 2rem;
//   border-radius: 12px;
//   box-shadow: 0 6px 18px ${({ theme }) => theme.shadow};
//   cursor: pointer;
//   transition: transform 0.3s ease, box-shadow 0.3s ease;
//   display: flex;
//   flex-direction: column;
//   justify-content: space-between;
//   min-height: 180px;

//   &:hover {
//     transform: translateY(-5px);
//     box-shadow: 0 8px 24px ${({ theme }) => theme.shadow};
//   }

//   h3 {
//     font-size: 1.5rem;
//     color: ${({ theme }) => theme.primary};
//     margin-bottom: 1rem;
//     display: flex;
//     align-items: center;
//     svg {
//       margin-right: 0.5rem;
//       font-size: 1.2rem;
//     }
//   }

//   button {
//     background: ${({ theme }) => theme.primary};
//     color: black;
//     border: none;
//     padding: 0.8rem 1.2rem;
//     border-radius: 8px;
//     cursor: pointer;
//     font-size: 1rem;
//     display: flex;
//     align-items: center;
//     justify-content: center;
//     transition: background 0.3s ease;
//     svg {
//       margin-left: 0.5rem;
//       font-size: 1.2rem;
//     }

//     &:hover {
//       background: ${({ theme }) => theme.hoverPrimary || '#0056b3'};
//     }
//   }
// `;

// const LogoutButton = styled.button`
//   position: absolute;
//   top: 1rem;
//   right: 1rem;
//   background: ${({ theme }) => theme.error};
//   color: black;
//   border: none;
//   padding: 0.6rem 1rem;
//   border-radius: 8px;
//   cursor: pointer;
//   font-size: 0.9rem;
//   display: flex;
//   align-items: center;
//   transition: background 0.3s ease;
//   svg {
//     margin-right: 0.5rem;
//     font-size: 1rem;
//   }
  
//   &:hover {
//     background: ${({ theme }) => theme.hoverError || '#c0392b'};
//   }
// `;

// const Dashboard = () => {
//   const [user, setUser] = useState(null);
//   const navigate = useNavigate();
//   const userId = sessionStorage.getItem('userId');

//   useEffect(() => {
//     const fetchUser = async () => {
//       if (userId) {
//         const { data, error } = await supabase
//           .from('users')
//           .select('username')
//           .eq('id', userId)
//           .single();

//         if (data) {
//           setUser({ username: data.username });
//         } else {
//           console.error('Error fetching user data:', error);
//           navigate('/login');
//         }
//       } else {
//         navigate('/login');
//       }
//     };

//     fetchUser();
//   }, [navigate, userId]);

//   const handleTestClick = (testRoute) => {
//     navigate(testRoute);
//   };

//   const handleLogout = () => {
//     sessionStorage.removeItem('userId');
//     navigate('/login');
//   };

//   if (!user) {
//     return <div>Loading...</div>;
//   }

//   return (
//     <DashboardContainer>
//       <LogoutButton onClick={handleLogout}>
//         <FaSignOutAlt /> Logout
//       </LogoutButton>
//       <ProfileSection>
//         <ProfilePhoto src={ProfilePic} alt="Profile" />
//         <ProfileInfo>
//           <h2><FaUser /> {user.username}</h2>
//         </ProfileInfo>
//       </ProfileSection>
//       <TestCardsContainer>
//         <TestCard onClick={() => handleTestClick('/test1')}>
//           <h3><FaPlayCircle /> Test 1</h3>
//           <button>Start Test <FaPlayCircle /></button>
//         </TestCard>
//         <TestCard onClick={() => handleTestClick('/test2')}>
//           <h3><FaPlayCircle /> Test 2</h3>
//           <button>Start Test <FaPlayCircle /></button>
//         </TestCard>
//         <TestCard onClick={() => handleTestClick('/test3')}>
//           <h3><FaPlayCircle /> Test 3</h3>
//           <button>Start Test <FaPlayCircle /></button>
//         </TestCard>
//       </TestCardsContainer>
//     </DashboardContainer>
//   );
// };

// export default Dashboard;



// //bui
// import React, { useState, useEffect } from 'react';
// import { supabase } from '../services/supabase';
// import styled from 'styled-components';
// import ProfilePic from './profile.jpg';
// import { useNavigate } from 'react-router-dom';
// import { FaPlayCircle, FaUser , FaSignOutAlt } from 'react-icons/fa';

// const DashboardContainer = styled.div`
//   background: linear-gradient(135deg, #f0f4f8, #e0e7ff);
//   padding: 2.5rem;
//   border-radius: 16px;
//   box-shadow: 0 12px 30px rgba(0, 0, 0, 0.1);
//   width: 90%;
//   max-width: 1200px;
//   margin: 8rem auto;
//   border: 1px solid #d1d5db;
//   position: relative;
//   transition: all 0.3s ease-in-out;
//   overflow: hidden; /* Prevent overflow from animations */
// `;

// const ProfileSection = styled.div`
//   display: flex;
//   align-items: center;
//   margin-bottom: 2.5rem;
//   border-bottom: 1px solid #d1d5db;
//   padding-bottom: 1.5rem;
// `;

// const ProfilePhoto = styled.img`
//   width: 110px;
//   height: 110px;
//   border-radius: 50%;
//   margin-right: 1.8rem;
//   object-fit: cover;
//   border: 3px solid #4f46e5;
//   transition: transform 0.3s ease;

//   &:hover {
//     transform: scale(1.05);
//   }
// `;

// const ProfileInfo = styled.div`
//   h2 {
//     font-size: 2rem;
//     color: #4f46e5;
//     margin: 0;
//     display: flex;
//     align-items: center;
//     svg {
//       margin-right: 0.6rem;
//       font-size: 1.5rem;
//     }
//   }
// `;

// const TestCardsContainer = styled.div`
//   display: grid;
//   grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
//   gap: 2rem;
// `;

// const TestCard = styled.div`
//   background: #ffffff;
//   padding: 2rem;
//   border-radius: 12px;
//   box-shadow: 0 6px 18px rgba(0, 0, 0, 0.1);
//   cursor: pointer;
//   transition: transform 0.3s ease, box-shadow 0.3s ease;
//   display: flex;
//   flex-direction: column;
//   justify-content: space-between;
//   min-height: 180px;
//   position: relative; /* For pseudo-element positioning */

//   &:hover {
//     transform: translateY(-5px);
//     box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
//   }

//   &::before {
//     content: '';
//     position: absolute;
//     top: 0;
//     left: 0;
//     right: 0;
//     bottom: 0;
//     background: rgba(79, 70, 229, 0.1);
//     border-radius: 12px;
//     opacity: 0;
//     transition: opacity 0.3s ease;
//   }

//   &:hover::before {
//     opacity: 1;
//   }

//   h3 {
//     font-size: 1.5rem;
//     color: #4f46e5;
//     margin-bottom: 1rem;
//     display: flex;
//     align-items: center;
//     svg {
//       margin-right: 0.5rem;
//       font-size: 1.5rem;
//     }
//   }

//   button {
//     background: #4f46e5;
//     color: white;
//     border: none;
//     padding: 0.8rem 1.2rem;
//     border-radius: 8px;
//     cursor: pointer;
//     font-size: 1rem;
//     display: flex;
//     align-items: center;
//     justify-content: center;
//     transition: background 0.3s ease, transform 0.3s ease;

//     svg {
//       margin-left: 0.5rem;
//       font-size: 1.2rem;
//     }

//     &:hover {
//       background: #4338ca;
//       transform: scale(1.05);
//     }
//   }
// `;

// const LogoutButton = styled.button`
//   position: absolute;
//   top: 1rem;
//   right: 1rem;
//   background: #ef4444;
//   color: white;
//   border: none;
//   padding: 0.6rem 1rem;
//   border-radius: 8px;
//   cursor: pointer;
//   font-size: 0.9rem;
//   display: flex;
//   align-items: center;
//   transition: background 0.3s ease;

//   svg {
//     margin-right: 0.5rem;
//     font-size: 1rem;
//   }

//   &:hover {
//     background: #dc2626;
//   }
// `;

// const Dashboard = () => {
//   const [user, setUser ] = useState(null);
//   const navigate = useNavigate();
//   const userId = sessionStorage.getItem('userId');

//   useEffect(() => {
//     const fetchUser  = async () => {
//       if (userId) {
//         const { data, error } = await supabase
//           .from('users')
//           .select('username')
//           .eq('id', userId)
//           .single();

//         if (data) {
//           setUser ({ username: data.username });
//         } else {
//           console.error('Error fetching user data:', error);
//           navigate('/login');
//         }
//       } else {
//         navigate('/login');
//       }
//     };

//     fetchUser ();
//   }, [navigate, userId]);

//   const handleTestClick = (testRoute) => {
//     navigate(testRoute);
//   };

//   const handleLogout = () => {
//     sessionStorage.removeItem('userId');
//     navigate('/login');
//   };

//   if (!user) {
//     return <div>Loading...</div>;
//   }

//   return (
//     <DashboardContainer>
//       <LogoutButton onClick={handleLogout}>
//         <FaSignOutAlt /> Logout
//       </LogoutButton>
//       <ProfileSection>
//         <ProfilePhoto src={ProfilePic} alt="Profile" />
//         <ProfileInfo>
//           <h2><FaUser  /> {user.username}</h2>
//         </ProfileInfo>
//       </ProfileSection>
//       <TestCardsContainer>
//         <TestCard onClick={() => handleTestClick('/test1')}>
//           <h3><FaPlayCircle /> Test 1</h3>
//           <button>Start Test <FaPlayCircle /></button>
//         </TestCard>
//         <TestCard onClick={() => handleTestClick('/test2')}>
//           <h3><FaPlayCircle /> Test 2</h3>
//           <button>Start Test <FaPlayCircle /></button>
//         </TestCard>
//         <TestCard onClick={() => handleTestClick('/test3')}>
          
//           <h3><FaPlayCircle /> Test 3</h3>
//           <button>Start Test <FaPlayCircle /></button>
//         </TestCard>
//       </TestCardsContainer>
//     </DashboardContainer>
//   );
// };

// export default Dashboard;

import React, { useState, useEffect } from 'react';
import { supabase } from '../services/supabase';
import styled from 'styled-components';
import ProfilePic from './profile.jpg';
import { useNavigate } from 'react-router-dom';
import { FaPlayCircle, FaUser , FaSignOutAlt } from 'react-icons/fa';

const DashboardContainer = styled.div`
  background: #f7f9fc; /* Light background */
  padding: 2.5rem;
  border-radius: 16px;
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.1);
  width: 90%;
  max-width: 1200px;
  margin: 8rem auto;
  border: 1px solid #e0e7ff; /* Light border */
  position: relative;
  transition: all 0.3s ease-in-out;
  overflow: hidden; /* Prevent overflow from animations */
`;

const ProfileSection = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 2.5rem;
  border-bottom: 1px solid #e0e7ff; /* Light border */
  padding-bottom: 1.5rem;
`;

const ProfilePhoto = styled.img`
  width: 110px;
  height: 110px;
  border-radius: 50%;
  margin-right: 1.8rem;
  object-fit: cover;
  border: 3px solid black; /* Soft blue */
  transition: transform 0.3s ease;

  &:hover {
    transform: scale(1.05);
  }
`;

const ProfileInfo = styled.div`
  h2 {
    font-size: 2rem;
    color: black;
    margin: 0;
    display: flex;
    align-items: center;
    svg {
      margin-right: 0.6rem;
      font-size: 1.5rem;
    }
  }
`;

const TestCardsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2rem;
`;

const TestCard = styled.div`
  background: #ffffff; /* White background for cards */
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-height: 180px;
  position: relative; /* For pseudo-element positioning */

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  }

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(59, 130, 246, 0.1); /* Soft blue overlay */
    border-radius: 12px;
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  &:hover::before {
    opacity: 1;
  }

  h3 {
    font-size: 1.5rem;
    color:black;
    margin-bottom: 1rem;
    display: flex;
    align-items: center;
    svg {
      margin-right: 0.5rem;
      font-size: 1.5rem;
    }
  }

  button {
    background:green;
    color: white;
    border: none;
    padding: 0.8rem 1.2rem;
    border-radius: 8px;
    cursor: pointer;
    font-size: 1rem;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background 0.3s ease, transform 0.3s ease;

    svg {
      margin-left: 0.5rem;
      font-size: 1.2rem;
    }

    &:hover {
      background: #2563eb; /* Darker blue on hover */
      transform: scale(1.05);
    }
  }
`;

const LogoutButton = styled.button`
  position: absolute;
  top: 1rem;
  right: 1rem;
  background:blue; /* Red for logout */
  color: white;
  border: none;
  padding: 0.6rem 1rem;
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  transition: background 0.3s ease;

  svg {
    margin-right: 0.5rem;
    font-size: 1rem;
  }

  &:hover {
    background: #dc2626; /* Darker red on hover */
  }
`;

const Dashboard = () => {
  const [user, setUser ] = useState(null);
  //const [name, setName ] = useState(null);
  const navigate = useNavigate();
  const userId = sessionStorage.getItem('userId');

  useEffect(() => {
    const fetchUser  = async () => {
      if (userId) {
        const { data, error } = await supabase
          .from('users')
          .select('*')
          .eq('id', userId)
          .single();

        if (data) {
          setUser ({ username: data.username, name: data.name });
          //setName({name: data.name});
        } else {
          console.error('Error fetching user data:', error);
          navigate('/login');
        }
      } else {
        navigate('/login');
      }
    };

    fetchUser ();
  }, [navigate, userId]);

  const handleTestClick = (testRoute) => {
    navigate(testRoute);
  };

  const handleLogout = () => {
    sessionStorage.removeItem('userId');
    navigate('/login');
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <DashboardContainer>
      <LogoutButton onClick={handleLogout}>
        <FaSignOutAlt /> Logout
      </LogoutButton>
      <ProfileSection>
        <ProfilePhoto src={ProfilePic} alt="Profile" />
        <ProfileInfo>
          <h2>Hello {user.name}</h2>
          <h4><FaUser  />Email: {user.username}</h4>
        </ProfileInfo>
      </ProfileSection>
      <TestCardsContainer>
        <TestCard onClick={() => handleTestClick('/StartExam')}>
          <h3><FaPlayCircle /> Test 1</h3>
          <button>Start Test <FaPlayCircle /></button>
        </TestCard>
        <TestCard onClick={() => handleTestClick('/StartExam')}>
        <h3><FaPlayCircle /> Test 2</h3>
          <button>Start Test <FaPlayCircle /></button>
        </TestCard>
        <TestCard onClick={() => handleTestClick('/StartExam')}>
          <h3><FaPlayCircle /> Test 3</h3>
          <button>Start Test <FaPlayCircle /></button>
        </TestCard>
      </TestCardsContainer>
    </DashboardContainer>
  );
};

export default Dashboard;