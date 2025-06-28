//REST -> REPRESEMTATIONAL STATE TRANSFER
// REST is an architectural style for designing networked applications.
// It relies on a stateless, client-server, cacheable communications protocol -- HTTP.
// RESTful web services allow you to access and manipulate resources using standard HTTP methods like GET, POST, PUT, DELETE.
const express = require('express')
const crypto = require('node:crypto')
const { validateMovie } = require('./schemas/movies') // Import the validation function
const { validatePartialMovie } = require('./schemas/movies') // Import the validation function for partial updates
const movies = require('./movies.json') // Assuming you have a movies.json file with movie data
const cors = require('cors')
const app = express()
app.use(express.json()) // Middleware to parse JSON request bodies
const port = 5000
/*app.get('/', (req, res) => {
    res.json({message: 'Hello World!'})
})*/
const ACCEPTED_ORIGINS = [
  'http://localhost:8080',
  'http://movies.com',
]
app.use(cors({
  origin: ACCEPTED_ORIGINS
}))
app.get('/movies', (req, res) => {//recuperar todas las peliculas
  /*const origin = req.header('origin')// get the origin of the request
  if (ACCEPTED_ORIGINS.includes(origin) || !origin) {
    res.header('Access-Control-Allow-Origin', origin) // Allow only accepted origins for CORS
  }*/
  //res.header('Access-Control-Allow-Origin', '*') // Allow all origins for CORS
  const { genre } = req.query  //res.json(movies)
  if (genre) {//chekear su hay un genero en la query
    const filteredMovies = movies.filter(movie => movie.genre.some(g => g.toLowerCase() === genre.toLowerCase()))
    return res.json(filteredMovies)
  }
  res.json(movies) // Return all movies if no genre filter is applied
})

app.get('/movies/:id', (req, res) => {//path to regex
  const { id } = req.params
  const movie = movies.find(movie => movie.id === id)
  if (movie) return res.json(movie)
  res.status(404).json({ message: 'Movie not found' })
})
app.get('/movies/search', (req, res) => { 

})
app.post('/movies', (req, res) => { 
  
  const result = validateMovie(req.body)
  if (result.error) {
    return res.status(400).json({ message: result.error.errors.map(err => err.message) })
  }
  //en bd
  const newMovie = {
    id: crypto.randomUUID(), // Generate a unique ID for the new movie
    ...result.data // Use the validated data from the request body
  }
  //
  //esto no es rest porq no se esrta guardando en una bd, el estado de la app en mem

  movies.push(newMovie)//add new movie in to the movie array
  res.status(201).json(newMovie)//actualizar la cache del cliente
})
app.patch('/movies/:id', (req, res) => { 
  const result = validatePartialMovie(req.body)
  if (result.error) {
    return res.status(400).json({ message: result.error.errors.map(err => err.message) })
  }
  const { id } = req.params
  const movieIndex = movies.findIndex(movie => movie.id === id)
  if (movieIndex === -1) {
    return res.status(404).json({ message: 'Movie not found' })
  }
  const updateMovie = {
    ...movies[movieIndex],
    ...result.data
  }
  movies[movieIndex] = updateMovie
  return res.json(updateMovie)
})
app.delete('/movies/:id', (req, res) => { 
  const { id } = req.params
  const movieIndex = movies.findIndex(movie => movie.id === id)
  if (movieIndex === -1) { 
    return res.status(404).json({ message: 'Movie not found' })
  }
  movies.splice(movieIndex, 1)// remove the movie from the array
  return res.json({ message: 'Movie deleted successfully' })
})
app.options('/movies/:id', (req, res) => { 
  const origin = req.header('origin')// get the origin of the request
  if (ACCEPTED_ORIGINS.includes(origin) || !origin) {
    res.header('Access-Control-Allow-Origin', origin) // Allow only accepted origins for CORS
    res.header('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE') // Allow specific methods
  }
  res.send(200) // No Content
})
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})