import { where } from "sequelize";
import FavoriteMovie from "../models/favoriteMovieModel";
import UserFavMovieAssoc from "../models/userFavMovieAssocModel";

class NotesRepository {
    async findAllMovieNotes(movieId: string) {
        const favoriteMovie = await FavoriteMovie.findOne({
            where : { imdbID: movieId }
        });

        if (!favoriteMovie) {
            return null;
        }

        const associations = await UserFavMovieAssoc.findAll({
            where: { fav_movies_id: favoriteMovie.id },
            attributes: ['Notes'],
        });

        if (!associations) {
            return null;
        }

        return associations.map((assoc: any) => assoc.Notes);
    }
};

export default NotesRepository;
