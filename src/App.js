import { useState, useEffect, useMemo, useCallback } from "react";
import EmployeeForm from "./components/EmployeeForm";
import EmployeeList from "./components/EmployeeList";
import "./App.css";

function App() {
  const [employees, setEmployees] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("None");
  const [editingEmployee, setEditingEmployee] = useState(null);

  // Load saved employees from LocalStorage
  useEffect(() => {
    try {
      const savedEmployees = localStorage.getItem("employees");

      if (savedEmployees !== null) {
        const parsedEmployees = JSON.parse(savedEmployees);

        if (Array.isArray(parsedEmployees)) {
          setEmployees(parsedEmployees);
        }
      }
    } catch (error) {
      console.error("Could not load employees:", error);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Save employees whenever data changes
  useEffect(() => {
    if (!isLoaded) return;

    try {
      localStorage.setItem("employees", JSON.stringify(employees));
    } catch (error) {
      console.error("Could not save employees:", error);
    }
  }, [employees, isLoaded]);

  // Search and department filter
  const filteredEmployees = useMemo(() => {
    const search = searchTerm.trim().toLowerCase();

    return employees.filter((employee) => {
      const name = String(employee.name || "").toLowerCase();
      const email = String(employee.email || "").toLowerCase();

      const matchesSearch =
        name.includes(search) || email.includes(search);

      const matchesDepartment =
        selectedDepartment === "None" ||
        employee.department === selectedDepartment;

      return matchesSearch && matchesDepartment;
    });
  }, [employees, searchTerm, selectedDepartment]);

  // Add a new employee
  const addEmployee = useCallback((newEmployee) => {
    setEmployees((previousEmployees) => [
      ...previousEmployees,
      {
        ...newEmployee,
        status: newEmployee.status || "Active",
      },
    ]);
  }, []);

  // Update an existing employee
  const updateEmployee = useCallback((updatedEmployee) => {
    setEmployees((previousEmployees) =>
      previousEmployees.map((employee) =>
        employee.id === updatedEmployee.id
          ? {
              ...updatedEmployee,
              status: updatedEmployee.status || employee.status || "Active",
            }
          : employee
      )
    );

    setEditingEmployee(null);
  }, []);

  // Open employee in edit mode
  const editEmployee = useCallback((employee) => {
    setEditingEmployee(employee);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  // Cancel editing
  const cancelEdit = useCallback(() => {
    setEditingEmployee(null);
  }, []);

  // Toggle employee status: Active <-> Inactive
  const toggleEmployeeStatus = useCallback((employeeId) => {
    setEmployees((previousEmployees) =>
      previousEmployees.map((employee) => {
        if (employee.id !== employeeId) {
          return employee;
        }

        const currentStatus = employee.status || "Active";

        return {
          ...employee,
          status: currentStatus === "Active" ? "Inactive" : "Active",
        };
      })
    );

    // Keep the editing form in sync if this employee is being edited
    setEditingEmployee((currentEmployee) => {
      if (!currentEmployee || currentEmployee.id !== employeeId) {
        return currentEmployee;
      }

      const currentStatus = currentEmployee.status || "Active";

      return {
        ...currentEmployee,
        status: currentStatus === "Active" ? "Inactive" : "Active",
      };
    });
  }, []);

  // Delete an employee
  const deleteEmployee = useCallback(
    (employeeId) => {
      const confirmed = window.confirm(
        "Are you sure you want to delete this employee?"
      );

      if (!confirmed) return;

      setEmployees((previousEmployees) =>
        previousEmployees.filter(
          (employee) => employee.id !== employeeId
        )
      );

      if (editingEmployee?.id === employeeId) {
        setEditingEmployee(null);
      }
    },
    [editingEmployee]
  );

  return (
    <main className="app-container">
      <header className="top-header">
        <div className="brand">
          <div className="brand-icon">E</div>
          <span>
            Employees<span className="brand-accent">MS</span>
          </span>
        </div>

        <span className="header-label">HR Management</span>
      </header>

      <section className="page-heading">
        <div>
          <p className="eyebrow">PEOPLE & ORGANIZATION</p>
          <h1>Employee Management</h1>
          <p className="page-description">
            Keep your team organized in one place.
          </p>
        </div>

        <div className="total-card">
          <span>Total Employees</span>
          <strong>{employees.length}</strong>
        </div>
      </section>

      <EmployeeForm
        onAddEmployee={addEmployee}
        editingEmployee={editingEmployee}
        onUpdateEmployee={updateEmployee}
        onCancelEdit={cancelEdit}
      />

      <section className="filter-card">
        <div className="filter-heading">
          <h2>Find Employees</h2>
          <p>
            Search by name or email, or filter by department.
          </p>
        </div>

        <div className="filter-controls">
          <div className="search-box">
            <label htmlFor="employee-search">
              Search Employees
            </label>

            <input
              id="employee-search"
              type="search"
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={(event) =>
                setSearchTerm(event.target.value)
              }
            />
          </div>

          <div className="department-filter">
            <label htmlFor="department-filter">
              Filter by Department
            </label>

            <select
              id="department-filter"
              value={selectedDepartment}
              onChange={(event) =>
                setSelectedDepartment(event.target.value)
              }
            >
              <option value="None">None - Show All Employees</option>
              <option value="Engineering">Engineering</option>
              <option value="Human Resources">Human Resources</option>
              <option value="Marketing">Marketing</option>
              <option value="Finance">Finance</option>
              <option value="Design">Design</option>
            </select>
          </div>
        </div>

        <p className="results-count">
          Showing {filteredEmployees.length} of {employees.length} employees
        </p>
      </section>

      {isLoaded ? (
        <EmployeeList
          employees={filteredEmployees}
          onDeleteEmployee={deleteEmployee}
          onEditEmployee={editEmployee}
          onToggleStatus={toggleEmployeeStatus}
        />
      ) : (
        <p className="loading-message">Loading employees...</p>
      )}

      <footer className="app-footer">
        Employee Management System · Built with React
      </footer>
    </main>
  );
}

export default App;