//function loadCSSBasedOnDeviceType() {
//    if (window.innerWidth >= 1025) {
//        loadCSS('styles-pc.css');
//    } else {
//        loadCSS('styles-mobile.css');
//    }
//}
//
//function loadCSS(filename) {
//    var link = document.createElement('link');
//    link.rel = 'stylesheet';
//    link.type = 'text/css';
//    link.href = filename;
//    document.head.appendChild(link);
//}
//
//// Call the function when the page loads and on window resize
//window.addEventListener('load', loadCSSBasedOnDeviceType);


var xhr = new XMLHttpRequest();
xhr.open("GET", "Assets/data.json", true);
xhr.responseType = "json";
var jsonDATA = null;
xhr.onload = function () {
    if (xhr.status === 200) {
        var jsondata = xhr.response;
        console.log(jsondata);
    }
    jsonDATA = jsondata;
};

xhr.send();
const checkboxes = document.querySelectorAll('input[type="radio"]');
const primaryCheckboxes = document.querySelector(".top-middle");
const secondaryCheckboxes = document.querySelector(".top-right");
const tablediv = document.querySelector(".spreadsheet");

checkboxes.forEach((checkbox) => {
    checkbox.addEventListener("change", (event) => {
        if (event.target.checked) {
            // Clear the existing checkboxes in the right container
            primaryCheckboxes.innerHTML = "<h2>Επίλεξε τμήμα</h2>";
            secondaryCheckboxes.innerHTML = "<h2>Επίλεξε κατεύθυνση</h2>";
            const id = ["Α", "Β", "Γ"].indexOf(event.target.value);
            checkboxes.forEach((ch) => {
                var temp_id = ["Α", "Β", "Γ"].indexOf(ch.value);
                //console.log(id, temp_id);
                if (temp_id != id) {
                    ch.checked = false;
                    //console.log(temp_id);
                }
            });

            const jsonData1 = jsonDATA["classes"]["second"][parseInt(id)];
            const jsonData2 = jsonDATA["classes"]["third"][parseInt(id)];
            // Create checkboxes based on the selected option
            //console.log(jsonData);

            jsonData1.forEach((suboption) => {
                var checkbox = document.createElement("input");
                checkbox.type = "radio";
                checkbox.name = "suboption1";
                checkbox.value = suboption;
                checkbox.id = suboption;
                const label = document.createElement("label");
                label.textContent = " " + suboption;
                label.setAttribute("for", suboption);
                primaryCheckboxes.appendChild(checkbox);
                primaryCheckboxes.appendChild(label);
                primaryCheckboxes.appendChild(document.createElement("br"));
            });

            jsonData2.forEach((suboption) => {
                var checkbox = document.createElement("input");
                checkbox.type = "radio";
                checkbox.name = "suboption2";
                checkbox.value = suboption;
                checkbox.id = suboption;
                const label = document.createElement("label");
                label.textContent = " " + suboption;
                label.setAttribute("for", suboption);
                secondaryCheckboxes.appendChild(checkbox);
                secondaryCheckboxes.appendChild(label);
                secondaryCheckboxes.appendChild(document.createElement("br"));
            });

        } else {
            primaryCheckboxes.innerHTML = "<h2>Επίλεξε τμήμα</h2>";
            secondaryCheckboxes.innerHTML = "<h2>Επίλεξε κατεύθυνση</h2>";
            checkboxes.forEach((ch) => {
                ch.checked = false;
            });
        }
        delete_spreadsheet();
    });
});

function timetable(data) {
    const teachers = jsonDATA["teachers"];
    var spreadsheet = [];
    if (String(data[0]).startsWith("Α")) {
        var _class = String(data[0]).toUpperCase();
        const tt = jsonDATA["timetable"];
        var day = [];
        for (let i = 0; i < tt.length; i++) {
            for (let j = 0; j < tt[i].length; j++) {
                if (tt[i][j].includes(_class)) {
                    day.push([teachers[j], false]);
                    var h = j;
                    break;
                } else if (j == tt[i].length - 1) {
                    day.push(["", false]);
                    var h = j;
                    break;
                }
            }
            if (day.length == 7) {
                spreadsheet.push(day);
                day = [];
            }
        }
    } else {
        var _class1 = String(data[0]).toUpperCase();
        var _class2 = String(data[1]).toUpperCase();
        const tt = jsonDATA["timetable"];
        var day = [];
        for (let i = 0; i < tt.length; i++) {
            for (let j = 0; j < tt[i].length; j++) {
                if (tt[i][j].includes(_class1)) {
                    day.push([teachers[j], false]);
                    var h = j;
                    break;
                } else if (tt[i][j].includes(_class2)) {
                    day.push([teachers[j], true]);
                    var h = j;
                    break;
                } else if (j == tt[i].length - 1) {
                    day.push(["", false]);
                    var h = j;
                    break;
                }
            }
            if (day.length == 7) {
                spreadsheet.push(day);
                day = [];
            }
        }
    }
    return spreadsheet;
}

