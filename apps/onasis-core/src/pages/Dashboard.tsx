/**
 * Dashboard Page Component
 * Main dashboard for authenticated users
 */

import React, { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import {
  BarChart3,
  Key,
  Code2,
  FileText,
  Settings,
  Users,
  Activity,
  Package,
  Copy,
  Check,
  ExternalLink,
  Terminal,
  BookOpen,
  Shield,
} from 'lucide-react'
import toast from 'react-hot-toast'

interface QuickAction {
  icon: React.ElementType
  label: string
  description: string
  action: () => void
  color: string
}

interface Stat {
  label: string
  value: string | number
  change: string
  trend: 'up' | 'down' | 'neutral'
}

export const Dashboard: React.FC = () => {
  const { user } = useAuth()
  const [copiedKey, setCopiedKey] = useState<string | null>(null)
  
  // Mock API key for demonstration
  const apiKey = 'lns_api_' + Math.random().toString(36).substr(2, 9)
  
  const handleCopyApiKey = (key: string) => {
    navigator.clipboard.writeText(key)
    setCopiedKey(key)
    toast.success('API key copied to clipboard')
    setTimeout(() => setCopiedKey(null), 2000)
  }
  
  const quickActions: QuickAction[] = [
    {
      icon: Key,
      label: 'API Keys',
      description: 'Manage your API keys',
      action: () => toast.info('Opening API key management...'),
      color: 'bg-blue-500',
    },
    {
      icon: Code2,
      label: 'API Sandbox',
      description: 'Test API endpoints',
      action: () => toast.info('Opening API sandbox...'),
      color: 'bg-purple-500',
    },
    {
      icon: FileText,
      label: 'Documentation',
      description: 'Browse API docs',
      action: () => toast.info('Opening documentation...'),
      color: 'bg-green-500',
    },
    {
      icon: Settings,
      label: 'Settings',
      description: 'Configure your account',
      action: () => toast.info('Opening settings...'),
      color: 'bg-gray-500',
    },
  ]
  
  const stats: Stat[] = [
    {
      label: 'API Calls Today',
      value: '12,543',
      change: '+12.3%',
      trend: 'up',
    },
    {
      label: 'Active API Keys',
      value: 3,
      change: 'No change',
      trend: 'neutral',
    },
    {
      label: 'Response Time',
      value: '45ms',
      change: '-5ms',
      trend: 'up',
    },
    {
      label: 'Success Rate',
      value: '99.9%',
      change: '+0.1%',
      trend: 'up',
    },
  ]
  
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                API Dashboard
              </h1>
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                Welcome back, {user?.name || 'Developer'}!
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                <ExternalLink className="h-4 w-4 inline mr-2" />
                View API Docs
              </button>
            </div>
          </div>
        </div>
      </header>
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="bg-white dark:bg-gray-800 rounded-lg shadow p-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {stat.label}
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                    {stat.value}
                  </p>
                </div>
                <Activity
                  className={`h-8 w-8 ${
                    stat.trend === 'up'
                      ? 'text-green-500'
                      : stat.trend === 'down'
                      ? 'text-red-500'
                      : 'text-gray-500'
                  }`}
                />
              </div>
              <p
                className={`text-sm mt-2 ${
                  stat.trend === 'up'
                    ? 'text-green-600'
                    : stat.trend === 'down'
                    ? 'text-red-600'
                    : 'text-gray-600'
                }`}
              >
                {stat.change} from yesterday
              </p>
            </div>
          ))}
        </div>
        
        {/* API Key Section */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow mb-8">
          <div className="p-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              Your API Key
            </h2>
            <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <code className="text-sm font-mono text-gray-800 dark:text-gray-200">
                  {apiKey}
                </code>
                <button
                  onClick={() => handleCopyApiKey(apiKey)}
                  className="ml-4 p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  {copiedKey === apiKey ? (
                    <Check className="h-5 w-5 text-green-500" />
                  ) : (
                    <Copy className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              Keep your API key secure and never share it publicly.
            </p>
          </div>
        </div>
        
        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickActions.map((action, index) => (
              <button
                key={index}
                onClick={action.action}
                className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 hover:shadow-lg transition-shadow text-left"
              >
                <div
                  className={`inline-flex p-3 rounded-lg ${action.color} text-white mb-4`}
                >
                  <action.icon className="h-6 w-6" />
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  {action.label}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  {action.description}
                </p>
              </button>
            ))}
          </div>
        </div>
        
        {/* Code Examples */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
          <div className="p-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              Quick Start
            </h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Install the SDK
                </h3>
                <div className="bg-gray-900 rounded-lg p-4">
                  <code className="text-sm text-green-400">
                    npm install @lanonasis/api-sdk
                  </code>
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Initialize the client
                </h3>
                <div className="bg-gray-900 rounded-lg p-4">
                  <pre className="text-sm text-gray-300">
{`import { LanonasisClient } from '@lanonasis/api-sdk'

const client = new LanonasisClient({
  apiKey: '${apiKey}'
})

// Make your first API call
const response = await client.api.test()
console.log(response)`}
                  </pre>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Resources */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <a
            href="#"
            className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 hover:shadow-lg transition-shadow"
          >
            <BookOpen className="h-8 w-8 text-blue-500 mb-4" />
            <h3 className="font-semibold text-gray-900 dark:text-white">
              API Documentation
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
              Complete reference for all endpoints
            </p>
          </a>
          
          <a
            href="#"
            className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 hover:shadow-lg transition-shadow"
          >
            <Terminal className="h-8 w-8 text-purple-500 mb-4" />
            <h3 className="font-semibold text-gray-900 dark:text-white">
              Interactive Console
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
              Test API calls in real-time
            </p>
          </a>
          
          <a
            href="#"
            className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 hover:shadow-lg transition-shadow"
          >
            <Shield className="h-8 w-8 text-green-500 mb-4" />
            <h3 className="font-semibold text-gray-900 dark:text-white">
              Security Best Practices
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
              Keep your integration secure
            </p>
          </a>
        </div>
      </main>
    </div>
  )
}