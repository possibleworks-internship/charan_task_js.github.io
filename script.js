var arr = [];
let newdata = {};
const context = document.querySelector(".main");

//form inputs
let name1 = document.querySelector("#name");
let username = document.querySelector("#uname");
let email = document.querySelector("#uemail");
let number = document.querySelector("#pnumber");
const submit = document.querySelector(".submit");

//creating a block
const block = function (maindata, index = 0) {
  maindata.forEach((data, i) => {
    let html = `
        <div class="main__row" id='mainrow--${index ? index : i}'>
            <div class="stylediv" id="input_add--${index ? index : i}">
            <label for="main__name">Name:</label>
            <span class="main__name" id="add--${index ? index : i}">${
      data.name
    }</span>
            </div>
            <div class="stylediv">
            <label for="main__uname">Username:</label>
            <span class="main__uname">${data.username}</span>
            </div>
            <div class="stylediv">
            <label for="main__number">Phone Number:</label>
            <span class="main__number">${data.phone}</span>
            </div>
            <div class="stylediv" id="btn_add--${index ? index : i}">
            <button class="update update--${index ? index : i}">UPDATE</button>
            </div>
            <div class="stylediv">
            <button class='delete delete-${
              index ? index : i + 1
            }'>DELETE</button>
            </div>
        <div>`;
    context.insertAdjacentHTML("beforeend", html);
  });
  deleteButton();
  updatebutton();
};

//fetching data and storing to local storage
const fetchData = async function () {
  const response = await fetch("https://jsonplaceholder.typicode.com/users");
  const data = await response.json();
  window.localStorage.setItem("usersdata", JSON.stringify(data));
  let webdata = window.localStorage.getItem("usersdata");
  arr.push(JSON.parse(webdata));
  let maindata = arr.flat(1);
  console.log(maindata);
  block(maindata);
  search(maindata);
};
fetchData();

//adding new data
const formdata = document.querySelector("#formdata");
formdata.addEventListener("submit", function (e) {
  e.preventDefault();
  const newdata = Array.from(
    document.querySelectorAll("#formdata input")
  ).reduce((acc, input) => ({ ...acc, [input.id]: input.value }), {});
  console.log(newdata);
  fetch("https://jsonplaceholder.typicode.com/users", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(newdata),
  })
    .then((response) => response.json())
    .then((data) => {
      arr = JSON.parse(window.localStorage.getItem("usersdata"));
      const i = arr.length;
      console.log(arr);
      arr.push(data);
      window.localStorage.setItem("usersdata", JSON.stringify(arr));
      let [newone] = arr.slice(-1);
      block([newone], i);
    });
});

//deleting the data

const deleteButton = async function () {
  var del_btn = await document.getElementsByClassName("delete");
  [...del_btn].forEach((ele) => {
    ele.addEventListener("click", function (e) {
      e.preventDefault();
      let del_class= ele.className;
      let del_sld = del_class.slice(7);
      console.log(del_sld);
      let del_id = del_sld.match(/(\d+)/)[0];
      console.log(del_id);

      fetch(`https://jsonplaceholder.typicode.com/users/${del_id}`, {
        method: "DELETE",
      })
        .then((response) => response.json())
        .then((data) => {
          let del = document.getElementById(`mainrow--${del_id - 1}`);
          console.log(del);
          context.removeChild(del);
        });
    });
  });
};

//updating data
const updatebutton = async function () {
  var update_btn = await document.getElementsByClassName("update");
  [...update_btn].forEach((ele) => {
    ele.addEventListener("click", function (e) {
      let upd = ele.className;
      let upd_sld = upd.slice(8);
      let upd_id = upd_sld.match(/(\d+)/)[0];
      var add_input = document.createElement("input");
      add_input.type = "text";
      add_input.placeholder = "Update your name here";
      const add = document.getElementById(`input_add--${upd_id}`);
      add.appendChild(add_input);
      ele.classList.add("hidden");
      let add_button_save = document.createElement("button");
      add_button_save.textContent = "SAVE";
      add_button_save.classList.add(`btn_save--${upd_id}`);
      const add_bt = document.getElementById(`btn_add--${upd_id}`);
      const name_input = document.getElementById(`add--${upd_id}`);
      add_bt.appendChild(add_button_save);
      add_button_save.addEventListener("click", function (e) {
        e.preventDefault();
        let add_new = add_input.value;
        if (add_new === "") return;
        fetch(`https://jsonplaceholder.typicode.com/users/${upd_id}`, {
          method: "PATCH",
          body: JSON.stringify({
            name: add_new,
          }),
          headers: {
            "Content-type": "application/json; charset=UTF-8",
          },
        })
          .then((response) => response.json())
          .then((data) => {
            name_input.textContent = "";
            name_input.textContent = data.name;
            ele.classList.remove("hidden");
            add_button_save.classList.add("hidden");
            add_input.classList.add("hidden");
          });
      });
    });
  });
};

//searching for data
const main_search = function (data) {
  document
    .querySelector(".search_button")
    .addEventListener("click", function (e) {
      e.preventDefault();
      let search_data = document.querySelector(".search").value;
      let value = data.filter((el) => el.name.includes(search_data));
      value.forEach((ele) => {
        let index = ele.id;
        document
          .getElementById(`mainrow--${index - 1}`)
          .classList.add("add_color");
      });
    });
};

const search = async function (data) {
  return main_search(data);
};
