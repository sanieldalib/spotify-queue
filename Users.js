const users = {}

const addUser = (user, socket) => {
  users[user] = socket;
}

module.exports = {users: users, addUser: addUser};
