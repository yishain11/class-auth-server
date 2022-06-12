// const bcrypt = require("bcrypt");
// const fs = require("fs");
// const jwt = require("jsonwebtoken");
const SECRET = "my secret";
function generateToken(data) {
  const token = jwt.sign(data, SECRET, { expiresIn: 64000 });
  console.log("token", token);
  return token;
}

function checkToken(token) {
  const res = jwt.verify(token, SECRET);
  console.log("res checkToken", res);
  return res;
}

async function checkPassword(user, pass) {
  const users = JSON.parse(fs.readFileSync("../data/users.json", "utf-8"));
  for (let i = 0; i < users.length; i++) {
    const userObj = users[i];
    if (userObj.user === user) {
      const storedPass = userObj.pass;
      try {
        const res = await bcrypt.compare(pass, storedPass);
        console.log("res", res);
        return res;
      } catch (error) {
        console.log("error", error);
        return false;
      }
    }
  }
}

async function genPassword(user, pass) {
  try {
    const res = await bcrypt.hash(pass, 10);
    const storedUsers = JSON.parse(
      fs.readFileSync("../data/users.json", "utf-8")
    );
    storedUsers.push({ user, pass: res });
    fs.writeFileSync("../data/users.json", JSON.stringify(storedUsers));
    return true;
  } catch (error) {
    console.log("error", error);
    return false;
  }
}

module.exports = { checkPassword, genPassword, generateToken, checkToken };
