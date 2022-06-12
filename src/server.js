const http = require("http");
const fs = require("fs");
const auth = require("../services/auth");

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
      fs.createReadStream("../views/login/login.html").pipe(res);
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
          console.log("data in signin", data);
          const user = data.username;
          const pass = data.password;
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
