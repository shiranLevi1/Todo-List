function onAddClicked() {
    let userTaskElement = document.getElementById("userTask");
    let userTask = userTaskElement.value;
    let userDateElement = document.getElementById("userDate");
    let userDate = userDateElement.value;
    let userTimeElement = document.getElementById("userTime");
    let userTime = userTimeElement.value;
    let container = document.getElementById("container");


    try {
        validateInput(userTask, userDate, userTime);
        notes = saveLocalStorage(userTaskElement, userDateElement, userTimeElement);
        createNewTask(container, notes, notes.length-1);
        cleanInput(userTaskElement, userDateElement, userTimeElement);
    }
    
    catch (error) {
        console.log(error);
    }
}

function onResetClicked() {
    let userTaskElement = document.getElementById("userTask");
    let userDateElement = document.getElementById("userDate");
    let userTimeElement = document.getElementById("userTime");

    cleanInput(userTaskElement, userDateElement, userTimeElement);
    resetFieldsUI();
}

function onDeleteAllClicked() {
    let container = document.getElementById("container");
    container.innerHTML = "";

    window.localStorage.clear();
}

showTasks();


function validateInput(userTask, userDate, userTime) {

    let isValid = true;

    resetFieldsUI();
    cleanErrorFromTextArea();

    if (isEmptyField(userDate)) {
        markAsError("userDate");
        isValid = false;
    }
    if (isEmptyField(userTime)) {
        markAsError("userTime");
        isValid = false;
    }
    if (isEmptyField(userTask)) {
        showErrorMessage("userTask", "Add your task...");
        isValid = false;
    }
    if (!isValid) {
        throw new Error(message);
    }
}

function resetFieldsUI() {
    cleanRedBorder("userDate");
    cleanRedBorder("userTime");
}

function cleanRedBorder(id) {
    let redBorder = document.getElementById(id);
    redBorder.style.border = "";
}

function cleanErrorFromTextArea() {
    let node = document.getElementById("userTask-error");
    let userTaskElement = document.getElementById("userTask");

    if (node.innerHTML == "") {
        node.addEventListener("click", function () {
            node.innerHTML = "";
        });
    }
    if (node.innerHTML == "") {
        userTaskElement.addEventListener("click", function () {
            node.innerHTML = "";
        });
    }
}

function isEmptyField(field) {
    if (field.trim() == "" || field.trim() == null) {
        return true;
    }
    
    return false;
}

function markAsError(id) {
    let redBorder = document.getElementById(id);
    redBorder.style.border = "2px solid red";
}

function showErrorMessage(id, message) {
    let node = document.getElementById(id + "-error");
    node.innerHTML = message;
}

function saveLocalStorage(userTaskElement, userDateElement, userTimeElement) {
    let strNotesCounter = localStorage.getItem("notesCounter");

    let id;

    if (!strNotesCounter) {
        id = 0;
    }
    else {
        id = JSON.parse(strNotesCounter);
    }

    let note = {
        id: id++,
        userTask: userTaskElement.value,
        userDate: userDateElement.value,
        userTime: userTimeElement.value
    };
    
    localStorage.setItem("notesCounter", JSON.stringify(id));

    let strNotes = localStorage.getItem("notes");
    let notes;

    if (!strNotes) {
        notes = [];
    }
    else {
        notes = JSON.parse(strNotes);
    }

    notes.push(note);

    strNotes = localStorage.setItem("notes", JSON.stringify(notes));
    
    return notes;
}

function showTasks() {
    let strNotes = localStorage.getItem("notes");

    if (!strNotes) {
        return;
    }

    let notes = JSON.parse(strNotes);

    let container = document.getElementById("container");
    container.innerHTML = "";

    let index;

    for (index = 0; index < notes.length; index++) {
        createNewTask(container, notes, index);
    }
}

function createNewTask(container, notes, index) {

    let newTaskCard = document.createElement("div");
    newTaskCard.setAttribute("class", "newTaskCard");
    newTaskCard.setAttribute("id", notes[index].id);

    deleteTaskDiv(newTaskCard);
    userTaskDiv(newTaskCard, notes, index);
    userDateDiv(newTaskCard, notes, index);
    userTimeDiv(newTaskCard, notes, index);
    
    container.append(newTaskCard);
}

function deleteTaskDiv(newTaskCard) {
    let deleteButton = document.createElement("button");
    deleteButton.setAttribute("class", "deleteButton");
    newTaskCard.append(deleteButton);

    deleteButton.addEventListener("click", function (event) {
        let deleteCardDiv = event.target.parentElement;
        deleteCardDiv.remove(this);

        let strNotes = localStorage.getItem("notes");
        let notes;

        if (!strNotes) {
            notes = [];
        }
        else {
            notes = JSON.parse(strNotes);
        }

        for (let index = 0; index < notes.length; index++) {
            if (notes[index].id == deleteCardDiv.id) {
                notes.splice(index, 1);
            }
            localStorage.setItem("notes", JSON.stringify(notes));
        }
    });
}

function userTaskDiv(newTaskCard, notes, index) {
    let userTaskDiv = document.createElement("div");
    userTaskDiv.setAttribute("class", "userTaskDiv");
    userTaskDiv.innerHTML = notes[index].userTask;
    newTaskCard.append(userTaskDiv);
}

function userDateDiv(newTaskCard, notes, index) {
    let userDateDiv = document.createElement("div");
    userDateDiv.setAttribute("class", "userDateDiv");
    userDateDiv.innerHTML = notes[index].userDate;
    newTaskCard.append(userDateDiv);

}

function userTimeDiv(newTaskCard, notes, index) {
    let userTimeDiv = document.createElement("div");
    userTimeDiv.setAttribute("class", "userTimeDiv");
    userTimeDiv.innerHTML = notes[index].userTime
    newTaskCard.append(userTimeDiv);
}

function cleanInput(task, date, time) {
    task.value = "";
    date.value = "";
    time.value = "";
}