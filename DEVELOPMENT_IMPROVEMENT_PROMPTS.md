# 🎯 GigRakshak AI - Complete Development Prompt for Future Improvements

## HOW TO USE THIS PROMPT

This document contains **detailed prompts** for each improvement area. Copy-paste any section into the AI (or for your developers) to get started on that specific improvement.

When asking for improvements, provide this context for better results:
- The prompt from below
- Your current code (paste the relevant file)
- Any specific requirements or constraints
- Desired outcome/acceptance criteria

---

---

## PROMPT 1: SECURITY HARDENING - JWT AUTHENTICATION

### OBJECTIVE
Implement JWT-based authentication to replace the current mock authentication system. Users should receive a JWT token on login/registration, send it with each request, and the token should be validated server-side.

### CURRENT STATE
- Mock authentication in localStorage (no backend validation)
- Anyone can call APIs without token
- No password hashing
- No secure session management

### REQUIREMENTS
1. **Backend Implementation**:
   - Create `/api/auth/register` endpoint that:
     - Validates email format (use Joi)
     - Hashes password with bcrypt (salt rounds: 10)
     - Creates user in MongoDB
     - Returns JWT token (expires in 7 days)
   
   - Create `/api/auth/login` endpoint that:
     - Validates email/password
     - Returns JWT token on success
     - Returns 401 on invalid credentials
   
   - Create authentication middleware that:
     - Checks JWT token in Authorization header
     - Verifies token signature
     - Attaches user info to req.user
     - Returns 401 if token invalid/missing

2. **Frontend Implementation**:
   - Store JWT in httpOnly cookie (not localStorage)
   - Send token with every API request
   - Handle 401 errors with automatic logout
   - Refresh token on expiry

3. **Database Changes**:
   - Add email, passwordHash fields to User model
   - Add unique index on email
   - Add createdAt, updatedAt timestamps

### ACCEPTANCE CRITERIA
- ✅ New user can register with email/password
- ✅ Existing user can login with email/password
- ✅ JWT token returned and stored securely
- ✅ Token validated on each API request
- ✅ 401 error returned for invalid/missing token
- ✅ Token automatically refreshed on expiry
- ✅ Passwords hashed with bcrypt
- ✅ No plaintext passwords in logs

### DEPENDENCIES TO ADD
```json
{
  "jsonwebtoken": "^9.1.0",
  "bcryptjs": "^2.4.3",
  "joi": "^17.11.0"
}
```

### ESTIMATED EFFORT
2-3 days

---

## PROMPT 2: INPUT VALIDATION - SCHEMA VALIDATION MIDDLEWARE

### OBJECTIVE
Add comprehensive input validation to all API endpoints using Joi schemas. Validate request body, query params, and path params. Return 400 with detailed error messages for invalid input.

### CURRENT STATE
- No input validation on any endpoint
- Database accepts any data
- No error messages for invalid input
- Potential for data corruption

### REQUIREMENTS
1. **Create validation schemas** for:
   - User registration (name, email, password, location, income)
   - Risk calculation (location, income)
   - Policy purchase (userId, planType)
   - Claim processing (userId, amount, reason)

2. **Create validation middleware** that:
   - Validates request body against schema
   - Validates query parameters
   - Validates path parameters
   - Returns 400 with specific error details
   - Supports optional fields

3. **Apply to all endpoints**:
   - POST /api/users/register
   - POST /api/auth/login
   - POST /api/risk
   - POST /api/pricing
   - POST /api/policy/buy
   - POST /api/trigger/check
   - POST /api/claim/auto

### EXAMPLE SCHEMA
```javascript
const userRegistrationSchema = Joi.object({
  name: Joi.string().min(2).max(50).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
  location: Joi.string().min(2).max(50).required(),
  dailyIncome: Joi.number().min(100).max(100000).required(),
  platform: Joi.string().valid('Zomato', 'Swiggy', 'Dunzo').required()
});
```

### ACCEPTANCE CRITERIA
- ✅ All endpoints validate input
- ✅ Invalid input returns 400
- ✅ Error messages are specific and helpful
- ✅ Schemas handle both required and optional fields
- ✅ Data type coercion happens automatically

