import { useState } from 'react';
import axios from "axios";
import { useNavigate } from 'react-router-dom';

const ApiKeyForm = ({ isLoading }) => {
  const navigate = useNavigate();
  const [apiKey, setApiKey] = useState('');
  const [error, setError] = useState('');
  const [isValidating, setIsValidating] = useState(false);
  const [showApiKey, setShowApiKey] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    // Basic validation
    if (!apiKey.trim()) {
      setError('Please enter your Apify API key');
      return;
    }

    // Format validation - Apify API keys start with apify_api_
    if (!apiKey.trim().startsWith('apify_api_') || apiKey.trim().length < 15) {
      setError('Invalid API key format. Expected format: apify_api_...');
      return;
    }

    setIsValidating(true);
    
    try {
      console.log('Making API request to backend with API key...');
      

      const response = await axios.get('http://localhost:5000/api/actors', {
        headers: {
          'x-api-key': apiKey.trim()
        },
        timeout: 30000 // 30 seconds timeout
      });

      console.log('Backend response:', response.data);

      if (response.data.success) {
        // Store API key in sessionStorage for other components
        sessionStorage.setItem('apify_api_key', JSON.stringify(apiKey.trim()));
        
        navigate("/actorslist", {state : response.data.data})
      } else {
        throw new Error(response.data.error?.message || 'Failed to fetch actors');
      }
      
      // Simulated success for demo
      setTimeout(() => {
        console.log("API key validated successfully");
        setIsValidating(false);
      }, 2000);
      
    } catch (err) {
      console.error('Error fetching actors:', err);
      
      let errorMessage = 'Failed to validate API key';
      
      if (err.response) {
        // Backend responded with an error
        const backendError = err.response.data?.error;
        switch (err.response.status) {
          case 400:
            errorMessage = backendError?.message || 'Invalid request. Please check your API key format.';
            break;
          case 401:
            errorMessage = 'Invalid API key. Please check your Apify API key and try again.';
            break;
          case 404:
            errorMessage = 'Backend service not found. Please ensure the backend is running.';
            break;
          case 429:
            errorMessage = 'Too many requests. Please wait a moment and try again.';
            break;
          case 500:
            errorMessage = 'Server error. Please try again later.';
            break;
          default:
            errorMessage = backendError?.message || `Server error (${err.response.status})`;
        }
      } else if (err.code === 'ECONNABORTED') {
        errorMessage = 'Request timed out. Please check your connection and try again.';
      } else if (err.code === 'ECONNREFUSED' || err.message.includes('Network Error')) {
        errorMessage = 'Cannot connect to backend. Please ensure the backend server is running on port 5000.';
      } else {
        errorMessage = err.message || 'An unexpected error occurred';
      }
      
      setError(errorMessage);
      setIsValidating(false);
    }
  };

  const handleApiKeyChange = (e) => {
    setApiKey(e.target.value);
    if (error) setError(''); // Clear error when user starts typing
  };

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div className="min-h-screen bg-white relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        {/* Animated Gradient Orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-blue-300/10 to-slate-400/10 rounded-full mix-blend-multiply filter blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-r from-slate-300/15 to-blue-400/15 rounded-full mix-blend-multiply filter blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
      </div>

      <div className="relative z-10 flex items-center justify-center min-h-screen p-6">
        <div className="w-full max-w-lg">
          {/* Back Navigation */}
          <div className="mb-8">
            <button 
              className="group flex items-center gap-2 text-slate-600 hover:text-blue-700 transition-colors duration-300"
              onClick={handleBack}
            >
              <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <span className="font-medium">Back</span>
            </button>
          </div>

          {/* Main Form Card */}
          <div className="relative bg-white border border-slate-200 rounded-3xl p-8 shadow-xl">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="relative mb-6">
                <div className="relative mx-auto w-20 h-20 bg-gradient-to-br from-blue-100 to-slate-100 rounded-2xl flex items-center justify-center border border-blue-200">
                  <svg 
                    className="w-10 h-10 text-blue-700" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={1.5} 
                      d="M15 7a2 2 0 012 2m-2-2a2 2 0 00-2 2m0 0v3m4 4H9m6 0V9a2 2 0 00-2-2M9 17v-3m0 3h6m-6 0H3" 
                    />
                  </svg>
                </div>
              </div>
              
              <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-800 to-blue-700 bg-clip-text text-transparent mb-3">
                Secure API Integration
              </h1>
              <p className="text-slate-600 text-lg">
                Connect your Apify account to access your actors
              </p>
            </div>

            {/* Security Badge */}
            <div className="flex justify-center mb-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 border border-blue-200 rounded-full text-blue-700 text-sm font-medium">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                </svg>
                End-to-End Encrypted
              </div>
            </div>

            {/* Form */}
            <div className="space-y-6">
              <div>
                <label 
                  htmlFor="apiKey" 
                  className="block text-sm font-semibold text-slate-700 mb-3"
                >
                  Apify API Key
                </label>
                <div className="relative group">
                  <input
                    type={showApiKey ? "text" : "password"}
                    id="apiKey"
                    value={apiKey}
                    onChange={handleApiKeyChange}
                    placeholder="apify_api_..."
                    className={`w-full px-4 py-4 pr-12 bg-white border rounded-xl text-slate-800 placeholder-slate-400 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all duration-300 ${
                      error 
                        ? 'border-red-400 bg-red-50' 
                        : 'border-slate-300 hover:border-blue-300'
                    }`}
                    disabled={isLoading || isValidating}
                  />
                  
                  {/* Toggle Show/Hide Button */}
                  <button
                    type="button"
                    onClick={() => setShowApiKey(!showApiKey)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center hover:text-blue-700 transition-colors duration-300"
                  >
                    {showApiKey ? (
                      <svg 
                        className={`w-5 h-5 transition-colors duration-300 ${
                          apiKey ? 'text-blue-700' : 'text-slate-400'
                        }`} 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path 
                          strokeLinecap="round" 
                          strokeLinejoin="round" 
                          strokeWidth={2} 
                          d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" 
                        />
                      </svg>
                    ) : (
                      <svg 
                        className={`w-5 h-5 transition-colors duration-300 ${
                          apiKey ? 'text-blue-700' : 'text-slate-400'
                        }`} 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path 
                          strokeLinecap="round" 
                          strokeLinejoin="round" 
                          strokeWidth={2} 
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" 
                        />
                        <path 
                          strokeLinecap="round" 
                          strokeLinejoin="round" 
                          strokeWidth={2} 
                          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" 
                        />
                      </svg>
                    )}
                  </button>

                  {/* Focus Ring Effect */}
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500/10 to-slate-500/10 opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                </div>
                
                {/* Error Message */}
                {error && (
                  <div className="mt-3 flex items-start gap-2 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg p-3">
                    <svg 
                      className="w-5 h-5 mt-0.5 flex-shrink-0" 
                      fill="currentColor" 
                      viewBox="0 0 20 20"
                    >
                      <path 
                        fillRule="evenodd" 
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" 
                        clipRule="evenodd" 
                      />
                    </svg>
                    <span>{error}</span>
                  </div>
                )}

                {/* Help Text */}
                <div className="mt-3 flex items-center gap-2 text-xs text-slate-500">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                  <span>Find your API key in Apify Console → Settings → Integrations</span>
                </div>
              </div>

              {/* Submit Button */}
              <button
                onClick={handleSubmit}
                disabled={isLoading || isValidating || !apiKey.trim()}
                className={`group relative w-full py-4 px-6 rounded-xl font-semibold transition-all duration-300 ${
                  isLoading || isValidating || !apiKey.trim()
                    ? 'bg-slate-300 text-slate-500 cursor-not-allowed border border-slate-300'
                    : 'bg-blue-700 text-white hover:bg-blue-800 shadow-lg hover:shadow-blue-500/25 transform hover:scale-105 border border-blue-600'
                }`}
              >
                {/* Button Background Effect */}
                {!(isLoading || isValidating || !apiKey.trim()) && (
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-800 to-slate-700 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                )}
                
                <span className="relative z-10 flex items-center justify-center gap-3">
                  {isValidating ? (
                    <>
                      <svg 
                        className="animate-spin h-5 w-5" 
                        xmlns="http://www.w3.org/2000/svg" 
                        fill="none" 
                        viewBox="0 0 24 24"
                      >
                        <circle 
                          className="opacity-25" 
                          cx="12" 
                          cy="12" 
                          r="10" 
                          stroke="currentColor" 
                          strokeWidth="4"
                        />
                        <path 
                          className="opacity-75" 
                          fill="currentColor" 
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                      Validating API Key...
                    </>
                  ) : isLoading ? (
                    <>
                      <svg 
                        className="animate-spin h-5 w-5" 
                        xmlns="http://www.w3.org/2000/svg" 
                        fill="none" 
                        viewBox="0 0 24 24"
                      >
                        <circle 
                          className="opacity-25" 
                          cx="12" 
                          cy="12" 
                          r="10" 
                          stroke="currentColor" 
                          strokeWidth="4"
                        />
                        <path 
                          className="opacity-75" 
                          fill="currentColor" 
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                      Loading Actors...
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                      Connect & Load Actors
                      <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </>
                  )}
                </span>
              </button>
            </div>

            {/* Security Footer */}
            <div className="mt-8 pt-6 border-t border-slate-200">
              <div className="grid grid-cols-2 gap-4 text-center">
                <div className="flex flex-col items-center gap-2">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                    <svg className="w-4 h-4 text-blue-700" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="text-xs text-slate-600">Secure Storage</span>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                    <svg className="w-4 h-4 text-blue-700" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="text-xs text-slate-600">Session Only</span>
                </div>
              </div>
              
              <p className="text-xs text-slate-500 text-center mt-4">
                Your API key is encrypted and stored securely in your browser session
              </p>
            </div>
          </div>

          {/* Additional Help Section */}
          <div className="mt-8 text-center">
            <div className="inline-flex items-center gap-2 text-slate-600 hover:text-blue-700 transition-colors duration-300 cursor-pointer">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
              </svg>
              <span className="text-sm font-medium">Need help finding your API key?</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApiKeyForm;