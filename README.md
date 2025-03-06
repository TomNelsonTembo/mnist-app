# MNIST Classification Frontend with Vite + React

This project is a frontend application built with **Vite** and **React** that serves as a user interface for interacting with MNIST classification models. It allows users to draw digits, submit them for classification, and view the model's predictions.

## Features

- **Interactive Canvas**: Draw digits using a mouse or touch input.
- **Model Integration**: Connect to a backend service running MNIST classification models.
- **Real-Time Predictions**: Submit drawn digits and receive classification results instantly.
- **Responsive Design**: Works seamlessly on both desktop and mobile devices.

## Prerequisites

Before you begin, ensure you have the following installed:

- [Node.js](https://nodejs.org/) (v16 or higher)
- [npm](https://www.npmjs.com/) or [Yarn](https://yarnpkg.com/)

## Getting Started

1. **Clone the Repository**

   ```bash
   git clone git@github.com:TomNelsonTembo/mnist-app.git
   cd mnist-classification-frontend
   ```
2.**Install Dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```
3. **Run the Development Server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```
4. **Build for Production**
   To build the project for production, run:
   ```bash
   npm run build
   # or
   yarn build
   ```
## Project Structure
   ```
   mnist-frontend/
   ├── public/              # Static assets
   ├── src/                 # Source code
   │   ├── assets/      # React components
   │   ├── hooks/           # Custom React hooks
   │   ├── App.css/           # Stylesheet
   │   ├── App.jsx          # Main application component
   │   └── main.jsx         # Entry point
   ├── .env                 # Environment variables
   ├── vite.config.js       # Vite configuration
   ├── Dockerfile           # Dockerfile
   ├── package.json         # Project dependencies
   └── README.md            # This file
   ```
