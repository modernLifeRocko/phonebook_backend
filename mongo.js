const mongoose = require('mongoose')

if (process.argv.length < 3){
  console.log('input password')
  process.exit()
}

const password = process.argv[2]

const url = `mongodb+srv://mongoRocko:${password}@cluster0.vb9jy.mongodb.net/phonebookApp?retryWrites=true&w=majority`

mongoose.set('strictQuery', false)
mongoose.connect(url)

const contactSchema = new mongoose.Schema({
  name: String,
  number: String,
})
const Contact = mongoose.model('Contact', contactSchema)

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
