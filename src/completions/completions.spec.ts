import { Request, Response, NextFunction } from 'express';
import { runCompletion } from './index';
import { openai } from '../client/openai';

jest.mock('../client/openai', () => ({
  openai: {
    chat: {
      completions: {
        create: jest.fn(),
      },
    },
  },
}));

describe('runCompletion', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockNext: NextFunction;

  beforeEach(() => {
    mockRequest = {
      body: {
        prompt: 'Hello, world!',
        model: 'test-model',
        temperature: 0.7,
      },
    };

    mockResponse = {
      setHeader: jest.fn().mockReturnThis(),
      write: jest.fn().mockReturnThis(),
      end: jest.fn().mockReturnThis(),
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };

    mockNext = jest.fn();
  });

  it('should stream a valid response when the completion API succeeds', async () => {
    const mockStream = async function* () {
      yield { choices: [{ delta: { content: 'Hello' } }] };
      yield { choices: [{ delta: { content: ', world!' } }] };
    };

    (openai.chat.completions.create as jest.Mock).mockResolvedValue(mockStream());

    await runCompletion(mockRequest as Request, mockResponse as Response, mockNext);

    expect(mockResponse.write).toHaveBeenCalledWith(
      `data: ${JSON.stringify({ text: 'Hello' })}\n\n`
    );
    expect(mockResponse.write).toHaveBeenCalledWith(
      `data: ${JSON.stringify({ text: ', world!' })}\n\n`
    );
    expect(mockResponse.write).toHaveBeenCalledWith('data: [DONE]\n\n');
    expect(mockResponse.end).toHaveBeenCalled();
  });

  it('should handle errors and forward exception', async () => {
    const mockError = new Error('Test error');
    (openai.chat.completions.create as jest.Mock).mockRejectedValue(mockError);

    await runCompletion(mockRequest as Request, mockResponse as Response, mockNext);

    expect(mockResponse.status).toHaveBeenCalledWith(500);
    expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Test error' });
    expect(mockResponse.end).toHaveBeenCalled();
  });

  it('should return an error if prompt is missing', async () => {
    await runCompletion(
      {
        body: {
          prompt: '',
          model: 'test-model',
          temperature: 0.7,
        },
      } as Request,
      mockResponse as Response,
      mockNext
    );

    expect(mockResponse.status).toHaveBeenCalledWith(400);
    expect(mockResponse.json).toHaveBeenCalledWith({
      error: 'Bad Request',
      message: "Missing required 'prompt' parameter",
    });
    expect(mockResponse.end).toHaveBeenCalled();
  });
});
