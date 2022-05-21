# API Endpoint Structure

### Swagger API Documentation

![API Documentation](https://github.com/Mayank-MP05/vasooli-2.0-backend/blob/main/docs/swagger.png?raw=true)

### User and Auth Routes

`/user/login`

`/user/register`

`/user/logout/:userId`

`/user/editProfile/:id`
### Transactions CRUD 

`/transaction/create`

`/transaction/read`

`/transaction/read/:id`

`/transaction/update/:id`

`/transaction/delete/:id`

### Transactions CRUD 

`/vasooli/create`

`/vasooli/read`

`/vasooli/read/:id`

`/vasooli/update/:id`

`/vasooli/delete/:id`


### Notifications  

`/notifications/read`

`/notifications/markAllRead/:id`

# SQL Table Entity Relationship Diagram 
- Users Table
- Transactions Table
- Vasooli Table

![SQL Tables ER Diagram](https://github.com/Mayank-MP05/vasooli-2.0-backend/blob/main/docs/sql-tables-er-diagram.PNG?raw=true)


# NoSQL mongodb sample documents 
- Notifications Document Sample #1

```
{
  "_id": {
    "$oid": "6287c06cd94d3f0838f22a80"
  },
  "priority": {
    "$numberLong": "1"
  },
  "content": "Joe Rogan Just approved your payment of Rs 400 for Grocery",
  "timestamp": {
    "$date": "2022-01-01T03:00:00.000Z"
  },
  "userId": {
    "$numberLong": "78"
  },
  "readStatus": false
}

```
- Notifications Document Sample #2

```
{
  "_id": {
    "$oid": "6288d6fabab81dde71015765"
  },
  "priority": 2,
  "content": "trohangre@mail.com has just joined vasooli money manager app!",
  "timestamp": {
    "$date": "2022-05-21T12:11:38.275Z"
  }
}
```