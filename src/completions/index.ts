import { NextFunction, Request, Response } from 'express';
import { openai } from '../client/openai';
import { ChatCompletionSystemMessageParam, ChatCompletionUserMessageParam } from 'openai/resources';

import { envVars } from '../utilities/env-vars';
import { characters } from '../instructions/character-instructions';

const model = envVars.API_MODEL;
const temperature = 1.5;

const isRequestValid = (req: Request, res: Response): boolean => {
  const prompt = req.body.prompt;
  const character = req.body.character;

  if (!prompt) {
    res.status(400).json({
      error: 'Bad Request',
      message: "Missing required 'prompt' parameter",
    });
    return false;
  }

  if (!character || !characters[character]) {
    res.status(400).json({
      error: 'Bad Request',
      message: `Invalid value for parameter 'character', needs to match one of the possible values: ${Object.keys(
        characters
      ).join(', ')}`,
    });
    return false;
  }

  return true;
};

export const runCompletionStream = async (req: Request, res: Response, _next: NextFunction) => {
  try {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    const prompt = req.body.prompt;
    const character = req.body.character;

    if (!isRequestValid(req, res)) {
      return;
    }

    const characterInstructions = characters[character]!;

    const messages = [
      { role: 'user', content: prompt } as ChatCompletionUserMessageParam,
      { role: 'system', content: characterInstructions } as ChatCompletionSystemMessageParam,
    ];

    const stream = await openai.chat.completions.create({
      model,
      temperature,
      messages: messages,
      stream: true,
    });

    // Send each chunk as an SSE event
    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content || '';
      if (content) {
        res.status(200).write(`data: ${JSON.stringify({ text: content })}\n\n`);
      }
    }

    res.write('data: [DONE]\n\n');
    res.end();
  } catch (error) {
    console.error('Error while executing runCompletionStream:', error);
    res.status(500).json({ error: (error as Error).message });
    res.end();
  }
};

export const runCompletion = async (req: Request, res: Response, _next: NextFunction) => {
  try {
    const prompt = req.body.prompt;
    const character = req.body.character;

    if (!isRequestValid(req, res)) {
      return;
    }

    const characterInstructions = characters[character]!;

    const messages = [
      { role: 'user', content: prompt } as ChatCompletionUserMessageParam,
      { role: 'system', content: characterInstructions } as ChatCompletionSystemMessageParam,
    ];

    const response = await openai.chat.completions.create({
      model,
      temperature,
      messages: messages,
    });

    console.log('response:', response);

    res.status(200).json({ text: response });
  } catch (error) {
    console.error('Error while executing runCompletion:', error);
    res.status(500).json({ error: (error as Error).message });
    res.end();
  }
};
