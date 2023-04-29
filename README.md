# Drikkekompis

Drikkekompis is a project that aims to help users find the perfect drink for their occasion, whether it's a party, a date, or just a cozy night in. The project consists of a client built with Vite and ReactJS, a server built with NodeJS and Express, and a scraper that uses Firestore.

## Installation and Setup

To run the project, you will need Docker installed on your machine. Once you have Docker, you can start the project by running the following command in the root directory of the project:

'''
docker-compose up --build
'''

## Environment Variables

The following environment variables need to be set for the project to work properly:

### Client

- `VITE_SERVER_URL`: The local server URL.
- `VITE_ENVIRONMENT`: The environment (development or production).

### Server

- `VINMONOPOLET_API_KEY`: The API key from api.vinmonopolet.no.
- `GPT_API_KEY`: The API key from OpenAI.

### Cloud Function

- `PORT`: The localhost port.
- `VINMONOPOLET_API_KEY`: The API key from api.vinmonopolet.no.

## Packages Used

The project uses the following packages:

### Client

- `@tanstack/react-query`: A popular data fetching and caching library.
- `@tanstack/react-query-devtools`: A tool to help debug and visualize queries.
- `@tanstack/react-table`: A flexible and powerful table library.
- `axios`: A popular promise-based HTTP client.
- `dotenv`: A zero-dependency module that loads environment variables from a .env file.
- `react`: A popular library for building user interfaces.
- `react-dom`: A package that provides DOM-specific methods that can be used at the top level of an app to enable React features.
- `react-select`: A flexible and powerful select control for React.
- `serve`: A package that serves a static site or single-page app.

### Server

- `@google-cloud/firestore`: A package that provides access to Firestore, a NoSQL document database built for automatic scaling, high performance, and ease of application development.
- `@google-cloud/functions-framework`: A package that provides a framework for writing lightweight, modular functions in Node.js that run in many different environments, including Cloud Functions.
- `@google-cloud/secret-manager`: A package that provides access to Secret Manager, a secure and convenient storage system for API keys, passwords, and other sensitive data.
- `axios`: A popular promise-based HTTP client.
- `dotenv`: A zero-dependency module that loads environment variables from a .env file.
- `express`: A popular and minimalistic web framework for Node.js.
- `nodemon`: A tool that automatically restarts the server when changes are detected.
- `openai`: A package that provides access to the OpenAI GPT-3 API, a state-of-the-art natural language processing system.
- `puppeteer-core`: A Node.js library which provides a high-level API to control Chrome or Chromium over the DevTools Protocol.

## File Structure

The project has the following file structure:

- `client`: Contains the client code built with Vite and ReactJS.
- `function`: Contains the scraper built with NodeJS, Firestore, and (in the future) Cloud Functions.
- `server`: Contains the server code built with NodeJS and Express.
- `project files and config`: Contains various project files and configurations.

## License

This project is licensed under the MIT License. See the
