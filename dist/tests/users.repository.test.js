"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const userRepository_1 = __importDefault(require("../user/repositories/userRepository"));
const userModel_1 = __importDefault(require("../user/models/userModel"));
const userFavMovieAssocModel_1 = __importDefault(require("../user/models/userFavMovieAssocModel"));
const favoriteMovieModel_1 = __importDefault(require("../user/models/favoriteMovieModel"));
jest.mock('../user/models/userFavMovieAssocModel');
jest.mock('../user/models/favoriteMovieModel');
jest.mock('../user/models/userModel');
const mockUser = jest.mocked(userModel_1.default, { shallow: false });
const mockUserFavMovieAssoc = jest.mocked(userFavMovieAssocModel_1.default, { shallow: false });
const mockFavoriteMovie = jest.mocked(favoriteMovieModel_1.default, { shallow: false });
describe('UserRepository', () => {
    const userRepository = new userRepository_1.default();
    describe('getFavoriteMoviesByUserById', () => {
        it('should return favorite movies if they exist', () => __awaiter(void 0, void 0, void 0, function* () {
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
            mockUserFavMovieAssoc.findAll.mockResolvedValueOnce(mockData);
            const result = yield userRepository.getFavoriteMoviesByUserById(1);
            expect(mockUserFavMovieAssoc.findAll).toHaveBeenCalledWith({
                where: { user_id: 1 },
                include: [{ model: favoriteMovieModel_1.default, as: 'favoriteMovie' }],
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
        }));
        it('should throw an error if the database query fails', () => __awaiter(void 0, void 0, void 0, function* () {
            jest.spyOn(console, 'error').mockImplementation(() => { });
            mockUserFavMovieAssoc.findAll.mockRejectedValueOnce(new Error('Database error'));
            yield expect(userRepository.getFavoriteMoviesByUserById(1)).rejects.toThrow('Database error');
            expect(mockUserFavMovieAssoc.findAll).toHaveBeenCalledWith({
                where: { user_id: 1 },
                include: [{ model: favoriteMovieModel_1.default, as: 'favoriteMovie' }],
            });
        }));
    });
    describe('addMovieToFavoritesByUserId', () => {
        it('should add a movie to the user\'s favorites if it does not exist', () => __awaiter(void 0, void 0, void 0, function* () {
            const mockUserInstance = { id: 1 };
            const mockMovie = {
                Title: 'Inception',
                Poster: 'https://example.com/poster.jpg',
                Year: '2010',
                imdbID: 'tt1375666',
                Genre: 'Sci-Fi',
                Plot: 'A mind-bending thriller',
                Notes: 'Great movie',
            };
            const mockFavoriteMovieInstance = Object.assign({ id: 101 }, mockMovie);
            const mockAssociation = { id: 1, Notes: 'Great movie' };
            mockUser.findByPk.mockResolvedValueOnce(mockUserInstance);
            mockFavoriteMovie.findOne.mockResolvedValueOnce(null);
            mockFavoriteMovie.create.mockResolvedValueOnce(mockFavoriteMovieInstance);
            mockUserFavMovieAssoc.create.mockResolvedValueOnce(mockAssociation);
            jest.spyOn(userRepository, 'getFavoriteMoviesByUserById').mockResolvedValueOnce([
                Object.assign(Object.assign({}, mockMovie), { Notes: 'Great movie' }),
            ]);
            const result = yield userRepository.addMovieToFavoritesByUserId(1, mockMovie);
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
            expect(result).toEqual([Object.assign(Object.assign({}, mockMovie), { Notes: 'Great movie' })]);
        }));
        it('should add an existing movie to the user\'s favorites', () => __awaiter(void 0, void 0, void 0, function* () {
            const mockUserInstance = { id: 1 };
            const mockMovie = {
                Title: 'Inception',
                Poster: 'https://example.com/poster.jpg',
                Year: '2010',
                imdbID: 'tt1375666',
                Genre: 'Sci-Fi',
                Plot: 'A mind-bending thriller',
                Notes: 'Great movie',
            };
            const mockFavoriteMovieInstance = Object.assign({ id: 101 }, mockMovie);
            const mockAssociation = { id: 1, Notes: 'Great movie' };
            mockUser.findByPk.mockResolvedValueOnce(mockUserInstance);
            mockFavoriteMovie.findOne.mockResolvedValueOnce(mockFavoriteMovieInstance);
            mockUserFavMovieAssoc.create.mockResolvedValueOnce(mockAssociation);
            jest.spyOn(userRepository, 'getFavoriteMoviesByUserById').mockResolvedValueOnce([
                Object.assign(Object.assign({}, mockMovie), { Notes: 'Great movie' }),
            ]);
            const result = yield userRepository.addMovieToFavoritesByUserId(1, mockMovie);
            expect(mockUser.findByPk).toHaveBeenCalledWith(1);
            expect(mockFavoriteMovie.findOne).toHaveBeenCalledWith({ where: { Title: 'Inception' } });
            expect(mockFavoriteMovie.create).not.toHaveBeenCalled();
            expect(mockUserFavMovieAssoc.create).toHaveBeenCalledWith({
                user_id: 1,
                fav_movies_id: 101,
                Notes: 'Great movie',
            });
            expect(result).toEqual([Object.assign(Object.assign({}, mockMovie), { Notes: 'Great movie' })]);
        }));
        it('should throw an error if the user does not exist', () => __awaiter(void 0, void 0, void 0, function* () {
            const mockMovie = { Title: 'Inception' };
            mockUser.findByPk.mockResolvedValueOnce(null);
            yield expect(userRepository.addMovieToFavoritesByUserId(1, mockMovie)).rejects.toThrow('User with ID 1 not found');
            expect(mockUser.findByPk).toHaveBeenCalledWith(1);
            expect(mockFavoriteMovie.findOne).not.toHaveBeenCalled();
            expect(mockFavoriteMovie.create).not.toHaveBeenCalled();
            expect(mockUserFavMovieAssoc.create).not.toHaveBeenCalled();
        }));
        it('should throw an error if there is a database error', () => __awaiter(void 0, void 0, void 0, function* () {
            const mockMovie = { Title: 'Inception' };
            mockUser.findByPk.mockRejectedValueOnce(new Error('Database error'));
            yield expect(userRepository.addMovieToFavoritesByUserId(1, mockMovie)).rejects.toThrow('Database error');
            expect(mockUser.findByPk).toHaveBeenCalledWith(1);
        }));
    });
    describe('updateFavoriteMovieByIdAndByUserId', () => {
        it('should update a favorite movie and its notes if they exist', () => __awaiter(void 0, void 0, void 0, function* () {
            const mockUserInstance = { id: 1 };
            const mockFavoriteMovieInstance = { id: 101, imdbID: 'tt1375666' };
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
            const result = yield userRepository.updateFavoriteMovieByIdAndByUserId(1, mockMovie);
            expect(mockUser.findByPk).toHaveBeenCalledWith(1);
            expect(mockFavoriteMovie.findOne).toHaveBeenCalledWith({ where: { imdbID: 'tt1375666' } });
            expect(mockFavoriteMovie.update).toHaveBeenCalledWith({
                Title: 'Inception Updated',
                Year: '2011',
                Poster: 'https://example.com/poster_updated.jpg',
                Genre: 'Sci-Fi',
                Plot: 'Updated plot',
            }, { where: { imdbID: 'tt1375666' } });
            expect(mockUserFavMovieAssoc.update).toHaveBeenCalledWith({ Notes: 'Updated notes' }, { where: { fav_movies_id: 101 } });
            expect(result).toEqual([mockMovie]);
        }));
        it('should throw an error if the user does not exist', () => __awaiter(void 0, void 0, void 0, function* () {
            const mockMovie = { imdbID: 'tt1375666' };
            mockUser.findByPk.mockResolvedValueOnce(null);
            yield expect(userRepository.updateFavoriteMovieByIdAndByUserId(1, mockMovie)).rejects.toThrow('User with ID 1 not found');
            expect(mockUser.findByPk).toHaveBeenCalledWith(1);
            expect(mockFavoriteMovie.findOne).not.toHaveBeenCalled();
            expect(mockFavoriteMovie.update).not.toHaveBeenCalled();
            expect(mockUserFavMovieAssoc.update).not.toHaveBeenCalled();
        }));
        it('should throw an error if the movie does not exist', () => __awaiter(void 0, void 0, void 0, function* () {
            const mockUserInstance = { id: 1 };
            const mockMovie = { imdbID: 'tt1375666' };
            mockUser.findByPk.mockResolvedValueOnce(mockUserInstance);
            mockFavoriteMovie.findOne.mockResolvedValueOnce(null);
            yield expect(userRepository.updateFavoriteMovieByIdAndByUserId(1, mockMovie)).rejects.toThrow("Movie id couldn't be found");
            expect(mockUser.findByPk).toHaveBeenCalledWith(1);
            expect(mockFavoriteMovie.findOne).toHaveBeenCalledWith({ where: { imdbID: 'tt1375666' } });
            expect(mockFavoriteMovie.update).not.toHaveBeenCalled();
            expect(mockUserFavMovieAssoc.update).not.toHaveBeenCalled();
        }));
        it('should update the movie details but not the notes if notes are not provided', () => __awaiter(void 0, void 0, void 0, function* () {
            const mockUserInstance = { id: 1 };
            const mockFavoriteMovieInstance = { id: 101, imdbID: 'tt1375666' };
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
            const result = yield userRepository.updateFavoriteMovieByIdAndByUserId(1, mockMovie);
            expect(mockUser.findByPk).toHaveBeenCalledWith(1);
            expect(mockFavoriteMovie.findOne).toHaveBeenCalledWith({ where: { imdbID: 'tt1375666' } });
            expect(mockFavoriteMovie.update).toHaveBeenCalledWith({
                Title: 'Inception Updated',
                Year: '2011',
                Poster: 'https://example.com/poster_updated.jpg',
                Genre: 'Sci-Fi',
                Plot: 'Updated plot',
            }, { where: { imdbID: 'tt1375666' } });
            expect(mockUserFavMovieAssoc.update).not.toHaveBeenCalled();
            expect(result).toEqual(updatedMovies);
        }));
        it('should throw an error if the database operation fails', () => __awaiter(void 0, void 0, void 0, function* () {
            const mockMovie = { imdbID: 'tt1375666' };
            mockUser.findByPk.mockRejectedValueOnce(new Error('Database error'));
            yield expect(userRepository.updateFavoriteMovieByIdAndByUserId(1, mockMovie)).rejects.toThrow('Database error');
            expect(mockUser.findByPk).toHaveBeenCalledWith(1);
        }));
    });
});
