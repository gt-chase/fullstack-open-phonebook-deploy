const express = require('express')
const app = express()
const axios = require('axios')
const morgan = require('morgan')

app.use(express.json())
// app.use(morgan('tiny'));
morgan.token('host', function(req, res) {
  return req.hostname;
});

morgan.token('param', function(req, res, param) {
  return req.params[param];
});
morgan.token('new_person', function(req, res) {
  return JSON.stringify(req.body)
})
app.use(morgan(':method :host :status :param[id] :res[content-length] - :response-time ms :new_person'));

let data = [
  { 
    "id": "1",
    "name": "Arto Hellas", 
    "number": "040-123456"
  },
  { 
    "id": "2",
    "name": "Ada Lovelace", 
    "number": "39-44-5323523"
  },
  { 
    "id": "3",
    "name": "Dan Abramov", 
    "number": "12-43-234345"
  },
  { 
    "id": "4",
    "name": "Mary Poppendieck", 
    "number": "39-23-6423122"
  }
]

app.get('/api/data', (request, response) => {
  response.json(data)
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
  const id = request.params.id
  const contact = data.find(person => person.id === id)

  if (contact) {
    response.json(contact)
  } else {
    response.status(404).end()
  }
})

app.post('/api/data', (request, response) => {
  const body = request.body
  const generateId = () => {
    let proposedId = Math.floor(Math.random() * 1000);
    if (data.filter(n => n.id === proposedId).length > 0) {
      return generateId();
    } else {
      return String(proposedId)
    }
  }

  if (!body.name) {
    return response.status(400).json({
      error: 'name missing'
    })
  }
  if (!body.number) {
    return response.status(400).json({
      error: 'number missing'
    })
  }
  if (data.filter(n => n.name === body.name).length > 0) {
    return response.status(400).json({
      error: 'name already in use'
    })
  }

  const person = {
    id: generateId(),
    name: body.name,
    number: body.number,
  }

  data = data.concat(person)

  response.json(data)
})

app.delete('/api/data/:id', (request, response) => {
  const id = request.params.id
  data = data.filter(person => person.id !== id)

  response.status(204).end()
})



const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
