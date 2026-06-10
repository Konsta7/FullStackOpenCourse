require('dotenv').config()
const express = require('express')
const morgan = require('morgan');
const app = express()
const Number = require('./models/number')


app.use(express.json())

const requestLogger = (request, response, next) => {
  console.log('Method:', request.method)
  console.log('Path:  ', request.path)
  console.log('Body:  ', request.body)
  console.log('---')
  next()
}

const errorHandler = (error, request, response, next) => {
  console.error(error.message)
  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }
  next(error)
}

app.use(morgan('tiny'))
app.use(express.static('dist'))
app.use(requestLogger)
app.use(errorHandler)



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

app.get('/api/persons/:id', (request, response, next) => {
  const id = request.params.id
  Number.findById(request.params.id).then(number => {
    if (number) {
      response.json(number)
    }  
    else {
      response.status(404).end()
    }
  })
  .catch((error) => next(error))
})


app.delete('/api/persons/:id', (request, response, next) => {
  Number.findByIdAndDelete(request.params.id).then(() => {
    console.log('Number deleted')
    response.status(204).end()
  })
  .catch((error) => next(error))
})

app.put('/api/persons/:id', (request, response, next) => {
  const id = request.params.id
  const body = request.body

  Number.findById(id).then(number => {
    if (!number) {
      return response.status(404).end()
    }

    number.name = body.name
    number.number = body.number

    return number.save().then(updatedNumber => {
      response.json(updatedNumber)
    })
})
  .catch((error) => next(error))
})

app.post('/api/persons', (request, response, next) => {
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

  const entry = new Number({
    name: person.name,
    number: person.number,
  })

  entry.save().then(savedNumber => {
    console.log('Number saved!')
    response.json(savedNumber)
  })
  .catch((error) => next(error))
})

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)
app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

