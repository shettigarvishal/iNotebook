const conneectToMongo=require('./db');
conneectToMongo();
const express = require('express')
const app = express()
const port = 5000

app.use(express.json())
//Available routes
app.use('/api/auth',require('./Routes/auth'))
app.use('/api/note',require('./Routes/note'))



app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
