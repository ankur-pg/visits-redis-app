const express = require('express')
const redis = require('redis')

const app = express()
const port = 3000

// Create a Redis client
const client = redis.createClient({
    url: 'redis://redis:6379'
})

// Connect to Redis and handle connection events
const connectRedis = async () => {
    try {
        await client.connect()
        console.log('Connected to Redis')
        await client.set('visits', 0)
    } catch (err) {
        console.error('Redis connection error:', err)
    }
}

// Immediately invoke the connection function
(async () => {
    await connectRedis()
})()

client.on('error', (err) => {
    console.error('Redis error:', err)
})

app.get('/', async (req, res) => {
    try {
        const visits = await client.get('visits')
        res.send(`Number of visits is ${visits}`)
        await client.set('visits', parseInt(visits) + 1)
    } catch (err) {
        res.status(500).send('Redis error')
    }
})

app.listen(port, () => {
    console.log(`App listening at http://localhost:${port}`)
})
