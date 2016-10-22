const {app, BrowserWindow} = require('electron')

document.getElementById("createButton").addEventListener("click", check_invalid_input);

function check_invalid_input() {
	fname = document.getElementById("fname");
	if (fname.checkValidity() == false) {
		document.getElementById('demo').innerHTML = "this is invalid name";
	}
}