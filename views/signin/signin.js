const form = document.getElementById("f");
document.addEventListener("submit", (e) => {
  e.preventDefault();
  const data = new FormData(form);
  const dataJson = {};
  for (const [key, val] of data.entries()) {
    console.log("val", val);
    console.log("key", key);
    dataJson[key] = val;
  }
  fetch("http://localhost:3232/signin", {
    method: "POST",
    body: JSON.stringify(dataJson),
  })
    .then((res) => res.json())
    .then((res) => {
      console.log("res", res);
      const msgDiv = document.getElementById("msg");
      msgDiv.innerText = res.msg;
      // if (res.msg) {
      //   window.location = "/";
      // }
    });
});
