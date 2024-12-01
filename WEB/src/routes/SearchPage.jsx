import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // For navigation
import supabase from '../utils/supabase';

const SearchPage = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const navigate = useNavigate(); // Initialize navigation

  const handleSearch = async () => {
    try {
      const { data, error } = await supabase
        .from('articles') // Replace with your table name
        .select('*')
        .ilike('post_title', `%${query}%`); // Replace with your column name

      if (error) throw error;
      setResults(data);
    } catch (error) {
      console.error('Error fetching data:', error.message);
    }
  };

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
            <button className="btn btn-primary btn-lg" onClick={handleSearch}>
              Search
            </button>
          </div>
        </div>
      </div>

      {/* Search Results */}
      <div className="mt-4">
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
      </div>
    </div>
  );
};

export default SearchPage;
