# Use the base image from the devcontainer.json
FROM mcr.microsoft.com/devcontainers/universal:2-linux

# Set the working directory for the entire project
#WORKDIR /workspaces/cis476-term-project

# Copy package.json files for frontend (and backend when available) to install dependencies
# COPY ./term-project-frontend/package*.json /workspaces/term-project-frontend/
# COPY ./term-project-backend/package*.json /workspaces/term-project-backend/

# Install dependencies for the frontend
#WORKDIR /workspaces/cis476-term-project/term-project-frontend
#RUN npm install

# Install dependencies for the backend (when available)
# WORKDIR /workspaces/term-project-backend
# RUN npm install

# Copy the rest of the application code for frontend (and backend when available)
# COPY ../term-project-frontend /workspaces/term-project-frontend
# COPY ./term-project-backend /workspaces/term-project-backend

# Start the Next.js frontend in development mode
#WORKDIR /workspaces/term-project-frontend
#RUN npm install -g concurrently
#EXPOSE 3000

# CMD ["npm", "run", "dev"]
