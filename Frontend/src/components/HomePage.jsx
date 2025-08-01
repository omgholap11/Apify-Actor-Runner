import React from 'react';
import { useNavigate } from 'react-router-dom';
const HomePage = () => {

  const navigate = useNavigate();

  const handleApiKeyClick = () => {
      navigate("/apikeyform");
  };

  const cardsData = [
    {
      title: 'Dynamic Actor Management',
      description: 'Seamlessly list, view, and execute your Apify actors with real-time updates and comprehensive monitoring.',
      icon: '🚀',
      color: 'from-blue-500 to-blue-600'
    },
    {
      title: 'Smart Schema Forms',
      description: 'Auto-generated forms based on actor input schemas for effortless interaction and validation.',
      icon: '📋',
      color: 'from-blue-600 to-blue-700'
    },
    {
      title: 'Instant Execution',
      description: 'Trigger actor runs with live results and comprehensive error handling for optimal performance.',
      icon: '⚡',
      color: 'from-slate-500 to-slate-600'
    },
    {
      title: 'Secure Integration',
      description: 'Enterprise-grade security with session-based API key management and encrypted connections.',
      icon: '🔒',
      color: 'from-blue-700 to-slate-600'
    },
    {
      title: 'Real-time Monitoring',
      description: 'Track your actor runs with detailed logs, performance metrics, and actionable insights.',
      icon: '📊',
      color: 'from-slate-600 to-blue-600'
    },
    {
      title: 'Data Export',
      description: 'Export results in multiple formats with advanced filtering options and data transformation.',
      icon: '📤',
      color: 'from-blue-500 to-slate-500'
    }
  ];

  return (
    <div className="min-h-screen bg-white relative overflow-hidden">
      {/* Sophisticated Background Elements */}
      <div className="absolute inset-0">
        {/* Animated Gradient Orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-blue-300/10 to-blue-400/10 rounded-full mix-blend-multiply filter blur-3xl animate-pulse"></div>
        <div className="absolute top-3/4 right-1/4 w-80 h-80 bg-gradient-to-r from-indigo-300/15 to-blue-400/15 rounded-full mix-blend-multiply filter blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
        <div className="absolute top-1/2 left-3/4 w-72 h-72 bg-gradient-to-r from-slate-200/10 to-slate-300/10 rounded-full mix-blend-multiply filter blur-3xl animate-pulse" style={{animationDelay: '4s'}}></div>
      </div>

      <div className="relative z-10 container mx-auto px-6 py-16">
        {/* Enhanced Header */}
        <div className="text-center mb-20">
          <div className="mb-12">
            <h1 className="text-6xl md:text-7xl font-bold bg-gradient-to-r from-slate-800 via-blue-700 to-slate-700 bg-clip-text text-transparent mb-6 tracking-tight">
              Apify Actor Runner
            </h1>
            
            <div className="flex justify-center mb-6">
              <div className="w-32 h-px bg-gradient-to-r from-transparent via-blue-600 to-transparent"></div>
            </div>
          </div>
          
          <p className="text-xl md:text-2xl text-slate-600 mb-12 max-w-4xl mx-auto leading-relaxed">
            Enterprise-grade web automation platform engineered for developers and organizations. 
            <span className="text-blue-700 font-semibold"> Build, execute, and monitor</span> your Apify actors with unparalleled reliability.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
            <button
              onClick={handleApiKeyClick}
              className="group relative px-10 py-4 bg-blue-700 text-white font-semibold rounded-xl shadow-lg shadow-blue-700/25 hover:shadow-xl hover:shadow-blue-700/30 transform hover:scale-105 transition-all duration-300 ease-out border border-blue-600 hover:bg-blue-800"
            >
              <span className="relative z-10 flex items-center gap-3">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 8a6 6 0 01-7.743 5.743L10 14l-1 1-1 1H6v2H2v-4l4.257-4.257A6 6 0 1118 8zm-6-4a1 1 0 100 2 2 2 0 012 2 1 1 0 102 0 4 4 0 00-4-4z" clipRule="evenodd" />
                </svg>
                Configure API Access
                <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </span>
            </button>
            
            <div className="flex items-center gap-3 text-slate-500 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></div>
                <span className="font-medium text-slate-600">Live Environment</span>
              </div>
              <div className="w-px h-4 bg-slate-300"></div>
              <span>Zero Configuration Required</span>
            </div>
          </div>

          {/* Professional Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16 max-w-4xl mx-auto">
            {[
              { number: '10+', label: 'Monthly Executions', icon: '⚡' },
              { number: '5+', label: 'Active Developers', icon: '👥' },
              { number: '99.9%', label: 'Service Uptime', icon: '🛡️' }
            ].map((stat, index) => (
              <div key={index} className="group relative bg-white border border-slate-200 rounded-2xl p-8 hover:border-blue-300 hover:shadow-lg transition-all duration-300 transform hover:scale-105">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-slate-50/30 opacity-0 group-hover:opacity-100 rounded-2xl transition-opacity duration-300"></div>
                <div className="relative z-10">
                  <div className="text-3xl mb-4 transform group-hover:scale-110 transition-transform duration-300">{stat.icon}</div>
                  <div className="text-4xl font-bold text-slate-800 mb-2">{stat.number}</div>
                  <div className="text-slate-600 font-medium">{stat.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Enhanced Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
          {cardsData.map((card, index) => (
            <div
              key={index}
              className="group relative bg-white border border-slate-200 rounded-2xl p-8 hover:border-blue-300 hover:shadow-xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-2"
            >
              {/* Gradient Border Effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 to-slate-50/20 opacity-0 group-hover:opacity-100 rounded-2xl transition-opacity duration-300"></div>
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-600 to-slate-500 rounded-t-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              
              <div className="relative z-10">
                {/* Icon with Glow Effect */}
                <div className="relative mb-6">
                  <div className="relative text-4xl p-3 transform group-hover:scale-110 transition-transform duration-300">
                    {card.icon}
                  </div>
                </div>
                
                {/* Content */}
                <h3 className="text-xl font-bold text-slate-800 mb-4 group-hover:text-blue-700 transition-colors duration-300">
                  {card.title}
                </h3>
                
                <p className="text-slate-600 leading-relaxed group-hover:text-slate-700 transition-colors duration-300">
                  {card.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Premium CTA Section */}
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-slate-200/20 to-blue-200/20 rounded-3xl blur-3xl"></div>
          <div className="relative bg-gradient-to-br from-slate-50 to-white border border-slate-200 rounded-3xl p-12 shadow-xl">
            <div className="text-center mb-10">
              <div className="inline-flex items-center justify-center p-2 bg-blue-50 rounded-full border border-blue-200 mb-6">
                <span className="px-4 py-2 text-blue-700 font-medium text-sm">
                  🚀 Ready for Production
                </span>
              </div>
              
              <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-slate-800 to-slate-700 bg-clip-text text-transparent mb-6 tracking-tight">
                Scale Your Automation
              </h2>
              
              <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
                Join enterprise teams and developers who trust our platform for 
                <span className="text-blue-700 font-semibold"> mission-critical automation workflows</span> at scale.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-10">
              <button
                onClick={handleApiKeyClick}
                className="group relative px-10 py-4 bg-blue-700 text-white font-bold rounded-xl shadow-lg shadow-blue-700/25 hover:shadow-xl hover:shadow-blue-700/30 transform hover:scale-105 transition-all duration-300 border border-blue-600 hover:bg-blue-800"
              >
                <span className="relative z-10 flex items-center gap-3">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                    <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                  </svg>
                  Start Building Today
                </span>
              </button>
              
              <div className="text-slate-600 text-sm space-y-1">
                <div className="font-medium">• Enterprise-ready infrastructure</div>
                <div>• 24/7 technical support included</div>
              </div>
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-wrap justify-center items-center gap-8 text-slate-600 text-sm">
              {[
                { icon: '🏆', text: 'SOC 2 Type II Certified' },
                { icon: '🔒', text: 'Enterprise Security' },
                { icon: '📞', text: '24/7 Premium Support' },
                { icon: '⚡', text: '99.99% SLA Guarantee' }
              ].map((item, index) => (
                <div key={index} className="flex items-center gap-2 hover:text-blue-700 transition-colors duration-300">
                  <span className="text-lg">{item.icon}</span>
                  <span className="font-medium">{item.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;