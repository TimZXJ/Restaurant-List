//Require packages in the project
const express = require('express')
const app = express()
const port = 3000
const exphbs = require('express-handlebars')//Require express-handlebars
const mongoose = require('mongoose')//Require mongoose
const Restaurant = require('./models/restaurant.js')

//Setting database
mongoose.connect('mongodb://localhost/restaurant-list', { useNewUrlParser: true, useUnifiedTopology: true })
const db = mongoose.connection

db.on('error', () => {
  console.log('mongodb error!')
})
db.once('open', () => {
  console.log('mongodb connected!')
})

//Setting template engine
app.engine('handlebars', exphbs({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')
//Setting static files
app.use(express.static('public'))
//Setting body-parser 進行前置處理
app.use(express.urlencoded({ extended: true}))

//Routes setting:index
app.get('/', (req, res) => {
  Restaurant.find()
    .lean()
    .then(restaurants => res.render('index', { restaurants }))
    .catch(error => console.log(error))
})
// //Routes setting:show list
// app.get('/restaurants/:restaurants_id', (req, res) => {
//   //如使用Number(),當 req.params.restaurants_id是空字串時,restaurants_id為 0 的餐廳會被錯誤取出來
//   const restaurant = restaurantList.results.find(restaurant => restaurant.id.toString() === req.params.restaurants_id)
//   res.render('show', { restaurant: restaurant })
// })
// //Routes setting:search part
// app.get('/search', (req, res) => {
//   const keyword = req.query.keyword
//   const restaurants = restaurantList.results.filter(restaurant => {
//     return restaurant.name.toLowerCase().includes(keyword.toLowerCase())
//   })
//   res.render('index', { restaurants: restaurants, keyword: keyword })
// })

//Routes setting:create page
app.get('/restaurants/new', (req, res) => {
  res.render('new')
})
//Routes setting:catch create data
app.post('/restaurants', (req, res) => {
const restaurant = req.body
return Restaurant.create({
  name: restaurant.name,
  name_en: restaurant.name_en,
  category: restaurant.category,
  image: restaurant.image || "https://assets-lighthouse.s3.amazonaws.com/uploads/image/file/5635/01.jpg",
  location: restaurant.location,
  phone: restaurant.phone,
  google_map: restaurant.google_map,
  rating: restaurant.rating,
  description: restaurant.description,
  })
  .then(() => res.redirect('/'))
  .catch(error => console.log(error))
})

//Activate and listen on the Express server
app.listen(port, () => {
  console.log(`Express is listening on http://localhost:${port}`)
})
