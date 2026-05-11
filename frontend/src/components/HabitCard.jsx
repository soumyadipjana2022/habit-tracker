import HabitList from './HabitList.jsx';

export default function HabitCard({ habit, onComplete, onUncomplete, onEdit, onDelete }) {
  return (
    <HabitList
      habits={[habit]}
      onComplete={onComplete}
      onUncomplete={onUncomplete}
      onToggleDay={(selectedHabit, day) => (day.completed ? onUncomplete(selectedHabit, day.day) : onComplete(selectedHabit, day.day))}
      onEdit={onEdit}
      onDelete={onDelete}
    />
  );
}

