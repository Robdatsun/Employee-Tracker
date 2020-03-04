const mysql = require('mysql');
const db = {};
const connection = mysql.createPool({
  host     : 'localhost',
  user     : 'root',
  password : 'Frontier280',
  database : 'employees'
});


db.allEmployeesInfo = () => {
  return new Promise((resolve, reject) => {
    connection.query(`
    SELECT 
      employee.id as "employee id", 
      employee.first_name as "first name", 
      employee.last_name as "last name", 
      role.title as "job title", 
      role.salary, 
      department.name as department 
    FROM employee  
    JOIN role  
      ON employee.role_id=role.id 
    JOIN department  
      ON role.department_id = department.id 
    ORDeR BY employee.id ASC`, (err, result) => {
      if(err) return reject(err);
      return resolve(result);
    })
  })
}

db.findAllEmployees = () => {
  return new Promise((resolve, reject) => {
    connection.query(`SELECT * FROM employee`, (err, result) => {
      if(err) return reject(err);
      return resolve(result);
    });
  });
};

db.findAllDepartments = () => {
  return new Promise((resolve, reject) => {
    connection.query(`SELECT * FROM department`, (err, result) => {
      if(err) return reject(err);
      return resolve(result);
    });
  });
};

db.findAllRoles = () => {
  return new Promise((resolve, reject) => {
    connection.query(`SELECT * FROM role`, (err, result) => {
      if(err) return reject(err);
      return resolve(result);
    });
  });
};

db.findAllEmployeesByDepartment = (departmentId) => {
  return new Promise((resolve, reject) => {
    connection.query(`
    SELECT 
      department.name, 
      employee.first_name, 
      employee.last_name 
    FROM employee 
    JOIN role 
      ON employee.role_id=role.id 
    JOIN department  
      ON department.id=role.department_id 
    WHERE role.department_id = ?`, [ departmentId ], (err, result) => {
      if(err) return reject(err);
      return resolve(result);
    });
  });
};

db.findAllEmployeesByManager = (managerId) => {
  return new Promise((resolve, reject) => {
    connection.query(`SELECT * FROM employee WHERE manager_id = ?`, [ managerId ], (err, result) => {
      if(err) return reject(err);
      return resolve(result);
    });
  });
};


db.updateEmployeeRole = (employeeId, roleId) => {
  return new Promise((resolve, reject) => {
    connection.query(`UPDATE employee SET role_id = ? WHERE id = ?`, [ roleId, employeeId ], (err, result) => {
      if(err) return reject(err);
      return resolve(result);
    });
  });
};

db.findAllPossibleManagers = (employeeId) => {
  return new Promise((resolve, reject) => {
    connection.query(`SELECT * FROM employee WHERE id != ?`, [ employeeId ], (err, result) => {
      if(err) return reject(err);
      return resolve(result);
    })
  })
}

db.updateEmployeeManager = (employeeId, managerId) => {
  return new Promise((resolve, reject) => {
    connection.query(`UPDATE employee SET manager_id = ? WHERE id = ?`, [ managerId, employeeId ], (err, result) => {
      if(err) return reject(err);
      return resolve(result);
    });
  });
};

db.createDepartment = (department) => {
  return new Promise((resolve, reject) => {
    connection.query(`INSERT INTO department (name) 
    VALUES (?)`, [ department ], (err, result) => {
      if(err) return reject(err);
      return resolve(result);
    });
  });
};


db.createEmployee = (employee) => {
  return new Promise((resolve, reject) => {
    connection.query(`INSERT INTO employee 
    (first_name, last_name, role_id, manager_id) VALUES (?,?,?,?)`, [employee.first_name,employee.last_name, employee.role_id, employee.manager_id], (err, result) => {
      if(err) return reject(err);
      return resolve(result);
    });
  });
};
module.exports = db;