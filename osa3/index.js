require('dotenv').config()
const express = require('express')
const morgan = require('morgan');
const app = express()
const Number = require('./models/number')

app.use(express.json())

app.use(morgan('tiny'))

app.use(express.static('dist'))

app.get('/', (request, response) => {
  response.send('<h1>Hello World!</h1>')
})

app.get('/info', (request, response) => {
  const date = new Date()
  const length = Number.length
  response.send(`<p>Phonebook has info for ${length} people</p><p>${date}</p>`)
})

app.get('/api/persons', (request, response) => {
  Number.find({}).then(numbers => {
    response.json(numbers)
  })
})

app.get('/api/persons/:id', (request, response) => {
  const id = request.params.id
  Number.findById(request.params.id).then(number => {
    if (number) {
      response.json(number)
    }  
    else {
      response.status(404).end()
    }
  })
})

/*
app.delete('/api/persons/:id', (request, response) => {
  const id = request.params.id
  numbers = numbers.filter(n => n.id !== id)
  if (!numbers.find(n => n.id === id)) {
    console.log('Number deleted')
    response.status(204).end()
  } else {
    console.log('Number not found')
    response.status(404).end()
  }
})
*/

app.post('/api/persons', (request, response) => {
  const person = request.body

  if (!person.name) {
    return response.status(400).json({ 
      error: 'name missing' 
    })
  }

  if (!person.number) {
    return response.status(400).json({ 
      error: 'number missing' 
    })
  }

  const number = new Number({
    name: person.name,
    number: person.number,
  })

  number.save().then(savedNumber => {
    console.log('Number saved!')
    response.json(savedNumber)
  })
})

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

