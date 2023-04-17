const database = [
    {
      id: 1,
      name: "Jimmy Smith",
      email: "jimmy123@gmail.com",
      password: "jimmy123!", 
      reminders: [
      {id: 1, title: "something", completed: false, description: "something",  subtasks: ["do also", "as well as this"], tags: ["groceries", "chore"], date: "2023-04-25"}, 
      {id: 2, title: "something2", completed: true, description: "something2"}],
      friends: [],
    },
    {
      id: 2,
      name: "Johnny Doe",
      email: "johnny123@gmail.com",
      password: "johnny123!",
      reminders: [],
      friends: [],
    },
    {
      id: 3,
      name: "Jonathan Chen",
      email: "jonathan123@gmail.com",
      password: "jonathan123!",
      reminders: [{id: 1, title: "something else", completed: false, description: "something"}],
      friends : [],
    },
  ];
  
  const userModel = {
    findOne: (email) => {
      const user = database.find((user) => user.email === email);
      if (user) {
        return user;
      }
      throw new Error(`Couldn't find user with email: ${email}`);
    },
    findById: (id) => {
      const user = database.find((user) => user.id === id);
      if (user) {
        return user;
      }
      throw new Error(`Couldn't find user with id: ${id}`);
    },
    searchUser: (search) => {
      return database.filter(
        (user) =>
        user.name.toLowerCase().includes(search.toLowerCase()) ||
        user.email.toLowerCase().includes(search.toLowerCase())
      );
    },
  };
  
  module.exports = { database, userModel };
  