### ESTIMATED EFFORT
3-4 days

---

## PROMPT 3: ERROR HANDLING - COMPREHENSIVE ERROR LOGGING & TRACKING

### OBJECTIVE
Implement centralized error handling throughout the application. Log all errors to a file/service, return consistent error responses, and track error patterns.

### CURRENT STATE
- Errors logged only to console
- No error tracking
- Inconsistent error responses
- No error ID for debugging

### REQUIREMENTS
1. **Create error handling middleware** that:
   - Catches all errors globally
   - Logs error with timestamp, stack trace, request ID
   - Returns consistent JSON error response with:
     - Error ID (for support reference)
     - Human-readable message
     - Error code (400, 401, 403, 500, etc.)
     - Request ID (for tracing)

2. **Add logging service** that:
   - Creates logs directory
   - Rotates logs daily
   - Separates error logs from regular logs
   - Includes timestamp, level (ERROR, WARN, INFO), context

3. **Add error classes** for:
   - ValidationError (400)
   - UnauthorizedError (401)
   - ForbiddenError (403)
   - NotFoundError (404)
   - InternalServerError (500)

### EXAMPLE RESPONSE
```javascript
// Success
{
  "success": true,
  "data": { ... }
}

// Error
{
  "success": false,
  "error": {
    "id": "ERR_2024_03_26_0001",
    "message": "Invalid email format",
    "code": 400,
    "requestId": "req_12345"
  }
}
```

### ACCEPTANCE CRITERIA
- ✅ All errors tracked and logged
- ✅ Consistent error response format
- ✅ Error logs stored durably
- ✅ Each error has unique ID
- ✅ Stack traces visible in logs only (not to client)
- ✅ Request ID included for tracing

### DEPENDENCIES TO ADD
```json
{
  "winston": "^3.11.0",
  "express-async-errors": "^3.1.1"
}
```

### ESTIMATED EFFORT
2-3 days

---

## PROMPT 4: TESTING - UNIT TEST SUITE FOR BACKEND

### OBJECTIVE
Create a comprehensive unit test suite for backend logic using Jest. Test all business logic functions, controllers, and services with 80%+ code coverage.

### CURRENT STATE
- Zero test coverage
- Manual testing only
- No regression testing
- Can't verify code changes don't break existing functionality

### REQUIREMENTS
1. **Setup Jest**:
   - Configure jest.config.js
   - Setup test database (in-memory MongoDB)
   - Setup test utilities and mocks

2. **Test categories**:
   - Unit tests for services (riskEngine, pricingEngine)
   - Unit tests for utilities (weather.js)
   - Unit tests for controllers (with mocked services)
   - Unit tests for validation schemas

3. **Test examples**:
   ```javascript
   // Test 1: Risk calculation
   describe('calculateRisk', () => {
     it('should return LOW risk for score < 0.3', () => {
       const result = calculateRisk({ rain: 0, aqi: 50, orderDrop: 0 });
       expect(result.level).toBe('LOW');
     });
   });

   // Test 2: Price calculation
   describe('calculatePremium', () => {
     it('should apply 1.5x multiplier for HIGH risk', () => {
       const premium = calculatePremium(50, 'HIGH');
       expect(premium).toBe(75);
     });
   });
   ```

4. **Coverage targets**:
   - Business logic: 100%
   - Controllers: 80%
   - Overall: 80%+

### ACCEPTANCE CRITERIA
- ✅ All core functions have tests
- ✅ All controllers have tests
- ✅ Coverage report generated
- ✅ Tests run in < 10 seconds
- ✅ No external API calls in tests (mocked)
- ✅ Tests pass in CI/CD pipeline

### DEPENDENCIES TO ADD
```json
{
  "jest": "^29.7.0",
  "mongodb-memory-server": "^9.1.6",
  "supertest": "^6.3.3"
}
```

### ESTIMATED EFFORT
5-7 days

---

## PROMPT 5: API DOCUMENTATION - SWAGGER/OPENAPI DOCUMENTATION

### OBJECTIVE
Create interactive API documentation using Swagger/OpenAPI. Document all endpoints, request/response schemas, authentication requirements, and error codes.

