"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const openAiController_1 = __importDefault(require("../controller/openAiController"));
const router = express_1.default.Router();
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
router.get('/movie-recommendations', openAiController_1.default.getMovieRecommendations);
exports.default = router;