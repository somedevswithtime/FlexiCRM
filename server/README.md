# Server Application

This server provides API endpoints for the FlexiCRM application, primarily focused on managing schemas.

## Main Routes

The following are the main routes currently available:

- `GET /api/schemas`: Retrieves all accessible schemas.
- `GET /api/schemas/:schemaId`: Retrieves a specific schema by its ID.

## Running the Server

To run the server for development:

```bash
npm run dev
```

This command uses `ts-node-dev` to automatically restart the server when file changes are detected.

To build the server for production:

```bash
npm run build
```

To start the server in production (after building):

```bash
npm run start
```
