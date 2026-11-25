import express from 'express';
import swaggerUi from 'swagger-ui-express';
import {parse} from 'yaml';
import {readFileSync} from 'node:fs';
import path from 'node:path';
import {projectRoot} from './config/paths.js';

const app = express();

app.use(express.json());

// Documentation Swagger : lecture du YAML -> objet JS -> swagger-ui-express
const openApiPath = path.join(projectRoot, 'docs', 'openapi.yaml');
const openApiDocument = parse(readFileSync(openApiPath, 'utf8'));

app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(openApiDocument));

export default app;
