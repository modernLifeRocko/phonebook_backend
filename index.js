const express= require("express")
const app = express()
const morgan = require('morgan')

app.use(express.json())
app.use(morgan('tiny',{skip: (req, res)=> req.method === 'POST'}))
morgan.token('body', (req, res) => JSON.stringify(req.body) ) 
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body', {skip: (req, res)=> req.method !== 'POST'}))

let phonebook = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "040-123456"
  },
  {
    id: 2,
    name: "Ada Lovelace",
    number: "39-44-5323523"
  },
  {
    id: 3,
    name: "Dan Abramov",
    number: "12-43-234345"
  },
  {
    id: 4,
    name: "Mary Poppendieck",
    number: "39-23-6423122"
  }

]

app.get('/api/persons', (request, response) =>{
 response.json(phonebook)
})

app.get('/info', (request, response)=>{
  const reqTime = new Date(Date.now())
  response.send(`Phonebook has info for ${phonebook.length} people<br/>${reqTime}`
  )
})

app.get('/api/persons/:id', (request, response)=>{
  const id = Number(request.params.id)
  const contact = phonebook.find(person => person.id === id)
  if (contact){
    response.json(contact)
  } else {
    response.status(404).end()
  }
})

app.delete('/api/persons/:id', (request, response)=>{
  const id = Number(request.params.id)
  phonebook = phonebook.filter(contact => contact.id !== id)

  response.status(204).end()
})

app.post('/api/persons', (request, response)=>{
  const newId = Math.ceil(100000*Math.random())
  const body = request.body
  if (!body.name || !body.number){
    return response.status(400).json({error: 'contact info missing'})
  }
  if  (phonebook.find(contact=>contact.name === body.name)){
    return response.status(400).json({error: 'contact already exists'})
  }
  const contact = {
    id: newId,
    name: body.name,
    number: body.number,
  }
  phonebook = phonebook.concat(contact)
  response.json(contact)

})


const PORT = 3001
app.listen(PORT, () =>{
  console.log(`Server running on port ${PORT}`)
})
