import mongoose from 'mongoose';

const reminderSchema = new mongoose.Schema(
  {
    enabled: { type: Boolean, default: false },
    time: {
      type: String,
      default: '09:00',
      match: [/^([01]\d|2[0-3]):([0-5]\d)$/, 'Reminder time must be HH:mm']
    },
    days: {
      type: [Number],
      default: [0, 1, 2, 3, 4, 5, 6],
      validate: {
        validator: (days) => days.every((day) => day >= 0 && day <= 6),
        message: 'Reminder days must be numbers from 0 to 6'
      }
    }
  },
  { _id: false }
);

const habitSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    name: {
      type: String,
      required: [true, 'Habit name is required'],
      trim: true,
      maxlength: 80
    },
    description: {
      type: String,
      trim: true,
      maxlength: 400,
      default: ''
    },
    frequency: {
      type: String,
      enum: ['daily', 'weekdays', 'weekly', 'monthly'],
      default: 'daily'
    },
    scheduledDays: {
      type: [Number],
      default: [1, 2, 3, 4, 5],
      validate: {
        validator: (days) => days.every((day) => day >= 0 && day <= 6),
        message: 'Scheduled days must be numbers from 0 to 6'
      }
    },
    weeklyGoal: {
      type: Number,
      min: 1,
      max: 7,
      default: 5
    },
    monthlyGoal: {
      type: Number,
      min: 1,
      max: 31,
      default: 20
    },
    reminder: {
      type: reminderSchema,
      default: () => ({})
    },
    completions: {
      type: [Date],
      default: []
    }
  },
  { timestamps: true }
);

habitSchema.index({ user: 1, name: 1 });

export default mongoose.model('Habit', habitSchema);
