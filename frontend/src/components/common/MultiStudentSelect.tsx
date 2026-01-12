interface Props {
  students: { id: string; name: string }[];
  selected: string[];
  onChange: (ids: string[]) => void;
}

export default function MultiStudentSelect({
  students,
  selected,
  onChange,
}: Props) {
  const toggleStudent = (id: string) => {
    if (selected.includes(id)) {
      onChange(selected.filter(s => s !== id));
    } else {
      onChange([...selected, id]);
    }
  };

  return (
    <div className="border rounded-lg p-3 max-h-48 overflow-y-auto">
      {students.map(student => (
        <label
          key={student.id}
          className="flex items-center gap-2 mb-2 cursor-pointer"
        >
          <input
            type="checkbox"
            checked={selected.includes(student.id)}
            onChange={() => toggleStudent(student.id)}
          />
          <span>{student.name}</span>
        </label>
      ))}
    </div>
  );
}
