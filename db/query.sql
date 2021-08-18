SELECT 
    emp.id, 
    emp.first_name,
    emp.last_name,
    roles.title,
    department.name AS department,
    roles.salary,
    CONCAT(man.first_name, ' ', man.last_name) AS manager
FROM employee emp
JOIN roles
    ON emp.role_id = roles.id
JOIN department
    ON department.id = roles.department_id
LEFT JOIN employee man
    ON emp.manager_id = man.id