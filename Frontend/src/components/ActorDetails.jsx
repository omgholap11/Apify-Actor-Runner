// import { useState, useEffect } from 'react';
// import { useLocation, useNavigate, useParams } from 'react-router-dom';
// import axios from 'axios';
// import DebugInput from './DebugInput';

// const ActorDetails = () => {
//   const location = useLocation();
//   const navigate = useNavigate();
//   const { actorId } = useParams();
  
//   // Get actor data from location state
//   const actor = location.state?.actor;
//   const actors = location.state?.actors;
  
//   // Get API key from sessionStorage (since we're using React Router now)
//   const apiKey = sessionStorage.getItem('apify_api_key')?.replace(/"/g, '');

//   const [schema, setSchema] = useState(null);
//   const [isLoadingSchema, setIsLoadingSchema] = useState(true);
//   const [schemaError, setSchemaError] = useState('');
//   const [inputValues, setInputValues] = useState({});
//   const [isExecuting, setIsExecuting] = useState(false);
//   const [executionResult, setExecutionResult] = useState(null);
//   const [executionError, setExecutionError] = useState('');
//   const [inputMode, setInputMode] = useState('form'); // 'form' or 'json'
//   const [activeMainTab, setActiveMainTab] = useState('input'); // 'input' or 'output'

//   // Handle back to actors list
//   const handleBackToActors = () => {
//     navigate('/actorslist', { 
//       state: actors,
//       replace: false 
//     });
//   };

//   // Handle execution complete
//   const handleExecutionComplete = (result) => {
//     console.log('Execution completed:', result);
//     // Switch to output tab when execution completes
//     setActiveMainTab('output');
//   };

//   // Redirect if no actor data and no API key
//   if (!actor || !apiKey) {
//     return (
//       <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//         <div className="text-center">
//           <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
//           </svg>
//           <h3 className="mt-2 text-lg font-medium text-gray-900">Actor not found</h3>
//           <p className="mt-1 text-sm text-gray-500">Please go back and select an actor from the list.</p>
//           <button
//             onClick={() => navigate('/', { replace: true })}
//             className="mt-4 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
//           >
//             Go Back to Start
//           </button>
//         </div>
//       </div>
//     );
//   }

//   // Load actor schema on component mount
//   useEffect(() => {
//     const loadSchema = async () => {
//       setIsLoadingSchema(true);
//       setSchemaError('');
      
//       try {
//         console.log('Loading schema for actor:', actor.id);
        
//         const response = await axios.get(`http://localhost:5000/api/schema/${actor.id}`, {
//           headers: {
//             'x-api-key': apiKey
//           },
//           timeout: 15000
//         });

//         if (response.status == 200) {
//           console.log('Schema loaded:', response.data.data);
//           setSchema(response.data.data);
          
//           // Initialize input values with defaults/examples
//           const initialValues = {};
//           const schemaData = response.data.data.inputSchema;
          
//           if (schemaData.properties) {
//             // Has schema - create form fields
//             Object.keys(schemaData.properties).forEach(fieldName => {
//               const field = schemaData.properties[fieldName];
//               if (field.default !== undefined) {
//                 initialValues[fieldName] = field.default;
//               } else if (field.prefill !== undefined) {
//                 initialValues[fieldName] = field.prefill;
//               } else if (response.data.data.examples && response.data.data.examples[fieldName] !== undefined) {
//                 initialValues[fieldName] = response.data.data.examples[fieldName];
//               } else if (field.type === 'boolean') {
//                 initialValues[fieldName] = false;
//               } else if (field.type === 'array') {
//                 initialValues[fieldName] = [];
//               } else if (field.type === 'object') {
//                 initialValues[fieldName] = {};
//               } else {
//                 initialValues[fieldName] = '';
//               }
//             });
//             setInputMode('form'); // Start with form mode when schema is available
//           } else {
//             // No schema properties - use free-form input with example
//             initialValues.freeFormInput = '{"url": "https://www.apify.com/"}';
//             setInputMode('json'); // Start with JSON mode when no schema
//           }
          
//           setInputValues(initialValues);
//         } else {
//           throw new Error(response.data.error?.message || 'Failed to load schema');
//         }
//       } catch (err) {
//         console.error('Error loading schema:', err);
//         let errorMessage = 'Failed to load actor schema';
        
//         if (err.response?.status === 404) {
//           errorMessage = 'Actor not found or schema not available';
//         } else if (err.response?.status === 401) {
//           errorMessage = 'Authentication failed. Please check your API key.';
//         } else if (err.code === 'ECONNREFUSED') {
//           errorMessage = 'Cannot connect to backend server';
//         }
        
//         setSchemaError(errorMessage);
//       } finally {
//         setIsLoadingSchema(false);
//       }
//     };

//     loadSchema();
//   }, [actor.id, apiKey]);

//   // Helper function to create form fields from schema
//   const createFormFieldsFromSchema = (inputSchema) => {
//     if (!inputSchema || !inputSchema.properties) return {};
    
//     const fields = {};
//     Object.keys(inputSchema.properties).forEach(fieldName => {
//       const field = inputSchema.properties[fieldName];
//       // Set default values
//       if (field.default !== undefined) {
//         fields[fieldName] = field.default;
//       } else if (field.type === 'boolean') {
//         fields[fieldName] = false;
//       } else if (field.type === 'array') {
//         fields[fieldName] = [];
//       } else if (field.type === 'object') {
//         fields[fieldName] = {};
//       } else {
//         fields[fieldName] = field.prefill || '';
//       }
//     });
//     return fields;
//   };

//   // Convert form values to JSON
//   const formToJson = (formValues) => {
//     return JSON.stringify(formValues, null, 2);
//   };

//   // Convert JSON to form values
//   const jsonToForm = (jsonString) => {
//     try {
//       return JSON.parse(jsonString);
//     } catch (err) {
//       return {};
//     }
//   };

//   // Handle input mode switching
//   const handleInputModeChange = (mode) => {
//     if (mode === 'json' && inputMode === 'form') {
//       // Convert current form values to JSON
//       setInputValues({
//         freeFormInput: formToJson(inputValues)
//       });
//     } else if (mode === 'form' && inputMode === 'json') {
//       // Convert JSON back to form values
//       const formValues = jsonToForm(inputValues.freeFormInput || '{}');
//       setInputValues(formValues);
//     }
//     setInputMode(mode);
//   };

//   // Handle input changes
//   const handleInputChange = (fieldName, value) => {
//     setInputValues(prev => ({
//       ...prev,
//       [fieldName]: value
//     }));
//   };

//   // Clean input values before sending (remove empty strings, NaN, etc.)
//   const cleanInputValues = (values) => {
//     // If we're in JSON mode or have free-form input, use that directly
//     if (inputMode === 'json' && values.freeFormInput !== undefined) {
//       // If it's already parsed JSON, return it
//       if (typeof values.freeFormInput === 'object') {
//         return values.freeFormInput;
//       }
//       // If it's a string, try to parse it
//       try {
//         return JSON.parse(values.freeFormInput);
//       } catch (err) {
//         throw new Error('Invalid JSON input. Please check your syntax.');
//       }
//     }
    
//     // For form mode, clean the structured input
//     const cleaned = {};
//     Object.keys(values).forEach(key => {
//       const value = values[key];
//       const fieldSchema = schema?.inputSchema?.properties?.[key];
      
//       // Skip internal keys
//       if (key === 'freeFormInput') return;
      
//       // Skip empty or invalid values
//       if (value === undefined || value === null) return;
//       if (typeof value === 'string' && value.trim() === '') return;
//       if (typeof value === 'number' && isNaN(value)) return;
//       if (Array.isArray(value) && value.length === 0 && !fieldSchema?.default) return;
      
//       cleaned[key] = value;
//     });
//     return cleaned;
//   };

//   // Execute the actor
//   const handleExecute = async () => {
//     setIsExecuting(true);
//     setExecutionError('');
//     setExecutionResult(null);
    
//     try {
//       const cleanedInput = cleanInputValues(inputValues);
//       console.log('Executing actor with input:', cleanedInput);
      
//       const response = await axios.post(`http://localhost:5000/api/execute/${actor.id}`, {
//         input: cleanedInput,
//         options: {
//           timeout: 300, // 5 minutes
//           memory: 512,  // 512MB
//           maxWaitTime: 300
//         }
//       }, {
//         headers: {
//           'x-api-key': apiKey,
//           'Content-Type': 'application/json'
//         },
//         timeout: 320000 // 5+ minutes to allow for execution
//       });

//       if (response.data.success) {
//         console.log('Execution completed:', response.data.data);
//         setExecutionResult(response.data.data);
        
//         // Handle execution completion
//         handleExecutionComplete(response.data.data);
//       } else {
//         throw new Error(response.data.error?.message || 'Execution failed');
//       }
//     } catch (err) {
//       console.error('Execution error:', err);
//       let errorMessage = 'Execution failed';
      
//       // Handle JSON parsing errors specifically
//       if (err.message && err.message.includes('Invalid JSON')) {
//         errorMessage = err.message;
//       } else if (err.response) {
//         const backendError = err.response.data?.error;
//         switch (err.response.status) {
//           case 400:
//             errorMessage = backendError?.message || 'Invalid input parameters';
//             break;
//           case 401:
//             errorMessage = 'Authentication failed';
//             break;
//           case 408:
//             errorMessage = 'Execution timed out';
//             break;
//           case 422:
//             errorMessage = backendError?.message || 'Execution failed';
//             break;
//           case 500:
//             errorMessage = 'Server error during execution';
//             break;
//           default:
//             errorMessage = backendError?.message || `Error ${err.response.status}`;
//         }
//       } else if (err.code === 'ECONNABORTED') {
//         errorMessage = 'Request timed out. The actor may still be running.';
//       } else if (err.code === 'ECONNREFUSED') {
//         errorMessage = 'Cannot connect to backend server';
//       }
      
