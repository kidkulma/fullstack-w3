
const Person = require('./models/person')
const express = require('express')
var morgan = require('morgan')
const app = express()
const bodyParser = require('body-parser')
const cors = require('cors')


app.use(express.static('build'))
app.use(cors())
app.use(bodyParser.json())
morgan.token('content', function (req, res) { return JSON.stringify(req.body) })
app.use(morgan(function (tokens, req, res) {
  return [
    tokens.method(req, res),
    tokens.url(req, res),
    tokens.status(req, res),
    tokens.content(req, res),
    tokens.res(req, res, 'content-length'), '-',
    tokens['response-time'](req, res), 'ms'
  ].join(' ')
}))


app.get('/api/persons', (req, res) => {
  Person
    .find({})
    .then(persons => {
      res.json(persons.map(Person.format))
      res.status(200).end()
    }).catch(error => { console.log(error) })
})

app.get('/info', (req, res) => {
  Person
    .find({})
    .then(persons => {
      res.send(`<p>luettelossa on ${persons.length} henkilön tiedot</p><p>${new Date().toString()}</p>`)
    })

})

app.get('/api/persons/:id', (req, res) => {
  Person
    .findById(req.params.id)
    .then(person => {
      if (person) {
        res.json(Person.format(person))
      } else {
        res.status(404).end
      }
    }).catch(error => {
      console.log(error)
      res.status(400).send({ error: 'malformatted id' })
    })
})

app.delete('/api/persons/:id', (req, res) => {
  Person
    .findByIdAndRemove(req.params.id)
    .then(person => {
      res.status(204).end()
    }).catch(error => {
      res.status(400).send({ error: 'malformatted id' })
    })
})

app.post('/api/persons', (req, res) => {
  const body = req.body

  if (body.name === '' || body.number === '') {
    return res.status(400).json({ error: 'name or number missing' })
  }
  const person = new Person({
    name: body.name,
    number: body.number
  })

  Person
    .find({ name: body.name })
    .then(result => {
      if (result.length === 0) {
        person
          .save()
          .then(savedPerson => {
            res.json(Person.format(savedPerson))
          })
      }
      else {
        res.status(400).json({ error: 'name already has a number' })
      }
    })
})

app.put('/api/persons/:id', (req, res) => {
  const body = req.body

  const person = {
    name: body.name,
    number: body.number
  }

  Person.findByIdAndUpdate(req.params.id, person, { new: true })
    .then(updatedPerson => {
      res.json(Person.format(updatedPerson))
    }).catch(error => {
      console.log(error)
      res.status(400).send({ error: 'malformatted id' })
    })
})


const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})