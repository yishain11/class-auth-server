const fs = require("fs");
const bcrypt = require("bcrypt");

function readUsers() {
  const users = JSON.parse(fs.readFileSync("../data/users.json", "utf-8"));
  return users;
}

function storeUserData(username, password) {
  const users = readUsers();
  users.push({ username, password });
  fs.writeFileSync("../data/users.json", JSON.stringify(users));
}

async function hashPassword(password) {
  const hashed = await bcrypt.hash(password, 10);
  return hashed;
}
async function comparePasswords(username, password) {
  const users = readUsers();
  for (let i = 0; i < users.length; i++) {
    const user = users[i];
    if (user.username === username) {
      const res = await comparePasswordsHash(password, user.password);
      return res;
    }
  }
  return false;
}

async function comparePasswordsHash(userPassword, hashedPasword) {
  const res = await bcrypt.compare(userPassword, hashedPasword);
  return res;
}

module.exports = { storeUserData, hashPassword, comparePasswords };