//       setExecutionError(errorMessage);
//       // Switch to output tab to show error
//       setActiveMainTab('output');
//     } finally {
//       setIsExecuting(false);
//     }
//   };

//   // Get missing required fields for better error messaging
//   const getMissingFields = () => {
//     // For JSON mode
//     if (inputMode === 'json') {
//       if (!inputValues.freeFormInput || inputValues.freeFormInput === '') {
//         return ['JSON input'];
//       }
//       if (typeof inputValues.freeFormInput === 'string') {
//         try {
//           JSON.parse(inputValues.freeFormInput);
//           return [];
//         } catch (err) {
//           return ['Valid JSON format'];
//         }
//       }
//       return [];
//     }
    
//     // For form mode with schema
//     if (schema?.inputSchema?.properties && schema?.inputSchema?.required) {
//       return schema.inputSchema.required.filter(fieldName => {
//         const value = inputValues[fieldName];
//         const fieldSchema = schema.inputSchema.properties[fieldName];
        
//         // Check if value is empty/invalid
//         if (value === undefined || value === null) return true;
        
//         // For strings, check for empty string
//         if (fieldSchema?.type === 'string' && value === '') return true;
        
//         // For numbers, check for NaN or empty string
//         if ((fieldSchema?.type === 'number' || fieldSchema?.type === 'integer') && 
//             (isNaN(value) || value === '')) return true;
        
//         // For arrays, check if empty
//         if (fieldSchema?.type === 'array' && Array.isArray(value) && value.length === 0) return true;
        
//         return false;
//       });
//     }
    
//     // For form mode without schema (fallback URL field)
//     if (!inputValues.url || inputValues.url.trim() === '') {
//       return ['URL'];
//     }
    
//     return [];
//   };

//   const validateForm = () => {
//     // For JSON mode, validate JSON syntax
//     if (inputMode === 'json') {
//       if (inputValues.freeFormInput === undefined || inputValues.freeFormInput === '') {
//         return false; // Require some input
//       }
//       // If it's a string, try to parse it to validate JSON
//       if (typeof inputValues.freeFormInput === 'string') {
//         try {
//           JSON.parse(inputValues.freeFormInput);
//           return true;
//         } catch (err) {
//           return false; // Invalid JSON
//         }
//       }
//       return true; // Already parsed object
//     }
    
//     // For form mode with schema
//     if (schema?.inputSchema?.properties) {
//       if (!schema?.inputSchema?.required) return true;
      
//       return schema.inputSchema.required.every(fieldName => {
//         const value = inputValues[fieldName];
//         const fieldSchema = schema.inputSchema.properties[fieldName];
        
//         // Check if value is empty/invalid
//         if (value === undefined || value === null) return false;
        
//         // For strings, check for empty string
//         if (fieldSchema?.type === 'string' && value === '') return false;
        
//         // For numbers, check for NaN or empty string
//         if ((fieldSchema?.type === 'number' || fieldSchema?.type === 'integer') && 
//             (isNaN(value) || value === '')) return false;
        
//         // For arrays, check if empty
//         if (fieldSchema?.type === 'array' && Array.isArray(value) && value.length === 0) return false;
        
//         return true;
//       });
//     }
    
//     // For form mode without schema (fallback URL field)
//     return inputValues.url && inputValues.url.trim() !== '';
//   };

//   // Format number with K/M suffix
//   const formatNumber = (num) => {
//     if (!num) return '0';
//     if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
//     if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
//     return num.toString();
//   };

//   // Format date helper
//   const formatDate = (dateString) => {
//     if (!dateString) return 'N/A';
//     return new Date(dateString).toLocaleString();
//   };

//   const formatDateShort = (dateString) => {
//     if (!dateString) return 'N/A';
//     return new Date(dateString).toLocaleDateString();
//   };

//   if (isLoadingSchema) {
//     return (
//       <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
//           <p className="text-gray-600">Loading actor schema...</p>
//         </div>
//       </div>
//     );
//   }

//   if (schemaError) {
//     return (
//       <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//         <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full text-center">
//           <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
//             <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
//             </svg>
//           </div>
//           <h2 className="text-xl font-bold text-gray-900 mb-2">Schema Load Error</h2>
//           <p className="text-gray-600 mb-6">{schemaError}</p>
//           <button
//             onClick={handleBackToActors}
//             className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
//           >
//             Back to Actors
//           </button>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-50">
//       {/* Simple header with back button */}
//       <div className="bg-white border-b border-gray-200 shadow-sm">
//         <div className="max-w-7xl mx-auto px-6 lg:px-8 py-4">
//           <button
//             onClick={handleBackToActors}
//             className="inline-flex items-center text-indigo-600 hover:text-indigo-700 font-medium transition-colors"
//           >
//             <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
//             </svg>
//             Back to Actors
//           </button>
//         </div>
//       </div>

//       <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
//         {/* Actor Overview Card */}
//         <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-8">
//           <div className="bg-purple-600 px-8 py-6">
//             <div className="flex items-start justify-between">
//               <div className="flex-1">
//                 <h1 className="text-3xl font-bold text-white mb-2">{schema?.title || schema?.name || actor.title || actor.name}</h1>
//                 <p className="text-indigo-100 text-lg">by <span className="font-semibold">{schema?.username || actor.username}</span></p>
                
//                 {/* Status badges */}
//                 <div className="flex items-center space-x-3 mt-4">
//                   <div className={`px-3 py-1 rounded-full text-xs font-medium ${
//                     schema?.isPublic 
//                       ? 'bg-green-100 text-green-800' 
//                       : 'bg-white/20 text-white'
//                   }`}>
//                     {schema?.isPublic ? '🌐 Public' : '🔒 Private'}
//                   </div>
                  
//                   {schema?.isDeprecated && (
//                     <div className="px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
//                       ⚠️ Deprecated
//                     </div>
//                   )}
                  
//                   {schema?.version?.buildTag && (
//                     <div className="px-3 py-1 rounded-full text-xs font-medium bg-white/20 text-white">
//                       📦 {schema.version.buildTag}
//                     </div>
//                   )}
//                 </div>
//               </div>
              
//               {/* Quick stats */}
//               <div className="flex space-x-6 ml-8">
//                 <div className="text-center bg-white/10 px-6 py-4 rounded-xl backdrop-blur-sm">
//                   <div className="text-2xl font-bold text-white">{formatNumber(schema?.stats?.totalRuns || 0)}</div>
//                   <div className="text-sm text-indigo-100">Total Runs</div>
//                 </div>
//                 <div className="text-center bg-white/10 px-6 py-4 rounded-xl backdrop-blur-sm">
//                   <div className="text-2xl font-bold text-white">{formatNumber(schema?.stats?.totalUsers || 0)}</div>
//                   <div className="text-sm text-indigo-100">Users</div>
//                 </div>
//                 <div className="text-center bg-white/10 px-6 py-4 rounded-xl backdrop-blur-sm">
//                   <div className="text-2xl font-bold text-white">{formatNumber(schema?.stats?.totalBuilds || 0)}</div>
//                   <div className="text-sm text-indigo-100">Builds</div>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Actor description */}
//           {schema?.description && (
//             <div className="px-8 py-6 bg-gray-50 border-b border-gray-200">
//               <div className="flex items-start space-x-3">
//                 <div className="flex-shrink-0">
//                   <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
//                   </svg>
//                 </div>
//                 <div>
//                   <h3 className="text-sm font-semibold text-gray-800 mb-1">Description</h3>
//                   <p className="text-gray-700 leading-relaxed">{schema.description}</p>
//                 </div>
//               </div>
//             </div>
//           )}

//           {/* Detailed Information */}
//           <div className="px-8 py-6">
//             <h3 className="text-lg font-semibold text-gray-900 mb-6">Actor Details</h3>
            
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
//               {/* Basic Information */}
//               <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-100">
//                 <h4 className="font-semibold text-blue-900 mb-4 flex items-center">
//                   <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
//                   </svg>
//                   Basic Info
//                 </h4>
//                 <div className="space-y-3 text-sm">
//                   <div className="flex justify-between">
//                     <span className="text-gray-600">ID:</span>
//                     <span className="font-mono text-xs bg-white px-2 py-1 rounded">{schema?.id}</span>
//                   </div>
//                   <div className="flex justify-between">
//                     <span className="text-gray-600">Name:</span>
//                     <span className="font-medium">{schema?.name}</span>
//                   </div>
//                   <div className="flex justify-between">
//                     <span className="text-gray-600">User ID:</span>
//                     <span className="font-mono text-xs bg-white px-2 py-1 rounded">{schema?.userId}</span>
//                   </div>
//                   <div className="flex justify-between">
//                     <span className="text-gray-600">Anonymous Run:</span>
//                     <span className={`font-medium ${schema?.isAnonymouslyRunnable ? 'text-green-600' : 'text-red-600'}`}>
//                       {schema?.isAnonymouslyRunnable ? 'Yes' : 'No'}
//                     </span>
//                   </div>
//                 </div>
//               </div>

//               {/* Timeline Information */}
//               <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-xl border border-green-100">
//                 <h4 className="font-semibold text-green-900 mb-4 flex items-center">
//                   <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
//                   </svg>
//                   Timeline
//                 </h4>
//                 <div className="space-y-3 text-sm">
//                   <div>
//                     <span className="text-gray-600 block">Created:</span>
//                     <span className="font-medium">{formatDateShort(schema?.createdAt)}</span>
//                   </div>
//                   <div>
//                     <span className="text-gray-600 block">Modified:</span>
//                     <span className="font-medium">{formatDateShort(schema?.modifiedAt)}</span>
//                   </div>
//                   <div>
//                     <span className="text-gray-600 block">Fetched:</span>
//                     <span className="font-medium">{formatDateShort(schema?.fetchedAt)}</span>
//                   </div>
//                 </div>
//               </div>

