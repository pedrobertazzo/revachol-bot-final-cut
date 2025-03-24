# Revachol Bot: Final Cut

Welcome to **Revachol Bot: Final Cut**, a fan-made chat backend inspired by the world of _Disco Elysium_.

## Prerequisites

This projects uses OpenAI SDK, so you need a compatible provider (openAI, gemini, etc) and API Key to continue.

---

## Setting Up the Environment

1. Install dependencies:

   ```bash
   yarn
   ```

2. Create the `env/development-secrets.env` file if it doesn't exist:

   ```bash
   touch env/development-secrets.env
   ```

3. Populate it with your sensitive variables:

   ```env
   OPENAI_API_KEY=your_openai_api_key_here
   ```

4. (Optional) Update `env/development.env` with non-sensitive configuration:
   ```env
   API_BASE_URL=https://generativelanguage.googleapis.com/v1beta/
   PORT=3000
   ```

---

## Quickstart

1. Start the development server:

   ```bash
   yarn dev
   ```

2. Open your browser and visit:

   ```
   http://localhost:3000
   ```

3. Use the following endpoints to interact with the bot:

   - **Health Check**:  
     **GET** `/health`  
     Returns `200 OK` with the message `Okay!`

   - **Chat Completions**:  
     **POST** `/chat/completions`  
     **Body**:

     ```json
     {
       "prompt": "Your prompt here",
       "character": "harryDuBois"
     }
     ```

   - **Streamed Chat Completions**:  
     **POST** `/chat/completions/stream`  
     Same body as above, but responses are streamed.

---

## Characters

Each character has been carefully crafted to reflect their unique personalities from _Disco Elysium_. Here's a quick overview:

- **Harry Du Bois**: Chaotic, poetic, and deeply unstable. Expect existential despair and surreal metaphors.
- **Kim Kitsuragi**: Logical, disciplined, and dryly humorous. The voice of reason in a sea of madness.
- **Cuno**: Loud, profane, and unpredictable. Chaos incarnate.
- **Evrart Claire**: Smooth, manipulative, and always in control. A master of subtle pressure.
- **Joyce Messier**: Pragmatic, efficient, and tinged with dry humor. No-nonsense, but not heartless.

---

## Tests

Run the test suite to ensure everything is working as expected:

```bash
yarn test
```

---
