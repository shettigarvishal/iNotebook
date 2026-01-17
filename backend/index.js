const conneectToMongo=require('./db');
conneectToMongo();
const express = require('express')
var cors = require('cors')
var app = express()
const port = 5000

 
app.use(cors())

app.use(express.json())
//Available routes
app.use('/api/auth',require('./Routes/auth'))
app.use('/api/note',require('./Routes/note'))



app.listen(port, () => {
  console.log(`iNotebook backend listening on port ${port}`)
})