//               {/* Configuration */}
//               <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-6 rounded-xl border border-purple-100">
//                 <h4 className="font-semibold text-purple-900 mb-4 flex items-center">
//                   <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
//                   </svg>
//                   Configuration
//                 </h4>
//                 <div className="space-y-3 text-sm">
//                   <div className="flex justify-between">
//                     <span className="text-gray-600">Memory:</span>
//                     <span className="font-medium">{schema?.defaultRunOptions?.memoryMbytes || 'N/A'} MB</span>
//                   </div>
//                   <div className="flex justify-between">
//                     <span className="text-gray-600">Timeout:</span>
//                     <span className="font-medium">{schema?.defaultRunOptions?.timeoutSecs ? `${Math.floor(schema.defaultRunOptions.timeoutSecs / 60)}m` : 'N/A'}</span>
//                   </div>
//                   <div className="flex justify-between">
//                     <span className="text-gray-600">Build:</span>
//                     <span className="font-medium">{schema?.defaultRunOptions?.build || 'latest'}</span>
//                   </div>
//                   <div className="flex justify-between">
//                     <span className="text-gray-600">Tagged Version:</span>
//                     <span className="font-medium">{schema?.taggedVersion || 'N/A'}</span>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {/* Extended Statistics */}
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
//               {/* Detailed Statistics */}
//               <div className="bg-gradient-to-br from-orange-50 to-red-50 p-6 rounded-xl border border-orange-100">
//                 <h4 className="font-semibold text-orange-900 mb-4 flex items-center">
//                   <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
//                   </svg>
//                   Usage Statistics
//                 </h4>
//                 <div className="grid grid-cols-2 gap-4 text-sm">
//                   <div className="text-center bg-white p-3 rounded-lg">
//                     <div className="font-bold text-lg text-orange-600">{formatNumber(schema?.stats?.totalRuns || 0)}</div>
//                     <div className="text-gray-600">Total Runs</div>
//                   </div>
//                   <div className="text-center bg-white p-3 rounded-lg">
//                     <div className="font-bold text-lg text-orange-600">{formatNumber(schema?.stats?.totalUsers || 0)}</div>
//                     <div className="text-gray-600">Total Users</div>
//                   </div>
//                   <div className="text-center bg-white p-3 rounded-lg">
//                     <div className="font-bold text-lg text-orange-600">{formatNumber(schema?.stats?.totalBuilds || 0)}</div>
//                     <div className="text-gray-600">Total Builds</div>
//                   </div>
//                   <div className="text-center bg-white p-3 rounded-lg">
//                     <div className="font-bold text-lg text-orange-600">{formatNumber(schema?.stats?.totalUsers7Days || 0)}</div>
//                     <div className="text-gray-600">Users (7d)</div>
//                   </div>
//                 </div>
//                 <div className="mt-4 grid grid-cols-1 gap-2 text-sm">
//                   <div className="flex justify-between bg-white p-2 rounded">
//                     <span className="text-gray-600">Users (30d):</span>
//                     <span className="font-medium">{formatNumber(schema?.stats?.totalUsers30Days || 0)}</span>
//                   </div>
//                   <div className="flex justify-between bg-white p-2 rounded">
//                     <span className="text-gray-600">Meta Origin:</span>
//                     <span className="font-medium">{formatNumber(schema?.stats?.totalMetaOrigin || 0)}</span>
//                   </div>
//                 </div>
//               </div>

//               {/* Categories and Examples */}
//               <div className="bg-gradient-to-br from-teal-50 to-cyan-50 p-6 rounded-xl border border-teal-100">
//                 <h4 className="font-semibold text-teal-900 mb-4 flex items-center">
//                   <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
//                   </svg>
//                   Categories & Examples
//                 </h4>
//                 <div className="space-y-4">
//                   <div>
//                     <span className="text-gray-600 block mb-2">Categories:</span>
//                     {schema?.categories && schema.categories.length > 0 ? (
//                       <div className="flex flex-wrap gap-2">
//                         {schema.categories.map((category, index) => (
//                           <span key={index} className="inline-block px-3 py-1 text-xs bg-teal-100 text-teal-800 rounded-full">
//                             {category}
//                           </span>
//                         ))}
//                       </div>
//                     ) : (
//                       <span className="text-gray-500 text-sm">No categories defined</span>
//                     )}
//                   </div>
                  
//                   {schema?.examples && (
//                     <div>
//                       <span className="text-gray-600 block mb-2">Example Input:</span>
//                       <div className="bg-white p-3 rounded-lg border">
//                         <div className="text-xs text-gray-500 mb-1">Content Type: {schema.examples.contentType}</div>
//                         <code className="text-xs text-gray-800 break-all">{schema.examples.body}</code>
//                       </div>
//                     </div>
//                   )}
//                 </div>
//               </div>
//             </div>

//             {/* Tagged Builds */}
//             {schema?.taggedBuilds && (
//               <div className="bg-gradient-to-br from-gray-50 to-slate-50 p-6 rounded-xl border border-gray-200 mb-6">
//                 <h4 className="font-semibold text-gray-900 mb-4 flex items-center">
//                   <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
//                   </svg>
//                   Tagged Builds
//                 </h4>
//                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//                   {Object.entries(schema.taggedBuilds).map(([tag, build]) => (
//                     <div key={tag} className="bg-white p-4 rounded-lg border">
//                       <div className="flex items-center justify-between mb-2">
//                         <span className="font-medium text-gray-900">{tag}</span>
//                         <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
//                           {build?.buildNumber || 'N/A'}
//                         </span>
//                       </div>
//                       {build?.createdAt && (
//                         <div className="text-xs text-gray-500">
//                           Created: {formatDateShort(build.createdAt)}
//                         </div>
//                       )}
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             )}

//             {/* Schema Information */}
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//               <div className="bg-gradient-to-br from-indigo-50 to-blue-50 p-6 rounded-xl border border-indigo-100">
//                 <h4 className="font-semibold text-indigo-900 mb-4 flex items-center">
//                   <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
//                   </svg>
//                   Input Schema
//                 </h4>
//                 <div className="bg-white p-4 rounded-lg">
//                   {schema?.inputSchema && Object.keys(schema.inputSchema).length > 0 ? (
//                     <div className="space-y-2 text-sm">
//                       <div className="flex justify-between">
//                         <span className="text-gray-600">Type:</span>
//                         <span className="font-medium">{schema.inputSchema.type || 'object'}</span>
//                       </div>
//                       <div className="flex justify-between">
//                         <span className="text-gray-600">Properties:</span>
//                         <span className="font-medium">{Object.keys(schema.inputSchema.properties || {}).length}</span>
//                       </div>
//                       <div className="flex justify-between">
//                         <span className="text-gray-600">Required:</span>
//                         <span className="font-medium">{schema.inputSchema.required?.length || 0}</span>
//                       </div>
//                       {schema.inputSchema.title && (
//                         <div className="flex justify-between">
//                           <span className="text-gray-600">Title:</span>
//                           <span className="font-medium">{schema.inputSchema.title}</span>
//                         </div>
//                       )}
//                     </div>
//                   ) : (
//                     <p className="text-gray-500 text-sm">No input schema defined</p>
//                   )}
//                 </div>
//               </div>

//               <div className="bg-gradient-to-br from-emerald-50 to-green-50 p-6 rounded-xl border border-emerald-100">
//                 <h4 className="font-semibold text-emerald-900 mb-4 flex items-center">
//                   <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
//                   </svg>
//                   Output Schema
//                 </h4>
//                 <div className="bg-white p-4 rounded-lg">
//                   {schema?.outputSchema && Object.keys(schema.outputSchema).length > 0 ? (
//                     <div className="space-y-2 text-sm">
//                       <div className="flex justify-between">
//                         <span className="text-gray-600">Type:</span>
//                         <span className="font-medium">{schema.outputSchema.type || 'object'}</span>
//                       </div>
//                       <div className="flex justify-between">
//                         <span className="text-gray-600">Properties:</span>
//                         <span className="font-medium">{Object.keys(schema.outputSchema.properties || {}).length}</span>
//                       </div>
//                       {schema.outputSchema.title && (
//                         <div className="flex justify-between">
//                           <span className="text-gray-600">Title:</span>
//                           <span className="font-medium">{schema.outputSchema.title}</span>
//                         </div>
//                       )}
//                     </div>
//                   ) : (
//                     <p className="text-gray-500 text-sm">No output schema defined</p>
//                   )}
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Main Execution Section */}
//         <div className="bg-white rounded-xl shadow-lg overflow-hidden">
//           {/* Main Tabs Header */}
//           <div className="border-b border-gray-200 bg-gray-50">
//             <div className="flex items-center justify-between px-8 py-4">
//               <nav className="flex space-x-8">
//                 <button
//                   onClick={() => setActiveMainTab('input')}
//                   className={`py-3 px-6 text-sm font-semibold rounded-lg transition-all duration-200 flex items-center space-x-2 ${
//                     activeMainTab === 'input'
//                       ? 'bg-indigo-600 text-white shadow-lg'
//                       : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
//                   }`}
//                 >
//                   <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
//                   </svg>
//                   <span>Input Configuration</span>
//                 </button>
//                 <button
//                   onClick={() => setActiveMainTab('output')}
//                   className={`py-3 px-6 text-sm font-semibold rounded-lg transition-all duration-200 flex items-center space-x-2 ${
//                     activeMainTab === 'output'
//                       ? 'bg-indigo-600 text-white shadow-lg'
//                       : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
//                   }`}
//                 >
//                   <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
//                   </svg>
//                   <span>Execution Results</span>
//                   {executionResult && (
//                     <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
//                       {executionResult.results?.length || 0}
//                     </span>
//                   )}
//                 </button>
//               </nav>
              
//               {/* Execute Button - Prominent Position */}
//               <button
//                 onClick={handleExecute}
//                 disabled={isExecuting || !validateForm()}
//                 className={`px-8 py-3 rounded-xl font-semibold text-lg transition-all duration-200 flex items-center space-x-3 ${
//                   isExecuting || !validateForm()
//                     ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
//                     : 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5'
//                 }`}
//               >
//                 {isExecuting ? (
//                   <>
//                     <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//                       <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
//                       <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
//                     </svg>
//                     <span>Executing...</span>
//                   </>
//                 ) : (
//                   <>
//                     <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
//                     </svg>
//                     <span>Execute Actor</span>
//                   </>
//                 )}
//               </button>
//             </div>
            
