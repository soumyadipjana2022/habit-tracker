import express from 'express';
import {
  completeHabit,
  createHabit,
  deleteHabit,
  getHabit,
  listHabits,
  uncompleteHabit,
  updateHabit
} from '../controllers/habitController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.route('/').get(listHabits).post(createHabit);
router.route('/:id').get(getHabit).put(updateHabit).delete(deleteHabit);
router.post('/:id/complete', completeHabit);
router.delete('/:id/complete', uncompleteHabit);

export default router;

