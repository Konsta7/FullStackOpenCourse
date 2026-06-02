import { useState, useEffect } from 'react'
import countryService from './services/Countries.jsx'
import axios from 'axios'
import './index.css'

const Filter = ( {filter, setFilter} ) => {
  const handleFilterChange = (event) => {
    console.log(event.target.value)
    setFilter(event.target.value.toLowerCase())
  }

  return (
    <div>
      find countries <input placeholder="find countries..." onChange={handleFilterChange} />
    </div>
  )
}

const Countries = ( {countries, setCountries, filter, setFilter} ) => {
  const handleShow = (event) => {
    setFilter(event.target.parentNode.firstChild.textContent.toLowerCase())
  }
  
  countryService.getAll().then(initialCountries => {
      setCountries(initialCountries)
    }
  )
  const showCountries = countries.filter(country => country.name.common.toLowerCase().includes(filter))
  if (showCountries.length > 10) {
    return <p>Too many matches, specify another filter</p>
  }
  else if (1 < showCountries.length && showCountries.length < 10) {
    return <div>{showCountries.map(country => <p key={country.name.common}>{country.name.common}<button onClick={handleShow}>show</button></p>)}</div>
  }
  else if (showCountries.length === 1) {
    const country = showCountries[0]

    return (
    <div>
      <h1>{country.name.common}</h1>
      <p>capital {country.capital}</p>
      <p>area {country.area}</p>
      <h1>Languages</h1>
      <ul>
        {Object.values(country.languages).map(language => (
          <li key={language}>{language}</li>
        ))}
      </ul>
      <img src={country.flags.png} />
    </div>
    )
  }
}

const App = () => {
  const [countries, setCountries] = useState([])
  const [filter, setFilter] = useState(null)

  return (
    <div>
      <Filter filter={filter} setFilter={setFilter} />
      <Countries countries={countries} setCountries={setCountries} filter={filter} setFilter={setFilter} />
    </div>
  )
}

export default App

