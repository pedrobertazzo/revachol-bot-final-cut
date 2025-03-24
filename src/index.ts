import http from 'http';
import express from 'express';
import cors from 'cors';
import { envVars } from './utilities/env-vars';
import { runCompletion, runCompletionStream } from './completions';

const port = envVars.PORT;

const startServer = async () => {
  const app = express();
  const httpServer = http.createServer(app);

  app.use(cors());
  app.use(express.json());

  app.get('/health', (_req, res) => {
    res.status(200).send('Okay!');
  });

  app.post('/chat/completions', runCompletion);
  app.post('/chat/completions/stream', runCompletionStream);

  httpServer.listen({ port });
  console.log(`🚀 Server ready at http://localhost:${port}/ 🚀`);
};

startServer();
