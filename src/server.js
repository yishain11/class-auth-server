const http = require("http");
const fs = require("fs");
const auth = require("../services/auth");
const authModule = require("../services/new_auth");
const jwt = require("jsonwebtoken");
const SECRET = "my secret string";

const server = http.createServer(async (req, res) => {
  const { url, method, headers } = req;
  switch (url) {
    case "/":
      fs.createReadStream("../views/home/home.html").pipe(res);
      break;
    case "/home.js":
      fs.createReadStream("../views/home/home.js").pipe(res);
      break;
    case "/login":
      switch (method) {
        case "GET":
          fs.createReadStream("../views/login/login.html").pipe(res);
          break;
        case "POST":
          const buffers = [];
          for await (const chunk of req) {
            buffers.push(chunk);
          }
          const data = JSON.parse(Buffer.concat(buffers).toString());
          const user = data.username;
          const pass = data.password;
          const results = await authModule.comparePasswords(user, pass);
          let token;
          if (results) {
            token = jwt.sign({ name: user, isAuthenticated: true }, SECRET, {
              expiresIn: "1h",
            });
            console.log("token", token);
          }
          res.end(JSON.stringify({ msg: `login res is: ${results}` }));
          break;
      }
      break;
    case "/login.js":
      fs.createReadStream("../views/login/login.js").pipe(res);
      break;
    case "/signin":
      switch (method) {
        case "GET":
          fs.createReadStream("../views/signin/signin.html").pipe(res);
          break;
        case "POST":
          const buffers = [];
          for await (const chunk of req) {
            buffers.push(chunk);
          }
          const data = JSON.parse(Buffer.concat(buffers).toString());
          const user = data.username;
          const pass = data.password;
          const hashed = await authModule.hashPassword(pass);
          authModule.storeUserData(user, hashed);
          res.end(JSON.stringify({ msg: "user stored" }));
          break;
      }
      break;
    case "/signin.js":
      fs.createReadStream("../views/signin/signin.js").pipe(res);
      break;
    case "/private":
      fs.createReadStream("../views/private/private.html").pipe(res);
      break;
    case "/private.js":
      fs.createReadStream("../views/private/private.js").pipe(res);
      break;
    case "/auth":
      const buffers = [];
      for await (const chunk of req) {
        buffers.push(chunk);
      }
      const data = JSON.parse(Buffer.concat(buffers).toString());
      const user = data.username;
      const pass = data.password;
  }
});

server.listen(3232, () => {
  console.log("server listening on 3232");
});
