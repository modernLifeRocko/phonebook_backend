/* eslint-disable consistent-return */
require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const Contact = require('./models/contact');

const app = express();

app.use(express.json());
app.use(express.static('dist'));
app.use(morgan('tiny', { skip: (req) => req.method === 'POST' }));
morgan.token('body', (req) => JSON.stringify(req.body));
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body', { skip: (req) => req.method !== 'POST' }));

const errorHandler = (error, req, res, next) => {
  console.error(error.message);
  if (error.name === 'CastError') {
    return res.status(400).send({ error: 'malformatted id' });
  }
  if (error.name === 'ValidationError') {
    return res.status(400).json({ error: error.message });
  }
  next(error);
};
const unknownEndpoint = (req, res) => {
  res.status(404).send({ error: 'unknown endpoint' });
};
app.get('/api/persons', (request, response) => {
  Contact.find({})
    .then((contacts) => {
      response.json(contacts);
    });
});

app.get('/info', (request, response) => {
  const reqTime = new Date(Date.now());
  Contact.find({}).then((phonebook) => {
    response.send(`Phonebook has info for ${phonebook.length} people<br/>${reqTime}`);
  });
});

app.get('/api/persons/:id', (request, response, next) => {
  Contact.findById(request.params.id).then((contact) => {
    if (contact) {
      response.json(contact);
    } else {
      response.status(404).end();
    }
  })
    .catch((error) => next(error));
});

app.delete('/api/persons/:id', (request, response, next) => {
  Contact.findByIdAndRemove(request.params.id)
    .then(() => {
      response.status(204).end();
    })
    .catch((error) => next(error));
});

app.post('/api/persons', (request, response, next) => {
  const { body } = request;
  if (!body.name || !body.number) {
    return response.status(400).json({ error: 'contact info missing' });
  }
  /*
  if  (phonebook.find(contact=>contact.name === body.name)){
    return response.status(400).json({error: 'contact already exists'})
  }
  */
  const contact = new Contact({
    name: body.name,
    number: body.number,
  });
  contact.save()
    .then((savedContact) => {
      response.json(savedContact);
    })
    .catch((error) => next(error));
});
app.put('/api/persons/:id', (request, response, next) => {
  const { name, number } = request.body;
  Contact.findByIdAndUpdate(
    request.params.id,
    { name, number },
    { new: true, runValidators: true, context: 'query' },
  )
    .then((updatedContact) => {
      response.json(updatedContact);
    })
    .catch((error) => next(error));
});

app.use(unknownEndpoint);
app.use(errorHandler);

const { PORT } = process.env;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
