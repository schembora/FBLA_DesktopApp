/* global i */
// Set a global var to hold filesystem utility object
var fs = require('fs');
// Function to write to a file
function saveToFile () {
    var memberArray = gatherUserData();
	fs.appendFile("data/users.csv", memberArray[0] + "," + memberArray[1] + "," + memberArray[2] + "," + memberArray[3] + "," + memberArray[4] + "," + memberArray[5] + "," + memberArray[6] + "," + memberArray[7] + "," + memberArray[8] + ","  +  memberArray[9] + "\r\n", function(e){alert("Data Saved")});
    document.location = "editUsers.html";
}
function gatherUserData(){
    var memNumber = document.getElementById("memNumber").value;
	var fName = document.getElementById("firstName").value;
	var lName = document.getElementById("lastName").value;
	var school = document.getElementById("school").value;
	var state = document.getElementById("state").value;
	var email = document.getElementById("email").value;
	var year = document.getElementById("year").value;
	var code = document.getElementById("code").value;
	var amountOwed = document.getElementById("amountOwed").value;
    var grade = document.getElementById("grade").value;
    return [memNumber, fName, lName, school, state, email, year, code, amountOwed,grade];
}
function validate(newUser) {
    document.getElementById('alert').innerHTML = "";
    var dataArray = gatherUserData();
    var nameArray = ["Membership Number", "First Name", "Last Name", "School", "State", "Email", "Year", "Code", "Amount Owed", "Grade"];
    var checkArray = [, , , , , , , , ];
    var errors = [];
    for (i = 0; i < dataArray.length; i++) {
        if (i == 0 || i == 6 || i == 8) {
            if (dataArray[i] < 0 || dataArray[i] == null || dataArray[i] == "") {
                errors.push("Please enter a valid " + nameArray[i]);
                checkArray[i] = false;
            }
            else { checkArray[i] = true; }
        }
        else {
            if (dataArray[i] == null || dataArray[i] == "" || (dataArray[i].indexOf(',') > -1)) {
                errors.push("Please enter a valid " + nameArray[i]);
                checkArray[i] = false;
            }
            else {
                if (i == 5) {
                    if (dataArray[i].indexOf('@') === -1) {
                        errors.push("Please enter a valid " + nameArray[i]);
                        checkArray[i] = false;
                    }
                    else { checkArray[i] = true;}
                }
                else {
                    checkArray[i] = true;
                }

            }
        }

    }
    var isTrue = isValidated(checkArray);
    if (isTrue) {
        console.log("True");
        if (newUser) {
            saveToFile();
        }

    }
    else {
        for (i = 0; i < errors.length; i++) {
            document.getElementById('alert').innerHTML += "<strong> Error: </strong>" + (errors[i] + "<br>");
        }
        $('#alert').show();
    }

    return isTrue;

}
function isValidated(array){
    for (i = 0; i < array.length - 1; i++){
        if (array[i] != array[i+1]){
            return false;
        }
    }
    return true;
}
function generateMemNum(){
	var docArray = loadFromFile();
	var newArray = docArray[docArray.length-1].split(',');         // Generates membership number by adding 1 to the last used membership number
	document.getElementById('memNumber').value = parseInt(newArray[0]) + 1;
}
function createForm(){
	generateMemNum();
	document.getElementById('year').min = "2000";          // Creates original add user form
	document.getElementById('amountOwed').min = "0";
}
function load() {	   
	var lineNum = getLineNum();
	var documentArray = loadFromFile();        // document array is WHOLE FILE
	var data = documentArray[lineNum];
	var memberArray = data.split(",");
	document.getElementById("memNumber").value = memberArray[0];
	document.getElementById("firstName").value = memberArray[1];
	document.getElementById("lastName").value = memberArray[2];
	document.getElementById("school").value = memberArray[3];        // Loads the selected users information. Gets the selected line number then splits by commas to get the actual membership array
	document.getElementById("state").value = memberArray[4];
	document.getElementById("email").value = memberArray[5];
	document.getElementById("year").value = memberArray[6];
	document.getElementById("code").value = memberArray[7];
	document.getElementById("amountOwed").value = memberArray[8].trim();
    document.getElementById("grade").value = memberArray[9].trim();
}
function loadFromFile(){
	var documentArray;
	documentArray = fs.readFileSync("data/users.csv").toString().split("\n");      // Returns whole file split by lines
	documentArray.pop();
	return documentArray;
}
function getLineNum(){
	var lineArray = window.location.href.split("?");
	var lineNum = lineArray[1];                            // Gets line number of the user that is being viewed/edited
	return lineNum;
}
function deleteUser(){
	var documentArray = loadFromFile();
	var lineNum = getLineNum();
	var document1Array = documentArray;
	document1Array.splice(lineNum, 1);     // Deletes user by splicing the user's line
	fs.writeFile("data/users.csv", document1Array.join("\r\n") + "\r\n", function(err){console.log("error")});
	alert("Successfully Deleted User");
	document.location="editUsers.html";
}
function updateUser() {
	var documentArray = loadFromFile();
	var lineNum = getLineNum();
	var document1Array = documentArray;
    var isValidated = validate(false);      // Updates user by first checking if user is all data is validated. Then it overrides the current data for that user. It then writes it to the file
    var userArray = gatherUserData();
    if (isValidated){
        document1Array[lineNum] = userArray[0] + "," + userArray[1] + "," + userArray[2] + "," + userArray[3] + "," + userArray[4] + "," + userArray[5] + "," + userArray[6] + "," + userArray[7] + "," + userArray[8] + ',' + userArray[9];
        document1Array[document1Array.length-1] += "\n";
        fs.writeFile("data/users.csv", document1Array.join("\r\n"), function (err) { console.log("error") });
        alert("Successfully Updated User");
        document.location = "editUsers.html";	
    }
    
	  
}
function createTable(array, table){     // Generates complete table  Takes an array and a table as parameters
	var allRows = "";
	for (i = 0; i < array.length; i++){
		var currentMemberArray = array[i].toString().split(",");
        var status;
        if (currentMemberArray[7] === "1"){status = "Active"}       // File stores 0,1 for active,inactive
        else{status = "Inactive"};  
		allRows += "<tr> <td>" + currentMemberArray[0] + "</td> <td>" + currentMemberArray[1] + "</td> <td>" + currentMemberArray[2] +"</td> <td>" + currentMemberArray[3]+"</td> <td>" + currentMemberArray[4]+"</td> <td>" + currentMemberArray[5]+"</td> <td>" + currentMemberArray[6]+ "</td> <td> "+ status + "</td> <td> "+ currentMemberArray[8] + "</td> <td>" + (parseInt(currentMemberArray[9]) + 9) + "</td> <td>" + "<a href = \"selectedUser.html?" + i + "\" >" + "<span class ='glyphicon glyphicon-new-window' aria-hidden = 'true'></span>" + "</a> </td> <tr>";
	}			                                                                                   // Adds 9 to grade because in the file it is stored as 0,1,2,3
	table.innerHTML= allRows;
}
function displayTable(){
	var dataArray = loadFromFile();
	var table = document.getElementById("mytableBody");
	createTable(dataArray, table);                             // Creates the table, adds the sort feature, and the search
	sortTable();
	search();
}
function sortTable() {
	$(document).ready(function() { 
		$("#myTable").tablesorter({sortList:[[0,0], [1,0]]});     // Created From Tablesorter Jquery Plugin (Auto-sorts membership number to begin with)
	}); 
}
function search() {     // Basically checks which table rows match the searched text and hides the table rows that do not
    var choiceElement = document.getElementById('searchChoices');
    $(document).ready(function () {
        $("#search").keyup(function () {
            _this = this;
            var searchChoice = choiceElement.options[choiceElement.selectedIndex].value;
            console.log(searchChoice);
            if (searchChoice === "10") {    // If all rows to be searched is selected
                $.each($("#myTable tbody").find("tr"), function () {
                    if ($(this).text().toLowerCase().indexOf($(_this).val().toLowerCase()) == -1)
                        $(this).hide();
                    else
                        $(this).show();
                });
            }
            else {  // If a certain row to be searched is selected
                $.each($("#myTable tbody ").find("tr"), function () {
                    if ($(this).find("td").eq(parseInt(searchChoice)).text().toLowerCase().indexOf($(_this).val().toLowerCase()) == -1) // Only searches to selected table row using the select value
                        $(this).hide();
                    else
                        $(this).show();
                });
            }

        });
    });
}
function createReport () {      // Checks which checkboxes/radios/selects have been selected in the reports page
	var choiceElement = document.getElementById('sortChoices');
	var sortChoice = choiceElement.options[choiceElement.selectedIndex].value;
	var owes = $("#optionOwes").is(':checked');
	var owesNot = $("#optionOwesNot").is(':checked');
    var active = $("#optionActive").is(':checked');
    var inActive = $("#optionInactive").is(':checked');
	var frosh = $("#frosh").is(':checked');
	var soph = $("#soph").is(':checked');
	var junior = $("#junior").is(':checked');
	var senior = $("#senior").is(':checked');
	var memNum = $("#memNum").is(':checked');
	var fullName = $("#name").is(':checked');
	var state = $("#state").is(':checked');
	var email = $("#email").is(':checked');
	var year = $("#year").is(':checked');
	var grade = $("#grade").is(':checked');
	var amountOwed = $("#amountOwed").is(':checked');
    var status = $("#code").is(':checked');
    var school = $("#school").is(':checked');
	var radioTrue = $("#footerTrue").is(':checked');
	document.location = "realReport.html?" + sortChoice + ',' + owes + ',' +  owesNot + ',' + frosh + ',' + soph + ',' + junior + ',' + senior+ ',' +  memNum + ',' + fullName + ',' +state + "," + email + ',' + year + ','+ grade + ',' + amountOwed + ',' + radioTrue + ',' + active+ ',' + inActive + ',' + school + ',' + status; // Add the values after a ? as booleans so the next page can tell which ones are selected
}
function processData(){
	var reportDataArray = getReportData();
    var filteredMembers = reportDataArray[1];
    var selectArray = reportDataArray[0];
    var lineNum = getLineNum();
	var tableHtml = createReportBody(filteredMembers, selectArray, true);
   
	document.getElementById("reportContainer").innerHTML= tableHtml;
	createFooter(filteredMembers, lineNum);
}
function getReportData(){
    var lineNum = getLineNum();
	var dataArray = loadFromFile();
	var userSelectedData = lineNum.split(',');
	var sortColumnNumber = parseInt(userSelectedData[0]);
	var dataArraySorted = sortData(dataArray, sortColumnNumber);
	var filteredMembers = filterMembers(dataArraySorted, lineNum);     // Goes through a couple functions to get the data for the selected report
	var selectArray = gatherTableData(filteredMembers, lineNum);
    return [selectArray,filteredMembers];
}
function sortData(dataArray,sortColumnNumber){ // Sorts data based on what user selected

	if (sortColumnNumber === 8 || sortColumnNumber === 0 || sortColumnNumber === 7 || sortColumnNumber === 9){ // When sorting numerically
		var sorted1Array = dataArray.sort(function(a,b){
			var a = parseInt(a.split(',')[sortColumnNumber]);
			var b = parseInt(b.split(',')[sortColumnNumber]);
			return a-b;
		});
		return sorted1Array;
	}
	else{
		var sortedArray = dataArray.sort(function(a,b){   // Sorting alphabetically
			var aValue = a.split(',')[sortColumnNumber];
			var bValue = b.split(',')[sortColumnNumber];
			if (aValue < bValue)
				return -1;
			else
				return 1;
		});
		return sortedArray;
	}
	
}
function filterMembers(sortedDataArray, lineNum) { // Filters any options out that were not selected
	var owes = lineNum.split(',')[1] == "true";
	var owesNot = lineNum.split(',')[2] == "true";
	var frosh = lineNum.split(',')[3] == "true";           // Checks which options were selected by basically splitting the url by commas
	var soph = lineNum.split(',')[4] == "true";
	var junior = lineNum.split(',')[5] == "true";
	var senior = lineNum.split(',')[6] == "true";
    var active = lineNum.split(',')[15] == "true";
    var inActive = lineNum.split(',')[16] == "true"; 
	var filteredMembers = sortedDataArray.filter(function(o){
		var thisGuyOwes = parseInt(o.split(',')[8]) > 0;
        var thisGuyActive = parseInt(o.split(',')[7]) == 1;
		var freshmen = parseInt(o.split(',')[9]) === 0;       // Checks the data of the actual member
		var sophmore = parseInt(o.split(',')[9]) === 1;
		var juniors = parseInt(o.split(',')[9]) === 2;
		var seniors = parseInt(o.split(',')[9]) === 3;
		if ((owes && thisGuyOwes || owesNot && !thisGuyOwes) && (active && thisGuyActive || inActive && !thisGuyActive) && (frosh && freshmen || soph && sophmore || junior && juniors || senior && seniors)){
			return true;     // Returns true when the member matches the selected criteria
		}
		else{
			return false;
		}
	});
	return filteredMembers;
}
function gatherTableData(filteredMembers, lineNum) {        // Gathers the data for the choices that want to be shown in the report
	var memNum =  lineNum.split(',')[7] == "true";
	var fullName = lineNum.split(',')[8] == "true";
	var state = lineNum.split(',')[9] == "true";
	var email = lineNum.split(',')[10] == "true";
	var year = lineNum.split(',')[11] == "true";
	var grade = lineNum.split(',')[12] == "true";          
	var amountOwed = lineNum.split(',')[13] == "true";
    var school = lineNum.split(',')[17] == "true";
    var status = lineNum.split(',')[18] == "true";
	var selectArray = [memNum,fullName, fullName, school, state, email, year, status, amountOwed, grade];
	return selectArray;
}