//             {/* Validation Error - Right under the header */}
//             {!validateForm() && activeMainTab === 'input' && (
//               <div className="mx-8 mb-4 p-4 bg-gradient-to-r from-red-50 to-pink-50 border border-red-200 rounded-xl">
//                 <div className="flex items-start space-x-3">
//                   <svg className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
//                     <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
//                   </svg>
//                   <div>
//                     <h3 className="text-sm font-semibold text-red-800">Missing Required Fields</h3>
//                     <p className="text-sm text-red-700 mt-1">
//                       Please fill in: <strong>{getMissingFields().join(', ')}</strong>
//                     </p>
//                   </div>
//                 </div>
//               </div>
//             )}
//           </div>

//           {/* Tab Content */}
//           <div className="p-8">
//             {/* Input Tab */}
//             {activeMainTab === 'input' && (
//               <div>
//                 <div className="mb-8">
//                   <h2 className="text-2xl font-bold text-gray-900 mb-4">Configure Input</h2>
                  
//                   {/* Input Mode Switcher */}
//                   <div className="flex items-center justify-between mb-8">
//                     <span className="text-lg font-semibold text-gray-800">Input Mode</span>
//                     <div className="flex bg-gray-50 rounded-xl p-1.5 border border-gray-200">
//                       <button
//                         onClick={() => handleInputModeChange('form')}
//                         className={`px-6 py-3 text-sm font-semibold rounded-lg transition-all duration-200 flex items-center space-x-2 ${
//                           inputMode === 'form'
//                             ? 'bg-indigo-600 text-white shadow-lg transform scale-105'
//                             : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
//                         }`}
//                       >
//                         <span>📝</span>
//                         <span>Form Fields</span>
//                       </button>
//                       <button
//                         onClick={() => handleInputModeChange('json')}
//                         className={`px-6 py-3 text-sm font-semibold rounded-lg transition-all duration-200 flex items-center space-x-2 ${
//                           inputMode === 'json'
//                             ? 'bg-indigo-600 text-white shadow-lg transform scale-105'
//                             : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
//                         }`}
//                       >
//                         <span>🔧</span>
//                         <span>JSON Editor</span>
//                       </button>
//                     </div>
//                   </div>
//                 </div>

//                 {/* Form Mode */}
//                 {inputMode === 'form' && (
//                   <div className="space-y-6">
//                     {schema?.inputSchema?.properties ? (
//                       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//                         {Object.keys(schema.inputSchema.properties).map(fieldName => {
//                           const field = schema.inputSchema.properties[fieldName];
//                           const isRequired = schema.inputSchema.required?.includes(fieldName);
                          
//                           return (
//                             <div key={fieldName} className="space-y-3">
//                               <label className="block text-sm font-semibold text-gray-800">
//                                 {field.title || fieldName}
//                                 {isRequired && <span className="text-red-500 ml-1">*</span>}
//                               </label>
//                               {field.description && (
//                                 <p className="text-sm text-gray-600 leading-relaxed mb-2">{field.description}</p>
//                               )}
                              
//                               {renderFormField(fieldName, field, inputValues[fieldName], 
//                                 (value) => handleInputChange(fieldName, value), isRequired)}
//                             </div>
//                           );
//                         })}
//                       </div>
//                     ) : (
//                       <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-xl p-6">
//                         <div className="flex items-start space-x-3">
//                           <div className="flex-shrink-0">
//                             <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
//                             </svg>
//                           </div>
//                           <div className="flex-1">
//                             <h3 className="text-sm font-semibold text-yellow-800 mb-2">No Schema Available</h3>
//                             <p className="text-yellow-700 text-sm mb-4">
//                               This actor doesn't have a defined schema. We've created a simple URL field for basic configuration.
//                             </p>
//                             <div className="space-y-3">
//                               <label className="block text-sm font-semibold text-gray-800">
//                                 URL <span className="text-red-500">*</span>
//                               </label>
//                               <input
//                                 type="url"
//                                 value={inputValues.url || ''}
//                                 onChange={(e) => handleInputChange('url', e.target.value)}
//                                 placeholder="https://www.apify.com/"
//                                 className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors bg-white"
//                               />
//                             </div>
//                           </div>
//                         </div>
//                       </div>
//                     )}
//                   </div>
//                 )}

//                 {/* JSON Mode */}
//                 {inputMode === 'json' && (
//                   <div className="space-y-6">
//                     <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6">
//                       <div className="flex items-start space-x-3">
//                         <div className="flex-shrink-0">
//                           <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
//                           </svg>
//                         </div>
//                         <div className="flex-1">
//                           <h3 className="text-sm font-semibold text-blue-800 mb-2">Advanced JSON Configuration</h3>
//                           <p className="text-blue-700 text-sm">
//                             Edit the JSON input directly for complete control over the input structure.
//                           </p>
//                           {schema?.examples && (
//                             <div className="mt-3 p-3 bg-blue-100 rounded-lg">
//                               <p className="text-blue-800 text-xs font-medium mb-1">Example Configuration:</p>
//                               <code className="text-blue-900 text-xs">{schema.examples.body}</code>
//                             </div>
//                           )}
//                         </div>
//                       </div>
//                     </div>
                    
//                     <div>
//                       <label className="block text-sm font-semibold text-gray-800 mb-3">
//                         JSON Configuration
//                       </label>
//                       <textarea
//                         value={typeof inputValues.freeFormInput === 'string' ? inputValues.freeFormInput : JSON.stringify(inputValues.freeFormInput || {}, null, 2)}
//                         onChange={(e) => {
//                           try {
//                             // Try to parse as JSON to validate
//                             const parsed = JSON.parse(e.target.value);
//                             setInputValues({ freeFormInput: parsed });
//                           } catch (err) {
//                             // Keep as string if invalid JSON for now
//                             setInputValues({ freeFormInput: e.target.value });
//                           }
//                         }}
//                         placeholder={schema?.examples?.body || '{"url": "https://www.apify.com/"}'}
//                         className="w-full h-96 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 font-mono text-sm bg-gray-50 focus:bg-white transition-colors"
//                         style={{ fontFamily: 'Monaco, Consolas, "Courier New", monospace' }}
//                       />
//                       <p className="mt-2 text-xs text-gray-500">
//                         Enter valid JSON. {schema?.examples && (
//                           <>Example: <code className="bg-gray-100 px-1 rounded">{schema.examples.body}</code></>
//                         )}
//                       </p>
//                     </div>
//                   </div>
//                 )}
//               </div>
//             )}

//             {/* Output Tab */}
//             {activeMainTab === 'output' && (
//               <div>
//                 <h2 className="text-2xl font-bold text-gray-900 mb-6">Execution Results</h2>
                
//                 {!executionResult && !executionError && !isExecuting && (
//                   <div className="text-center py-16">
//                     <div className="w-20 h-20 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
//                       <svg className="w-10 h-10 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
//                       </svg>
//                     </div>
//                     <h3 className="text-lg font-semibold text-gray-900 mb-2">Ready to Execute</h3>
//                     <p className="text-gray-500">Configure your input and execute the actor to see results here</p>
//                   </div>
//                 )}

//                 {isExecuting && (
//                   <div className="text-center py-16">
//                     <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center mx-auto mb-6">
//                       <svg className="animate-spin w-10 h-10 text-indigo-600" fill="none" viewBox="0 0 24 24">
//                         <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
//                         <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
//                       </svg>
//                     </div>
//                     <h3 className="text-lg font-semibold text-gray-900 mb-2">Executing Actor</h3>
//                     <p className="text-gray-500">Please wait while your actor is running...</p>
//                   </div>
//                 )}

//                 {executionError && (
//                   <div className="bg-gradient-to-r from-red-50 to-pink-50 border border-red-200 rounded-xl p-6">
//                     <div className="flex items-start space-x-4">
//                       <div className="flex-shrink-0">
//                         <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
//                           <svg className="w-6 h-6 text-red-600" fill="currentColor" viewBox="0 0 20 20">
//                             <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
//                           </svg>
//                         </div>
//                       </div>
//                       <div className="flex-1">
//                         <h3 className="text-lg font-semibold text-red-800 mb-2">Execution Failed</h3>
//                         <p className="text-red-700 leading-relaxed">{executionError}</p>
//                       </div>
//                     </div>
//                   </div>
//                 )}

//                 {executionResult && <ExecutionResults result={executionResult} />}
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// // Helper function to render form fields
// const renderFormField = (fieldName, field, value, onChange, isRequired) => {
//   switch (field.type) {
//     case 'string':
//       if (field.enum) {
//         return (
//           <select
//             value={value || ''}
//             onChange={(e) => onChange(e.target.value)}
//             className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-gray-50 focus:bg-white transition-colors"
//           >
//             <option value="">Select an option</option>
//             {field.enum.map(option => (
//               <option key={option} value={option}>{option}</option>
//             ))}
//           </select>
//         );
//       }
      
//       if (field.description && field.description.length > 100) {
//         return (
//           <textarea
//             value={value || ''}
//             onChange={(e) => onChange(e.target.value)}
//             placeholder={field.prefill || field.example || field.description}
//             rows={4}
//             className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-gray-50 focus:bg-white transition-colors"
//           />
//         );
//       }
      
//       return (
//         <input
//           type={fieldName.toLowerCase().includes('password') ? 'password' : 'text'}
//           value={value || ''}
//           onChange={(e) => onChange(e.target.value)}
//           placeholder={field.prefill || field.example || `Enter ${fieldName}`}
//           className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-gray-50 focus:bg-white transition-colors"
//         />
//       );

