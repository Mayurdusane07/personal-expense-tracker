const express = require('express')

const path = require('path')
const {open} = require('sqlite')
const sqlite3 = require('sqlite3')

const app = express()
app.use(express.json())

const dbPath = path.join(__dirname, 'expenseTracker.db')

let db = null

const initializeDBAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    })
    app.listen(3000, () => {
      console.log('Server Running at https://localhost:3000/')
    })
  } catch (e) {
    console.log(`DB error : ${e.message}`)
    process.exit(1)
  }
}

initializeDBAndServer()

// API to add new transaction
app.post('/transactions/', async (request, response) => {
  const transDetails = request.body

  const {type, category, amount, date, description} = transDetails

  const addTransQuery = `
  INSERT INTO transactions (type, category, amount, date, description ) values 
  ('${type}', '${category}', ${amount}, '${date}', '${description}' )
  `

  try {
    await db.run(addTransQuery)
    response.send('Transaction Added Successfully')
  } catch (e) {
    console.log(`Add Transaction Error : ${e.message}`)
  }
})

// API to retrieves all transactions
app.get('/transactions/', async (request, response) => {
  const {limit = 4} = request.query

  const getTransactionsQuery = `
  SELECT * FROM transactions 
  LIMIT ${limit}; 
  `
  try {
    const transactionsArray = await db.all(getTransactionsQuery)
    response.send(transactionsArray)
  } catch (e) {
    console.log(`Getting all transactions error : ${e.message}`)
  }
})

// API to get specific transaction based by ID
app.get('/transactions/:id', async (request, response) => {
  const {id} = request.params

  const getTransactionQuery = `
  SELECT * FROM transactions where id = ${id}
  `
  try {
    const transaction = await db.get(getTransactionQuery)
    response.send(transaction)
  } catch (e) {
    console.log(`Getting specific transaction error : ${e.message}`)
  }
})

// API to update a transaction
app.put('/transactions/:id', async (request, response) => {
  const {id} = request.params

  const updateDetails = request.body

  const {type, category, amount, date, description} = updateDetails

  const updateTransQuery = `
  UPDATE transactions SET  
    type = '${type}',
    category = '${category}',
    amount = ${amount}, 
    date = '${date}',
    description = '${description}' 
  
  WHERE id = ${id} 
  `

  try {
    await db.run(updateTransQuery)
    response.send('Transaction Updated Successfully')
  } catch (e) {
    console.log(`Updating existing transaction error : ${e.message}`)
  }
})

// API to delete a transaction by ID
app.delete('/transactions/:id', async (request, response) => {
  const {id} = request.params

  const deleteQuery = `
  DELETE FROM transactions 
  WHERE id = ${id} 
  `
  try {
    await db.run(deleteQuery)
    response.send('Transaction Deleted Successfully')
  } catch (e) {
    console.log(`Deleting transacttion error : ${e.message}`)
  }
})

// API to get a summary
app.get('/summary/', async (request, response) => {
  const {search_q, start_date, end_date} = request.query

  const getSummaryQuery = `
  SELECT
    (SELECT SUM(amount) FROM transactions WHERE type = 'income') AS total_income,
    (SELECT SUM(amount) FROM transactions WHERE type = 'expense' AND category LIKE '%${search_q}%' AND date BETWEEN '${start_date}' AND '${end_date}' ) AS total_expenses,
    ((SELECT SUM(amount) FROM transactions WHERE type = 'income') -
     (SELECT SUM(amount) FROM transactions WHERE type = 'expense' AND category LIKE '%${search_q}%')) AS balance;

  `
  try {
    const summary = await db.get(getSummaryQuery)
    response.send(summary)
  } catch (e) {
    console.log(`Summary Error : ${e.message}`)
  }
})

// API  to  get monthly  spending
app.get('/monthly_spending', async (request, response) => {
  const {search_q, month} = request.query

  const getMonthlySpending = `
  SELECT SUM(amount) AS monthly_spending
  FROM transactions
  WHERE category LIKE '%${search_q}%'  
  AND strftime('%m', date) = '${month}'  
  `
  try {
    const monthlySpending = await db.get(getMonthlySpending)
    response.send(monthlySpending)
  } catch (e) {
    console.log(`Getting monthly spending : ${e.message}`)
  }
})
