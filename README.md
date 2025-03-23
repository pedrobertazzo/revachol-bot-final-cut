# revachol-bot-final-cut

A simple chat backend using Express and OpenAI SDK.

## Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- [Yarn](https://yarnpkg.com/) (or npm)
- An OpenAI API key

## Env

Environment variables are managed using two files located in the `env` folder:

1. `env/development.env`: Contains non-sensitive configuration variables.

   ```
   API_BASE_URL=your_base_url_here (e.g. https://generativelanguage.googleapis.com/v1beta/)
   PORT=3000
   ```

2. `env/development-secrets.env`: Contains sensitive configuration variables (e.g., API keys).
   ```
   OPENAI_API_KEY=your_openai_api_key_here
   ```

### Setting Up the Environment

1. Create the `env/development-secrets.env` file if it doesn't exist.
2. Populate it with your sensitive variables, such as `OPENAI_API_KEY`.

## Quickstart

- `yarn`
- `yarn dev`
- available at http://localhost:3000

## Tests

- `yarn test`

## Endpoints

### Health Check

- **GET** `/health`
  - Returns `200 OK` with the message `Okay!`

### Chat Completions

- **POST** `/chat/completions`
  - **Body**:
    ```json
    {
      "prompt": "Your prompt here",
      "character": "harryDuBois"
    }
    ```
