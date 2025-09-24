const express = require('express');
const serverless = require('serverless-http');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const winston = require('winston');
const { v4: uuidv4 } = require('uuid');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');
const { body, validationResult } = require('express-validator');
const promClient = require('prom-client');
const fs = require('fs');
const path = require('path');

// Environment validation at startup
function validateEnvironment() {
  const required = ['NODE_ENV'];
  const optional = {
    ALLOWED_ORIGINS: 'https://dashboard.lanonasis.com,https://mcp.lanonasis.com',
    PORT: '3000'
  };

  // Check required variables
  const missing = required.filter(key => !process.env[key]);
  if (missing.length > 0) {
    console.error(`Missing required environment variables: ${missing.join(', ')}`);
    process.exit(1);
  }

  // Set defaults for optional variables
  Object.entries(optional).forEach(([key, defaultValue]) => {
    if (!process.env[key]) {
      process.env[key] = defaultValue;
    }
  });

  console.log('Environment validation passed');
}

// Validate environment on startup
validateEnvironment();

// Configure Winston logger
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      )
    })
  ]
});

// Prometheus metrics setup
const collectDefaultMetrics = promClient.collectDefaultMetrics;
collectDefaultMetrics();

const httpRequestsTotal = new promClient.Counter({
  name: 'http_requests_total',
  help: 'Total number of HTTP requests',
  labelNames: ['method', 'route', 'status_code']
});

const httpRequestDuration = new promClient.Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'route', 'status_code']
});

// Load HTML template at startup
let landingTemplate;
try {
  landingTemplate = fs.readFileSync(
    path.join(__dirname, '../../templates/landing.html'),
    'utf8'
  );
} catch (error) {
  logger.warn('Could not load landing template, using fallback', error);
  landingTemplate = '<!DOCTYPE html><html><body><h1>LanOnasis API Gateway</h1></body></html>';
}

const app = express();

// CORS configuration
// Restrict allowed origins via environment or sensible defaults
const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',') || [
  'https://lanonasis.com',
  'https://dashboard.lanonasis.com'
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-API-Key']
}));

// OpenAPI/Swagger configuration
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'LanOnasis Enterprise API Gateway',
      version: '1.0.0',
      description: 'Unified API Gateway for Enterprise Services including Memory as a Service, API Key Management, and Model Context Protocol'
    },
    servers: [
      {
        url: 'https://api.lanonasis.com',
        description: 'Production server'
      }
    ]
  },
  apis: [__filename] // paths to files containing OpenAPI definitions
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'"],
      fontSrc: ["'self'"],
      objectSrc: ["'none'"],
      mediaSrc: ["'self'"],
      frameSrc: ["'none'"],
    },
  },
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later',
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(limiter);

// Request ID middleware for tracing
app.use((req, res, next) => {
  req.id = uuidv4();
  res.setHeader('X-Request-ID', req.id);
  next();
});

// Request logging middleware
app.use((req, res, next) => {
  const start = Date.now();

  res.on('finish', () => {
    const duration = Date.now() - start;
    const route = req.route ? req.route.path : req.path;

    // Log request
    logger.info('HTTP Request', {
      requestId: req.id,
      method: req.method,
      url: req.url,
      route,
      statusCode: res.statusCode,
      duration,
      userAgent: req.get('User-Agent'),
      ip: req.ip
    });

    // Update Prometheus metrics
    httpRequestsTotal.inc({
      method: req.method,
      route,
      status_code: res.statusCode
    });

    httpRequestDuration.observe(
      { method: req.method, route, status_code: res.statusCode },
      duration / 1000
    );
  });

  next();
});

// CORS configuration (more secure)
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS.split(','),
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-API-Key', 'X-Request-ID']
}));

app.use(express.json({ limit: '10mb' }));

// Serve OpenAPI docs
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Metrics endpoint (with basic auth check)
app.get('/metrics', (req, res) => {
  const auth = req.headers.authorization;
  // Basic auth check - in production, use proper authentication
  if (!auth || !auth.includes('Basic')) {
    return res.status(401).json({ error: 'Authentication required for metrics endpoint' });
  }

  res.set('Content-Type', promClient.register.contentType);
  res.send(promClient.register.metrics());
});

