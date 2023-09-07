main_container = document.querySelector(".note_container");
var global_note_id = 0;
if(document.getElementById("storenote")) {
  document.getElementById("storenote").checked=true;
  document.getElementById("storenote").disabled=true;
}

fetchnote_value = localStorage.getItem("fetchnote");

if(document.getElementById("fetchnote")) {
  if (fetchnote_value == "true") {
    document.getElementById("fetchnote").checked = true;
    showSavedNotes();
  } else {
    document.getElementById("fetchnote").checked = false;
  }
}

function switchState() {
  if (document.getElementById("fetchnote").checked) {
    localStorage.setItem("fetchnote", true);
  } else {
    localStorage.setItem("fetchnote", false);
  }
}

function saveToLocal(checker, title, data) {
  document.getElementById("note_title").value = "";
  document.getElementById("note_data").value = "";
  if (checker) {
    let dict = {};
    dict[title] = data;

    let stored_notes = JSON.parse(localStorage.getItem("notes"));

    if (stored_notes != null) {
      stored_notes.push(dict);
      localStorage.setItem("notes", JSON.stringify(stored_notes));
    } else {
      let notes_array = [];
      notes_array.push(dict);
      localStorage.setItem("notes", JSON.stringify(notes_array));
    }
  }
}
function handleException(title = "", data = "") {
  title_ex = document.getElementById("title_error");
  data_ex = document.getElementById("data_error");
  if (title != "" && data != "") {
    title_ex.innerHTML = title;
    title_ex.setAttribute("style", "color: red; font-size: 12px;");
    title_elem = document.getElementById("note_title").setAttribute("style", "border: 1px solid red;");
    data_ex.innerHTML = data;
    data_ex.setAttribute("style", "color: red; font-size: 12px;");
    data_elem = document.getElementById("note_data").setAttribute("style", "border: 1px solid red;");
  } else if (title != "" && data == "") {
    data_ex.innerHTML = data;
    data_elem = document.getElementById("note_data").setAttribute("style", "border: 1px solid green;");
    title_ex.innerHTML = title;
    title_ex.setAttribute("style", "color: red; font-size: 12px;");
    title_elem = document.getElementById("note_title").setAttribute("style", "border: 1px solid red;");
  } else if (title == "" && data != "") {
    title_ex.innerHTML = ""
    title_elem = document.getElementById("note_title").setAttribute("style", "border: 1px solid green;");
    data_ex.innerHTML = data;
    data_ex.setAttribute("style", "color: red; font-size: 12px;");
    data_elem = document.getElementById("note_data").setAttribute("style", "border: 1px solid red;");
  } else if (title == "" && data == "") {
    title_ex.innerHTML = ""
    title_elem = document.getElementById("note_title").setAttribute("style", "border: 1px solid green;");

    data_ex.innerHTML = ""
    data_elem = document.getElementById("note_data").setAttribute("style", "border: 1px solid green;");
  }
}
function checkData() {
  title_el = document.getElementById("note_title").value;
  data_el = document.getElementById("note_data").value;
  store_note = document.getElementById("storenote").checked;
  document.getElementById("note_title");

  if (title_el == "" && data_el == "") {
    handleException("Note Title Can't Empty", "Note Data Can't be Empty");
  }
  else if (title_el == "" && data_el != "") {
    handleException("Note Title Can't Empty","");
  } 
  else if (title_el != "" && data_el == "") {
    handleException("", "Note Data Can't be Empty");
  } 
  else {
    if (checkStorage()) {
    addNote(title_el, data_el);
    saveToLocal(store_note, title_el, data_el);
    showMessage("success", "Note Added Succesfully");
    }
  }
}

function addNote(title_el, data_el) {
  
  if(global_note_id!=0) {
    note_body = document.getElementById(global_note_id).children[0].children[1];
    note_body.children[0].innerHTML = title_el;
    note_body.children[1].innerHTML = data_el.slice(0,30)+"...";
    global_note_id = 0;
  } else {
    notes_count = document.querySelectorAll(".note").length; 
    
    note_card = document.createElement("div");
    note_card.className = "note";
    note_card.id = `${notes_count + 1}`; 

    main_container = document.getElementById("nt");
    main_container.appendChild(note_card);
    html = ` <div class="card text-white bg-dark mx-1 mb-3" id="${
        notes_count + 1
      }" style= " max-width: 18rem; min-width: 18rem;">
          <div class="card-header row container-fluid justify-content-between" style="margin: 0px !important">
          Note: ${notes_count + 1}
          <i class="fa fa-pencil-square-o" onclick="editNote(${notes_count + 1})" aria-hidden="true"></i>
          <i class="fa fa-eye" data-toggle="modal" data-target="#viewmodal" onclick="showNote(${notes_count + 1})" aria-hidden="true"></i>
          <i" onclick="deleteNote(${
      notes_count + 1
    },'${title_el}')"class="fa fa-trash" aria-hidden="true"></i>
          </div>
          <div class="card-body">
              <h5 class="card-title">${title_el}</h5>
              <p class="card-text">${data_el.slice(0, 30)}...</p>
          </div>
      </div>`;
    document.getElementById(`${notes_count + 1}`).innerHTML = html; 
  }
}

