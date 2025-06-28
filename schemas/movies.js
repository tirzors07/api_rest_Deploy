const z = require('zod')//

const movieSchema = z.object({
    title: z.string({
      invalid_type_error: 'Movie title must be a string',
      required_error: 'movie title is required'
    }),
    year: z.number().int().positive().min(1900).max(2025),
    director: z.string({
      invalid_type_error: 'Director name must be a string',
      required_error: 'Director name is required'
    }),
    duration: z.number().int().positive(),
    rate: z.number().min(0).max(10).default(5.0),
    poster: z.string().url({
      invalid_type_error: 'Poster must be a valid URL',
      required_error: 'Poster URL is required'
    }),
    genre: z.array(
      z.enum(['action', 'comedy', 'drama', 'fantasy', 'horror', 'romance', 'sci-fi', 'thriller'], {
        required_error: 'Genre is required',
        invalid_type_error: 'Genre must be a valid genre'
      })
    )
})

function validateMovie(object) { 
    return movieSchema.safeParse(object)
}
function validatePartialMovie(object) { 
    return movieSchema.partial().safeParse(object)
}
module.exports = {
    validateMovie,
    validatePartialMovie
}