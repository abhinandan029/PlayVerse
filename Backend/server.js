import express from 'express'

const app = express()

const PORT = 3000

app.get('/api/login', (req, res) => {
  console.log("server is connected")
  res.end()
})

app.listen(PORT, () => {
  console.log(`server listening at port ${PORT}`)
})