function create_spreadsheet(data) {
    let container = tablediv;
    container.innerHTML = "<h2>Πρόγραμμα</h2>";
    let table = document.createElement("table");
    table.id = "table-id";
    var jsonData = timetable(data);

    // Get the keys (column names) of the first object in the JSON data
    let cols = ["", "Δευτέρα", "Τρίτη", "Τετάρτη", "Πέμπτη", "Παρασκευή"];

    // Create the header element
    let thead = document.createElement("thead");
    let tr = document.createElement("tr");

    // Loop through the column names and create header cells
    cols.forEach((item) => {
        let th = document.createElement("th");
        th.innerText = item; // Set the column name as the text of the header cell
        if (item != "") {
            th.style.backgroundColor = "#f0f0f0";
            th.style.padding = "8px";
            th.style.borderRadius = "3px";
        }
        tr.appendChild(th); // Append the header cell to the header row
    });
    thead.appendChild(tr); // Append the header row to the header
    table.append(tr); // Append the header to the table

    // Loop through the JSON data and create table rows
    for (let i = 0; i < 7; i++) {
        let tr = document.createElement("tr");

        for (let j = 0; j < 6; j++) {
            if (j == 0) {
                let td = document.createElement("td");
                td.innerText = String(i + 1);
                td.style.backgroundColor = "#f0f0f0";
                td.style.padding = "10px";
                td.style.borderRadius = "3px";
                tr.appendChild(td);
            } else {
                let td = document.createElement("td");
                td.innerText = jsonData[j - 1][i][0];
                if (jsonData[j - 1][i][1]) {
                    td.style.backgroundColor = "#d5ecf2";
                } else {
                    td.style.backgroundColor = "#e8eaeb";
                }
                //td.style.margin = "10px";
                td.style.padding = "10px";
                td.style.borderRadius = "3px";
                tr.appendChild(td);
            }
            table.appendChild(tr); // Append the table row to the table
        };
        container.appendChild(table); // Append the table to the container element
    }
    document.getElementById("spreadsheet").style.border = "3px solid #cccccc";

    const tempdiv = document.querySelector(".download");
    tempdiv.innerHTML = '';
    // Create a button element
    const button = document.createElement('button');

    // Set the button's text and attributes
    button.textContent = 'Κατέβασε το πρόγραμμα';
    button.id = 'downloadButton';

    // Assign the onclick event handler
    button.onclick = captureElementAsImage;

    // Append the button to the div
    tempdiv.appendChild(button);
}

function delete_spreadsheet() {
    document.getElementById("spreadsheet").style.border = "none";
    tablediv.innerHTML = "";
    let tempdiv = document.querySelector(".download");
    tempdiv.innerHTML = '';
}

function newClick() {
    const checkboxes = document.querySelectorAll('input[type="radio"]');
    var data = [];
    checkboxes.forEach((checkbox) => {
        if (checkbox.checked) {
            data.push(checkbox.value);
        }
    });
    if (data.length > 0) {
        if (data[0] == "Α" && data.length == 2) {
            create_spreadsheet([data[1], null]);
        } else if (["Β", "Γ"].includes(data[0]) && data.length == 3) {
            create_spreadsheet([data[1], data[2]]);
        } else {
            delete_spreadsheet();
        }
    } else {
        delete_spreadsheet();
    }
}


function handleCheckboxClick(event) {
    const target = event.target;
    if (target.type === "radio") {
        // Replace this with your code to handle checkbox click
        if (target.checked) {
            //console.log("Checkbox checked:", target.value);
            newClick();
        }
    }
}

document.body.addEventListener("click", handleCheckboxClick);

function captureElementAsImage() {
    const elementToCapture = document.getElementById('spreadsheet');

    // Use html2canvas to capture the element as an image
    html2canvas(elementToCapture).then(function (canvas) {
        // Convert the canvas to a data URL (PNG format)
        const dataURL = canvas.toDataURL('image/png');

        // Create a download link
        const downloadLink = document.createElement('a');
        downloadLink.href = dataURL;
        downloadLink.download = 'Programma.png';

        // Trigger a click event on the download link to initiate the download
        downloadLink.click();
    });
}
