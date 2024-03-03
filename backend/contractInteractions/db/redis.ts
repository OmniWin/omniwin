// Import the Redis class from the ioredis package
import Redis from 'ioredis';

// Create a new Redis instance. This can be customized with your Redis server configuration.
// For example, if your Redis server requires authentication or runs on a different host/port,
// you can pass these options to the Redis constructor.
const redisClient = new Redis({
  port: 6379, // Redis port
  host: '127.0.0.1', // Redis host
  // Optional: if your Redis instance requires authentication, uncomment the following line
  // password: 'your_redis_password',
  // Optional: specify the database number (defaults to 0)
  // db: 0,
});

// Listen for the connect event to confirm connection
redisClient.on('connect', () => {
  console.log('Connected to Redis');
});

// Listen for the error event to handle connection errors
redisClient.on('error', (err) => {
  console.error('Error connecting to Redis', err);
});

// Export the Redis client for use elsewhere in your application
export default redisClient;