function createReportBody(filteredMembers, selectArray, withBreaks) {
    var rows = "";
    var statusArray = [[0, "Inactive"], [1, "Active"]]; // 0 for inactive, 1 for active
    for (var i = 0; i < filteredMembers.length; i++) {
        var memberArray = filteredMembers[i].toString().split(',');
        if (withBreaks) {   // Don't want breaks when exporting to excel
            if (i % 50 === 0) {     // Ends and starts a new table after 50 members for printing purposes
                if (i > 0) {
                    rows += "</table>";
                }
                rows += createReportHeaders(selectArray, i === 0);
            }
        }
        else {
            if (i == 0) {
                rows += createReportHeaders(selectArray, true);
            }
        }

        rows += "<tr>";
        for (var j = 0; j < 10; j++) {
            if (selectArray[j]) {
                if (j === 9) {
                    rows += "<td>" + (parseInt(memberArray[9]) + 9) + "</td>"; // Adds 9 to grade since in file it is stored as 0,1,2,3
                }
                else if (j == 7){
                    for (var p =0; p < 2; p++){
                        if (memberArray[7] == statusArray[p][0]){
                            rows+= "<td>" + statusArray[p][1] + "</td>"; // Converts the number stored in file to either 'Active' or 'Inactive'
                        }
                    }
                }
                else if (j == 1) {
                    rows += "<td>" + memberArray[j] + " " + memberArray[j + 1] + "</td>"; // Converts first and last name to just one name
                }
                else if (j == 2) {
                    continue;   // Name already created so just skips over it
                }
                else {
                    rows += "<td>" + memberArray[j] + "</td>"; // For all others just create the selected row
                }

            }
        }

        rows += "</tr>"
    }
    if (!withBreaks) { rows += "</table>" } // When it is not exporting to excel generate table with breaks normally
    return rows;
}
function createReportHeaders(selectArray, isFirst){ // Creates the table header depending on the user's choices
		var headerArray = ["Mem #", "Name",null,"School","State","Email","Year Joined","Status","Amount Owed", "Grade"];
		var head = "<table id = 'reportTable' class='table table-bordered'><thead "+ (isFirst ? "" : "class = 'printPageHeader'") + "><tr>"; // Only want to display the first table header when viewing
		for (var i = 0; i < 10; i++){
			if (selectArray[i]){
				if (i == 2){continue;} // 2 is last name and since we are getting full name we skip over it
				head+= "<th>" + headerArray[i]+ "</th>";
			}
		}
		head+= "</tr></thead>";
		return head;
		
}
function createFooter(sortedArray, lineNum){ // Creates the footer if the user wants one
	var numOfOwing = 0; var sum = 0.0;
	var numOfActive= 0, numOfInactive= 0;
	var footerTrue = lineNum.split(',')[14] == "true";
	if (footerTrue){
		for (i = 0; i < sortedArray.length; i++){
			var lineArray = sortedArray[i].split(',');
			if (parseInt(lineArray[7]) > 0){     // Checks if user is active
				numOfActive++;				
			}
			if (parseFloat(lineArray[8]) > 0.0){ // Checks if user owes any money 
				numOfOwing++;
				sum+= parseFloat(lineArray[8]);
			}
		}
        var totalAmount = Number(sum).toLocaleString('en'); // Adds commas to totalAmount
		numOfInactive = sortedArray.length - numOfActive;
		document.getElementById("footerBody").innerHTML = "Number Of Members Owing: " + numOfOwing + " Total Amount Owed: $" + totalAmount;
		document.getElementById("footerBody1").innerHTML = "Number of Active Members: " + numOfActive + " Number of Inactive Members: " + numOfInactive;
	}
	else{
		document.getElementById("tempFoot").outerHTML = "";
		delete document.getElementById('tempFoot');   // Deletes the footer if not selected
	}

}
function toExcel(filePath){
	var reportDataArray = getReportData();
    var filteredMembers = reportDataArray[1];
    var selectArray = reportDataArray[0];
	var tableHtml = createReportBody(filteredMembers, selectArray,false);
	fs.writeFile(filePath, tableHtml, function(err) {
    if(err) {
        	alert(err);
    	}
	});
}
function chooseFile(name) {
    var chooser = document.querySelector(name);
    chooser.addEventListener("change", function (evt) {
        console.log(this.value);
        var lastFile = this.value;
        toExcel(lastFile);
    }, false);
    chooser.click();
}
function doPrint(){
    document.getElementById("hideOnPrint").outerHTML = "";
    delete document.getElementById("hideOnPrint");
    document.getElementById("hideOnPrint1").outerHTML = "";
    delete document.getElementById("hideOnPrint1");
    document.getElementById("back").outerHTML = "";
    delete document.getElementById("back");
    window.print();
    document.location = "editUsers.html";
}





