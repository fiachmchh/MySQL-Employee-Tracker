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

// function displayTable(){

// }



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

                case "Would you like to update roles":
                    employeeUpdate();
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
                    runSearch()
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
                    runSearch()
                })
        })

}

function employeeAdd() {
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
            }
        ])
        .then(function (answer) {
            connection.query(
                "INSERT INTO employee SET ?",
                {
                    first_name: answer.empName,
                    last_name: answer.empName2,
                },

                function (err, res) {
                    if (err) throw err;
                    console.log(res.affectedRows + " product inserted!\n");
                    // Call updateProduct AFTER the INSERT completes
                    runSearch()
                })
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
                // get the information of the chosen item
                var chosenItem;
                for (var i = 0; i < res.length; i++) {
                    if (res[i].title === answer.choice) {
                        chosenItem = res[i];
                    }

                    connection.query(
                        "UPDATE role SET ? WHERE ?",
                        [
                            {
                                title: answer.roleUpdate
                            },
                            {
                                id: chosenItem.id
                            }
                        ],
                        function (error) {
                            if (error) throw err;
                            console.log("role replaced!");
                            runSearch();
                        }
                    );
                }
                // else {
                //   // bid wasn't high enough, so apologize and start over
                //   console.log("Your bid was too low. Try again...");
                //   start();
                // }
            });

    })
}

