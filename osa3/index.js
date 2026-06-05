const express = require('express')
const morgan = require('morgan');
const app = express()

let numbers = [
  {
    "name": "Ada Lovelace",
    "number": "39-44-5323523",
    "id": "2"
  },
  {
    "name": "aasdasdasd",
    "number": "1231243125",
    "id": "56"
  },
  {
    "name": "asdasdasd",
    "number": "12312345",
    "id": "67"
  },
  {
    "name": "asdasd",
    "number": "1234555",
    "id": "78"
  }
]

app.use(express.json())

app.use(morgan('tiny'))

app.get('/', (request, response) => {
  response.send('<h1>Hello World!</h1>')
})

app.get('/info', (request, response) => {
  const date = new Date()
  const length = numbers.length
  response.send(`<p>Phonebook has info for ${length} people</p><p>${date}</p>`)
})

app.get('/api/persons', (request, response) => {
  response.json(numbers)
})

app.get('/api/persons/:id', (request, response) => {
  const id = request.params.id
  const number = numbers.find(n => n.id === id)
  if (number) {
    response.json(number)
  } 
  else {
    response.status(404).end()
  }
})

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

  if (numbers.find(n => n.name === person.name)) {
    return response.status(400).json({ 
      error: 'name must be unique' 
    })
  }

  person.id = Math.floor(Math.random() * 1000000).toString()
  numbers = numbers.concat(person)
  console.log(person)
  response.json(person)
})

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
