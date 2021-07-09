const express = require('express')
const router = express.Router()
const mcqs = require('../mcqs.json')

// to get all mcqs
router.get('/', (req,res) => {
    res.send(mcqs)
})

// to get a single mcq
router.get('/:id', (req,res) => {
    const mcq = mcqs.find(c => c.id === parseInt(req.params.id))

    if(!mcq){
        return res.status(404).send('The mcq is not found :(')
    } else {
        res.send(mcq)
    }
})

// to create a mcq
router.post('/', (req,res) => {
    const {error} = validateMcq(req.body)
    if(error){
        return res.status(400).send(error.details[0].message)   
    }

    const mcq = {
        id: mcqs.length + 1,
        statement: req.body.statement,
        options: [
            {id: req.body.options.length - 3 , text: req.body.options[0].text},
            {id: req.body.options.length - 2, text: req.body.options[1].text},
            {id: req.body.options.length - 1, text: req.body.options[2].text},
            {id: req.body.options.length, text: req.body.options[3].text},
        ],
        correct: req.body.correct
    }

    mcqs.push(mcq)
    res.send(mcq)
})

// to update a mcq
router.put('/:id', (req,res) => {
    const mcq = mcqs.find(c => c.id === parseInt(req.params.id))
    if(!mcq){
        return res.status(404).send('The MCQ is not found :(')
    }

    const {error} = validateMcq(req.body)
    if(error){
        return res.status(400).send(error.details[0].message)
    }

    mcq.statement = req.body.statement
    mcq.options[0].text = req.body.options[0].text
    mcq.options[1].text = req.body.options[1].text
    mcq.options[2].text = req.body.options[2].text
    mcq.options[3].text = req.body.options[3].text
    mcq.correct = req.body.correct
    res.send(mcq)
})

// to delete a mcq
router.delete('/:id', (req,res) => {
    const mcq = mcqs.find(c => c.id === parseInt(req.params.id))
    if(!mcq){
        return res.status(404).send('The MCQ is not found :(')
    }

    const index = mcqs.indexOf(mcq)
    mcqs.splice(index, 1)

    res.send(mcq)
})

// to validate the details of mcq
function validateMcq(mcq){
    const schema = Joi.object({
        statement: Joi.string().min(12).required(),
        options: Joi.array().items({
            text: Joi.string().min(1).required()
        },
        {
            text: Joi.string().min(1).required()
        },
        {
            text: Joi.string().min(1).required()
        },
        {
            text: Joi.string().min(1).required()
        }
        ),
        correct: Joi.number().min(1).required()
    })
    return schema.validate(mcq)
}

module.exports = router