### CURRENT STATE
- No API documentation
- Developers must read code to understand API
- No API contract definition
- Frontend doesn't know response structure in advance

### REQUIREMENTS
1. **Install swagger-ui-express**
2. **Document all endpoints**:
   - `/api/auth/register`
   - `/api/auth/login`
   - `/api/users/register`
   - `/api/risk`
   - `/api/pricing`
   - `/api/policy/buy`
   - `/api/trigger/check`
   - `/api/claim/auto`

3. **For each endpoint, document**:
   - HTTP method and path
   - Description
   - Request body (with example)
   - Query parameters
   - Response (200, 400, 401, 500)
   - Authentication requirement
   - Rate limiting

4. **Setup at `/api-docs`** for interactive testing

### EXAMPLE
```javascript
/**
 * @swagger
 * /api/risk:
 *   post:
 *     summary: Calculate risk score
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               location: { type: string }
 *               income: { type: number }
 *     responses:
 *       200:
 *         description: Risk calculated
 *         content:
 *           application/json:
 *             schema: { type: object }
 *       400:
 *         description: Invalid input
 */
```

### ACCEPTANCE CRITERIA
- ✅ All endpoints documented
- ✅ Swagger UI accessible at /api-docs
- ✅ Request/response examples provided
- ✅ Can test endpoints from Swagger UI
- ✅ Authentication requirements clear
- ✅ Error codes documented

### DEPENDENCIES TO ADD
```json
{
  "swagger-ui-express": "^5.0.0",
  "swagger-jsdoc": "^6.2.8"
}
```

### ESTIMATED EFFORT
3-4 days

---

## PROMPT 6: PERFORMANCE - REDIS CACHING FOR WEATHER DATA

### OBJECTIVE
Implement Redis caching for weather API calls. Cache weather data for 1 hour to reduce API calls and improve response time.

### CURRENT STATE
- Weather API called on every risk calculation
- Same location queried multiple times (cache miss)
- Slow response times for second request

### REQUIREMENTS
1. **Setup Redis**:
   - Docker Compose with Redis service
   - Connection pooling
   - 1-hour TTL for weather data

2. **Implement cache layer**:
   - Before calling weather API, check cache
   - If cache hit, return cached data
   - If cache miss, fetch from API and cache it
   - Cache key: `weather:${location}`

3. **Cache invalidation**:
   - Automatic 1-hour expiry
   - Manual invalidation endpoint (for testing)

### EXAMPLE CODE
```javascript
async function getWeatherDataWithCache(location) {
  // Check cache first
  const cached = await redis.get(`weather:${location}`);
  if (cached) return JSON.parse(cached);

  // Fetch from API
  const data = await getWeatherData(location);

  // Store in cache (1 hour TTL)
  await redis.setex(`weather:${location}`, 3600, JSON.stringify(data));

  return data;
}
```

### ACCEPTANCE CRITERIA
- ✅ First request takes ~500ms (API call)
- ✅ Second request takes ~5ms (cache hit)
- ✅ Cache expires after 1 hour
- ✅ Same location used multiple times benefits from cache
- ✅ Different locations have separate cache entries

### DEPENDENCIES TO ADD
```json
{
  "redis": "^4.6.11",
  "ioredis": "^5.3.2"
}
```

### DOCKER COMPOSE ADDITION
```yaml
redis:
  image: redis:7-alpine
  ports:
    - "6379:6379"
```

### ESTIMATED EFFORT
2-3 days

---

## PROMPT 7: FRONTEND - ERROR BOUNDARY & LOADING STATES

### OBJECTIVE
Add React Error Boundary component to catch errors gracefully. Add loading skeletons for all API calls. Implement toast notifications for success/error messages.

### CURRENT STATE
- No error boundary (one error crashes entire app)
- No loading states (no feedback to user)
- No success/error notifications
- Poor UX during data loading

### REQUIREMENTS
1. **Create ErrorBoundary component**:
   - Catches React errors
   - Shows user-friendly message
   - Logs error to Sentry
   - Provides retry button

2. **Create loading skeleton components**:
   - RiskCardSkeleton
   - WeatherCardSkeleton
   - MetricsCardSkeleton
   - FormSkeleton

