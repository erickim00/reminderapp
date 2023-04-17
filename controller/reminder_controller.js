let database = require("../database");

let remindersController = {
  list: (req, res) => {
    const currentUser = req.user;
    if (!currentUser) {
      res.redirect("/login");
    } else {
      const friendReminders = [];
      currentUser.friends.forEach(friendNumber => {
        database.database.forEach(data => {
          if (data.id === friendNumber) {
            friendReminders.push({ name: data.name, reminders: data.reminders });
          }
        });
      });
      res.render("reminder/index", { reminders: currentUser.reminders, friendsReminders: friendReminders });
    }
  },


  new: (req, res) => {
    const currentUser = req.user;
    res.render("reminder/create");
  },

  listOne: (req, res) => {
    const currentUser = req.user;
    let reminderToFind = req.params.id;
    let searchResult = currentUser.reminders.find(function (reminder) {
      return reminder.id == reminderToFind;
    });
    if (searchResult != undefined) {
      res.render("reminder/single-reminder", { reminderItem: searchResult });
    } else {
      res.render("reminder/index", { reminders: currentUser.reminders });
    }
  },

  create: (req, res) => {
    const currentUser = req.user;
    let subtasks = req.body.subtasks ? req.body.subtasks.split(',') : [];
    let tags = req.body.tags ? req.body.tags.split(',') : [];
    let reminder = {
      id: currentUser.reminders.length + 1,
      title: req.body.title,
      description: req.body.description,
      completed: false,
      subtasks: req.body.subtasks ? req.body.subtasks.split(",") : [],
      tags: req.body.tags ? req.body.tags.split(",") : [],
      reminderDate: req.body.reminderDate,
    };
    currentUser.reminders.push(reminder);
    res.redirect("/reminders");
  },
  

  edit: (req, res) => {
    const currentUser = req.user;
    let reminderToFind = req.params.id;
    let searchResult = currentUser.reminders.find(function (reminder) {
      return reminder.id == reminderToFind;
    });
    res.render("reminder/edit", { reminderItem: searchResult });
  },
  
  update: (req, res) => {
    const currentUser = req.user;
    let reminderToFind = req.params.id;
    let searchResult = currentUser.reminders.find(function (reminder) {
      return reminder.id == reminderToFind;
    });
  
    searchResult.title = req.body.title;
    searchResult.description = req.body.description;
    searchResult.completed = req.body.completed === 'true';
    searchResult.subtasks = req.body.subtasks ? req.body.subtasks.split(",") : [];
    searchResult.tags = req.body.tags ? req.body.tags.split(",") : [];
    searchResult.date = req.body.date;
  
    res.redirect("/reminders");
  },
  


  delete: (req, res) => {
    const currentUser = req.user;
    let idToRemove = req.params.id;
    let indexToRemove = -1;
    for (let x = 0; x < currentUser.reminders.length; x++) {
      if (currentUser.reminders[x]['id'] == idToRemove) {
        indexToRemove = x;
        break;
      };
    }

    if (indexToRemove != -1) {
      currentUser.reminders.splice(indexToRemove, 1)
    }
    res.redirect("/reminders");
  }
}

module.exports = remindersController;
