const Joi = require('joi')
const express = require('express')
const app = express()
const mcqs = require('./routes/mcqs')
const mongoose = require('mongoose')

app.use(express.json())
app.use('/mcqs',mcqs)

// port
const port = process.env.PORT || 3000
app.listen(port, () => console.log(`listening on port ${port}...`))
