const mongoose = require('mongoose')

const url = 'mongodb://kidkulma:pUnkkU51@ds131721.mlab.com:31721/fullstack-persons'

mongoose.connect(url, { useNewUrlParser: true })

const Person = mongoose.model('Person', {
  name: String,
  number: String
})

if (process.argv[2] === undefined && process.argv[3] === undefined) {
  console.log('puhelinluettelo:')
  Person
    .find({})
    .then(result => {
      result.forEach(person => {
        console.log(`${person.name} ${person.number}`)
      })
      mongoose.connection.close()
    })
} else {
  const person = new Person({
    name: process.argv[2],
    number: process.argv[3]
  })

  person
    .save()
    .then(response => {
      console.log(`Lisätään henkilölle ${person.name} numero ${person.number} luetteloon`)
      mongoose.connection.close()
    })
}