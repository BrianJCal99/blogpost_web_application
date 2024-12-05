import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import HomePage from './routes/HomePage';
import PostPage from './routes/PostPage';
import SigninPage from './routes/SigninPage';
import SignupPage from './routes/SignupPage';
import Profile from './routes/UserProfilePage';
import UserPostsPage from './routes/UserPostsPage';
import AllPostsPage from './routes/AllPostsPage';
import AllTagsPage from './routes/AllTagsPage.jsx';
import SearchPage from './routes/SearchPage.jsx';
import DetailedPostViewPage from './routes/DetailedPostViewPage.jsx';
import DetailedUserViewPage from './routes/DetailedUserViewPage.jsx';
import DeatiledTagsViewPage from './routes/DeatiledTagsViewPage.jsx';
import {Routes, Route} from 'react-router-dom';
import ProtectedRoute from './ProtectedRoutes.js';

function App() {
  return (
    <div>
      <Routes>
          {/* Public route */}
          <Route path='signin' element={<SigninPage />}/>
          <Route path='signup' element={<SignupPage />}/>
          <Route path='posts' element={<AllPostsPage />}/>
          <Route path='tags' element={<AllTagsPage />}/>
          <Route path='search' element={<SearchPage />}/>
          <Route path="/posts/:id" element={<DetailedPostViewPage />} />
          <Route path="/users/:id" element={<DetailedUserViewPage />} />
          <Route path="/tags/:tag_name" element={<DeatiledTagsViewPage />} />
          
          {/* Protected route */}
          <Route path='newpost' element={<ProtectedRoute><PostPage /></ProtectedRoute>}/>
          <Route path='profile' element={<ProtectedRoute><Profile /></ProtectedRoute>}/>
          <Route path='myposts' element={<ProtectedRoute><UserPostsPage /></ProtectedRoute>}/>

          {/* Fallback route */}
          <Route index element={<HomePage />}/>
      </Routes>
    </div>
  );
}

export default App;
