

## Setup and Run Instructions

### Prerequisites
Before you begin, ensure you have the following installed on your machine:
- [Node.js](https://nodejs.org/) (version 14.0.0 or higher)
- [SQLite](https://www.sqlite.org/index.html) (optional, if using SQLite as the database)

### Clone the Repository
First, clone this repository to your local machine using the following command:
bash
git clone https://github.com/your_username/personal-expense-tracker.git 


### Navigate to the Project Directory
cd personal-expense-tracker

### Install Dependencies 
npm install 

### Run the application 
npm start


 
### Access the application using following endponits 

 ### creating new transaction 
POST http://localhost:3000/transactions 
Content-Type: application/json 
{
    "type": "expense",
    "category": "Entertainment",
    "amount": 100,
    "date": "2024-09-20",
    "description": "Movie"
} 


### getting all transactions 
GET http://localhost:3000/transactions/?limit=12
 

### getting specific transaction by ID
GET http://localhost:3000/transactions/1  


### updating transaction 
PUT http://localhost:3000/transactions/6
Content-Type : application/json 

{   
    "type": "expense",
    "category": "Entertainment",
    "amount": 100,
    "date":"2024-09-15",
    "description": "Movie"
} 


### deleting a transaction by ID 
DELETE http://localhost:3000/transactions/7


### getting summary 
GET http://localhost:3000/summary/?search_q=Entertainment&start_date=2024-10-04&end_date=2024-10-12 


###
GET http://localhost:3000/monthly_spending/?search_q=Entertainment&month=09