3. **Create Toast notification system**:
   - Success toast (green)
   - Error toast (red)
   - Warning toast (yellow)
   - 5-second auto-dismiss

4. **Add loading states to all forms**:
   - Disable button during submission
   - Show spinner inside button
   - Disable inputs during submission

### EXAMPLE CODE
```javascript
// ErrorBoundary.jsx
class ErrorBoundary extends React.Component {
  state = { hasError: false };

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return <ErrorPage onRetry={() => this.setState({ hasError: false })} />;
    }
    return this.props.children;
  }
}

// useToast.js
const useToast = () => {
  return {
    success: (msg) => toast.success(msg),
    error: (msg) => toast.error(msg),
    loading: (msg) => toast.loading(msg)
  };
};
```

### ACCEPTANCE CRITERIA
- ✅ App doesn't crash on errors
- ✅ User sees skeleton while loading
- ✅ Toast appears on success/error
- ✅ All forms have loading states
- ✅ Error pages have retry buttons
- ✅ Smooth animations

### DEPENDENCIES TO ADD
```json
{
  "react-hot-toast": "^2.4.1",
  "react-loading-skeleton": "^3.3.1"
}
```

### ESTIMATED EFFORT
3-4 days

---

## PROMPT 8: DEPLOYMENT - DOCKER & CI/CD SETUP

### OBJECTIVE
Containerize the application with Docker. Setup GitHub Actions for automated testing and deployment on every push.

### CURRENT STATE
- Manual deployment only
- No containerization
- No automated tests before deployment
- Environment inconsistencies between dev/prod

### REQUIREMENTS
1. **Create Dockerfile for backend**:
   - Node.js 18 base image
   - Install dependencies
   - Expose port 5000
   - Health check

2. **Create Dockerfile for frontend**:
   - Node.js 18 base image
   - Build with npm run build
   - Multi-stage build
   - Serve with nginx

3. **Create docker-compose.yml**:
   - Backend service
   - Frontend service
   - MongoDB service
   - Redis service

4. **Setup GitHub Actions** (CI/CD):
   - Lint on every PR
   - Run tests on every push
   - Build Docker images
   - Deploy to staging on merge to develop
   - Deploy to production on merge to main

### EXAMPLE Dockerfile
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
EXPOSE 5000
HEALTHCHECK --interval=30s --timeout=3s \
  CMD node healthcheck.js
CMD ["npm", "start"]
```

### ACCEPTANCE CRITERIA
- ✅ Local setup with `docker-compose up -d`
- ✅ Tests run automatically on PR
- ✅ Build fails if tests fail
- ✅ Docker images built and pushed to registry
- ✅ Deployment happens automatically
- ✅ Rollback possible if deployment fails

### ESTIMATED EFFORT
4-5 days

---

---

## HOW TO COMBINE THESE PROMPTS

**For a developer taking on improvements:**

1. Choose one prompt from above
2. Copy the OBJECTIVE section
3. Add: "Here's the current code: [paste relevant code]"
4. Add: "Here's what I need: [paste REQUIREMENTS section]"
5. Add: "Acceptance criteria: [paste ACCEPTANCE CRITERIA]"
6. Ask: "Please implement this and provide: code + tests + documentation"

**Example request:**
```
I need help implementing JWT authentication. Here's my current code:
[paste server.js, user model, routes]

Requirements:
- Implement /api/auth/register endpoint
- Implement /api/auth/login endpoint
- Create authentication middleware
- Hash passwords with bcrypt
- Return JWT token valid for 7 days

Please provide:
1. Updated backend code
2. Frontend changes needed
3. Tests for the new endpoints
4. Instructions for testing
```

---

## TRACKING PROGRESS

Create a GitHub project to track:
1. Each prompt as a "Task"
2. Link to code changes
3. Link to PR review
4. Mark as completed when merged

---

**Total Estimated Effort**: 3-4 months for a small team  
**Priority Order**: 1 → 2 → 4 → 3 → 5 → 6 → 7 → 8

**Contact**: Use these prompts whenever you need AI assistance on improvements!
