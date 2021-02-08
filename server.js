// Build a command-line application that at a minimum allows the user to:

//   * Add departments, roles, employees

//   * View departments, roles, employees

//   * Update employee roles

// Bonus points if you're able to:

//   * Update employee managers

//   * View employees by manager

//   * Delete departments, roles, and employees

//   * View the total utilized budget of a department -- ie the combined salaries of all employees in that department


var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
    host: "localhost",

    // Your port; if not 3306
    port: 3306,

    // Your username
    user: "root",

    // Your password
    password: "chvfeevd829",
    database: "EmployeesDB"
});

connection.connect(function (err) {
    if (err) throw err;

});



function runSearch() {
    inquirer
        .prompt({
            name: "action",
            type: "rawlist",
            message: "What would you like to do?",
            choices: [
                "Do you want to add a department",
                "Do you want to add a role",
                "Do you want to add an employee",
                "Would you like to view departments",
                "Would you like to view roles",
                "Would you like to view employees",
                "Would you like to update roles"
            ]
        })

        .then(function (answer) {
            console.log(answer)
            switch (answer.action) {
                case "Would you like to view departments":
                    departmentSearch();
                    break;

                case "Would you like to view roles":
                    roleSearch();
                    break;

                case "Would you like to view employees":
                    employeeSearch();
                    break;

                case "Do you want to add a department":
                    departmentAdd();
                    break;

                case "Do you want to add a role":
                    roleAdd();
                    break;

                case "Do you want to add an employee":
                    employeeAdd();
                    break;
            }
        });
}
runSearch()

function departmentSearch() {
    connection.query("SELECT * FROM EmployeesDB.department", function (err, res) {
        console.table(res)
    })

}

function roleSearch() {
    connection.query("SELECT * FROM role", function (err, res) {
        console.table(res)
    })

}

function employeeSearch() {
    connection.query("SELECT * FROM employee", function (err, res) {
        console.table(res)
    })

}

function departmentAdd() {
    inquirer
        .prompt({
            name: "deptName",
            type: "input",
            message: "What is the new department?",
        })
        .then(function (answer) {
            connection.query(
                "INSERT INTO department SET ?",
                {
                    name: answer.deptName,
                },
                function (err, res) {
                    if (err) throw err;
                    console.log(res.affectedRows + " product inserted!\n");
                    // Call updateProduct AFTER the INSERT completes
                })
        })
}

function roleAdd() {
    inquirer
        .prompt({
            name: "roleName",
            type: "input",
            message: "What is the new role?",
        })
        .then(function (answer) {
            connection.query(
                "INSERT INTO role SET ?",
                {
                    title: answer.roleName,
                },
                function (err, res) {
                    if (err) throw err;
                    console.log(res.affectedRows + " product inserted!\n");
                    // Call updateProduct AFTER the INSERT completes
                })
        })
}

function employeeAdd() {
    inquirer
        .prompt([
            {
                name: "empName",
                type: "input",
                message: "What is the new employee's first name?",
            },
            {
                name: "empName2",
                type: "input",
                message: "What is the new new employee's last name?",
            }
        ])
        .then(function (answer) {
            connection.query(
                "INSERT INTO employee SET ?",
                {
                    first_name: answer.empName,
                    last_name: answer.empName2,
                },
                // {
                //     last_name: answer.empName2,

                // },
                function (err, res) {
                    if (err) throw err;
                    console.log(res.affectedRows + " product inserted!\n");
                    // Call updateProduct AFTER the INSERT completes
                })
        })
}

// function lastNameAdd() {
//     inquirer
//         .prompt({
//             name: "empName2",
//             type: "input",
//             message: "What is the new new employee's last name?",
//         })
//         .then(function (answer) {
//             connection.query(
//                 "INSERT INTO employee SET ?",
//                 {
//                     last_name: answer.empName2,
//                 },
//                 function (err, res) {
//                     if (err) throw err;
//                     console.log(res.affectedRows + " product inserted!\n");
//                     // Call updateProduct AFTER the INSERT completes
//                 })
//        })

// }

