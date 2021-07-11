const mongoose = require('mongoose')
const Joi = require('joi')
const express = require('express')
const router = express.Router()
// const mcqs = require('../mcqs.json')

const Mcqs = mongoose.model('Mcqs', new mongoose.Schema({
    statement: { 
        type: String,
        minlength: 10,
        maxlength: 300, 
        required: true, 
    },
    options: { 
        type: Array,
        validate: {
            isAsync: true,
            validator: function(v, callback){
                setTimeout(() => {
                    const result = v && v.length > 3
                    callback(result)
                }, 2000);
            },
            message: 'Options must have 4 values.'
        }
    },
    correct: { 
        type: Number,
        minlength: 2, 
        min: 0,
        max: 3,
        required: true 
    }
}))

// to get all mcqs
router.get('/', async (req,res) => {
    const mcqs = await Mcqs.find()
    res.send(mcqs)
})

// to get a single mcq
router.get('/:id', async (req,res) => {
    const mcq = await Mcqs.findById(req.params.id)

    if(!mcq){
        return res.status(404).send('The mcq is not found :(')
    } else {
        res.send(mcq)
    }
})

// to create a mcq
router.post('/', async (req,res) => {
    const {error} = validateMcq(req.body)
    if(error){
        return res.status(400).send(error.details[0].message)   
    }

    let mcq = new Mcqs({
        statement: req.body.statement,
        options: [
            req.body.options[0],
            req.body.options[1],
            req.body.options[2],
            req.body.options[3]
        ],
        correct: req.body.correct
    })

    mcq = await mcq.save()
    res.send(mcq)
})

// to update a mcq
router.put('/:id', async (req,res) => {
    const {error} = validateMcq(req.body)
    if(error){
        return res.status(400).send(error.details[0].message)
    }

    const mcq = await Mcqs.findByIdAndUpdate(req.params.id, {
        statement: req.body.statement,
        options: req.body.options,
        correct: req.body.correct
    },{new: true}, function(err, result){
            if(err){
                console.log(err)
            } else{
                console.log(result)
            }
        })

    if(!mcq){
        return res.status(404).send('The MCQ is not found :(')
    }
    res.send(mcq)
})

// to delete a mcq
router.delete('/:id', async (req,res) => {
    const mcq = await Mcqs.findByIdAndRemove(req.params.id)

    if(!mcq){
        return res.status(404).send('The MCQ is not found :(')
    }

    res.send(mcq)
})

// to validate the details of mcq
function validateMcq(mcq){
    const schema = Joi.object({
        statement: Joi.string().min(12).required(),
        options: Joi.array().items(Joi.string().min(1).required()),
        correct: Joi.number().min(1).required()
    })
    return schema.validate(mcq)
}

module.exports = router