//     case 'number':
//     case 'integer':
//       return (
//         <input
//           type="number"
//           value={value || ''}
//           onChange={(e) => {
//             const inputValue = e.target.value;
//             if (inputValue === '') {
//               onChange('');
//             } else {
//               const numValue = field.type === 'integer' ? parseInt(inputValue) : parseFloat(inputValue);
//               onChange(isNaN(numValue) ? '' : numValue);
//             }
//           }}
//           min={field.minimum}
//           max={field.maximum}
//           step={field.type === 'integer' ? 1 : 0.1}
//           className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-gray-50 focus:bg-white transition-colors"
//         />
//       );

//     case 'boolean':
//       return (
//         <label className="flex items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
//           <input
//             type="checkbox"
//             checked={value || false}
//             onChange={(e) => onChange(e.target.checked)}
//             className="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 w-5 h-5"
//           />
//           <span className="ml-3 text-sm text-gray-700 font-medium">
//             {field.description || 'Enable this option'}
//           </span>
//         </label>
//       );

//     case 'array':
//       return (
//         <textarea
//           value={Array.isArray(value) ? value.join('\n') : (value || '')}
//           onChange={(e) => onChange(e.target.value.split('\n').filter(item => item.trim()))}
//           placeholder="Enter items, one per line"
//           rows={4}
//           className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-gray-50 focus:bg-white transition-colors"
//         />
//       );

//     default:
//       return (
//         <input
//           type="text"
//           value={typeof value === 'object' ? JSON.stringify(value) : (value || '')}
//           onChange={(e) => onChange(e.target.value)}
//           placeholder={field.prefill || field.example || `Enter ${fieldName}`}
//           className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-gray-50 focus:bg-white transition-colors"
//         />
//       );
//   }
// };

// // Execution Results Component
// const ExecutionResults = ({ result }) => {
//   const [activeTab, setActiveTab] = useState('results');

//   return (
//     <div>
//       {/* Results Tabs */}
//       <div className="border-b border-gray-200 mb-6">
//         <nav className="-mb-px flex space-x-8">
//           <button
//             onClick={() => setActiveTab('results')}
//             className={`py-3 px-1 border-b-2 font-semibold text-sm transition-colors ${
//               activeTab === 'results'
//                 ? 'border-indigo-500 text-indigo-600'
//                 : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
//             }`}
//           >
//             Results ({result.results?.length || 0})
//           </button>
//           <button
//             onClick={() => setActiveTab('stats')}
//             className={`py-3 px-1 border-b-2 font-semibold text-sm transition-colors ${
//               activeTab === 'stats'
//                 ? 'border-indigo-500 text-indigo-600'
//                 : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
//             }`}
//           >
//             Statistics
//           </button>
//         </nav>
//       </div>

//       {/* Results Tab Content */}
//       {activeTab === 'results' && (
//         <div>
//           {result.results && result.results.length > 0 ? (
//             <div className="space-y-4 max-h-96 overflow-y-auto">
//               {result.results.map((item, index) => (
//                 <div key={index} className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-6 border border-gray-200">
//                   <div className="flex items-center justify-between mb-3">
//                     <h3 className="text-sm font-semibold text-gray-800">Result #{index + 1}</h3>
//                     <span className="text-xs text-gray-500 bg-white px-2 py-1 rounded-full">
//                       {Object.keys(item).length} fields
//                     </span>
//                   </div>
//                   <pre className="text-sm text-gray-800 whitespace-pre-wrap overflow-x-auto bg-white p-4 rounded-lg border">
//                     {JSON.stringify(item, null, 2)}
//                   </pre>
//                 </div>
//               ))}
//             </div>
//           ) : (
//             <div className="text-center py-12">
//               <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
//                 <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
//                 </svg>
//               </div>
//               <h3 className="text-lg font-semibold text-gray-900 mb-2">No Results</h3>
//               <p className="text-gray-500">The actor completed but returned no results</p>
//             </div>
//           )}
//         </div>
//       )}

//       {/* Statistics Tab Content */}
//       {activeTab === 'stats' && (
//         <div className="space-y-6">
//           <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//             <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-xl border border-green-100">
//               <div className="flex items-center justify-between">
//                 <div>
//                   <div className="text-sm font-semibold text-green-800">Status</div>
//                   <div className="text-2xl font-bold text-green-900">{result.status}</div>
//                 </div>
//                 <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
//                   <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
//                   </svg>
//                 </div>
//               </div>
//             </div>
//             <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-100">
//               <div className="flex items-center justify-between">
//                 <div>
//                   <div className="text-sm font-semibold text-blue-800">Duration</div>
//                   <div className="text-2xl font-bold text-blue-900">
//                     {result.stats?.durationMillis ? `${(result.stats.durationMillis / 1000).toFixed(1)}s` : 'N/A'}
//                   </div>
//                 </div>
//                 <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
//                   <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
//                   </svg>
//                 </div>
//               </div>
//             </div>
//           </div>
          
//           {result.runId && (
//             <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-6 rounded-xl border border-gray-200">
//               <div className="flex items-start space-x-3">
//                 <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
//                   <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
//                   </svg>
//                 </div>
//                 <div className="flex-1">
//                   <div className="text-sm font-semibold text-gray-800 mb-1">Run ID</div>
//                   <div className="text-sm font-mono text-gray-900 bg-white px-3 py-2 rounded-lg border break-all">
//                     {result.runId}
//                   </div>
//                 </div>
//               </div>
//             </div>
//           )}
          
//           {result.startedAt && (
//             <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-6 rounded-xl border border-purple-100">
//               <div className="flex items-start space-x-3">
//                 <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
//                   <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
//                   </svg>
//                 </div>
//                 <div className="flex-1">
//                   <div className="text-sm font-semibold text-purple-800 mb-1">Started At</div>
//                   <div className="text-sm text-purple-900 bg-white px-3 py-2 rounded-lg border">
//                     {new Date(result.startedAt).toLocaleString()}
//                   </div>
//                 </div>
//               </div>
//             </div>
//           )}
//         </div>
//       )}
//     </div>
//   );
// };

// export default ActorDetails;



