

const express = require('express');
const app = express()
const port = 80
// const { Sequelize } = require('sequelize');
// const sequelize = new Sequelize('database', process.env.PGUSER, process.env.PGPASSWORD, {
//   host: process.env.URL,
//   dialect: 'postgres'
// });

app.listen(port, ()=>{
  console.log(`Example app listening on port ${port}`)
})
