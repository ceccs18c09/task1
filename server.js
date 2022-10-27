const experss = require("express");
const fs = require("fs");

const app = experss();

app.use(experss.json());

app.use("/", (req, res, next) => {
  const auth = req.headers.authorization;
  const credentials = Buffer.from(auth.split(" ")[1], "base64")
    .toString("ascii")
    .split(":");

  if (credentials[0] === "super" && credentials[1] === "super") {
    next();
  } else {
    res.send("Unauthorized");
  }
});

app.get("/api/employees", (req, res) => {
  const employees = JSON.parse(fs.readFileSync("employees.json", "utf8"));
  res.send(employees);
});

app.get("/api/employees/:id", (req, res) => {
  const employeeId = parseInt(req.params.id);
  const employees = JSON.parse(fs.readFileSync("employees.json", "utf8"));

  let employee = null;
  employees.forEach((emp) => {
    if (emp.Id === employeeId) {
      employee = emp;
    }
  });

  if (employee) {
    res.send(employee);
  } else {
    res.send("Not Found");
  }
});

app.post("/api/employees", (req, res) => {
  const employee = req.body;
  const employees = JSON.parse(fs.readFileSync("employees.json", "utf8"));

  if (employee.Id && employee.Name && employee.Age) {
    employees.push(employee);
    fs.writeFileSync("employees.json", JSON.stringify(employees));

    res.send(employee);
  } else {
    res.send("Validation Error");
  }
});

app.delete("/api/employees/:id", (req, res) => {
  const employeeId = parseInt(req.params.id);
  let employees = JSON.parse(fs.readFileSync("employees.json", "utf8"));

  employees = employees.filter((employee) => {
    return employee.Id !== employeeId;
  });

  fs.writeFileSync("employees.json", JSON.stringify(employees));

  res.send(employees);
});

app.listen(3000, () => {
  console.log("Listening to port " + 3000);
});
