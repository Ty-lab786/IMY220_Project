import React, { useState } from 'react';

const Search = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState({ users: [], posts: [], albums: [] });
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    try {
      const response = await fetch(`http://localhost:5000/api/search?q=${encodeURIComponent(query)}`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      if (response.ok) {
        const data = await response.json();
        setResults(data);
      }
    } catch (err) {
      console.error('Search error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Search Input */}
      <form onSubmit={handleSearch} className="flex gap-2">
        <label htmlFor="search-input" className="sr-only">Search</label>
        <input
          id="search-input"
          type="text"
          placeholder="Search users, posts, albums, or #hashtags..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="flex-1 bg-gray-900 border border-gray-800 rounded p-3 text-white focus:outline-none focus:border-cyan-500"
        />
        <button type="submit" className="bg-cyan-600 hover:bg-cyan-500 text-white font-bold px-6 py-3 rounded">
          Search
        </button>
      </form>

      {loading && <div className="text-white">Searching...</div>}

      {/* Results Section */}
      {!loading && (
        <div className="space-y-6">
          {/* Users Results */}
          {results.users.length > 0 && (
            <div>
              <h2 className="text-lg font-bold text-white mb-2">Users</h2>
              <div className="space-y-2">
                {results.users.map((u) => (
                  <div key={u._id} className="bg-gray-900 p-3 rounded border border-gray-800 text-white">
                    {u.username} ({u.email})
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Posts Results */}
          {results.posts.length > 0 && (
            <div>
              <h2 className="text-lg font-bold text-white mb-2">Posts</h2>
              <div className="space-y-2">
                {results.posts.map((p) => (
                  <div key={p._id} className="bg-gray-900 p-3 rounded border border-gray-800 text-white">
                    {p.title}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Search;