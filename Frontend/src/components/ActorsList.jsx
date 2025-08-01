
import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const ActorsList = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Get actors data from location state - handle both array and object formats
  const stateData = location.state;
  let actors = [];
  
  if (Array.isArray(stateData)) {
    // Direct array of actors
    actors = stateData;
  } else if (stateData && stateData.actors) {
    // Object with actors property
    actors = stateData.actors;
  } else if (stateData && Array.isArray(stateData.data)) {
    // Object with data property containing actors
    actors = stateData.data;
  }
  
  console.log('Location state:', stateData);
  console.log('Processed actors:', actors);

  const totalActors = actors.length;
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('name'); // name, totalRuns, modifiedAt
  const [isLoading, setIsLoading] = useState(false);

  // Handle actor selection
  const handleActorSelect = (actor) => {
    navigate(`/actor/${actor.id}`, { 
      state: { 
        actor: actor,
        actors: actors // Pass all actors for context
      } 
    });
  };

  // Handle back to API key
  const handleBackToApiKey = () => {
    navigate('/', { replace: true });
  };

  // Redirect if no actors data
  if (!actors || !Array.isArray(actors) || actors.length === 0) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <svg className="mx-auto h-12 w-12 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
          <h3 className="mt-2 text-lg font-medium text-slate-800">No actors data</h3>
          <p className="mt-1 text-sm text-slate-600">Please go back and enter your API key to load actors.</p>
          <div className="mt-2 text-xs text-slate-500">
            Debug: {JSON.stringify(stateData)}
          </div>
          <button
            onClick={handleBackToApiKey}
            className="mt-4 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-700 hover:bg-blue-800 transition-all duration-300"
          >
            Go Back to API Key
          </button>
        </div>
      </div>
    );
  }

  // Filter actors based on search term
  const filteredActors = actors.filter(actor =>
    actor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    actor.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    actor.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Sort actors
  const sortedActors = [...filteredActors].sort((a, b) => {
    switch (sortBy) {
      case 'totalRuns':
        return (b.stats?.totalRuns || 0) - (a.stats?.totalRuns || 0);
      case 'modifiedAt':
        return new Date(b.modifiedAt) - new Date(a.modifiedAt);
      case 'name':
      default:
        return a.name.localeCompare(b.name);
    }
  });

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatNumber = (num) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num?.toString() || '0';
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-700 mx-auto mb-4"></div>
          <p className="text-slate-600">Loading your actors...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        {/* Animated Gradient Orbs */}
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-blue-300/15 to-slate-300/15 rounded-full mix-blend-multiply filter blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 left-1/4 w-80 h-80 bg-gradient-to-r from-slate-300/15 to-blue-300/15 rounded-full mix-blend-multiply filter blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
      </div>

      {/* Header */}
      <div className="relative z-10 bg-slate-50 border-b border-slate-200 top-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-800 to-blue-700 bg-clip-text text-transparent">Your Apify Actors</h1>
                <p className="mt-2 text-slate-600">
                  {totalActors} actor{totalActors !== 1 ? 's' : ''} found
                  {searchTerm && ` • ${filteredActors.length} matching "${searchTerm}"`}
                </p>
              </div>
              <button
                onClick={handleBackToApiKey}
                className="inline-flex items-center px-4 py-2 border border-slate-300 rounded-md shadow-sm text-sm font-medium text-slate-600 bg-white hover:bg-slate-50 transition-all duration-300"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Change API Key
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          {/* Search */}
          <div className="flex-1">
            <div className="relative group">
              <svg 
                className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-500" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Search actors by name, title, or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white border border-slate-300 rounded-xl text-slate-800 placeholder-slate-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 hover:border-slate-400 shadow-sm"
              />
              {/* Focus Ring Effect */}
              <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500/10 to-slate-500/10 opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
            </div>
          </div>

          {/* Sort */}
          <div className="sm:w-48">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full px-3 py-3 bg-white border border-slate-300 rounded-xl text-slate-800 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 hover:border-slate-400 shadow-sm"
            >
              <option value="name" className="bg-white text-slate-800">Sort by Name</option>
              <option value="totalRuns" className="bg-white text-slate-800">Sort by Popularity</option>
              <option value="modifiedAt" className="bg-white text-slate-800">Sort by Modified Date</option>
            </select>
          </div>
        </div>

        {/* No Results */}
        {filteredActors.length === 0 && searchTerm && (
          <div className="text-center py-12">
            <svg className="mx-auto h-12 w-12 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-slate-800">No actors found</h3>
            <p className="mt-1 text-sm text-slate-600">Try adjusting your search terms.</p>
          </div>
        )}

        {/* Actors Grid */}
        {filteredActors.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedActors.map((actor) => (
              <div
                key={actor.id}
                className="group relative bg-white border border-slate-200 rounded-2xl hover:bg-slate-50 transition-all duration-300 cursor-pointer hover:scale-105 hover:shadow-xl hover:shadow-blue-500/10 hover:border-blue-300 shadow-sm"
                onClick={() => handleActorSelect(actor)}
              >
                {/* Gradient Border Effect on Hover */}
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-slate-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                
                <div className="relative p-6">
                  {/* Actor Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-slate-800 truncate group-hover:text-blue-700 transition-colors duration-300">
                        {actor.title || actor.name}
                      </h3>
                      <p className="text-sm text-slate-500 mt-1">
                        by {actor.username}
                      </p>
                    </div>
                    {actor.isPublic && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-700 border border-blue-200">
                        Public
                      </span>
                    )}
                  </div>

                  {/* Description */}
                  <p className="text-slate-600 text-sm mb-4 line-clamp-3">
                    {actor.description || 'No description available'}
                  </p>

                  {/* Stats */}
                  <div className="flex items-center justify-between text-sm text-slate-500 mb-4">
                    <div className="flex items-center">
                      <svg className="w-4 h-4 mr-1 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                      {formatNumber(actor.stats?.totalRuns)} runs
                    </div>
                    <div className="flex items-center">
                      <svg className="w-4 h-4 mr-1 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                      </svg>
                      {formatNumber(actor.stats?.totalUsers)} users
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-500">
                      Modified {formatDate(actor.modifiedAt)}
                    </span>
                    <div className="flex items-center text-blue-700 text-sm font-medium group-hover:text-blue-600 transition-colors duration-300">
                      Select Actor
                      <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* No Actors */}
        {actors.length === 0 && (
          <div className="text-center py-12">
            <svg className="mx-auto h-12 w-12 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-slate-800">No actors found</h3>
            <p className="mt-1 text-sm text-slate-600">You don't have any actors in your Apify account yet.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ActorsList;