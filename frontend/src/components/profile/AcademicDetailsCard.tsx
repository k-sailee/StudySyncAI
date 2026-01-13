export default function AcademicDetailsCard({ academic, onEdit }: any) {
  return (
    <div className="card">
      <h3>Academic Details</h3>

      {academic ? (
        <>
          <p>Grade: {academic.grade}</p>
          <p>Stream: {academic.stream}</p>
          <p>Courses: {academic.courses}</p>
        </>
      ) : (
        <p className="text-muted">
          Academic details not added yet
        </p>
      )}

      <button onClick={onEdit} className="btn-primary">
        Update Profile
      </button>
    </div>
  );
}
