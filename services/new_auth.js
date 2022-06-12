const fs = require("fs");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

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

function checkToken(token, secret) {
  try {
    const res = jwt.verify(token, secret);
    return true;
  } catch (error) {
    console.log("error", error);
    return false;
  }
}

module.exports = { checkToken, storeUserData, hashPassword, comparePasswords };
