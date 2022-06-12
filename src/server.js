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
          await auth.genPassword(user, pass);
          res.end(JSON.stringify({ msg: "signed in" }));
          break;
      }
      break;
    case "/signin.js":
      fs.createReadStream("../views/signin/signin.js").pipe(res);
      break;
    case "/private":
      if (!headers.cookie) {
        res.writeHead(302, {
          location: "/login",
        });
        res.end();
        return;
      } else {
        const token = headers.cookie.replace("token=", "");
        const authRes = auth.checkToken(token);
        if (authRes) {
          fs.createReadStream("../views/private/private.html").pipe(res);
        } else {
          res.writeHead(302, {
            location: "/login",
          });
          res.end();
          return;
        }
      }
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
      console.log("data in auth", data);
      const user = data.username;
      console.log("user in auth", user);
      const pass = data.password;
      console.log("pass in auth", pass);
      const response = await auth.checkPassword(user, pass);
      if (!response) {
        res.writeHead(302, { location: "/signin" });
        return;
      } else {
        const token = auth.generateToken({ msg: "hi token" });
        res.writeHead(302, {
          "Set-Cookie": `token=${token};path=/`,
        });
        res.end(token);
        return;
      }
  }
});

server.listen(3232, () => {
  console.log("server listening on 3232");
});
