const mongoose = require('mongoose')

const numberSchema = new mongoose.Schema({
    name: String,
    number: String,
  })

const Number = mongoose.model('Number', numberSchema)

if (process.argv.length === 3) {

  const password = process.argv[2]
  const url = `mongodb+srv://klaunone22_db_user:${password}@numbers.vacunx4.mongodb.net/numbersApp?appName=Numbers`
  
  mongoose.set('strictQuery', false)
  mongoose.connect(url, { family: 4 })

  Number.find({}).then(result => {
    console.log('phonebook:')
    result.forEach(number => {
      console.log(number.name, number.number)
    })
    mongoose.connection.close()
  })
}

else if (process.argv.length === 5) {
  const password = process.argv[2]
  const name = process.argv[3]
  const phoneNumber = process.argv[4]

  const url = `mongodb+srv://klaunone22_db_user:${password}@numbers.vacunx4.mongodb.net/numbersApp?appName=Numbers`

  mongoose.set('strictQuery', false)
  mongoose.connect(url, { family: 4 })

  const number = new Number({
    name: name,
    number: phoneNumber,
  })

  number.save().then(result => {
    console.log('Number saved!')
    mongoose.connection.close()
  })
}

else {
  console.log('Please provide the password, name and number as arguments: node mongo.js <password> <name> <number>')
  process.exit(1)
}