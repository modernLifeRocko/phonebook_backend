const mongoose = require('mongoose')
mongoose.set('strictQuery',false)

const url = process.env.MONGODB_URI
console.log('connecting to MongoDB')
mongoose.connect(url)
  .then( result => {
    console.log('connected to MongoDB')
  })
  .catch( error => {
    console.log('error connecting to MongoDB: ',error.message)
  })

const contactSchema = new mongoose.Schema({
  name: String,
  number: String,
})

contactSchema.set('toJSON',{
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
} )

module.exports = mongoose.model('Contact', contactSchema)
/*
if (process.argv.length >= 5){
  const contact = new Contact({
    name: process.argv[3],
    number: process.argv[4],
  })
  contact.save().then(result => {
    console.log(`added ${contact.name} number ${contact.number} to phonebook`)
    mongoose.connection.close()
  })
} else {
  Contact.find({}).then(result => {
    console.log('phonebook:')
    result.forEach(contact => {
      console.log(contact.name, contact.number)
    })
    mongoose.connection.close()
  })
}
*/
