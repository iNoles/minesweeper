# Use the official Bun image
FROM oven/bun:latest

# Set the working directory
WORKDIR /app

# Copy package files and install dependencies
COPY bun.lock package.json tsconfig.json vite.config.ts tailwind.config.ts ./

RUN bun install

# Copy the rest of the app
COPY src ./src
COPY static ./static
COPY svelte.config.js ./

# Build the app
RUN bun run build

# Use a lightweight web server for static hosting (e.g. serve)
RUN bun add serve

# Expose port
EXPOSE 3000

# Start the server
CMD ["bun", "x", "serve", "dist", "--single", "--listen", "3000"]
