// API Gateway 配置管理
export const API_CONFIG = {
    // API Gateway 基础配置
    gateway: {
        // 🆕 使用正确的 API Gateway 地址
        baseUrl: import.meta.env.VITE_API_GATEWAY_URL || 'https://api.onencp-test.gcncp.nikecloud.com.cn',
        timeout: parseInt(import.meta.env.VITE_API_TIMEOUT || '10000'),
        retryAttempts: 2, // 🆕 根据文档固定为2次
        retryDelay: parseInt(import.meta.env.VITE_API_RETRY_DELAY || '1000'),
    },

    // health check configuration
    health: {
        // 🆕 使用正确的健康检查端点
        endpoint: '/healthcheck',
        interval: 30000, // 30 seconds check once
    },

    // authentication configuration
    auth: {
        tokenRefreshThreshold: 300, // refresh if expires in 5 minutes
        maxRetries: 3,
    },

    // feature flags
    features: {
        enableApiGateway: import.meta.env.VITE_ENABLE_API_GATEWAY !== 'false',
        enableHealthCheck: import.meta.env.VITE_ENABLE_HEALTH_CHECK !== 'false',
        enableTokenRefresh: import.meta.env.VITE_ENABLE_TOKEN_REFRESH !== 'false',
        mockMode: import.meta.env.VITE_MOCK_MODE === 'true',
        // 🆕 添加安全相关功能开关
        enableSecurityHeaders: import.meta.env.VITE_ENABLE_SECURITY_HEADERS !== 'false',
        enableCorsValidation: import.meta.env.VITE_ENABLE_CORS_VALIDATION !== 'false',
    },

    // development mode configuration
    development: {
        logLevel: 'debug',
        enableRequestLogging: true,
        enableResponseLogging: true,
        // 🆕 添加安全头验证
        validateSecurityHeaders: true,
    },

    // 🆕 安全配置 - 根据文档添加
    security: {
        expectedHeaders: {
            'X-XSS-Protection': '1; mode=block',
            'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',
            'X-Frame-Options': 'DENY',
            'X-Content-Type-Options': 'nosniff',
            'Referrer-Policy': 'no-referrer',
            'X-Permitted-Cross-Domain-Policies': 'none',
            'Content-Security-Policy': "default-src 'self' https:; font-src 'self' https: data:; img-src 'self' https: data:; object-src 'none'; script-src https:; style-src 'self' https: 'unsafe-inline'",
            'X-Download-Options': 'noopen',
        } as const,
    },

    // 🆕 CORS 配置 - 根据文档添加
    cors: {
        allowedOrigins: [
            window.location.origin,
            'https://nike.okta.com',
            'https://api.onencp-test.gcncp.nikecloud.com.cn', // 🆕 添加 API Gateway 域名
            // 🆕 根据实际需要添加其他允许的域名
            ...(import.meta.env.VITE_CORS_ALLOWED_ORIGINS?.split(',') || []),
        ],
        allowedMethods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
        allowedHeaders: [
            'Content-Type',
            'Authorization',
            'X-ID-Token',
            'X-Request-ID',
            'X-Client-Type',
            'X-Client-Version',
        ],
        exposedHeaders: [
            'X-Request-ID',
            'X-Response-Time',
        ],
        allowCredentials: true,
        maxAge: 86400, // 24 hours
    },

    // 🆕 重试策略配置 - 根据文档
    retry: {
        // Response Code 5xx: 2 times
        serverError: { maxAttempts: 2, delay: 1000 },
        // Response Code 408: 2 times  
        timeout: { maxAttempts: 2, delay: 1000 },
        // Response Code 429: 2 times
        rateLimit: { maxAttempts: 2, delay: 2000 },
        // IOException: 2 times
        networkError: { maxAttempts: 2, delay: 1000 },
        // TimeoutException: 2 times
        requestTimeout: { maxAttempts: 2, delay: 1000 },
    },
};

// environment detection
export const isDevelopment = import.meta.env.DEV;
export const isProduction = import.meta.env.PROD;

// configuration validation
export const validateConfig = (): boolean => {
    const required = [
        API_CONFIG.gateway.baseUrl,
    ];

    const missing = required.filter(config => !config);

    if (missing.length > 0) {
        console.error('Missing required API configuration:', missing);
        return false;
    }

    // 🆕 验证 CORS 配置
    if (API_CONFIG.features.enableCorsValidation) {
        const currentOrigin = window.location.origin;
        if (!API_CONFIG.cors.allowedOrigins.includes(currentOrigin)) {
            console.warn('Current origin not in allowed CORS origins:', currentOrigin);
        }
    }

    return true;
};

// 🆕 获取重试配置
export const getRetryConfig = (errorCode: string, statusCode: number) => {
    if (statusCode >= 500) {
        return API_CONFIG.retry.serverError;
    }
    if (statusCode === 408) {
        return API_CONFIG.retry.timeout;
    }
    if (statusCode === 429) {
        return API_CONFIG.retry.rateLimit;
    }
    if (errorCode === 'IO_EXCEPTION') {
        return API_CONFIG.retry.networkError;
    }
    if (errorCode === 'TIMEOUT_EXCEPTION') {
        return API_CONFIG.retry.requestTimeout;
    }

    // 默认不重试
    return { maxAttempts: 0, delay: 0 };
};
