import React, { useState } from 'react';
import supabase from '../utils/supabase';

const SearchPage = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);

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

  return (
    <div className="container mt-5">
      {/* Centered and Enlarged Search Bar */}
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="input-group">
            <input
              type="text"
              className="form-control form-control-lg" // Enlarged input
              placeholder="Search..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <button
              className="btn btn-primary btn-lg" // Enlarged button
              onClick={handleSearch}
            >
              Search
            </button>
          </div>
        </div>
      </div>

      {/* Display Results */}
      <div className="mt-4">
        <ul className="list-group">
          {results.map((item, index) => (
            <li key={index} className="list-group-item">
              {item.post_title} {/* Replace with desired data */}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default SearchPage;