function deleteNote(id=0, title,msg="") {
  if(id!=0) {
    el = document.getElementById(id);
    el.remove();
  }
  let notes_array = JSON.parse(localStorage.getItem("notes"));
  temp = notes_array;
  temp.forEach(function key_popper(ab, ind) {
    for (var key in ab) {
      if (key == title) {
        notes_array.splice(ind, 1);
      }
      break;
    }
    return false;
  });
  localStorage.setItem("notes", JSON.stringify(notes_array));
  if(msg != "") {
    showMessage("success",msg);
  } else {
  showMessage("success", "Note deleted Succesfully");
  }
}

function showSavedNotes() {
  let notes_elem = JSON.parse(localStorage.getItem("notes"));
  all_notes_in_dom = document.getElementsByClassName("card-title");
  all_note_in_dom = Array.from(all_notes_in_dom);
  all_dom_notes_title = [];
  all_note_in_dom.forEach(function (note, ind) {
    all_dom_notes_title.push(note.innerHTML);
  });
  if(all_notes_in_dom.length > 0) {
    showMessage("success", "Notes Already Added");
    return;
  } if (!notes_elem.length) {
    showMessage("danger", "No Notes Found");
  } else {
    notesObj = notes_elem;
    notesObj.forEach(function getNoteData(note, ind) {
      for (var title in note) {
        if (!all_dom_notes_title.length) {
          data = note[title];
          addNote(title, data);
        }
      }
    });
  }
  showMessage("success", "Note Added Succesfully");
}

function checkStorage() {
  input = document.getElementById("note_title").value;
  let notes_elem = JSON.parse(localStorage.getItem("notes"));
  if(notes_elem) {
    try {
      notes_elem.forEach(function getNoteData(note, ind) {
        for (var title in note) {
          if(title.toLowerCase()==input.toLowerCase()) {
            handleException("Title Already Exist");
            throw "Title Already Exist"
          }
        }
      });
      title_ex = document.getElementById("title_error");
      title_ex.innerHTML = "";
      title_ex.setAttribute("style", "color: red; font-size: 12px;");
      title_elem = document.getElementById("note_title").setAttribute("style", "border: 1px solid green;");
      document.getElementById("note_data").setAttribute("style", "border: 1px solid green;");
      return true;
    } catch(ex) {
          return false;
    }
  } else
  return true;  
}

function clearLocalStorage() {
  localStorage.clear();
  showMessage("danger", "Local Storage Cleared");
}

function showMessage(type, msg) {
  el = document.getElementById("alert");
  el.innerHTML = `
        <div class="alert alert-${type} alert-dismissible fade show" role="alert">
        <strong>${msg}</strong>
        <button type="button" class="close" data-dismiss="alert" aria-label="Close">
        <span aria-hidden="true">&times;</span>
        </button>
      </div>
        `;
  el.style.display = "";
  seconds = 1;
  let interval_id = setInterval(function () {
    if (seconds == 5) {
      el.style.display = "none";
      clearInterval(interval_id);
    } else { 
      seconds += 1;
    }
  },1000);
}

function editNote(id) {
  global_note_id = id;
  ntitle = document.getElementById("note_title");
  data = document.getElementById("note_data");
  note = document.getElementById(id).children[0].children[1];
  ntitle.value=note.children[0].innerText;
  let notesObj = JSON.parse(localStorage.getItem("notes"));
  try {
    notesObj.forEach(function getNoteData(note, ind) {
      for (var title in note) {
        if (ntitle.value==title) {
          ndata = note[title];  
          throw "found";           
        }
      }
    });
  } catch(ex) {
    data.value = ndata;
  }
  msg="Note is in edit mode now. Don't leave without saving otherwise this note will be lost."
  deleteNote(0,note.children[0].innerText,msg);
}

function showNote(id){
  obj = document.getElementById(id);
  note_title = obj.children[0].children[1].children[0].innerHTML;
  let notesObj = JSON.parse(localStorage.getItem("notes"));
  notesObj.forEach(function getNoteData(note, ind) {
    for (var title in note) {
      if (note_title==title) {
        data = note[title];       
      }
    }
  });
  document.getElementById("modaltitle").innerHTML=note_title;
  document.getElementById("modalbody").innerHTML=data;
}

  function toggleLightMode() {
    var element = document.body;
    element.classList.toggle("light-mode");
    document.note_title.classList.toggle("note_title_light");
    document.note_data.classList.toggle("note_data_light");
    document.modal-title.classList.toggle("modal-title-light");
    document.modal-body.classList.toggle("modal-body-light");


  }