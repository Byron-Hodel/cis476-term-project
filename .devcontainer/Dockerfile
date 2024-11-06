# Base image for development containers
FROM mcr.microsoft.com/devcontainers/universal:2-linux AS base

# Set working directory
WORKDIR /CIS476-term-project

# Copy package.json and lock file for dependency installation
COPY term-project-frontend/package.json term-project-frontend/package-lock.json term-project-frontend/

# Install dependencies
RUN cd term-project-frontend && npm install

# Copy all project files from the term-project-frontend directory
COPY term-project-frontend/ term-project-frontend/

# Copy and install backend dependencies
COPY ./backend-server/package.json ./backend-server/package-lock.json ./backend-server/
RUN cd backend-server && npm install

# Copy all backend project files
COPY ./backend-server /workspaces/cis476-term-project/backend-server

# Expose the application port
EXPOSE 3000 4000