// Root endpoint - Enterprise Services Landing Page
app.get('/', (req, res) => {
  // Check if request prefers JSON (API clients) or HTML (browsers)
  const acceptsJson = req.headers.accept && req.headers.accept.includes('application/json');
  const isApiRequest = req.get('User-Agent')?.includes('curl') || 
                      req.get('User-Agent')?.includes('Postman') ||
                      req.get('User-Agent')?.includes('HTTPie') ||
                      acceptsJson;

  if (isApiRequest || req.query.format === 'json') {
    // Return JSON for API clients
    res.json({
      platform: 'LanOnasis Enterprise Services',
      tagline: 'Unified API Gateway for Enterprise Solutions',
      version: '1.0.0',
      status: 'operational',
      baseUrl: 'https://api.lanonasis.com',
      services: {
        memory: {
          name: 'Memory as a Service (MaaS)',
          description: 'AI-powered memory management with semantic search',
          endpoints: {
            base: '/api/v1/memory',
            docs: '/docs#memory'
          },
          features: ['Vector Search', 'Multi-tenant', 'Role-based Access', 'Analytics']
        },
        apiKeys: {
          name: 'API Key Management',
          description: 'Secure storage and rotation of API keys',
          endpoints: {
            base: '/api/v1/api-keys',
            docs: '/docs#api-keys'
          },
          features: ['Secure Storage', 'Automatic Rotation', 'Access Control', 'Audit Logging']
        },
        mcp: {
          name: 'Model Context Protocol',
          description: 'Secure AI agent access to enterprise secrets',
          endpoints: {
            base: '/api/v1/mcp',
            docs: '/docs#mcp'
          },
          features: ['AI Agent Integration', 'Secure Context', 'Zero-trust Access', 'Real-time Updates']
        }
      },
      endpoints: {
        documentation: '/docs',
        dashboard: '/dashboard',
        health: '/api/v1/health',
        authentication: '/api/v1/auth',
        mcp: '/mcp',
        metrics: '/metrics'
      },
      integrations: {
        database: 'Supabase PostgreSQL with Vector Extensions',
        authentication: 'JWT with Role-based Access Control',
        ai: 'OpenAI Embeddings for Semantic Search',
        monitoring: 'Prometheus Metrics & Winston Logging'
      },
      support: {
        documentation: 'https://docs.lanonasis.com',
        contact: 'support@lanonasis.com',
        github: 'https://github.com/lanonasis'
      },
      timestamp: new Date().toISOString()
    });
  } else {
    // Serve HTML landing page for browsers
    res.setHeader('Content-Type', 'text/html');
    res.setHeader('Content-Security-Policy', "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self';");
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.send(landingTemplate);
  }
});

// Health endpoint
app.get('/health', (req, res) => {
  res.json({
    name: 'Lanonasis Memory Service',
    version: '1.0.0',
    status: 'healthy',
    timestamp: new Date().toISOString(),
    environment: 'netlify',
    database: 'connected',
    endpoints: {
      memory: 'operational',
      auth: 'operational',
      apiKeys: 'operational',
      mcp: 'operational'
    }
  });
});

app.get('/api/v1/health', (req, res) => {
  res.json({
    name: 'Lanonasis Memory Service',
    version: '1.0.0',
    status: 'healthy',
    timestamp: new Date().toISOString(),
    environment: 'netlify',
    database: 'connected',
    endpoints: {
      memory: 'operational',
      auth: 'operational',
      apiKeys: 'operational',
      mcp: 'operational'
    }
  });
});

// Input validation middleware
const loginValidation = [
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters long')
];

