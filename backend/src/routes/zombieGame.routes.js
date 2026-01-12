import express from 'express';
import {
  createSurvivor,
  makeDecision,
  getLeaderboard,
  addToLeaderboard,
  getSurvivor
} from '../controllers/zombieGame.controller.js';

const router = express.Router();

// Create a new survivor
router.post('/survivors', createSurvivor);

// Get survivor details
router.get('/survivors/:survivorId', getSurvivor);

// Make a decision for a survivor
router.post('/survivors/:survivorId/decisions', makeDecision);

// Get leaderboard
router.get('/leaderboard', getLeaderboard);

// Add entry to leaderboard
router.post('/leaderboard', addToLeaderboard);

export default router;
