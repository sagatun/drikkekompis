# Drikkekompis

Drikkekompis is a project that aims to help users find the perfect drink for their occasion, whether it's a party, a date, or just a cozy night in. The project consists of a client built with Vite and ReactJS, a server built with NodeJS and Express, and a scraper that uses Firestore.

## 🌐 Live Demo

Check out the live demo [here](https://drikkekompis.app).

## 🚀 Prerequisites

Before you begin, make sure you have:

- A Google Cloud account.
- Cloud Run and Firestore services enabled on your Google Cloud account.

These services are essential for the project's server and database functionalities.

## Installation and Setup

To run the project, you will need Docker installed on your machine. Once you have Docker, you can start the project by running the following command in the root directory of the project:

'''
docker-compose up --build
'''

## Environment Variables

The following environment variables need to be set for the project to work properly:

Each .env files should be placed in each project folders:

```bash

./client/.env
./scraper/.env
./server/.env

```

🔐 Important: For the server and scraper to function correctly, you must also place your Google Cloud service account JSON key in the root directory of each. Name the file according to the value you provide for the GOOGLE_APPLICATION_CREDENTIALS environment variable.

### Client

- `VITE_SERVER_URL`: The local server URL.
- `VITE_ENVIRONMENT`: The environment (development or production).

### Server

- `VINMONOPOLET_API_KEY`: The API key from api.vinmonopolet.no.
- `GPT_API_KEY`: The API key from OpenAI.
- `GOOGLE_APPLICATION_CREDENTIALS`: The gcloud service account key (json file)

### Scraper

- `PORT`: The localhost port.
- `VINMONOPOLET_API_KEY`: The API key from api.vinmonopolet.no.
- `GOOGLE_APPLICATION_CREDENTIALS`: The gcloud service account key (json file)

## Packages Used

The project uses the following packages:

### Client

- `@tanstack/react-query`: A popular data fetching and caching library.
- `@tanstack/react-table`: A flexible and powerful table library.
- `axios`: A popular promise-based HTTP client.
- `react`: A popular library for building user interfaces.

### Server

- `@google-cloud/firestore`: A package that provides access to Firestore, a NoSQL document database built for automatic scaling, high performance, and ease of application development.
- `@google-cloud/functions-framework`: A package that provides a framework for writing lightweight, modular functions in Node.js that run in many different environments, including Cloud Functions.
- `@google-cloud/secret-manager`: A package that provides access to Secret Manager, a secure and convenient storage system for API keys, passwords, and other sensitive data.
- `express`: A popular and minimalistic web framework for Node.js.
- `openai`: A package that provides access to the OpenAI GPT-3 API, a state-of-the-art natural language processing system.

### Scraper

- `puppeteer`: A Node.js library which provides a high-level API to control Chrome or Chromium over the DevTools Protocol.
- `express`: A popular and minimalistic web framework for Node.js.

## File Structure

The project has the following file structure:

- `client`: Contains the client code built with Vite and ReactJS.
- `function`: Contains the scraper built with NodeJS, Firestore, and (in the future) Cloud Functions.
- `server`: Contains the server code built with NodeJS and Express.
- `project files and config`: Contains various project files and configurations.

## License

This project is licensed under the MIT License. See the
