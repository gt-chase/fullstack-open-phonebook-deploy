const mongoose = require('mongoose')

if (process.argv.length<3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]
const name = process.argv[3]
const number = process.argv[4]

const url =
  `mongodb+srv://gregtchase:${password}@phonebookcluster.oa4pjuh.mongodb.net/phonebook?retryWrites=true&w=majority&appName=phonebookcluster`

mongoose.set('strictQuery',false)

mongoose.connect(url)

// let data = [
//   { 
//     "id": "1",
//     "name": "Arto Hellas", 
//     "number": "040-123456"
//   },
//   { 
//     "id": "2",
//     "name": "Ada Lovelace", 
//     "number": "39-44-5323523"
//   },
//   { 
//     "id": "3",
//     "name": "Dan Abramov", 
//     "number": "12-43-234345"
//   },
//   { 
//     "id": "4",
//     "name": "Mary Poppendieck", 
//     "number": "39-23-6423122"
//   }
// ]


const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Person = mongoose.model('Person', personSchema)

// const savePerson = async () => {
//   try {
//     const promises = data.map(person => {
//       const newPerson = new Person(person)
//       return newPerson.save()
//     })
//     const results = await Promise.all(promises)
//     results.forEach(result => console.log('new person is', result))
//   } catch (error) {
//     console.error('Error saving persons:', error)
//   } finally {
//     mongoose.connection.close()
//   }
// }

// savePersons()

if (name) {
  const person = new Person({
    name,
    number,
  })
  person.save().then(result => {
    console.log(`Added ${result.name} ${result.number}`)
    mongoose.connection.close()
  })
} else {
  Person.find({}).then(result => {
    result.forEach(person => {
      console.log(person)
    })
    mongoose.connection.close()
  })
}

