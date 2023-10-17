require('dotenv').config()
const express= require("express")
const app = express()
const morgan = require('morgan')
const Contact = require('./models/contact')

app.use(express.json())
app.use(express.static('dist'))
app.use(morgan('tiny',{skip: (req, res)=> req.method === 'POST'}))
morgan.token('body', (req, res) => JSON.stringify(req.body) ) 
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body', {skip: (req, res)=> req.method !== 'POST'}))

app.get('/api/persons', (request, response) =>{
  Contact.find({})
    .then( contacts => {
      response.json(contacts)
    })
})

app.get('/info', (request, response)=>{
  const reqTime = new Date(Date.now())
  Contact.find({}).then(phonebook =>{
  response.send(`Phonebook has info for ${phonebook.length} people<br/>${reqTime}`
  )
  })
})

app.get('/api/persons/:id', (request, response)=>{
 Contact.findById(request.params.id).then(note=> {
  response.json(note)
 })
})

app.delete('/api/persons/:id', (request, response)=>{
  const id = Number(request.params.id)
  phonebook = phonebook.filter(contact => contact.id !== id)

  response.status(204).end()
})

app.post('/api/persons', (request, response)=>{
  const body = request.body
  if (!body.name || !body.number){
    return response.status(400).json({error: 'contact info missing'})
  }
  /*
  if  (phonebook.find(contact=>contact.name === body.name)){
    return response.status(400).json({error: 'contact already exists'})
  }
  */
  const contact = new Contact({
    name: body.name,
    number: body.number,
  })
  contact.save().then( savedContact => {
    response.json(savedContact)
  })
})


const PORT = process.env.PORT || 3001
app.listen(PORT, () =>{
  console.log(`Server running on port ${PORT}`)
})
