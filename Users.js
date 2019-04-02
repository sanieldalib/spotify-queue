const users = {}

const addUser = (user, socket) => {
  users[user] = socket;
  console.log(users);
}

module.exports = {users: users, addUser: addUser};
