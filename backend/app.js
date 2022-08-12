const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const postsRoutes = require('./routes/posts');

const app = express();

mongoose.connect(`mongodb+srv://nasa-admin:${process.env.MONGO_PASSWORD}@nasacluster.ga5zg.mongodb.net/mean-project?retryWrites=true&w=majority`)
  .then(() => {
    console.log('connected')
  })
  .catch(() => {
    console.log('Failed mongo connection')
  });

app.use(cors())
app.use(express.json())

app.use('/api/posts',postsRoutes)

module.exports = app;
