const {Mcqs, validateMcq} = require('../models/mcqsmodel')
const mongoose = require('mongoose')
const Joi = require('joi')
const express = require('express')
const router = express.Router()
// const mcqs = require('../mcqs.json')


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

module.exports = router