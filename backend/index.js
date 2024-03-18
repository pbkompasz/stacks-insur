const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const port = 4000

app.use(bodyParser.json())
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
)

app.get('/', (request, response) => {
  response.json({ info: 'Node.js, Express, and Postgres API' })
})

app.listen(port, () => {
  console.log(`App running on port ${port}.`)
})

const Pool = require('pg').Pool
const pool = new Pool({
  user: 'myuser',
  host: 'db',
  database: 'mydatabase',
  password: 'mypassword',
  port: 5432,
})

const initDatabase = () => {
  pool.query(`CREATE TABLE IF NOT EXISTS test (test VARCHAR(255)); INSERT INTO test VALUES('test') `) 
}
initDatabase();

const getUsers = (request, response) => {
  pool.query('SELECT * FROM users ORDER BY id ASC', (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
  })
}




