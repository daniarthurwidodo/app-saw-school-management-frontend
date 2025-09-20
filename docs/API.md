# API Documentation

This project includes comprehensive API documentation in two formats:

1. **JSDoc Annotations** - Inline documentation in the MirageJS server code
2. **OpenAPI Specification** - Standalone OpenAPI 3.0 YAML file

## JSDoc Annotations

The MirageJS server (`mirage/server.ts`) contains detailed JSDoc annotations for all API endpoints. These annotations include:

- Route descriptions and summaries
- Parameter definitions
- Return value specifications
- Error response documentation
- Tags for grouping related endpoints

### Viewing JSDoc Documentation

Most modern IDEs (VS Code, WebStorm, etc.) will automatically display JSDoc documentation when you hover over route definitions in the MirageJS server code.

You can also generate HTML documentation from the JSDoc annotations using tools like JSDoc or TypeDoc:

```bash
# Install TypeDoc globally
npm install -g typedoc

# Generate documentation
typedoc mirage/server.ts --out docs/api
```

## OpenAPI Specification

The OpenAPI 3.0 specification (`openapi.yaml`) provides a complete, standalone description of the API that can be used with various tools.

### Validating the OpenAPI Specification

The project includes a validation script to ensure the OpenAPI specification is syntactically correct:

```bash
npm run validate:openapi
```

### Using the OpenAPI Specification

The OpenAPI specification can be used with numerous tools:

1. **Swagger UI** - Render interactive API documentation
2. **Postman** - Import as a collection for API testing
3. **Insomnia** - Import for API testing and development
4. **Code Generation** - Generate client SDKs in various languages
5. **API Gateways** - Configure API gateways and proxies

### Example Usage with Swagger UI

To view the API documentation in Swagger UI:

1. Copy the `openapi.yaml` file
2. Paste it into the [Swagger Editor](https://editor.swagger.io/)
3. View the interactive documentation

### Example Usage with Postman

To import the API specification into Postman:

1. Open Postman
2. Click "Import" in the top left
3. Select the `openapi.yaml` file
4. Postman will create a collection with all API endpoints

## API Endpoints

The API includes the following endpoint groups:

### Authentication
- `POST /api/auth/login` - Authenticate user
- `POST /api/auth/logout` - Logout user

### Users
- `GET /api/users` - Get all users
- `GET /api/users/{id}` - Get user by ID
- `POST /api/users` - Create new user
- `PUT /api/users/{id}` - Update user
- `DELETE /api/users/{id}` - Delete user

### Documents
- `GET /api/documents` - Get documents with search, filter, and pagination
- `GET /api/documents/{id}` - Get document by ID
- `POST /api/documents` - Create new document
- `PUT /api/documents/{id}` - Update document
- `DELETE /api/documents/{id}` - Delete document

### Tasks
- `GET /api/tasks` - Get tasks with search and filter
- `GET /api/tasks/{id}` - Get task by ID
- `POST /api/tasks` - Create new task
- `PUT /api/tasks/{id}` - Update task
- `DELETE /api/tasks/{id}` - Delete task

### Subtasks
- `GET /api/subtasks` - Get all subtasks
- `GET /api/subtasks/{id}` - Get subtask by ID
- `POST /api/subtasks` - Create new subtask
- `PUT /api/subtasks/{id}` - Update subtask
- `DELETE /api/subtasks/{id}` - Delete subtask

### Dashboard
- `GET /api/dashboard/stats` - Get dashboard statistics

## Data Models

The API defines the following data models:

- **User** - User information
- **Document** - Document metadata
- **Task** - Task information with subtasks
- **Subtask** - Subtask information
- **AuthResponse** - Authentication response
- **DashboardStats** - Dashboard statistics
- **Error** - Error response format

Each model is fully documented with property descriptions, types, and examples.

## Extending the Documentation

When adding new endpoints to the MirageJS server:

1. Add JSDoc annotations to the route definition
2. Update the `openapi.yaml` file with the new endpoint
3. Add any new data models to the OpenAPI specification
4. Run `npm run validate:openapi` to verify the specification