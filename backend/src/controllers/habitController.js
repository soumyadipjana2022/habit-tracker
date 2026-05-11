import Habit from '../models/Habit.js';
import { startOfDayUtc, toDayKey } from '../utils/dateUtils.js';
import { serializeHabit } from '../utils/habitStats.js';

const findOwnedHabit = (habitId, userId) => Habit.findOne({ _id: habitId, user: userId });

export const listHabits = async (req, res, next) => {
  try {
    const habits = await Habit.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json({ habits: habits.map(serializeHabit) });
  } catch (error) {
    next(error);
  }
};

export const createHabit = async (req, res, next) => {
  try {
    const { name, description, frequency, scheduledDays, weeklyGoal, monthlyGoal, reminder } = req.body;

    // Validate required fields
    if (!name || !name.trim()) {
      return res.status(400).json({ message: 'Habit name is required and cannot be empty' });
    }

    // Validate frequency enum
    if (frequency && !['daily', 'weekdays', 'weekly', 'monthly'].includes(frequency)) {
      return res.status(400).json({ message: 'Frequency must be daily, weekdays, weekly, or monthly' });
    }

    if (scheduledDays && (!Array.isArray(scheduledDays) || scheduledDays.some((day) => day < 0 || day > 6))) {
      return res.status(400).json({ message: 'Scheduled days must be numbers from 0 to 6' });
    }

    // Validate weeklyGoal range
    if (weeklyGoal && (weeklyGoal < 1 || weeklyGoal > 7)) {
      return res.status(400).json({ message: 'Weekly goal must be between 1 and 7' });
    }

    if (monthlyGoal && (monthlyGoal < 1 || monthlyGoal > 31)) {
      return res.status(400).json({ message: 'Monthly goal must be between 1 and 31' });
    }

    const habit = await Habit.create({
      user: req.user._id,
      name: name.trim(),
      description: description ? description.trim() : '',
      frequency,
      scheduledDays,
      weeklyGoal,
      monthlyGoal,
      reminder
    });

    res.status(201).json({ habit: serializeHabit(habit) });
  } catch (error) {
    next(error);
  }
};

export const getHabit = async (req, res, next) => {
  try {
    const habit = await findOwnedHabit(req.params.id, req.user._id);
    if (!habit) return res.status(404).json({ message: 'Habit not found' });

    res.json({ habit: serializeHabit(habit) });
  } catch (error) {
    next(error);
  }
};

export const updateHabit = async (req, res, next) => {
  try {
    const habit = await findOwnedHabit(req.params.id, req.user._id);
    if (!habit) return res.status(404).json({ message: 'Habit not found' });

    const fields = ['name', 'description', 'frequency', 'scheduledDays', 'weeklyGoal', 'monthlyGoal', 'reminder'];
    fields.forEach((field) => {
      if (req.body[field] !== undefined) habit[field] = req.body[field];
    });

    await habit.save();
    res.json({ habit: serializeHabit(habit) });
  } catch (error) {
    next(error);
  }
};

export const deleteHabit = async (req, res, next) => {
  try {
    const habit = await findOwnedHabit(req.params.id, req.user._id);
    if (!habit) return res.status(404).json({ message: 'Habit not found' });

    await habit.deleteOne();
    res.json({ message: 'Habit deleted' });
  } catch (error) {
    next(error);
  }
};

export const completeHabit = async (req, res, next) => {
  try {
    const habit = await findOwnedHabit(req.params.id, req.user._id);
    if (!habit) return res.status(404).json({ message: 'Habit not found' });

    const completionDate = startOfDayUtc(req.body.date || new Date());
    const dayKey = toDayKey(completionDate);
    const exists = habit.completions.some((date) => toDayKey(date) === dayKey);

    if (exists) {
      return res.status(409).json({ message: 'Habit already completed for this day' });
    }

    habit.completions.push(completionDate);
    await habit.save();
    res.status(201).json({ habit: serializeHabit(habit) });
  } catch (error) {
    next(error);
  }
};

export const uncompleteHabit = async (req, res, next) => {
  try {
    const habit = await findOwnedHabit(req.params.id, req.user._id);
    if (!habit) return res.status(404).json({ message: 'Habit not found' });

    const dayKey = toDayKey(req.body.date || new Date());
    habit.completions = habit.completions.filter((date) => toDayKey(date) !== dayKey);
    await habit.save();

    res.json({ habit: serializeHabit(habit) });
  } catch (error) {
    next(error);
  }
};
