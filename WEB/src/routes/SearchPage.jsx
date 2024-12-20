import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom'; // For navigation
import supabase from '../utils/supabase';

// Debounce function to limit API calls
const debounce = (func, delay) => {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      func(...args);
    }, delay);
  };
};

const SearchPage = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false); // Loading state for better UX
  const [tab, setTab] = useState('posts'); // Track active tab
  const navigate = useNavigate(); // Initialize navigation

  // Debounced search function
  const handleSearch = async (searchQuery) => {
    if (searchQuery.trim() === '') {
      setResults([]); // Clear results if the search query is empty
      return;
    }

    setLoading(true); // Show loading indicator during search

    try {
      // Query posts
      const { data: postResults, error: postError } = await supabase
        .from('posts') // Replace with your posts table name
        .select('*')
        .ilike('title', `%${searchQuery}%`); // Replace with your post title column

      if (postError) throw postError;

      // Query users
      const { data: userResults, error: userError } = await supabase
        .from('users') // Replace with your users table name
        .select('*')
        .or(`user_name.ilike.%${searchQuery}%,unique_user_name.ilike.%${searchQuery}%`);

      if (userError) throw userError;

      // Query tags
      const { data: tagsResults, error: tagsError } = await supabase
        .from('tags') // Replace with your posts table name
        .select('*')
        .ilike('name', `%${searchQuery}%`); // Replace with your post title column

      if (tagsError) throw tagsError;

      // Store both results separately for tab filtering
      setResults({
        posts: postResults.map(post => ({ ...post, type: 'post' })),
        users: userResults.map(user => ({ ...user, type: 'user' })),
        tags: tagsResults.map(user => ({ ...user, type: 'tag' })),
      });      
    } catch (error) {
      console.error('Error fetching data:', error.message);
    } finally {
      setLoading(false); // Stop loading indicator
    }
  };

  // Debounced version of handleSearch
  const debouncedSearch = useMemo(() => debounce(handleSearch, 300), []);

  // Update results as the query changes
  useEffect(() => {
    if (query.trim() !== '') {
      debouncedSearch(query);
    } else {
      setResults({ posts: [], users: [] }); // Clear results if query is empty
    }
  }, [query, debouncedSearch]);

  const handleItemClick = (item) => {
    if (item.type === 'post') {
      navigate(`/posts/${item.id}`); // Navigate to post details
    } else if (item.type === 'user') {
      navigate(`/users/${item.id}`); // Navigate to user details
    } else if (item.type === 'tag') {
      navigate(`/tags/${item.name}`); // Navigate to user details
    }
  };

  return (
    <div className="container mt-5">
      {/* Search Bar */}
      <div className="row justify-content-center">
        <h2 className="text-center my-3">Search</h2>
        <div className="col-md-6">
          <div className="input-group">
            <input
              type="text"
              className="form-control form-control-lg"
              placeholder="Search..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="mt-4">
        <div className="d-flex justify-content-center">
          <div className="btn-group btn-group-toggle" data-toggle="buttons">
            <label
              className={`btn ${tab === 'posts' ? 'btn-dark active' : 'btn-outline-dark'}`}
              onClick={() => setTab('posts')}
            >
              <input
                type="radio"
                name="options"
                id="option1"
                autoComplete="off"
                checked={tab === 'posts'}
                readOnly
              /> 
              Posts
            </label>
            <label
              className={`btn ${tab === 'users' ? 'btn-dark active' : 'btn-outline-dark'}`}
              onClick={() => setTab('users')}
            >
              <input
                type="radio"
                name="options"
                id="option2"
                autoComplete="off"
                checked={tab === 'users'}
                readOnly
              /> 
              Users
            </label>
            <label
              className={`btn ${tab === 'tags' ? 'btn-dark active' : 'btn-outline-dark'}`}
              onClick={() => setTab('tags')}
            >
              <input
                type="radio"
                name="options"
                id="option3"
                autoComplete="off"
                checked={tab === 'tags'}
                readOnly
              /> 
              Hashtags
            </label>
          </div>
        </div>
      </div>


      {/* Search Results */}
      <div className="mt-4">
        {loading ? (
          <p className="text-center">Searching...</p>
        ) : query.trim() === '' ? (
          <p className="text-center">Start typing to search...</p>
        ) : results[tab]?.length === 0 ? (
          <p className="text-center">No {tab} found for <strong>"{query}"</strong></p>
        ) : (
          <ul className="list-group">
            {results[tab]?.map((item) => (
              <li
                key={item.id} // Use unique ID
                className="list-group-item list-group-item-action"
                onClick={() => handleItemClick(item)} // Pass item to handler
              >
                {tab === 'posts' ? (
                  <div>{item.title}</div>
                ) : tab === 'tags' ? (
                  <div>#{item.name}</div> // Show tag name for 'tags'
                ) : (
                  <div>
                    <div>{item.user_name}</div>
                    <div className="small text-muted">@{item.unique_user_name}</div>
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default SearchPage;
