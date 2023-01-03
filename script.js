var usersData = [];
let newdata = {};
const containerBlock = document.querySelector(".main");

//form inputs
let name1 = document.querySelector("#name");
let username = document.querySelector("#username");
let email = document.querySelector("#email");
let number = document.querySelector("#phone");
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
              index ? index : i
            }'>DELETE</button>
            </div>
        <div>`;
    containerBlock.insertAdjacentHTML("beforeend", html);
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
  usersData.push(JSON.parse(webdata));
  let maindata = usersData.flat(1);
  console.log(maindata);
  block(maindata);
};
if (window.localStorage.getItem("usersdata")) {
  usersData = JSON.parse(window.localStorage.getItem("usersdata"));
  block(usersData);
} else {
  fetchData();
}

// fetchData();

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
      usersData = JSON.parse(window.localStorage.getItem("usersdata"));
      const i = usersData.length;
      console.log(usersData);
      usersData.push(data);
      window.localStorage.setItem("usersdata", JSON.stringify(usersData));
      let [newAddeddata] = usersData.slice(-1);
      block([newAddeddata], i);
    });
  name1.value = username.value = email.value = number.value = "";
});

//deleting the data

function deleteButton() {
  var delBtnlist = document.getElementsByClassName("delete");
  [...delBtnlist].forEach((ele) => {
    ele.addEventListener("click", function (e) {
      e.preventDefault();
      let delBtnClasses = ele.className;
      let sliceData = delBtnClasses.slice(7);
      console.log(sliceData);
      let delId = sliceData.match(/(\d+)/)[0];
      console.log(delId);
      if (confirm("Want to delete?")) {
        fetch(`https://jsonplaceholder.typicode.com/users/${delId}`, {
          method: "DELETE",
        })
          .then((response) => response.json())
          .then((data) => {
            let del = document.getElementById(`mainrow--${delId}`);
            console.log(del);
            containerBlock.removeChild(del);
            usersData = JSON.parse(window.localStorage.getItem("usersdata"));
            usersData.splice(delId, 1);
            window.localStorage.setItem("usersdata", JSON.stringify(usersData));
          });
      }
    });
  });
}

//updating data
function updatebutton() {
  var updateBtnlist = document.getElementsByClassName("update");
  [...updateBtnlist].forEach((ele) => {
    ele.addEventListener("click", function (e) {
      let updBtnClasses = ele.className;
      let sliceData = updBtnClasses.slice(8);
      let updId = sliceData.match(/(\d+)/)[0];
      var addInput = document.createElement("input");
      addInput.type = "text";
      addInput.placeholder = "Update your name here";
      const inputDiv = document.getElementById(`input_add--${updId}`);
      inputDiv.appendChild(addInput);
      ele.classList.add("hidden");
      let addBtnsave = document.createElement("button");
      addBtnsave.textContent = "SAVE";
      addBtnsave.classList.add(`btn_save--${updId}`);
      const updateDiv = document.getElementById(`btn_add--${updId}`);
      const nameFieldvalue = document.getElementById(`add--${updId}`);
      updateDiv.appendChild(addBtnsave);
      addBtnsave.addEventListener("click", function (e) {
        e.preventDefault();
        let newInputname = addInput.value;
        if (newInputname === "") return;
        fetch(`https://jsonplaceholder.typicode.com/users/${updId}`, {
          method: "PATCH",
          body: JSON.stringify({
            name: newInputname,
          }),
          headers: {
            "Content-type": "application/json; charset=UTF-8",
          },
        })
          .then((response) => response.json())
          .then((data) => {
            nameFieldvalue.textContent = "";
            nameFieldvalue.textContent = data.name;
            ele.classList.remove("hidden");
            addBtnsave.classList.add("hidden");
            addInput.classList.add("hidden");
            usersData = JSON.parse(window.localStorage.getItem("usersdata"));
            usersData[updId].name = data.name;
            window.localStorage.setItem("usersdata", JSON.stringify(usersData));
          });
      });
    });
  });
}

//searching for data
let check=0;
var value;
const remove=function(removeData){
  removeData.forEach((_, i) => {
    let cls = document.getElementById(`mainrow--${i}`);
    containerBlock.removeChild(cls);
  });
}
document
  .querySelector(".search_button")
  .addEventListener("click", function (e) {
    e.preventDefault();
    let searchInputdata = document.querySelector(".search").value.toLowerCase();
    console.log(searchInputdata);
    if (searchInputdata === "") {
      alert("No data found or please enter valid data")
    }
    if(check==0){
      remove(usersData)
      check+=1
    }
    else{
      remove(filteredData)
    }
    filteredData = usersData.filter((el) => el.name.toLowerCase().includes(searchInputdata));
    block(filteredData);
  });
