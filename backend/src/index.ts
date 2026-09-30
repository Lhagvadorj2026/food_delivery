import { Hono } from 'hono';
import { connectDb } from './lib/mongodb.js';
import foodCategoryRoute from './routes/food-category.routes.js';
import { cors } from 'hono/cors';
import foodRoute from './routes/food.routes.js';
import userRoute from './routes/user.routes.js';
import { serve } from '@hono/node-server';

const app = new Hono();

app.use('*', cors({
    origin: 'http://localhost:3000',
    allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
}));

app.get('/', (c) => c.json({ message: 'Food delivery API is running' }));
app.route('/category', foodCategoryRoute);
app.route('/food', foodRoute);
app.route('/user', userRoute);

async function startServer() {
    try {
        await connectDb();
        console.log('Database successfully connected.');

        serve({
            fetch: app.fetch,
            port: 3001,
        }, (info) => {
            console.log(`Server is running on http://localhost:${info.port}`);
        });
    } catch (error) {
        console.error('Failed to connect to the database:', error);
        process.exitCode = 1;
    }
}

startServer();

export default app;
