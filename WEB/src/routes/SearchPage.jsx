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
  const navigate = useNavigate(); // Initialize navigation

  // Debounced search function
  const handleSearch = async (searchQuery) => {
    if (searchQuery.trim() === '') {
      setResults([]); // Clear results if the search query is empty
      return;
    }

    setLoading(true); // Show loading indicator during search

    try {
      const { data, error } = await supabase
        .from('articles') // Replace with your table name
        .select('*')
        .ilike('post_title', `%${searchQuery}%`); // Replace with your column name

      if (error) throw error;
      setResults(data);
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
      setResults([]); // Clear results if query is empty
    }
  }, [query, debouncedSearch]);

  const handleItemClick = (id) => {
    navigate(`/posts/${id}`); // Navigate to the details page with the item's ID
  };

  return (
    <div className="container mt-5">
      {/* Search Bar */}
      <div className="row justify-content-center">
        <h2 className="text-center my-3">&#x1F50E; Search posts</h2>
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

      {/* Search Results */}
      <div className="mt-4">
        {loading ? (
          <p className="text-center">Searching...</p>
        ) : query.trim() === '' ? (
          <p className="text-center">Start typing to search...</p>
        ) : results.length === 0 ? (
          <p className="text-center">No results found for <strong>"{query}"</strong></p>
        ) : (
          <ul className="list-group">
            {results.map((item) => (
              <li
                key={item.id} // Use unique ID
                className="list-group-item list-group-item-action"
                onClick={() => handleItemClick(item.id)} // Pass ID to handler
              >
                {item.post_title} {/* Replace with desired data */}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );  
};

export default SearchPage;
