import express from 'express';
import OpenAIController from '../controller/openAiController';

const router = express.Router();

/**
 * @swagger
 * /ai/movie-recommendations/{movie}:
 *   get:
 *     summary: Get movie recommendations based on a given movie
 *     tags:
 *       - AI
 *     parameters:
 *       - in: path
 *         name: movie
 *         required: true
 *         schema:
 *           type: string
 *         description: The name of the movie to base recommendations on (URL-encoded if it contains spaces, e.g., "Harry%20Potter")
 *     responses:
 *       200:
 *         description: A list of recommended movies
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   properties:
 *                     movies:
 *                       type: array
 *                       items:
 *                         type: string
 *                       description: List of recommended movie names
 *       400:
 *         description: Bad request (e.g., missing movie name)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Error message
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Error message
 */
router.get('/movie-recommendations', OpenAIController.getMovieRecommendations);

/**
 * @swagger
 * /ai/movie-sentiment/{movieId}:
 *   get:
 *     summary: Get the overall sentiment of a movie based on notes made by users
 *     tags:
 *       - AI
 *     parameters:
 *       - in: path
 *         name: movie
 *         required: true
 *         schema:
 *           type: string
 *         description: The id of the movie to get the overall sentiment
 *     responses:
 *       200:
 *         description: A string detailing the sentiment
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   properties:
 *                     sentiment:
 *                       type: string
 *                       description: Overall sentiment of the movie
 *       400:
 *         description: Bad request (e.g., missing movie id)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Error message
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Error message
 */
router.get('/movie-sentiment/:movieId', OpenAIController.getMovieSentiment);

export default router;