import { useState, useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

const ActorDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { actorId } = useParams();
  
  // Get actor data from location state
  const actor = location.state?.actor;
  const actors = location.state?.actors;
  
  // Get API key from sessionStorage (since we're using React Router now)
  const apiKey = sessionStorage.getItem('apify_api_key')?.replace(/"/g, '');

  const [schema, setSchema] = useState(null);
  const [isLoadingSchema, setIsLoadingSchema] = useState(true);
  const [schemaError, setSchemaError] = useState('');
  const [inputValues, setInputValues] = useState({});
  const [isExecuting, setIsExecuting] = useState(false);
  const [executionResult, setExecutionResult] = useState(null);
  const [executionError, setExecutionError] = useState('');
  const [inputMode, setInputMode] = useState('form'); // 'form' or 'json'
  const [activeMainTab, setActiveMainTab] = useState('input'); // 'input' or 'output'

  // Handle back to actors list
  const handleBackToActors = () => {
    navigate('/actorslist', { 
      state: actors,
      replace: false 
    });
  };

  // Handle execution complete
  const handleExecutionComplete = (result) => {
    console.log('Execution completed:', result);
    // Switch to output tab when execution completes
    setActiveMainTab('output');
  };

  // Redirect if no actor data and no API key
  if (!actor || !apiKey) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <svg className="mx-auto h-12 w-12 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
          <h3 className="mt-2 text-lg font-medium text-slate-800">Actor not found</h3>
          <p className="mt-1 text-sm text-slate-500">Please go back and select an actor from the list.</p>
          <button
            onClick={() => navigate('/', { replace: true })}
            className="mt-4 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-700 hover:bg-blue-800"
          >
            Go Back to Start
          </button>
        </div>
      </div>
    );
  }

  // Load actor schema on component mount
  useEffect(() => {
    const loadSchema = async () => {
      setIsLoadingSchema(true);
      setSchemaError('');
      
      try {
        console.log('Loading schema for actor:', actor.id);
        
        const response = await axios.get(`http://localhost:5000/api/schema/${actor.id}`, {
          headers: {
            'x-api-key': apiKey
          },
          timeout: 15000
        });

        if (response.status == 200) {
          console.log('Schema loaded:', response.data.data);
          setSchema(response.data.data);
          
          // Initialize input values with defaults/examples
          const initialValues = {};
          const schemaData = response.data.data.inputSchema;
          
          if (schemaData.properties) {
            // Has schema - create form fields
            Object.keys(schemaData.properties).forEach(fieldName => {
              const field = schemaData.properties[fieldName];
              if (field.default !== undefined) {
                initialValues[fieldName] = field.default;
              } else if (field.prefill !== undefined) {
                initialValues[fieldName] = field.prefill;
              } else if (response.data.data.examples && response.data.data.examples[fieldName] !== undefined) {
                initialValues[fieldName] = response.data.data.examples[fieldName];
              } else if (field.type === 'boolean') {
                initialValues[fieldName] = false;
              } else if (field.type === 'array') {
                initialValues[fieldName] = [];
              } else if (field.type === 'object') {
                initialValues[fieldName] = {};
              } else {
                initialValues[fieldName] = '';
              }
            });
            setInputMode('form'); // Start with form mode when schema is available
          } else {
            // No schema properties - use free-form input with example
            initialValues.freeFormInput = '{"url": "https://www.apify.com/"}';
            setInputMode('json'); // Start with JSON mode when no schema
          }
          
          setInputValues(initialValues);
        } else {
          throw new Error(response.data.error?.message || 'Failed to load schema');
        }
      } catch (err) {
        console.error('Error loading schema:', err);
        let errorMessage = 'Failed to load actor schema';
        
        if (err.response?.status === 404) {
          errorMessage = 'Actor not found or schema not available';
        } else if (err.response?.status === 401) {
          errorMessage = 'Authentication failed. Please check your API key.';
        } else if (err.code === 'ECONNREFUSED') {
          errorMessage = 'Cannot connect to backend server';
        }
        
        setSchemaError(errorMessage);
      } finally {
        setIsLoadingSchema(false);
      }
    };

    loadSchema();
  }, [actor.id, apiKey]);

  // Helper function to create form fields from schema
  const createFormFieldsFromSchema = (inputSchema) => {
    if (!inputSchema || !inputSchema.properties) return {};
    
    const fields = {};
    Object.keys(inputSchema.properties).forEach(fieldName => {
      const field = inputSchema.properties[fieldName];
      // Set default values
      if (field.default !== undefined) {
        fields[fieldName] = field.default;
      } else if (field.type === 'boolean') {
        fields[fieldName] = false;
      } else if (field.type === 'array') {
        fields[fieldName] = [];
      } else if (field.type === 'object') {
        fields[fieldName] = {};
      } else {
        fields[fieldName] = field.prefill || '';
      }
    });
    return fields;
  };

  // Convert form values to JSON
  const formToJson = (formValues) => {
    return JSON.stringify(formValues, null, 2);
  };

  // Convert JSON to form values
  const jsonToForm = (jsonString) => {
    try {
      return JSON.parse(jsonString);
    } catch (err) {
      return {};
    }
  };

  // Handle input mode switching
  const handleInputModeChange = (mode) => {
    if (mode === 'json' && inputMode === 'form') {
      // Convert current form values to JSON
      setInputValues({
        freeFormInput: formToJson(inputValues)
      });
    } else if (mode === 'form' && inputMode === 'json') {
      // Convert JSON back to form values
      const formValues = jsonToForm(inputValues.freeFormInput || '{}');
      setInputValues(formValues);
    }
    setInputMode(mode);
  };

  // Handle input changes
  const handleInputChange = (fieldName, value) => {
    setInputValues(prev => ({
      ...prev,
      [fieldName]: value
    }));
  };

  // Clean input values before sending (remove empty strings, NaN, etc.)
  const cleanInputValues = (values) => {
    // If we're in JSON mode or have free-form input, use that directly
    if (inputMode === 'json' && values.freeFormInput !== undefined) {
      // If it's already parsed JSON, return it
      if (typeof values.freeFormInput === 'object') {
        return values.freeFormInput;
      }
      // If it's a string, try to parse it
      try {
        return JSON.parse(values.freeFormInput);
      } catch (err) {
        throw new Error('Invalid JSON input. Please check your syntax.');
      }
    }
    
    // For form mode, clean the structured input
    const cleaned = {};
    Object.keys(values).forEach(key => {
      const value = values[key];
      const fieldSchema = schema?.inputSchema?.properties?.[key];
      
      // Skip internal keys
      if (key === 'freeFormInput') return;
      
      // Skip empty or invalid values
      if (value === undefined || value === null) return;
      if (typeof value === 'string' && value.trim() === '') return;
      if (typeof value === 'number' && isNaN(value)) return;
      if (Array.isArray(value) && value.length === 0 && !fieldSchema?.default) return;
      
      cleaned[key] = value;
    });
    return cleaned;
  };

  // Execute the actor
  const handleExecute = async () => {
    setIsExecuting(true);
    setExecutionError('');
    setExecutionResult(null);
    
    try {
      const cleanedInput = cleanInputValues(inputValues);
      console.log('Executing actor with input:', cleanedInput);
      
      const response = await axios.post(`http://localhost:5000/api/execute/${actor.id}`, {
        input: cleanedInput,
        options: {
          timeout: 300, // 5 minutes
          memory: 512,  // 512MB
          maxWaitTime: 300
        }
      }, {
        headers: {
          'x-api-key': apiKey,
          'Content-Type': 'application/json'
        },
        timeout: 320000 // 5+ minutes to allow for execution
      });

      if (response.data.success) {
        console.log('Execution completed:', response.data.data);
        setExecutionResult(response.data.data);
        
        // Handle execution completion
        handleExecutionComplete(response.data.data);
      } else {
        throw new Error(response.data.error?.message || 'Execution failed');
      }
    } catch (err) {
      console.error('Execution error:', err);
      let errorMessage = 'Execution failed';
      
      // Handle JSON parsing errors specifically
      if (err.message && err.message.includes('Invalid JSON')) {
        errorMessage = err.message;
      } else if (err.response) {
        const backendError = err.response.data?.error;
        switch (err.response.status) {
          case 400:
            errorMessage = backendError?.message || 'Invalid input parameters';
            break;
          case 401:
            errorMessage = 'Authentication failed';
            break;
          case 408:
            errorMessage = 'Execution timed out';
            break;
          case 422:
            errorMessage = backendError?.message || 'Execution failed';
            break;
          case 500:
            errorMessage = 'Server error during execution';
            break;
          default:
            errorMessage = backendError?.message || `Error ${err.response.status}`;
        }
      } else if (err.code === 'ECONNABORTED') {
        errorMessage = 'Request timed out. The actor may still be running.';
      } else if (err.code === 'ECONNREFUSED') {
        errorMessage = 'Cannot connect to backend server';
      }
      
      setExecutionError(errorMessage);
      // Switch to output tab to show error
      setActiveMainTab('output');
    } finally {
      setIsExecuting(false);
    }
  };

  // Get missing required fields for better error messaging
  const getMissingFields = () => {
    // For JSON mode
    if (inputMode === 'json') {
      if (!inputValues.freeFormInput || inputValues.freeFormInput === '') {
        return ['JSON input'];
      }
      if (typeof inputValues.freeFormInput === 'string') {
        try {
          JSON.parse(inputValues.freeFormInput);
          return [];
        } catch (err) {
          return ['Valid JSON format'];
        }
      }
      return [];
    }
    
    // For form mode with schema
    if (schema?.inputSchema?.properties && schema?.inputSchema?.required) {
      return schema.inputSchema.required.filter(fieldName => {
        const value = inputValues[fieldName];
        const fieldSchema = schema.inputSchema.properties[fieldName];
        
        // Check if value is empty/invalid
        if (value === undefined || value === null) return true;
        
        // For strings, check for empty string
        if (fieldSchema?.type === 'string' && value === '') return true;
        
        // For numbers, check for NaN or empty string
        if ((fieldSchema?.type === 'number' || fieldSchema?.type === 'integer') && 
            (isNaN(value) || value === '')) return true;
        
        // For arrays, check if empty
        if (fieldSchema?.type === 'array' && Array.isArray(value) && value.length === 0) return true;
        
        return false;
      });
    }
    
    // For form mode without schema (fallback URL field)
    if (!inputValues.url || inputValues.url.trim() === '') {
      return ['URL'];
    }
    
    return [];
  };

  const validateForm = () => {
    // For JSON mode, validate JSON syntax
    if (inputMode === 'json') {
      if (inputValues.freeFormInput === undefined || inputValues.freeFormInput === '') {
        return false; // Require some input
      }
      // If it's a string, try to parse it to validate JSON
      if (typeof inputValues.freeFormInput === 'string') {
        try {
          JSON.parse(inputValues.freeFormInput);
          return true;
        } catch (err) {
          return false; // Invalid JSON
        }
      }
      return true; // Already parsed object
    }
    
    // For form mode with schema
    if (schema?.inputSchema?.properties) {
      if (!schema?.inputSchema?.required) return true;
      
      return schema.inputSchema.required.every(fieldName => {
        const value = inputValues[fieldName];
        const fieldSchema = schema.inputSchema.properties[fieldName];
        
        // Check if value is empty/invalid
        if (value === undefined || value === null) return false;
        
        // For strings, check for empty string
        if (fieldSchema?.type === 'string' && value === '') return false;
        
        // For numbers, check for NaN or empty string
        if ((fieldSchema?.type === 'number' || fieldSchema?.type === 'integer') && 
            (isNaN(value) || value === '')) return false;
        
        // For arrays, check if empty
        if (fieldSchema?.type === 'array' && Array.isArray(value) && value.length === 0) return false;
        
        return true;
      });
    }
    
    // For form mode without schema (fallback URL field)
    return inputValues.url && inputValues.url.trim() !== '';
  };

  // Format number with K/M suffix
  const formatNumber = (num) => {
    if (!num) return '0';
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  // Format date helper
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleString();
  };

  const formatDateShort = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  };

  if (isLoadingSchema) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-700 mx-auto mb-4"></div>
          <p className="text-slate-600">Loading actor schema...</p>
        </div>
      </div>
    );
  }

  if (schemaError) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-slate-800 mb-2">Schema Load Error</h2>
          <p className="text-slate-600 mb-6">{schemaError}</p>
          <button
            onClick={handleBackToActors}
            className="bg-blue-700 text-white px-4 py-2 rounded-lg hover:bg-blue-800 transition-colors"
          >
            Back to Actors
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Simple header with back button */}
      <div className="bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-4">
          <button
            onClick={handleBackToActors}
            className="inline-flex items-center text-blue-700 hover:text-blue-800 font-medium transition-colors"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Actors
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
        {/* Actor Overview Card */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-8">
          <div className="bg-blue-700 px-8 py-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-white mb-2">{schema?.title || schema?.name || actor.title || actor.name}</h1>
                <p className="text-blue-100 text-lg">by <span className="font-semibold">{schema?.username || actor.username}</span></p>
                
                {/* Status badges */}
                <div className="flex items-center space-x-3 mt-4">
                  <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                    schema?.isPublic 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-white/20 text-white'
                  }`}>
                    {schema?.isPublic ? '🌐 Public' : '🔒 Private'}
                  </div>
                  
                  {schema?.isDeprecated && (
                    <div className="px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                      ⚠️ Deprecated
                    </div>
                  )}
                  
                  {schema?.version?.buildTag && (
                    <div className="px-3 py-1 rounded-full text-xs font-medium bg-white/20 text-white">
                      📦 {schema.version.buildTag}
                    </div>
                  )}
                </div>
              </div>
              
              {/* Quick stats */}
              <div className="flex space-x-6 ml-8">
                <div className="text-center bg-white/10 px-6 py-4 rounded-xl backdrop-blur-sm">
                  <div className="text-2xl font-bold text-white">{formatNumber(schema?.stats?.totalRuns || 0)}</div>
                  <div className="text-sm text-blue-100">Total Runs</div>
                </div>
                <div className="text-center bg-white/10 px-6 py-4 rounded-xl backdrop-blur-sm">
                  <div className="text-2xl font-bold text-white">{formatNumber(schema?.stats?.totalUsers || 0)}</div>
                  <div className="text-sm text-blue-100">Users</div>
                </div>
                <div className="text-center bg-white/10 px-6 py-4 rounded-xl backdrop-blur-sm">
                  <div className="text-2xl font-bold text-white">{formatNumber(schema?.stats?.totalBuilds || 0)}</div>
                  <div className="text-sm text-blue-100">Builds</div>
                </div>
              </div>
            </div>
          </div>

          {/* Actor description */}
          {schema?.description && (
            <div className="px-8 py-6 bg-slate-50 border-b border-slate-200">
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-slate-800 mb-1">Description</h3>
                  <p className="text-slate-700 leading-relaxed">{schema.description}</p>
                </div>
              </div>
            </div>
          )}

          {/* Detailed Information */}
          <div className="px-8 py-6">
            <h3 className="text-lg font-semibold text-slate-800 mb-6">Actor Details</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
              {/* Basic Information */}
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl border border-blue-200">
                <h4 className="font-semibold text-blue-900 mb-4 flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Basic Info
                </h4>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-600">ID:</span>
                    <span className="font-mono text-xs bg-white px-2 py-1 rounded">{schema?.id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Name:</span>
                    <span className="font-medium">{schema?.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">User ID:</span>
                    <span className="font-mono text-xs bg-white px-2 py-1 rounded">{schema?.userId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Anonymous Run:</span>
                    <span className={`font-medium ${schema?.isAnonymouslyRunnable ? 'text-green-600' : 'text-red-600'}`}>
                      {schema?.isAnonymouslyRunnable ? 'Yes' : 'No'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Timeline Information */}
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl border border-blue-200">
                <h4 className="font-semibold text-blue-900 mb-4 flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Timeline
                </h4>
                <div className="space-y-3 text-sm">
                  <div>
                    <span className="text-slate-600 block">Created:</span>
                    <span className="font-medium">{formatDateShort(schema?.createdAt)}</span>
                  </div>
                  <div>
                    <span className="text-slate-600 block">Modified:</span>
                    <span className="font-medium">{formatDateShort(schema?.modifiedAt)}</span>
                  </div>
                  <div>
                    <span className="text-slate-600 block">Fetched:</span>
                    <span className="font-medium">{formatDateShort(schema?.fetchedAt)}</span>
                  </div>
                </div>
              </div>

              {/* Configuration */}
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl border border-blue-200">
                <h4 className="font-semibold text-blue-900 mb-4 flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  Configuration
                </h4>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-600">Memory:</span>
                    <span className="font-medium">{schema?.defaultRunOptions?.memoryMbytes || 'N/A'} MB</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Timeout:</span>
                    <span className="font-medium">{schema?.defaultRunOptions?.timeoutSecs ? `${Math.floor(schema.defaultRunOptions.timeoutSecs / 60)}m` : 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Build:</span>
                    <span className="font-medium">{schema?.defaultRunOptions?.build || 'latest'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Tagged Version:</span>
                    <span className="font-medium">{schema?.taggedVersion || 'N/A'}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Extended Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              {/* Detailed Statistics */}
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl border border-blue-200">
                <h4 className="font-semibold text-blue-900 mb-4 flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  Usage Statistics
                </h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="text-center bg-white p-3 rounded-lg">
                    <div className="font-bold text-lg text-blue-600">{formatNumber(schema?.stats?.totalRuns || 0)}</div>
                    <div className="text-slate-600">Total Runs</div>
                  </div>
                  <div className="text-center bg-white p-3 rounded-lg">
                    <div className="font-bold text-lg text-blue-600">{formatNumber(schema?.stats?.totalUsers || 0)}</div>
                    <div className="text-slate-600">Total Users</div>
                  </div>
                  <div className="text-center bg-white p-3 rounded-lg">
                    <div className="font-bold text-lg text-blue-600">{formatNumber(schema?.stats?.totalBuilds || 0)}</div>
                    <div className="text-slate-600">Total Builds</div>
                  </div>
                  <div className="text-center bg-white p-3 rounded-lg">
                    <div className="font-bold text-lg text-blue-600">{formatNumber(schema?.stats?.totalUsers7Days || 0)}</div>
                    <div className="text-slate-600">Users (7d)</div>
                  </div>
                </div>
                <div className="mt-4 grid grid-cols-1 gap-2 text-sm">
                  <div className="flex justify-between bg-white p-2 rounded">
                    <span className="text-slate-600">Users (30d):</span>
                    <span className="font-medium">{formatNumber(schema?.stats?.totalUsers30Days || 0)}</span>
                  </div>
                  <div className="flex justify-between bg-white p-2 rounded">
                    <span className="text-slate-600">Meta Origin:</span>
                    <span className="font-medium">{formatNumber(schema?.stats?.totalMetaOrigin || 0)}</span>
                  </div>
                </div>
              </div>

              {/* Categories and Examples */}
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl border border-blue-200">
                <h4 className="font-semibold text-blue-900 mb-4 flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                  </svg>
                  Categories & Examples
                </h4>
                <div className="space-y-4">
                  <div>
                    <span className="text-slate-600 block mb-2">Categories:</span>
                    {schema?.categories && schema.categories.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {schema.categories.map((category, index) => (
                          <span key={index} className="inline-block px-3 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                            {category}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <span className="text-slate-500 text-sm">No categories defined</span>
                    )}
                  </div>
                  
                  {schema?.examples && (
                    <div>
                      <span className="text-slate-600 block mb-2">Example Input:</span>
                      <div className="bg-white p-3 rounded-lg border">
                        <div className="text-xs text-slate-500 mb-1">Content Type: {schema.examples.contentType}</div>
                        <code className="text-xs text-slate-800 break-all">{schema.examples.body}</code>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Tagged Builds */}
            {schema?.taggedBuilds && (
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl border border-blue-200 mb-6">
                <h4 className="font-semibold text-blue-900 mb-4 flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                  Tagged Builds
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {Object.entries(schema.taggedBuilds).map(([tag, build]) => (
                    <div key={tag} className="bg-white p-4 rounded-lg border">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-slate-800">{tag}</span>
                        <span className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded">
                          {build?.buildNumber || 'N/A'}
                        </span>
                      </div>
                      {build?.createdAt && (
                        <div className="text-xs text-slate-500">
                          Created: {formatDateShort(build.createdAt)}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Main Execution Section */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Main Tabs Header */}
          <div className="border-b border-slate-200 bg-slate-50">
            <div className="flex items-center justify-between px-8 py-4">
              <nav className="flex space-x-8">
                <button
                  onClick={() => setActiveMainTab('input')}
                  className={`py-3 px-6 text-sm font-semibold rounded-lg transition-all duration-200 flex items-center space-x-2 ${
                    activeMainTab === 'input'
                      ? 'bg-blue-700 text-white shadow-lg'
                      : 'text-slate-600 hover:text-slate-800 hover:bg-slate-100'
                  }`}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  <span>Input Configuration</span>
                </button>
                <button
                  onClick={() => setActiveMainTab('output')}
                  className={`py-3 px-6 text-sm font-semibold rounded-lg transition-all duration-200 flex items-center space-x-2 ${
                    activeMainTab === 'output'
                      ? 'bg-blue-700 text-white shadow-lg'
                      : 'text-slate-600 hover:text-slate-800 hover:bg-slate-100'
                  }`}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  <span>Execution Results</span>
                  {executionResult && (
                    <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                      {executionResult.results?.length || 0}
                    </span>
                  )}
                </button>
              </nav>
              
              {/* Execute Button - Prominent Position */}
              <button
                onClick={handleExecute}
                disabled={isExecuting || !validateForm()}
                className={`px-8 py-3 rounded-xl font-semibold text-lg transition-all duration-200 flex items-center space-x-3 ${
                  isExecuting || !validateForm()
                    ? 'bg-slate-200 text-slate-500 cursor-not-allowed'
                    : 'bg-gradient-to-r from-blue-700 to-blue-600 text-white hover:from-blue-800 hover:to-blue-700 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5'
                }`}
              >
                {isExecuting ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    <span>Executing...</span>
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <span>Execute Actor</span>
                  </>
                )}
              </button>
            </div>
            
            {/* Validation Error - Right under the header */}
            {!validateForm() && activeMainTab === 'input' && (
              <div className="mx-8 mb-4 p-4 bg-gradient-to-r from-red-50 to-pink-50 border border-red-200 rounded-xl">
                <div className="flex items-start space-x-3">
                  <svg className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  <div>
                    <h3 className="text-sm font-semibold text-red-800">Missing Required Fields</h3>
                    <p className="text-sm text-red-700 mt-1">
                      Please fill in: <strong>{getMissingFields().join(', ')}</strong>
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Tab Content */}
          <div className="p-8">
            {/* Input Tab */}
            {activeMainTab === 'input' && (
              <div>
                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-slate-800 mb-4">Configure Input</h2>
                  
                  {/* Input Mode Switcher */}
                  <div className="flex items-center justify-between mb-8">
                    <span className="text-lg font-semibold text-slate-800">Input Mode</span>
                    <div className="flex bg-slate-50 rounded-xl p-1.5 border border-slate-200">
                      <button
                        onClick={() => handleInputModeChange('form')}
                        className={`px-6 py-3 text-sm font-semibold rounded-lg transition-all duration-200 flex items-center space-x-2 ${
                          inputMode === 'form'
                            ? 'bg-blue-700 text-white shadow-lg transform scale-105'
                            : 'text-slate-600 hover:text-slate-800 hover:bg-slate-100'
                        }`}
                      >
                        <span>📝</span>
                        <span>Form Fields</span>
                      </button>
                      <button
                        onClick={() => handleInputModeChange('json')}
                        className={`px-6 py-3 text-sm font-semibold rounded-lg transition-all duration-200 flex items-center space-x-2 ${
                          inputMode === 'json'
                            ? 'bg-blue-700 text-white shadow-lg transform scale-105'
                            : 'text-slate-600 hover:text-slate-800 hover:bg-slate-100'
                        }`}
                      >
                        <span>🔧</span>
                        <span>JSON Editor</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Form Mode */}
                {inputMode === 'form' && (
                  <div className="space-y-6">
                    {schema?.inputSchema?.properties ? (
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {Object.keys(schema.inputSchema.properties).map(fieldName => {
                          const field = schema.inputSchema.properties[fieldName];
                          const isRequired = schema.inputSchema.required?.includes(fieldName);
                          
                          return (
                            <div key={fieldName} className="space-y-3">
                              <label className="block text-sm font-semibold text-slate-800">
                                {field.title || fieldName}
                                {isRequired && <span className="text-red-500 ml-1">*</span>}
                              </label>
                              {field.description && (
                                <p className="text-sm text-slate-600 leading-relaxed mb-2">{field.description}</p>
                              )}
                              
                              {renderFormField(fieldName, field, inputValues[fieldName], 
                                (value) => handleInputChange(fieldName, value), isRequired)}
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <label className="block text-sm font-semibold text-slate-800">
                          URL <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="url"
                          value={inputValues.url || ''}
                          onChange={(e) => handleInputChange('url', e.target.value)}
                          placeholder="https://www.apify.com/"
                          className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white"
                        />
                      </div>
                    )}
                  </div>
                )}

                {/* JSON Mode */}
                {inputMode === 'json' && (
                  <div className="space-y-6">
                    <div className="bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 rounded-xl p-6">
                      <div className="flex items-start space-x-3">
                        <div className="flex-shrink-0">
                          <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                        <div className="flex-1">
                          <h3 className="text-sm font-semibold text-blue-800 mb-2">Advanced JSON Configuration</h3>
                          <p className="text-blue-700 text-sm">
                            Edit the JSON input directly for complete control over the input structure.
                          </p>
                          {schema?.examples && (
                            <div className="mt-3 p-3 bg-blue-100 rounded-lg">
                              <p className="text-blue-800 text-xs font-medium mb-1">Example Configuration:</p>
                              <code className="text-blue-900 text-xs">{schema.examples.body}</code>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-semibold text-slate-800 mb-3">
                        JSON Configuration
                      </label>
                      <textarea
                        value={typeof inputValues.freeFormInput === 'string' ? inputValues.freeFormInput : JSON.stringify(inputValues.freeFormInput || {}, null, 2)}
                        onChange={(e) => {
                          try {
                            // Try to parse as JSON to validate
                            const parsed = JSON.parse(e.target.value);
                            setInputValues({ freeFormInput: parsed });
                          } catch (err) {
                            // Keep as string if invalid JSON for now
                            setInputValues({ freeFormInput: e.target.value });
                          }
                        }}
                        placeholder={schema?.examples?.body || '{"url": "https://www.apify.com/"}'}
                        className="w-full h-96 px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono text-sm bg-slate-50 focus:bg-white transition-colors"
                        style={{ fontFamily: 'Monaco, Consolas, "Courier New", monospace' }}
                      />
                      <p className="mt-2 text-xs text-slate-500">
                        Enter valid JSON. {schema?.examples && (
                          <>Example: <code className="bg-slate-100 px-1 rounded">{schema.examples.body}</code></>
                        )}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Output Tab */}
            {activeMainTab === 'output' && (
              <div>
                <h2 className="text-2xl font-bold text-slate-800 mb-6">Execution Results</h2>
                
                {!executionResult && !executionError && !isExecuting && (
                  <div className="text-center py-16">
                    <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center mx-auto mb-6">
                      <svg className="w-10 h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-semibold text-slate-800 mb-2">Ready to Execute</h3>
                    <p className="text-slate-500">Configure your input and execute the actor to see results here</p>
                  </div>
                )}

                {isExecuting && (
                  <div className="text-center py-16">
                    <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center mx-auto mb-6">
                      <svg className="animate-spin w-10 h-10 text-blue-600" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-semibold text-slate-800 mb-2">Executing Actor</h3>
                    <p className="text-slate-500">Please wait while your actor is running...</p>
                  </div>
                )}

                {executionError && (
                  <div className="bg-gradient-to-r from-red-50 to-pink-50 border border-red-200 rounded-xl p-6">
                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0">
                        <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                          <svg className="w-6 h-6 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                          </svg>
                        </div>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-red-800 mb-2">Execution Failed</h3>
                        <p className="text-red-700 leading-relaxed">{executionError}</p>
                      </div>
                    </div>
                  </div>
                )}

                {executionResult && <ExecutionResults result={executionResult} />}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper function to render form fields
const renderFormField = (fieldName, field, value, onChange, isRequired) => {
  switch (field.type) {
    case 'string':
      if (field.enum) {
        return (
          <select
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-slate-50 focus:bg-white transition-colors"
          >
            <option value="">Select an option</option>
            {field.enum.map(option => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        );
      }
      
      if (field.description && field.description.length > 100) {
        return (
          <textarea
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            placeholder={field.prefill || field.example || field.description}
            rows={4}
            className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-slate-50 focus:bg-white transition-colors"
          />
        );
      }
      
      return (
        <input
          type={fieldName.toLowerCase().includes('password') ? 'password' : 'text'}
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          placeholder={field.prefill || field.example || `Enter ${fieldName}`}
          className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-slate-50 focus:bg-white transition-colors"
        />
      );

    case 'number':
    case 'integer':
      return (
        <input
          type="number"
          value={value || ''}
          onChange={(e) => {
            const inputValue = e.target.value;
            if (inputValue === '') {
              onChange('');
            } else {
              const numValue = field.type === 'integer' ? parseInt(inputValue) : parseFloat(inputValue);
              onChange(isNaN(numValue) ? '' : numValue);
            }
          }}
          min={field.minimum}
          max={field.maximum}
          step={field.type === 'integer' ? 1 : 0.1}
          className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-slate-50 focus:bg-white transition-colors"
        />
      );

    case 'boolean':
      return (
        <label className="flex items-center p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer">
          <input
            type="checkbox"
            checked={value || false}
            onChange={(e) => onChange(e.target.checked)}
            className="rounded border-slate-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50 w-5 h-5"
          />
          <span className="ml-3 text-sm text-slate-700 font-medium">
            {field.description || 'Enable this option'}
          </span>
        </label>
      );

    case 'array':
      return (
        <textarea
          value={Array.isArray(value) ? value.join('\n') : (value || '')}
          onChange={(e) => onChange(e.target.value.split('\n').filter(item => item.trim()))}
          placeholder="Enter items, one per line"
          rows={4}
          className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-slate-50 focus:bg-white transition-colors"
        />
      );

    default:
      return (
        <input
          type="text"
          value={typeof value === 'object' ? JSON.stringify(value) : (value || '')}
          onChange={(e) => onChange(e.target.value)}
          placeholder={field.prefill || field.example || `Enter ${fieldName}`}
          className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-slate-50 focus:bg-white transition-colors"
        />
      );
  }
};

// Execution Results Component
const ExecutionResults = ({ result }) => {
  const [activeTab, setActiveTab] = useState('results');

  return (
    <div>
      {/* Results Tabs */}
      <div className="border-b border-slate-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('results')}
            className={`py-3 px-1 border-b-2 font-semibold text-sm transition-colors ${
              activeTab === 'results'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
            }`}
          >
            Results ({result.results?.length || 0})
          </button>
          <button
            onClick={() => setActiveTab('stats')}
            className={`py-3 px-1 border-b-2 font-semibold text-sm transition-colors ${
              activeTab === 'stats'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
            }`}
          >
            Statistics
          </button>
        </nav>
      </div>

      {/* Results Tab Content */}
      {activeTab === 'results' && (
        <div>
          {result.results && result.results.length > 0 ? (
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {result.results.map((item, index) => (
                <div key={index} className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl p-6 border border-slate-200">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-semibold text-slate-800">Result #{index + 1}</h3>
                    <span className="text-xs text-slate-500 bg-white px-2 py-1 rounded-full">
                      {Object.keys(item).length} fields
                    </span>
                  </div>
                  <pre className="text-sm text-slate-800 whitespace-pre-wrap overflow-x-auto bg-white p-4 rounded-lg border">
                    {JSON.stringify(item, null, 2)}
                  </pre>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-slate-800 mb-2">No Results</h3>
              <p className="text-slate-500">The actor completed but returned no results</p>
            </div>
          )}
        </div>
      )}

      {/* Statistics Tab Content */}
      {activeTab === 'stats' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-xl border border-green-100">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-semibold text-green-800">Status</div>
                  <div className="text-2xl font-bold text-green-900">{result.status}</div>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl border border-blue-200">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-semibold text-blue-800">Duration</div>
                  <div className="text-2xl font-bold text-blue-900">
                    {result.stats?.durationMillis ? `${(result.stats.durationMillis / 1000).toFixed(1)}s` : 'N/A'}
                  </div>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
          
          {result.runId && (
            <div className="bg-gradient-to-br from-slate-50 to-slate-100 p-6 rounded-xl border border-slate-200">
              <div className="flex items-start space-x-3">
                <div className="w-10 h-10 bg-slate-200 rounded-full flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
                  </svg>
                </div>
                <div className="flex-1">
                  <div className="text-sm font-semibold text-slate-800 mb-1">Run ID</div>
                  <div className="text-sm font-mono text-slate-800 bg-white px-3 py-2 rounded-lg border break-all">
                    {result.runId}
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {result.startedAt && (
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl border border-blue-200">
              <div className="flex items-start space-x-3">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <div className="text-sm font-semibold text-blue-800 mb-1">Started At</div>
                  <div className="text-sm text-blue-900 bg-white px-3 py-2 rounded-lg border">
                    {new Date(result.startedAt).toLocaleString()}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ActorDetails;