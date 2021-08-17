SELECT 
    roles.id, 
    roles.title,
    department.department_name AS department, 
    roles.salary
FROM roles
JOIN department ON roles.department_id = department.id;