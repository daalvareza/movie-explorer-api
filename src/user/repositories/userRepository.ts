import User from "../models/userModel";
import MovieDTO from "../dto/movie.dto";
import FavoriteMovie from "../models/favoriteMovieModel";
import UserFavMovieAssoc from "../models/userFavMovieAssocModel";

class UserRepository {
    async getFavoriteMoviesByUserById(userId: number) {
        try {
            const userMovies = await UserFavMovieAssoc.findAll({
                where: { user_id: userId },
                include: [{ model: FavoriteMovie, as: 'favoriteMovie' }],
            });

            return userMovies.map((assoc: any) => ({
                ...assoc.favoriteMovie.get(),
                Notes: assoc.Notes,
            }));

        } catch (error: any) {
            console.error(`Error fetching favorite movies: ${error}`);
            throw error;
        }
    };

    async addMovieToFavoritesByUserId(userId: number, movie: MovieDTO) {
        try {
            const user = await User.findByPk(userId);
            if (!user) {
                throw new Error(`User with ID ${userId} not found`);
            }

            let favoriteMovie = await FavoriteMovie.findOne({
                where: { Title: movie.Title }
            });
        
            if (!favoriteMovie) {
                favoriteMovie = await FavoriteMovie.create({
                    Title: movie.Title,
                    Poster: movie.Poster,
                    Year: movie.Year,
                    imdbID: movie.imdbID,
                    Genre: movie.Genre,
                    Plot: movie.Plot,
                });
            }
        
            await UserFavMovieAssoc.create({
                user_id: userId,
                fav_movies_id: favoriteMovie.id,
                Notes: movie.Notes,
            });
        
            return await this.getFavoriteMoviesByUserById(userId);

        } catch (error: any) {
            console.error(`Error adding favorite movie: ${error}`);
            throw error;
        }
    };

    async updateFavoriteMovieByIdAndByUserId(userId: number, movie: MovieDTO) {
        try {
            const user = await User.findByPk(userId);
            if (!user) {
                throw new Error(`User with ID ${userId} not found`);
            }

            let favoriteMovie = await FavoriteMovie.findOne({
                where: { imdbID: movie.imdbID }
            });
        
            if (!favoriteMovie) {
                throw new Error("Movie id couldn't be found");
            }
        
            await FavoriteMovie.update(
                {
                    Title: movie.Title,
                    Year: movie.Year,
                    Poster: movie.Poster,
                    Genre: movie.Genre,
                    Plot: movie.Plot,
                },
                {
                    where: { imdbID: movie.imdbID },
                }
            );

            if (movie.Notes) {
                await UserFavMovieAssoc.update(
                    { Notes: movie.Notes },
                    { where: { fav_movies_id: favoriteMovie.id }},
                );
            }
        
            return await this.getFavoriteMoviesByUserById(userId);

        } catch (error: any) {
            console.error(`Error updating favorite movie: ${error}`);
            throw error;
        }
    };

    async deleteFavoriteMovieByIdAndByUserId(userId: number, movieId: string) {
        try {
            const user = await User.findByPk(userId);
            if (!user) {
                throw new Error(`User with ID ${userId} not found`);
            }

            let favoriteMovie = await FavoriteMovie.findOne({
                where: { imdbID: movieId }
            });

            if (!favoriteMovie) {
                throw new Error(`Movie with imdbID ${movieId} doesn't exist`);
            }

            const isOnlyOneUserWithThisMovie = await UserFavMovieAssoc.count({
                where: { fav_movies_id: favoriteMovie.id },
            }) <= 1;

            await UserFavMovieAssoc.destroy({
                where: {
                    user_id: user.id,
                    fav_movies_id: favoriteMovie.id
                }
            });

            if (isOnlyOneUserWithThisMovie) {
                await FavoriteMovie.destroy({
                    where: { id: favoriteMovie.id }
                });
            }
            return `Movie with imdbID ${movieId} removed successfully`;

        } catch (error: any) {
            console.error(`Error deleting favorite movie: ${error}`);
            throw error;
        }
    };
}

export default UserRepository;