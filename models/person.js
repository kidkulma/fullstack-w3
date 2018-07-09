const mongoose = require('mongoose')
var Schema = mongoose.Schema

const url = 'mongodb://kidkulma:pUnkkU51@ds131721.mlab.com:31721/fullstack-persons'

mongoose.connect(url, { useNewUrlParser: true });

var personSchema = new Schema({name: String, number: String})

personSchema.statics.format = function(person) {
    return {
        name: person.name,
        number: person.number,
        id: person._id 
    }
}

const Person = mongoose.model('Person', personSchema)

module.exports = Person