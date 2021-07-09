const mongoose = require('mongoose')
const express = require('express')
const app = express()
const mcqs = require('./routes/mcqs')

mongoose.connect('mongodb://localhost/quiz')
    .then(console.log('connected to mongodb...'))
    .catch(() => console.error('could not connected to mongodb...'))

app.use(express.json())
app.use('/mcqs',mcqs)

// port
const port = process.env.PORT || 3000
app.listen(port, () => console.log(`listening on port ${port}...`))