const registerValidation = [
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/).withMessage('Password must contain at least one lowercase letter, one uppercase letter, and one number'),
  body('confirmPassword').custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new Error('Password confirmation does not match password');
    }
    return true;
  }),
  body('firstName').optional().isLength({ min: 1, max: 50 }).withMessage('First name must be 1-50 characters'),
  body('lastName').optional().isLength({ min: 1, max: 50 }).withMessage('Last name must be 1-50 characters')
];

// Validation error handler
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      error: 'Validation failed',
      details: errors.array()
    });
  }
  next();
};

/**
 * @swagger
 * /api/v1/auth/login:
 *   post:
 *     summary: Authenticate user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 minLength: 8
 *     responses:
 *       200:
 *         description: Successful authentication
 *       400:
 *         description: Validation error
 *       401:
 *         description: Invalid credentials
 */
app.post('/api/v1/auth/login', loginValidation, handleValidationErrors, (req, res) => {
  // Don't echo back sensitive data
  const { email } = req.body;

  res.json({
    message: 'Authentication endpoint - implementation in progress',
    endpoint: '/api/v1/auth/login',
    email: email.split('@')[0] + '@***', // Masked email
    status: 'placeholder',
    note: 'Input validation passed'
  });
});

/**
 * @swagger
 * /api/v1/auth/register:
 *   post:
 *     summary: Register new user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *               - confirmPassword
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 minLength: 8
 *               confirmPassword:
 *                 type: string
 *               firstName:
 *                 type: string
 *                 maxLength: 50
 *               lastName:
 *                 type: string
 *                 maxLength: 50
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: Validation error
 *       409:
 *         description: User already exists
 */
app.post('/api/v1/auth/register', registerValidation, handleValidationErrors, (req, res) => {
  // Don't echo back sensitive data
  const { email, firstName, lastName } = req.body;

  res.status(201).json({
    message: 'Registration endpoint - implementation in progress',
    endpoint: '/api/v1/auth/register',
    email: email.split('@')[0] + '@***', // Masked email
    firstName: firstName || null,
    lastName: lastName || null,
    status: 'placeholder',
    note: 'Input validation passed'
  });
});

// Memory endpoints
app.get('/api/v1/memory', (req, res) => {
  res.json({
    message: 'Memory list endpoint - requires authentication',
    endpoint: '/api/v1/memory',
    status: 'placeholder',
    note: 'Full implementation requires database connection'
  });
});

app.post('/api/v1/memory', (req, res) => {
  res.json({
    message: 'Memory creation endpoint - requires authentication',
    endpoint: '/api/v1/memory',
    status: 'placeholder',
    body: req.body
  });
});

// API Key management endpoints
app.get('/api/v1/api-keys', (req, res) => {
  res.json({
    message: 'API Keys management endpoint - requires authentication',
    endpoint: '/api/v1/api-keys',
    status: 'placeholder'
  });
});

app.post('/api/v1/api-keys', (req, res) => {
  res.json({
    message: 'API Key creation endpoint - requires authentication',
    endpoint: '/api/v1/api-keys',
    status: 'placeholder',
    body: req.body
  });
});

// MCP endpoints
app.get('/api/v1/mcp/status', (req, res) => {
  res.json({
    message: 'MCP status endpoint',
    endpoint: '/api/v1/mcp/status',
    status: 'operational',
    protocol: 'Model Context Protocol v1.0',
    features: ['api-key-management', 'memory-service', 'proxy-tokens']
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Endpoint not found',
    path: req.originalUrl,
    method: req.method,
    available_endpoints: [
      '/',
app.use((err, req, res, next) => {
  console.error('API Error:', err);
  res.status(500).json({
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development'
      ? err.message
      : 'An error occurred processing your request',
    requestId: req.id, // Add request tracking
    timestamp: new Date().toISOString()
  });
});
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('API Error:', err);
  res.status(500).json({
    error: 'Internal server error',
    message: err.message,
    timestamp: new Date().toISOString()
  });
});

// Export serverless handler
const serverlessHandler = serverless(app);

exports.handler = async (event, context) => {
  // Set timeout context
  context.callbackWaitsForEmptyEventLoop = false;
  
  return await serverlessHandler(event, context);
};