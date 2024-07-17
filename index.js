require('dotenv').config()
const express = require('express')
const app = express()
const axios = require('axios')
const Person = require('.models/person')
// const morgan = require('morgan')
const cors = require('cors')

app.use(express.json())
app.use(cors())
app.use(express.static('dist'))
// app.use(morgan('tiny'));
// morgan.token('host', function(req, res) {
//   return req.hostname;
// });

// morgan.token('param', function(req, res, param) {
//   return req.params[param];
// });
// morgan.token('new_person', function(req, res) {
//   return JSON.stringify(req.body)
// })
// app.use(morgan(':method :host :status :param[id] :res[content-length] - :response-time ms :new_person'));


app.get('/api/data', (request, response) => {
  Person.find({}).then(data => {
    response.json(data)
  })
})

app.get('/info', async (request, response) => {
  try {
    const result = await axios.get('http://localhost:3001/api/data');
    const data = result.data
    let now = new Date().toString()
    console.log('headers', response)
    const numOfContacts = data.length;
    response.send(`<p>Phone book has info for ${numOfContacts} people</p><p>${now}</p>`)
  } catch (error) {
    console.error('Error fetching data:', error);
    response.status(500).send('Internal Server Error');
  }
})

app.get('/api/data/:id', (request, response) => {
  Person.findById(request.params.id).then(individual => {
    response.json(individual)
  })
})

app.post('/api/data', (request, response) => {
  const body = request.body

  if (body.name === undefined) {
    return response.status(400).json({error: 'name missing' })
  }

  const person = new Person({
    name: body.name,
    number: body.number || '',
  })

  person.save().then(savedPerson => {
    response.json(savedPerson)
  })
})

  

app.delete('/api/data/:id', (request, response) => {
  const id = request.params.id
  data = data.filter(person => person.id !== id)

  response.status(204).end()
})



const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
