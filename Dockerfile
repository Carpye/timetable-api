# Use the official Bun image
FROM oven/bun:latest

# Set the working directory inside the container
WORKDIR /app

# Copy the package files first (for better caching)
COPY package.json bun.lockb /app/

# Install dependencies using Bun
RUN bun install

# Copy the rest of the application code to the container
COPY . /app

# Create and mount the volume to /app/src/parsed
VOLUME /app/src/parsed

# Expose port 5678 for the application
EXPOSE 5678

# Start the application
CMD ["bun", "start"]
