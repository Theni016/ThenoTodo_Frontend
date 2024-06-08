document.addEventListener("DOMContentLoaded", function () {
  showTask();
});

const inputBox = document.getElementById("input-box");
const listContainer = document.getElementById("list-container");

function addTask() {
  if (inputBox.value === "") {
    alert("Invalid Input");
  } else {
    fetch("http://localhost:3000/addtask", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ task: inputBox.value }),
    })
      .then((response) => response.text())
      .then((data) => {
        console.log(data);
        showTask();
      })
      .catch((error) => {
        console.error("Error adding task:", error);
      });
  }
  inputBox.value = "";
}

listContainer.addEventListener(
  "click",
  function (e) {
    if (e.target.tagName === "LI") {
      e.target.classList.toggle("checked");
      const taskId = e.target.getAttribute("data-id");
      const status = e.target.classList.contains("checked")
        ? "done"
        : "pending";
      fetch(`http://localhost:3000/updatetask/${taskId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
      })
        .then((response) => response.text())
        .then((data) => {
          console.log(data);
        })
        .catch((error) => {
          console.error("Error updating task:", error);
        });
    } else if (
      e.target.tagName === "SPAN" &&
      e.target.classList.contains("delete")
    ) {
      const taskId = e.target.parentElement.getAttribute("data-id");
      fetch(`http://localhost:3000/deletetask/${taskId}`, {
        method: "DELETE",
      })
        .then((response) => response.text())
        .then((data) => {
          console.log(data);
          showTask();
        })
        .catch((error) => {
          console.error("Error deleting task:", error);
        });
    } else if (
      e.target.tagName === "IMG" &&
      e.target.parentElement.classList.contains("edit")
    ) {
      const li = e.target.parentElement.parentElement;
      const taskId = li.getAttribute("data-id");
      const taskText = li.childNodes[0].nodeValue.trim();
      const input = document.createElement("input");
      input.type = "text";
      input.value = taskText;
      input.onblur = function () {
        const newTask = input.value;
        fetch(`http://localhost:3000/updatetask/${taskId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ task: newTask }),
        })
          .then((response) => response.text())
          .then((data) => {
            console.log(data);
            showTask();
          })
          .catch((error) => {
            console.error("Error updating task:", error);
          });
      };
      li.innerHTML = "";
      li.appendChild(input);
      input.focus();
    }
  },
  false
);

function showTask() {
  fetch("http://localhost:3000/tasks")
    .then((response) => response.json())
    .then((data) => {
      listContainer.innerHTML = "";
      data.forEach((task) => {
        let li = document.createElement("li");
        li.innerHTML = task.task;
        li.setAttribute("data-id", task.id);
        li.setAttribute("draggable", "true");
        li.setAttribute("ondragstart", "drag(event)");
        if (task.status === "done") {
          li.classList.add("checked");
        }
        let spanEdit = document.createElement("span");
        spanEdit.classList.add("edit");
        let editImg = document.createElement("img");
        editImg.src = "resources/edit.png";
        spanEdit.appendChild(editImg);
        li.appendChild(spanEdit);
        let spanDelete = document.createElement("span");
        spanDelete.classList.add("delete");
        spanDelete.innerHTML = "\u00d7";
        li.appendChild(spanDelete);
        listContainer.appendChild(li);
      });
    })
    .catch((error) => {
      console.error("Error fetching tasks:", error);
    });
}

function toggleDarkMode() {
  const body = document.body;
  body.classList.toggle("dark-mode");
}
