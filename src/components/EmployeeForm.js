
import { useState, useRef, useEffect } from "react";

function EmployeeForm({
  onAddEmployee,
  editingEmployee,
  onUpdateEmployee,
  onCancelEdit,
}) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [department, setDepartment] = useState("Engineering");
  const [salary, setSalary] = useState("");

  const nameInputRef = useRef(null);

  // Load selected employee data into the form
  useEffect(() => {
    if (editingEmployee) {
      setName(editingEmployee.name || "");
      setEmail(editingEmployee.email || "");
      setAge(editingEmployee.age ?? "");
      setGender(editingEmployee.gender || "");
      setDepartment(editingEmployee.department || "Engineering");
      setSalary(editingEmployee.salary ?? "");
    } else {
      setName("");
      setEmail("");
      setAge("");
      setGender("");
      setDepartment("Engineering");
      setSalary("");
    }

    nameInputRef.current?.focus();
  }, [editingEmployee]);

  const clearForm = () => {
    setName("");
    setEmail("");
    setAge("");
    setGender("");
    setDepartment("Engineering");
    setSalary("");
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const employeeData = {
      id: editingEmployee ? editingEmployee.id : Date.now(),
      name: name.trim(),
      email: email.trim(),
      age: Number(age),
      gender,
      department,
      salary: Number(salary),
      status: editingEmployee
        ? editingEmployee.status || "Active"
        : "Active",
    };

    if (editingEmployee) {
      onUpdateEmployee(employeeData);
    } else {
      onAddEmployee(employeeData);
      clearForm();
      nameInputRef.current?.focus();
    }
  };

  const handleCancelEdit = () => {
    onCancelEdit();
  };

  return (
    <section className="employee-form">
      <div className="form-heading">
        <div>
          <h2>
            {editingEmployee ? "Edit Employee" : "Add New Employee"}
          </h2>

          <p>
            {editingEmployee
              ? "Update the employee information below."
              : "Enter employee information below."}
          </p>
        </div>

        {editingEmployee && (
          <span className="editing-badge">Editing</span>
        )}
      </div>

      <form onSubmit={handleSubmit}>
        <div className="form-grid">
          <div className="form-group">
            <label htmlFor="employee-name">Full Name</label>
            <input
              ref={nameInputRef}
              id="employee-name"
              type="text"
              placeholder="Enter full name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="employee-email">Email Address</label>
            <input
              id="employee-email"
              type="email"
              placeholder="example@email.com"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="employee-age">Age</label>
            <input
              id="employee-age"
              type="number"
              placeholder="Enter age"
              min="18"
              max="100"
              value={age}
              onChange={(event) => setAge(event.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="employee-gender">Gender</label>
            <select
              id="employee-gender"
              value={gender}
              onChange={(event) => setGender(event.target.value)}
              required
            >
              <option value="">Select gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
              <option value="Prefer not to say">
                Prefer not to say
              </option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="employee-department">Department</label>
            <select
              id="employee-department"
              value={department}
              onChange={(event) => setDepartment(event.target.value)}
              required
            >
              <option value="Engineering">Engineering</option>
              <option value="Human Resources">Human Resources</option>
              <option value="Marketing">Marketing</option>
              <option value="Finance">Finance</option>
              <option value="Design">Design</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="employee-salary">
              Monthly Salary (PKR)
            </label>
            <input
              id="employee-salary"
              type="number"
              placeholder="e.g. 75000"
              min="0"
              step="1"
              value={salary}
              onChange={(event) => setSalary(event.target.value)}
              required
            />
          </div>
        </div>

        <div className="form-actions">
          <button type="submit" className="add-employee-button">
            {editingEmployee ? "✓ Update Employee" : "+ Add Employee"}
          </button>

          {editingEmployee && (
            <button
              type="button"
              className="cancel-edit-button"
              onClick={handleCancelEdit}
            >
              Cancel Edit
            </button>
          )}
        </div>
      </form>
    </section>
  );
}

export default EmployeeForm;
