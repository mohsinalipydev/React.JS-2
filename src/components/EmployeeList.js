function EmployeeList({
  employees,
  onDeleteEmployee,
  onEditEmployee,
  onToggleStatus,
}) {
  return (
    <section className="list-card">
      <div className="section-heading">
        <div>
          <h2>Employee Directory</h2>
          <p>Manage and view your team members.</p>
        </div>

        <span className="employee-count">
          {employees.length} employees
        </span>
      </div>

      {employees.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">👥</div>
          <h3>No employees found</h3>
          <p>Add an employee or change your search filters.</p>
        </div>
      ) : (
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Employee</th>
                <th>Age</th>
                <th>Gender</th>
                <th>Department</th>
                <th>Salary (PKR)</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {employees.map((employee) => {
                const isActive =
                  (employee.status || "Active") === "Active";

                return (
                  <tr key={employee.id}>
                    <td>
                      <div className="employee-info">
                        <div className="avatar">
                          {employee.name
                            ? employee.name.charAt(0).toUpperCase()
                            : "?"}
                        </div>

                        <div>
                          <strong>{employee.name || "—"}</strong>
                          <p>{employee.email || "—"}</p>
                        </div>
                      </div>
                    </td>

                    <td>{employee.age ?? "—"}</td>

                    <td>{employee.gender || "—"}</td>

                    <td>{employee.department || "—"}</td>

                    <td>
                      {employee.salary == null
                        ? "—"
                        : `Rs. ${Number(employee.salary).toLocaleString("en-PK")}`}
                    </td>

                    <td>
                      <button
                        type="button"
                        className={`status-toggle ${
                          isActive
                            ? "status-active"
                            : "status-inactive"
                        }`}
                        onClick={() => onToggleStatus(employee.id)}
                        aria-label={`Change ${employee.name || "employee"} status from ${
                          isActive ? "Active to Inactive" : "Inactive to Active"
                        }`}
                        title="Click to change employee status"
                      >
                        <span className="status-dot"></span>
                        {isActive ? "Active" : "Inactive"}
                      </button>
                    </td>

                    <td>
                      <div className="action-buttons">
                        <button
                          type="button"
                          className="edit-button"
                          onClick={() => onEditEmployee(employee)}
                        >
                          Edit
                        </button>

                        <button
                          type="button"
                          className="delete-button"
                          onClick={() => onDeleteEmployee(employee.id)}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}

export default EmployeeList;