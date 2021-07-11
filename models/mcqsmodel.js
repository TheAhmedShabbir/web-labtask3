const mongoose = require('mongoose')
const Joi = require('joi')

const Mcqs = mongoose.model('Mcqs', new mongoose.Schema({
    statement: { 
        type: String,
        minlength: 10,
        maxlength: 300, 
        required: true, 
    },
    options: { 
        type: Array,
        required: true,
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
        min: 0,
        max: 3,
        required: true 
    }
}))

// to validate the details of mcq
function validateMcq(mcq){
    const schema = Joi.object({
        statement: Joi.string().min(12).required(),
        options: Joi.array().items(Joi.string().min(1).required()),
        correct: Joi.number().min(0).max(3).required()
    })
    return schema.validate(mcq)
}

module.exports.Mcqs = Mcqs
module.exports.validateMcq = validateMcq