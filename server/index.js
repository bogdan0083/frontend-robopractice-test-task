const express = require('express')
const cors = require("cors");
const app = express()
const port = process.env.PORT || 8080

app.use(cors())

app.get('/api/users', (req, res) => {
  // res.status(500).send(JSON.stringify({status: 'error', message: "Server error"}))
  res.send(
      require('./data.json')
  )
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
