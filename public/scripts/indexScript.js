
//Hämtar Användarnamnet som skirvits i formen och skickar detta till canvasView.html
//via URLen. Användarnamnet extraktas i userscript som körs i canvasView.html.

window.onload=function() {
  document.getElementById("nameFormId").onsubmit=function() {
	var userName = "Guest"
	if(document.getElementById("nameInputId").value != ""){
	userName = document.getElementById("nameInputId").value;
	}
    var address = ("canvasView.html?" + "username=" +  userName);
    window.location.replace(address);

    return false;
  }
}
