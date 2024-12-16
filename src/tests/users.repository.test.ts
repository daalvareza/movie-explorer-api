import UserRepository from '../user/repositories/userRepository';
import User from '../user/models/userModel';
import UserFavMovieAssoc from '../user/models/userFavMovieAssocModel';
import FavoriteMovie from '../user/models/favoriteMovieModel';

jest.mock('../user/models/userFavMovieAssocModel');
jest.mock('../user/models/favoriteMovieModel');
jest.mock('../user/models/userModel');

const mockUser = jest.mocked(User, { shallow: false });
const mockUserFavMovieAssoc = jest.mocked(UserFavMovieAssoc, { shallow: false });
const mockFavoriteMovie = jest.mocked(FavoriteMovie, { shallow: false });

describe('UserRepository', () => {
    const userRepository = new UserRepository();

    describe('getFavoriteMoviesByUserById', () => {
        it('should return favorite movies if they exist', async () => {
            const mockData = [
                {
                    favoriteMovie: {
                        get: jest.fn().mockReturnValue({
                            id: 1,
                            Title: 'Inception',
                            Year: '2010',
                            imdbID: 'tt1375666',
                        }),
                    },
                    Notes: 'Amazing movie',
                },
            ];

            mockUserFavMovieAssoc.findAll.mockResolvedValueOnce(mockData as any);
            const result = await userRepository.getFavoriteMoviesByUserById(1);

            expect(mockUserFavMovieAssoc.findAll).toHaveBeenCalledWith({
                where: { user_id: 1 },
                include: [{ model: FavoriteMovie, as: 'favoriteMovie' }],
            });
            expect(result).toEqual([
                {
                    id: 1,
                    Title: 'Inception',
                    Year: '2010',
                    imdbID: 'tt1375666',
                    Notes: 'Amazing movie',
                },
            ]);
        });

        it('should throw an error if the database query fails', async () => {
            jest.spyOn(console, 'error').mockImplementation(() => {});
            mockUserFavMovieAssoc.findAll.mockRejectedValueOnce(new Error('Database error'));

            await expect(userRepository.getFavoriteMoviesByUserById(1)).rejects.toThrow('Database error');
            expect(mockUserFavMovieAssoc.findAll).toHaveBeenCalledWith({
                where: { user_id: 1 },
                include: [{ model: FavoriteMovie, as: 'favoriteMovie' }],
            });
        });
    });

    describe('addMovieToFavoritesByUserId', () => {
        it('should add a movie to the user\'s favorites if it does not exist', async () => {
            const mockUserInstance = { id: 1 } as any;
            const mockMovie = {
                Title: 'Inception',
                Poster: 'https://example.com/poster.jpg',
                Year: '2010',
                imdbID: 'tt1375666',
                Genre: 'Sci-Fi',
                Plot: 'A mind-bending thriller',
                Notes: 'Great movie',
            };

            const mockFavoriteMovieInstance = { id: 101, ...mockMovie } as any;
            const mockAssociation = { id: 1, Notes: 'Great movie' } as any;

            mockUser.findByPk.mockResolvedValueOnce(mockUserInstance);
            mockFavoriteMovie.findOne.mockResolvedValueOnce(null);
            mockFavoriteMovie.create.mockResolvedValueOnce(mockFavoriteMovieInstance);
            mockUserFavMovieAssoc.create.mockResolvedValueOnce(mockAssociation);

            jest.spyOn(userRepository, 'getFavoriteMoviesByUserById').mockResolvedValueOnce([
                { ...mockMovie, Notes: 'Great movie' },
            ]);

            const result = await userRepository.addMovieToFavoritesByUserId(1, mockMovie);
            expect(mockUser.findByPk).toHaveBeenCalledWith(1);
            expect(mockFavoriteMovie.findOne).toHaveBeenCalledWith({ where: { Title: 'Inception' } });
            expect(mockFavoriteMovie.create).toHaveBeenCalledWith({
                Title: 'Inception',
                Poster: 'https://example.com/poster.jpg',
                Year: '2010',
                imdbID: 'tt1375666',
                Genre: 'Sci-Fi',
                Plot: 'A mind-bending thriller',
            });
            expect(mockUserFavMovieAssoc.create).toHaveBeenCalledWith({
                user_id: 1,
                fav_movies_id: 101,
                Notes: 'Great movie',
            });
            expect(result).toEqual([{ ...mockMovie, Notes: 'Great movie' }]);
        });

        it('should add an existing movie to the user\'s favorites', async () => {
            const mockUserInstance = { id: 1 } as any;
            const mockMovie = {
                Title: 'Inception',
                Poster: 'https://example.com/poster.jpg',
                Year: '2010',
                imdbID: 'tt1375666',
                Genre: 'Sci-Fi',
                Plot: 'A mind-bending thriller',
                Notes: 'Great movie',
            };

            const mockFavoriteMovieInstance = { id: 101, ...mockMovie } as any;
            const mockAssociation = { id: 1, Notes: 'Great movie' } as any;

            mockUser.findByPk.mockResolvedValueOnce(mockUserInstance);
            mockFavoriteMovie.findOne.mockResolvedValueOnce(mockFavoriteMovieInstance);
            mockUserFavMovieAssoc.create.mockResolvedValueOnce(mockAssociation);

            jest.spyOn(userRepository, 'getFavoriteMoviesByUserById').mockResolvedValueOnce([
                { ...mockMovie, Notes: 'Great movie' },
            ]);

            const result = await userRepository.addMovieToFavoritesByUserId(1, mockMovie);
            expect(mockUser.findByPk).toHaveBeenCalledWith(1);
            expect(mockFavoriteMovie.findOne).toHaveBeenCalledWith({ where: { Title: 'Inception' } });
            expect(mockFavoriteMovie.create).not.toHaveBeenCalled();
            expect(mockUserFavMovieAssoc.create).toHaveBeenCalledWith({
                user_id: 1,
                fav_movies_id: 101,
                Notes: 'Great movie',
            });
            expect(result).toEqual([{ ...mockMovie, Notes: 'Great movie' }]);
        });

        it('should throw an error if the user does not exist', async () => {
            const mockMovie = { Title: 'Inception' };
            mockUser.findByPk.mockResolvedValueOnce(null);

            await expect(userRepository.addMovieToFavoritesByUserId(1, mockMovie as any)).rejects.toThrow(
                'User with ID 1 not found'
            );

            expect(mockUser.findByPk).toHaveBeenCalledWith(1);
            expect(mockFavoriteMovie.findOne).not.toHaveBeenCalled();
            expect(mockFavoriteMovie.create).not.toHaveBeenCalled();
            expect(mockUserFavMovieAssoc.create).not.toHaveBeenCalled();
        });

        it('should throw an error if there is a database error', async () => {
            const mockMovie = { Title: 'Inception' };
            mockUser.findByPk.mockRejectedValueOnce(new Error('Database error'));

            await expect(userRepository.addMovieToFavoritesByUserId(1, mockMovie as any)).rejects.toThrow(
                'Database error'
            );

            expect(mockUser.findByPk).toHaveBeenCalledWith(1);
        });
      });

    describe('updateFavoriteMovieByIdAndByUserId', () => {
        it('should update a favorite movie and its notes if they exist', async () => {
            const mockUserInstance = { id: 1 } as any;
            const mockFavoriteMovieInstance = { id: 101, imdbID: 'tt1375666' } as any;
            const mockMovie = {
                imdbID: 'tt1375666',
                Title: 'Inception Updated',
                Year: '2011',
                Poster: 'https://example.com/poster_updated.jpg',
                Genre: 'Sci-Fi',
                Plot: 'Updated plot',
                Notes: 'Updated notes',
            };

            mockUser.findByPk.mockResolvedValueOnce(mockUserInstance);
            mockFavoriteMovie.findOne.mockResolvedValueOnce(mockFavoriteMovieInstance);
            mockFavoriteMovie.update.mockResolvedValueOnce([1]);
            mockUserFavMovieAssoc.update.mockResolvedValueOnce([1]);

            jest.spyOn(userRepository, 'getFavoriteMoviesByUserById').mockResolvedValueOnce([mockMovie]);

            const result = await userRepository.updateFavoriteMovieByIdAndByUserId(1, mockMovie);
            expect(mockUser.findByPk).toHaveBeenCalledWith(1);
            expect(mockFavoriteMovie.findOne).toHaveBeenCalledWith({ where: { imdbID: 'tt1375666' } });
            expect(mockFavoriteMovie.update).toHaveBeenCalledWith(
                {
                    Title: 'Inception Updated',
                    Year: '2011',
                    Poster: 'https://example.com/poster_updated.jpg',
                    Genre: 'Sci-Fi',
                    Plot: 'Updated plot',
                },
                { where: { imdbID: 'tt1375666' } }
            );
            expect(mockUserFavMovieAssoc.update).toHaveBeenCalledWith(
                { Notes: 'Updated notes' },
                { where: { fav_movies_id: 101 } }
            );
            expect(result).toEqual([mockMovie]);
        });

        it('should throw an error if the user does not exist', async () => {
            const mockMovie = { imdbID: 'tt1375666' } as any;

            mockUser.findByPk.mockResolvedValueOnce(null);
            await expect(userRepository.updateFavoriteMovieByIdAndByUserId(1, mockMovie)).rejects.toThrow(
                'User with ID 1 not found'
            );

            expect(mockUser.findByPk).toHaveBeenCalledWith(1);
            expect(mockFavoriteMovie.findOne).not.toHaveBeenCalled();
            expect(mockFavoriteMovie.update).not.toHaveBeenCalled();
            expect(mockUserFavMovieAssoc.update).not.toHaveBeenCalled();
        });

        it('should throw an error if the movie does not exist', async () => {
            const mockUserInstance = { id: 1 } as any;
            const mockMovie = { imdbID: 'tt1375666' } as any;

            mockUser.findByPk.mockResolvedValueOnce(mockUserInstance);
            mockFavoriteMovie.findOne.mockResolvedValueOnce(null);

            await expect(userRepository.updateFavoriteMovieByIdAndByUserId(1, mockMovie)).rejects.toThrow(
                "Movie id couldn't be found"
            );
            
            expect(mockUser.findByPk).toHaveBeenCalledWith(1);
            expect(mockFavoriteMovie.findOne).toHaveBeenCalledWith({ where: { imdbID: 'tt1375666' } });
            expect(mockFavoriteMovie.update).not.toHaveBeenCalled();
            expect(mockUserFavMovieAssoc.update).not.toHaveBeenCalled();
        });

        it('should update the movie details but not the notes if notes are not provided', async () => {
            const mockUserInstance = { id: 1 } as any;
            const mockFavoriteMovieInstance = { id: 101, imdbID: 'tt1375666' } as any;
            const mockMovie = {
                imdbID: 'tt1375666',
                Title: 'Inception Updated',
                Year: '2011',
                Poster: 'https://example.com/poster_updated.jpg',
                Genre: 'Sci-Fi',
                Plot: 'Updated plot',
            };
            const updatedMovies = [
                {
                    imdbID: 'tt1375666',
                    Title: 'Inception Updated',
                    Year: '2011',
                    Poster: 'https://example.com/poster_updated.jpg',
                    Genre: 'Sci-Fi',
                    Plot: 'Updated plot',
                    Notes: null,
                },
            ];

            mockUser.findByPk.mockResolvedValueOnce(mockUserInstance);
            mockFavoriteMovie.findOne.mockResolvedValueOnce(mockFavoriteMovieInstance);
            mockFavoriteMovie.update.mockResolvedValueOnce([1]);

            jest.spyOn(userRepository, 'getFavoriteMoviesByUserById').mockResolvedValueOnce(updatedMovies);

            const result = await userRepository.updateFavoriteMovieByIdAndByUserId(1, mockMovie);
            expect(mockUser.findByPk).toHaveBeenCalledWith(1);
            expect(mockFavoriteMovie.findOne).toHaveBeenCalledWith({ where: { imdbID: 'tt1375666' } });
            expect(mockFavoriteMovie.update).toHaveBeenCalledWith(
                {
                    Title: 'Inception Updated',
                    Year: '2011',
                    Poster: 'https://example.com/poster_updated.jpg',
                    Genre: 'Sci-Fi',
                    Plot: 'Updated plot',
                },
                { where: { imdbID: 'tt1375666' } }
            );
            expect(mockUserFavMovieAssoc.update).not.toHaveBeenCalled();
            expect(result).toEqual(updatedMovies);
        });

        it('should throw an error if the database operation fails', async () => {
            const mockMovie = { imdbID: 'tt1375666' } as any;
            mockUser.findByPk.mockRejectedValueOnce(new Error('Database error'));

            await expect(userRepository.updateFavoriteMovieByIdAndByUserId(1, mockMovie)).rejects.toThrow(
                'Database error'
            );

            expect(mockUser.findByPk).toHaveBeenCalledWith(1);
        });
    });
});
