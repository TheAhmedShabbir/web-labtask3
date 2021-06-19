const Joi = require('joi')
const express = require('express')
const app = express()
const mcqs = require('./mcqs.json')

app.use(express.json())

// landing page
app.get('/', (req, res) => {
    res.send('Hello World')
})

// to get all mcqs
app.get('/mcqs', (req,res) => {
    res.send(mcqs)
})

// to get a single mcq
app.get('/mcqs/:id', (req,res) => {
    const mcq = mcqs.find(c => c.id === parseInt(req.params.id))

    if(!mcq){
        return res.status(404).send('The mcq is not found :(')
    } else {
        res.send(mcq)
    }
})

// to create a mcq
app.post('/mcqs', (req,res) => {
    const {error} = validateMcq(req.body)
    if(error){
        return res.status(400).send(error.details[0].message)   
    }

    const mcq = {
        id: mcqs.length + 1,
        name: req.body.statement
    }

    mcqs.push(mcq)
    res.send(mcq)
})

// to update a mcq
app.put('/mcqs/:id', (req,res) => {
    const mcq = mcqs.find(c => c.id === parseInt(req.params.id))
    if(!mcq){
        return res.status(404).send('The MCQ is not found :(')
    }

    const {error} = validateMcq(req.body)
    if(error){
        return res.status(400).send(error.details[0].message)
    }

    mcq.statement = req.body.statement
    mcq.option1 = req.body.option1
    mcq.option2 = req.body.option2
    mcq.option3 = req.body.option3
    mcq.option4 = req.body.option4
    res.send(mcq)
})

// to delete a mcq
app.delete('/mcqs/:id', (req,res) => {
    const mcq = mcqs.find(c => c.id === parseInt(req.params.id))
    if(!mcq){
        return res.status(404).send('The MCQ is not found :(')
    }

    const index = mcqs.indexOf(mcq)
    mcqs.splice(index, 1)

    res.send(mcq)
})

// to validate the statement of mcq
function validateMcq(mcq){
    const schema = Joi.object({statement: Joi.string().min(12).required()})
    return schema.validate(mcq)
}

// port
const port = process.env.PORT || 3000
app.listen(port, () => console.log(`listening on port ${port}...`))