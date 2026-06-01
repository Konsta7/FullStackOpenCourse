import { useState, useEffect } from 'react'
import numberService from './services/Numbers.jsx'
import axios from 'axios'
import './index.css'

const Filter = ( {filter, setFilter} ) => {
  const handleFilterChange = (event) => {
    console.log(event.target.value)
    setFilter(event.target.value)
  }

    return (
      <div>
        filter shown with <input value={filter} onChange={handleFilterChange} />
      </div>
    )
  }

const Notification = ({ message, color }) => {
  if (message === null) {
    return null
  }

  return (
    <div className="error" style={{ color: color }}>
      {message}
    </div>
  )
}

const PersonForm = ( {newName, newNumber, setNewName, setNewNumber, persons, setPersons, setMessage, setColor} ) => {
  const handleNameChange = (event) => {
    console.log(event.target.value)
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    console.log(event.target.value)
    setNewNumber(event.target.value)
  }

  const addPerson = (event) => {
    event.preventDefault()
    const personObject = {
      name: newName,
      number: newNumber
    }
    if (persons.some(person => person.name === newName)) {
      if (!window.confirm(`${newName} is already added to phonebook, replace the old number with a new one?`)) {
        return
      }
      const person = persons.find(person => person.name === newName)
      const updatedPerson = {...person, number: newNumber}
      numberService.update(persons.find(person => person.name === newName).id, personObject)
        .then(response => {
          setPersons(persons.map(p => p.id !== person.id ? p : updatedPerson))
        })
      .catch(error => {
        setColor('red')
        setMessage('Failed to update number')
        setTimeout(() => {
          setMessage(null)
        }, 5000)
      })
      setColor('green')
      setMessage(`Updated ${newName}'s number`)
      setTimeout(() => {
        setMessage(null)
      }, 5000)
      setNewName('')
      setNewNumber('')
      return
    }
    numberService.create(personObject)
     .then(response => {
      setPersons(persons.concat(response))
      setMessage(`Added ${response.name}`)
      setTimeout(() => {
        setMessage(null)
      }, 5000)
      setNewName('')
      setNewNumber('')
    })
    .catch(error => {
      setColor('red')
      setMessage('Failed to add person')
      setTimeout(() => {
        setMessage(null)
      }, 5000)
    })
  }
  return (
    <form onSubmit={addPerson}>
      <div>
        name: <input value={newName} onChange={handleNameChange} />
      </div>
      <div>
        number: <input value={newNumber} onChange={handleNumberChange}/>
      </div>
      <div>
        <button type="submit">add</button>
      </div>
    </form>
  )
}

const Persons = ( {persons, filter, setPersons, setMessage, setColor} ) => {
  const handleDelete = (id) => {
    if (!window.confirm('Delete this person?')) {
      return
    }
    numberService.remove(id)
     .then(response => {
      console.log(`Deleted ${response.name}`)
      setColor('green')
      setMessage(`Deleted ${response.name}`)
      setTimeout(() => {
        setMessage(null)
      }, 5000)
    })
      .catch(error => {
        setColor('red')
        setMessage('Failed to delete person')
        setTimeout(() => {
          setMessage(null)
        }, 5000)
      })
    setPersons(persons.filter(person => person.id !== id))
  }

  return (
    <div>
      {persons.filter(person => person.name.toLowerCase().includes(filter.toLowerCase())).map(person => <p key={person.name}>{person.name} {person.number}<button onClick={() => handleDelete(person.id)}>delete</button></p>)}
    </div>
  )
}


const App = () => {
  const [persons, setPersons] = useState([]) 
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState('')
  const [message, setMessage] = useState(null)
  const [color, setColor] = useState('green')

  useEffect(() => {
  console.log('effect')
  numberService.getAll()
    .then(data => {
      console.log('promise fulfilled')
      setPersons(data)
    })
}, [])


  return (
    <div>
      <h2>Phonebook</h2>
      <Filter filter={filter} setFilter={setFilter} />
      <h2>Add new</h2>
      <PersonForm newName={newName} newNumber={newNumber} setNewName={setNewName} setNewNumber={setNewNumber} persons={persons} setPersons={setPersons} setMessage={setMessage} setColor={setColor} />
      <Notification className="error" message={message} color={color} />
      <h2>Numbers</h2>
      <Persons persons={persons} filter={filter} setPersons={setPersons} setMessage={setMessage} setColor={setColor} />
    </div>
  )
}

export default App

