import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { ArrowRight, Terminal, Code, Database, Key, Cpu, Layers } from 'lucide-react';

export default function Developers() {
  return (
    <>
      <Helmet>
        <title>Developers | Lan Onasis Memory Service</title>
        <meta name="description" content="Developer tools and resources for the Lan Onasis Memory Service platform. API documentation, SDKs, and integration guides." />
        <meta name="keywords" content="Memory Service, API, SDK, developer tools, integration, documentation, AI memory" />
      </Helmet>
      
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-indigo-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Developer Hub
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-12">
              Access powerful tools and resources to integrate Lan Onasis Memory Service into your applications
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="bg-gray-800/50 backdrop-blur-lg rounded-xl p-6 border border-gray-700 hover:border-blue-500 transition-all"
            >
              <div className="flex items-center mb-4">
                <Terminal className="w-8 h-8 text-blue-400 mr-3" />
                <h3 className="text-2xl font-semibold">API Documentation</h3>
              </div>
              <p className="text-gray-300 mb-4">
                Comprehensive REST API documentation with interactive examples and endpoint specifications.
              </p>
              <a 
                href="https://api.lanonasis.com/docs" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center text-blue-400 hover:text-blue-300 font-medium"
              >
                View Documentation
                <ArrowRight className="ml-2 w-4 h-4" />
              </a>
            </motion.div>
            
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="bg-gray-800/50 backdrop-blur-lg rounded-xl p-6 border border-gray-700 hover:border-green-500 transition-all"
            >
              <div className="flex items-center mb-4">
                <Code className="w-8 h-8 text-green-400 mr-3" />
                <h3 className="text-2xl font-semibold">SDK & CLI Tools</h3>
              </div>
              <p className="text-gray-300 mb-4">
                Download our SDKs and CLI tools for seamless integration with your development workflow.
              </p>
              <a 
                href="https://api.lanonasis.com/developers/sdk" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center text-green-400 hover:text-green-300 font-medium"
              >
                Get SDKs
                <ArrowRight className="ml-2 w-4 h-4" />
              </a>
            </motion.div>
            
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="bg-gray-800/50 backdrop-blur-lg rounded-xl p-6 border border-gray-700 hover:border-purple-500 transition-all"
            >
              <div className="flex items-center mb-4">
                <Key className="w-8 h-8 text-purple-400 mr-3" />
                <h3 className="text-2xl font-semibold">API Key Management</h3>
              </div>
              <p className="text-gray-300 mb-4">
                Generate and manage API keys for secure access to Memory Service features.
              </p>
              <a 
                href="https://api.lanonasis.com/dashboard" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center text-purple-400 hover:text-purple-300 font-medium"
              >
                Manage Keys
                <ArrowRight className="ml-2 w-4 h-4" />
              </a>
            </motion.div>
            
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="bg-gray-800/50 backdrop-blur-lg rounded-xl p-6 border border-gray-700 hover:border-yellow-500 transition-all"
            >
              <div className="flex items-center mb-4">
                <Database className="w-8 h-8 text-yellow-400 mr-3" />
                <h3 className="text-2xl font-semibold">Memory Integration</h3>
              </div>
              <p className="text-gray-300 mb-4">
                Learn how to store, retrieve, and manage AI memories across your applications.
              </p>
              <a 
                href="https://api.lanonasis.com/developers/memory" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center text-yellow-400 hover:text-yellow-300 font-medium"
              >
                Integration Guide
                <ArrowRight className="ml-2 w-4 h-4" />
              </a>
            </motion.div>
            
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="bg-gray-800/50 backdrop-blur-lg rounded-xl p-6 border border-gray-700 hover:border-red-500 transition-all"
            >
              <div className="flex items-center mb-4">
                <Cpu className="w-8 h-8 text-red-400 mr-3" />
                <h3 className="text-2xl font-semibold">MCP Server</h3>
              </div>
              <p className="text-gray-300 mb-4">
                Connect external AI agents to Lan Onasis Memory Service via our MCP endpoint.
              </p>
              <a 
                href="https://api.lanonasis.com/mcp" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center text-red-400 hover:text-red-300 font-medium"
              >
                MCP Documentation
                <ArrowRight className="ml-2 w-4 h-4" />
              </a>
            </motion.div>
            
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="bg-gray-800/50 backdrop-blur-lg rounded-xl p-6 border border-gray-700 hover:border-cyan-500 transition-all"
            >
              <div className="flex items-center mb-4">
                <Layers className="w-8 h-8 text-cyan-400 mr-3" />
                <h3 className="text-2xl font-semibold">Platform Services</h3>
              </div>
              <p className="text-gray-300 mb-4">
                Explore all platform services and their integration capabilities.
              </p>
              <a 
                href="https://api.lanonasis.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center text-cyan-400 hover:text-cyan-300 font-medium"
              >
                View All Services
                <ArrowRight className="ml-2 w-4 h-4" />
              </a>
            </motion.div>
          </div>
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="text-center"
          >
            <p className="text-gray-400">
              Need help with integration? Visit our developer portal at{' '}
              <a 
                href="https://api.lanonasis.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-400 hover:text-blue-300 underline"
              >
                api.lanonasis.com
              </a>
            </p>
          </motion.div>
        </div>
      </div>
    </>
  );
}