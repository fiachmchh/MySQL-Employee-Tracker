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
    runSearch()

});

function runSearch() {
    inquirer
        .prompt({
            name: "action",
            type: "rawlist",
            message: "What would you like to do?",
            choices: [
                "View departments",
                "View roles",
                "View employees",
                "Add a department",
                "Add a role",
                "Add an employee",
                "Update roles"
            ]
        })

        .then(function (answer) {
            console.log(answer)
            switch (answer.action) {
                case "View departments":
                    departmentSearch();
                    break;

                case "View roles":
                    roleSearch();
                    break;

                case "View employees":
                    employeeSearch();
                    break;

                case "Add a department":
                    departmentAdd();
                    break;

                case "Add a role":
                    roleAdd();
                    break;

                case "Add an employee":
                    // employeeAdd();
                    chooseJob();
                    break;

                case "Update roles":
                    employeeUpdate();
                    break;
            }
        });
}


function departmentSearch() {
    connection.query("SELECT name FROM department", function (err, res) {
        console.table(res)
        runSearch()
    })

}

function roleSearch() {
    connection.query("SELECT title, salary, name FROM role INNER JOIN department ON role.department_id = department.id", function (err, res) {
        console.table(res)
        runSearch()
    })
}

function employeeSearch() {

    connection.query("SELECT first_name, last_name, title, salary, name FROM employee LEFT JOIN role ON employee.role_id = role.id LEFT JOIN department ON role.department_id = department.id", function (err, res) {
        console.table(res)
        runSearch()
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
                    runSearch()
                })
        })
}

function roleAdd() {
    inquirer
        .prompt([
            {
                name: "roleName",
                type: "input",
                message: "What is the new role?",
            },
            {
                name: "salary",
                type: "input",
                message: "What is the salary of the new role?",
            }

        ])
        .then(function (answer) {
            connection.query(
                "INSERT INTO role SET ?",
                {
                    title: answer.roleName,
                    salary: answer.salary,
                },
                function (err, res) {
                    if (err) throw err;
                    console.log(res.affectedRows + " product inserted!\n");
                    // Call updateProduct AFTER the INSERT completes
                    runSearch()
                })
        })
}

// function employeeAdd() {
//     inquirer
//         .prompt([
//             {
//                 name: "empName",
//                 type: "input",
//                 message: "What is the employee's first name?",
//             },
//             {
//                 name: "empName2",
//                 type: "input",
//                 message: "What is the employee's last name?",
//             }
//         ])
//         .then(function (answer) {
//             connection.query(
//                 "INSERT INTO employee SET ?",
//                 {
//                     first_name: answer.empName,
//                     last_name: answer.empName2,
//                 },

//                 function (err, res) {
//                     if (err) throw err;
//                     console.log(res.affectedRows + " product inserted!\n");
//                     // Call updateProduct AFTER the INSERT completes
//                     runSearch()
//                 })
//         })
// }

function chooseJob() {

    connection.query("SELECT id, title FROM role", function (err, res) {
        if (err) throw err;
        inquirer
            .prompt([
                {
                    name: "empName",
                    type: "input",
                    message: "What is the employee's first name?",
                },
                {
                    name: "empName2",
                    type: "input",
                    message: "What is the employee's last name?",
                },
                {
                    name: "choice",
                    type: "rawlist",
                    choices: function () {
                        var choiceArray = [];
                        for (var i = 0; i < res.length; i++) {
                            choiceArray.push(res[i].id);
                        }
                        return choiceArray;
                        
                    },
                    message: "What is the new employees role?"
                    
                },
                
                
                

            ])
            .then(function (answer) {
                // get the information of the chosen item
                connection.query(
                    "INSERT INTO employee SET ?",
                    {
                        first_name: answer.empName,
                        last_name: answer.empName2,
                        role_id: answer.choice
                    },
                    function (error) {
                        if (error) throw err;
                        console.log("new role added");
                        runSearch();
                    }
                );
            });
    })
}

function employeeUpdate() {

    connection.query("SELECT * FROM role", function (err, res) {
        if (err) throw err;
        // once you have the items, prompt the user for which they'd like to bid on
        // console.log(res)
        inquirer
            .prompt([
                {
                    name: "choice",
                    type: "rawlist",
                    choices: function () {
                        var choiceArray = [];
                        for (var i = 0; i < res.length; i++) {
                            choiceArray.push(res[i].title);
                        }
                        return choiceArray;
                    },
                    message: "Which role would you like to update?"
                },
                {
                    name: "roleUpdate",
                    type: "input",
                    message: "What is the new role?"
                }
            ])

            .then(function (answer) {


                connection.query(
                    "UPDATE role SET ? WHERE ?",
                    [
                        {
                            title: answer.roleUpdate
                        },
                        {
                            title: answer.choice
                        }
                    ],
                    function (error) {
                        if (error) throw err;
                        console.log("role replaced!");
                        runSearch();
                    }
                );
            });

    })
}

