import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import HomePage from './routes/HomePage';
import PostPage from './routes/PostPage';
import SigninPage from './routes/SigninPage';
import SignupPage from './routes/SignupPage';
import Profile from './routes/UserProfilePage';
import UserPostsPage from './routes/UserPostsPage';
import AllPostsPage from './routes/AllPostsPage';
import {Routes, Route} from 'react-router-dom';
import ProtectedRoute from './ProtectedRoutes.js';

function App() {
  return (
    <div>
      <Routes>
          {/* Public route */}
          <Route path='signin' element={<SigninPage />}/>
          <Route path='signup' element={<SignupPage />}/>
          <Route path='allposts' element={<AllPostsPage />}/>
          
          {/* Protected route */}
          <Route path='post' element={<ProtectedRoute><PostPage /></ProtectedRoute>}/>
          <Route path='profile' element={<ProtectedRoute><Profile /></ProtectedRoute>}/>
          <Route path='myposts' element={<ProtectedRoute><UserPostsPage /></ProtectedRoute>}/>

          {/* Fallback route */}
          <Route index element={<HomePage />}/>
      </Routes>
    </div>
  );
}

export default App;
