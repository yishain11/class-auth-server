const btn = document.getElementById("logOutBtn");
console.log("btn", btn);
btn.addEventListener("click", () => {
  document.cookie = "token= ; expires = Thu, 01 Jan 1970 00:00:00 GMT";
});
