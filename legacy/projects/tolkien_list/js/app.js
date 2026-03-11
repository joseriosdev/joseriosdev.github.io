class Member {
  constructor(name, lastName, age, id, type) {
    this.name = name;
    this.lastName = lastName;
    this.age = age;
    this.id = id;
    this.type = type;
  }
}

class UI {
  static addMemberToList(member) {
    const list = document.getElementById("club-list");
    const row = document.createElement("tr");

    row.innerHTML = `
      <td>${member.name}</td>
      <td>${member.lastName}</td>
      <td>${member.id}</td>
      <td>${member.age}</td>
      <td>${member.type}</td>
      <td><a href="#" class="text-danger text-decoration-none fw-bold" id="delete">X</a></td>
    `;
    list.appendChild(row);
  }

  static showAlert(message, className) {
    const boxMessage = document.createElement("div");
    boxMessage.className = `text-white alert-message text-center ${className}`;
    boxMessage.appendChild(document.createTextNode(message));

    const container = document.querySelector(".container");
    const form = document.getElementById("form");
    container.insertBefore(boxMessage, form); // insertBefore method needs a parent element

    setTimeout(() => document.querySelector(".alert-message").remove(), 3000);
  }

  static deleteMember(target) {
    if(target.id === "delete") {
      target.parentElement.parentElement.remove();
    }
  }

  static clearFields() {
    document.getElementById("name").value = "";
    document.getElementById("last-name").value = "";
    document.getElementById("age").value = "";
    document.getElementById("id").value = "";
    document.getElementById("folk-type").value = "";
  }
}

class Storage {
  static getMembers() {
    let members = localStorage.getItem("members") === null ? [] : JSON.parse(localStorage.getItem("members"));
    return members;
  }

  static displayMembers() {
    const members = Storage.getMembers();
    members.forEach(member => UI.addMemberToList(member));
  }

  static addMember(member) {
    const members = Storage.getMembers();
    members.push(member);
    localStorage.setItem("members", JSON.stringify(members));
  }

  static removeMemeber(id) {
    const members = Storage.getMembers();
    members.forEach((member, index) => {
      if(member.id === id) {
        members.splice(index, 1);
      }
    });
    localStorage.setItem("members", JSON.stringify(members));
  }
}

document.addEventListener("DOMContentLoaded", Storage.displayMembers);

document.getElementById("form").addEventListener("submit", (evt) => {
  const name = document.getElementById("name").value;
  const lastName = document.getElementById("last-name").value;
  const age = document.getElementById("age").value;
  const memberid = document.getElementById("id").value;
  const memberType = document.getElementById("folk-type").value;
  const member = new Member(name, lastName, age, memberid, memberType);

  if(name==="" || lastName==="" || age==="" || memberid==="" || memberType==="") {
    UI.showAlert("Please fill up the form", "bg-danger");
  } else {
    UI.addMemberToList(member);
    Storage.addMember(member);
    UI.showAlert("Member Added :D", "bg-success");
    UI.clearFields();
  }

  evt.preventDefault();
});

document.getElementById("club-list").addEventListener("click", (evt) => {
  UI.deleteMember(evt.target);
  Storage.removeMemeber(evt.target.parentElement.previousElementSibling.previousElementSibling.previousElementSibling.textContent);
  UI.showAlert("Member removed", "bg-success");
  evt.preventDefault();
});