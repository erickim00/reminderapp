let database = require("../reminder/database").database;
const express = require("express");
const app = express();
const path = require("path");
const ejsLayouts = require("express-ejs-layouts");
const session = require("express-session");


app.use(
  session({
    secret: "secret",
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: false,
      maxAge: 24 * 60 * 60 * 1000,
    },
  })
);

const reminderController = require("./controller/reminder_controller");
const authController = require("./controller/userController");
const friendsController = require("./controller/friendsController");
const passport = require("./middleware/passport");
app.use(passport.initialize());
app.use(passport.session());

app.use(express.static(path.join(__dirname, "public")));

app.use(express.urlencoded({ extended: false }));

app.use(ejsLayouts);

app.set("view engine", "ejs");

app.use((req, res, next) => {
  if (req.user) {
    res.locals.user = req.user.email;
  } else {
    res.locals.user = "";
  }
  next();
})

// Routes start here

app.get("/login", (req, res) => {
  res.render("login")
})


app.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/reminders",
    failureRedirect: "/login",
  })
);

app.get('/logout', function (req, res){
  req.session.destroy(function (err) {
  res.redirect('/');
  });
});


app.get("/register", (req, res) => {
  res.render("register")
})


app.post(
  "/register",
  (req, res) => {
    console.log('entered function')
  let { email, password } = req.body;
  console.log(email, password)
  if (email && password) {
    if (Object.values(database).some(user => user.email === email)) {
      console.log('Email already in use.')
      return res.render("register", { error: "Email already in use." });
    }
    let id = Object.keys(database).length + 1;
    database.push({
      id: id,
      email: email,
      password: password,
      reminders: []
    });
    return res.render("login", { success: "You are now registered and can log in." });
  } else {
    console.log('Please enter an email and password.')
    return res.render("register", { error: "Please enter an email and password." });
  }
}
);


app.get("/reminders", reminderController.list);

app.get("/reminder/new", reminderController.new);

app.get("/reminder/:id", reminderController.listOne);

app.get("/reminder/:id/edit", reminderController.edit);

app.post("/reminder/", reminderController.create);

// Implement this yourself
app.post("/reminder/update/:id", reminderController.update);

// Implement this yourself
app.post("/reminder/delete/:id", reminderController.delete);

app.get("/friends/list", friendsController.listFriends);
app.get("/friends/search", friendsController.searchUser);
app.post("/friends/add/:id", friendsController.addFriend);

// // Fix this to work with passport! The registration does not need to work, you can use the fake database for this.
// app.get("/register", authController.register);
// app.post("/register", authController.registerSubmit);

app.listen(3001, function () {
  console.log(
    "Server running. Visit: localhost:3001/reminders in your browser 🚀"
  );
});
