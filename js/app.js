/* global i */
// Set a global var to hold filesystem utility object
var fs = require('fs');
var gui = require('nw.gui'); 
// Function to write to a file
function saveToFile () {
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
	fs.appendFile("data/users.txt", memNumber + "," + fName + "," + lName + "," + school + "," + state + "," + email + "," + year + "," + code + "," + amountOwed + ","  +  grade + "\r\n", function(e){alert("Data Saved")});
    document.location = "homepage.html";
}
function validate(newUser) {
    document.getElementById('alert').innerHTML= "";
    var memNumber = document.getElementById("memNumber").value;
    var fName = document.getElementById("firstName").value;
    var lName = document.getElementById("lastName").value;
    var school = document.getElementById("school").value;
    var state = document.getElementById("state").value;
    var email = document.getElementById("email").value;
    var year = document.getElementById("year").value;
    var code = document.getElementById("code").value;
    var amountOwed = document.getElementById("amountOwed").value;
    var dataArray = [memNumber, fName, lName, school, state, email, year, code, amountOwed];
    var nameArray = ["Membership Number", "First Name", "Last Name", "School", "State", "Email", "Year", "Code", "Amount Owed"];
    var checkArray = [, , , , , , , , ];
    var errors = [];
    for (i = 0; i < dataArray.length; i++) {
        if (i == 0 || i == 6 || i == 8) {
            if (dataArray[i] < 0 || dataArray[i] == null || dataArray[i] == "" ) {
                errors.push("Please enter a valid " + nameArray[i]);
                console.log(dataArray[7]);
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
                    else { checkArray[i] = true; console.log("poop"); }
                }
                else {
                    checkArray[i] = true;
                }

            }
        }

    }
    console.log(checkArray);
    var isTrue = isValidated(checkArray);
    if (isTrue) {
        console.log("True");
        if (newUser){
            saveToFile();
        }
        
    }
    else {
        for (i = 0; i < errors.length; i++){
            document.getElementById('alert').innerHTML +="<strong> Error: </strong>" +  (errors[i] + "<br>");
        }
        $('.alert').show();
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
	var newArray = docArray[docArray.length-1].split(',');
	document.getElementById('memNumber').value = parseInt(newArray[0]) + 1;
}
function createForm(){
	generateMemNum();
	document.getElementById('year').min = "2000";
	document.getElementById('amountOwed').min = "0";
}
function load() {	   
	var lineNum = getLineNum();
	var documentArray = loadFromFile();
	var data = documentArray[lineNum];
	var dataArray = data.split(",");
	document.getElementById("memNumber").value = dataArray[0];
	document.getElementById("firstName").value = dataArray[1];
	document.getElementById("lastName").value = dataArray[2];
	document.getElementById("school").value = dataArray[3];
	document.getElementById("state").value = dataArray[4];
	document.getElementById("email").value = dataArray[5];
	document.getElementById("year").value = dataArray[6];
	document.getElementById("code").value = dataArray[7];
	document.getElementById("amountOwed").value = dataArray[8].trim();
    console.log(dataArray[9]);
    document.getElementById("grade").value = dataArray[9].trim();
}
function loadFromFile(){
	var documentArray;
	documentArray = fs.readFileSync("data/users.txt").toString().split("\n");
	documentArray.pop();
	return documentArray;
}
function getLineNum(){
	var lineArray = window.location.href.split("?");
	var lineNum = lineArray[1];
	return lineNum;
}
function deleteUser(){
	var documentArray = loadFromFile();
	var lineNum = getLineNum();
	var document1Array = documentArray;
	document1Array.splice(lineNum, 1);
	fs.writeFile("data/users.txt", document1Array.join("\r\n") + "\r\n", function(err){console.log("error")});
	alert("Successfully Deleted User");
	document.location="editUsers.html";
}
function updateUser() {
	var documentArray = loadFromFile();
	var lineNum = getLineNum();
	var document1Array = documentArray;
    var isValidated = validate(false);
    if (isValidated){
        document1Array[lineNum] = document.getElementById("memNumber").value + "," + document.getElementById("firstName").value + "," + document.getElementById("lastName").value + "," + document.getElementById("school").value + "," + document.getElementById("state").value + "," + document.getElementById("email").value + "," + document.getElementById("year").value + "," + document.getElementById("code").value + "," + document.getElementById("amountOwed").value + ',' + document.getElementById("grade").value;
        document1Array[document1Array.length-1] += "\n";
        fs.writeFile("data/users.txt", document1Array.join("\r\n"), function (err) { console.log("error") });
        alert("Successfully Updated User");
        document.location = "editUsers.html";	
    }
    
	  
}
function createTable(array, table){
	var allRows = "";
	for (i = 0; i < array.length; i++){
		var array2 = array[i].toString().split(",");
        var status;
        if (array2[7] === "1"){status = "Active"}
        else{status = "Inactive"};
		allRows += "<tr> <td>" + array2[0] + "</td> <td>" + array2[1] + "</td> <td>" + array2[2] +"</td> <td>" + array2[3]+"</td> <td>" + array2[4]+"</td> <td>" + array2[5]+"</td> <td>" + array2[6]+ "</td> <td> "+ status + "</td> <td> "+ array2[8] + "</td> <td>" + (parseInt(array2[9]) + 9) + "</td> <td>" + "<a href = \"selectedUser.html?" + i + "\" >" + "<span class ='glyphicon glyphicon-new-window' aria-hidden = 'true'></span>" + "</a> </td> <tr>";
	}			   
	table.innerHTML= allRows;
}
function displayTable(){
	var array = loadFromFile();
	var table = document.getElementById("mytableBody");
	createTable(array, table);
	sortTable();
	search();
}
function sortTable() {
	$(document).ready(function() { 
		$("#myTable").tablesorter({sortList:[[0,0], [1,0]]}); 
	}); 
}
function search() {
    var choiceElement = document.getElementById('searchChoices');
    $(document).ready(function () {
        $("#search").keyup(function () {
            _this = this;
            var searchChoice = choiceElement.options[choiceElement.selectedIndex].value;
            console.log(searchChoice);
            if (searchChoice === "10") {
                $.each($("#myTable tbody").find("tr"), function () {
                    if ($(this).text().toLowerCase().indexOf($(_this).val().toLowerCase()) == -1)
                        $(this).hide();
                    else
                        $(this).show();
                });
            }
            else {
                $.each($("#myTable tbody ").find("tr"), function () {
                    if ($(this).find("td").eq(parseInt(searchChoice)).text().toLowerCase().indexOf($(_this).val().toLowerCase()) == -1)
                        $(this).hide();
                    else
                        $(this).show();
                });
            }

        });
    });
}
function createReport () {
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
	document.location = "realReport.html?" + sortChoice + ',' + owes + ',' +  owesNot + ',' + frosh + ',' + soph + ',' + junior + ',' + senior+ ',' +  memNum + ',' + fullName + ',' +state + "," + email + ',' + year + ','+ grade + ',' + amountOwed + ',' + radioTrue + ',' + active+ ',' + inActive + ',' + school + ',' + status;
}
function processData(){
	var lineNum = getLineNum();
	var dataArray = loadFromFile();
	var query = lineNum.split(',');
	var sortColumnNumber = parseInt(query[0]);
	var dataArraySorted = sortData(dataArray, sortColumnNumber);
	var filteredMembers = filterMembers(dataArraySorted, lineNum);
	var selectArray = gatherTableData(filteredMembers, lineNum);
	var tableHtml = createReportBody(filteredMembers, selectArray, true);
	document.getElementById("reportContainer").innerHTML= tableHtml;
	createFooter(filteredMembers, lineNum);
}
function sortData(dataArray,sortColumnNumber){

	if (sortColumnNumber === 8 || sortColumnNumber === 0 || sortColumnNumber === 7 || sortColumnNumber === 9){
		var sorted1Array = dataArray.sort(function(a,b){
			var a = parseInt(a.split(',')[sortColumnNumber]);
			var b = parseInt(b.split(',')[sortColumnNumber]);
			return a-b;
		});
		return sorted1Array;
	}
	else{
		var sortedArray = dataArray.sort(function(a,b){
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
function filterMembers(sortedDataArray, lineNum) {
	var owes = lineNum.split(',')[1] == "true";
	var owesNot = lineNum.split(',')[2] == "true";
    var active = lineNum.split(',')[15] == "true";
    var inActive = lineNum.split(',')[16] == "true"; 
	var frosh = lineNum.split(',')[3] == "true";
	var soph = lineNum.split(',')[4] == "true";
	var junior = lineNum.split(',')[5] == "true";
	var senior = lineNum.split(',')[6] == "true";
	var filteredMembers = sortedDataArray.filter(function(o){
		var thisGuyOwes = parseInt(o.split(',')[8]) > 0;
        var thisGuyActive = parseInt(o.split(',')[7]) == 1;
		var freshmen = parseInt(o.split(',')[9]) === 0;
		var sophmore = parseInt(o.split(',')[9]) === 1;
		var juniors = parseInt(o.split(',')[9]) === 2;
		var seniors = parseInt(o.split(',')[9]) === 3;
		if ((owes && thisGuyOwes || owesNot && !thisGuyOwes) && (active && thisGuyActive || inActive && !thisGuyActive) && (frosh && freshmen || soph && sophmore || junior && juniors || senior && seniors)){
			return true;
		}
		else{
			return false;
		}
	});
	return filteredMembers;
}
function gatherTableData(filteredMembers, lineNum) {
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
	console.log(selectArray);
	return selectArray;
}

function createReportBody(filteredMembers, selectArray, withBreaks) {	// 10th element is grade
    var container = document.getElementById("reportContainer");
    var rows = "";
    var statusArray = [[0, "Inactive"], [1, "Active"]];
    for (var i = 0; i < filteredMembers.length; i++) {
        var lineArray = filteredMembers[i].toString().split(',');
        if (withBreaks) {
            if (i % 50 === 0) {
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
                    rows += "<td>" + (parseInt(lineArray[9]) + 9) + "</td>";
                }
                else if (j == 7){
                    for (var p =0; p < 2; p++){
                        if (lineArray[7] == statusArray[p][0]){
                            rows+= "<td>" + statusArray[p][1] + "</td>";
                        }
                    }
                }
                else if (j == 1) {
                    rows += "<td>" + lineArray[j] + " " + lineArray[j + 1] + "</td>";
                }
                else if (j == 2) {
                    continue;
                }
                else {
                    rows += "<td>" + lineArray[j] + "</td>";
                }

            }
        }

        rows += "</tr>"
    }
    if (!withBreaks) { rows += "</table>" }
    return rows;
}
function createReportHeaders(selectArray, isFirst){
		var headerArray = ["Mem #", "Name",null,"School","State","Email","Year Joined","Status","Amount Owed", "Grade"];
		//var table = document.getElementById("tableHead");
		var head = "<table id = 'reportTable' class='table table-bordered'><thead "+ (isFirst ? "" : "class = 'printPageHeader'") + "><tr>";
		for (var i = 0; i < 10; i++){
			if (selectArray[i]){
				if (i == 2){continue;}
				head+= "<th>" + headerArray[i]+ "</th>";
			}
		}
		head+= "</tr></thead>";
		console.log("header is :" + head);
		return head;
		//table.innerHTML = head;
		
}
function createFooter(sortedArray, lineNum){
	var numOfOwing = 0; var sum = 0.0;
	var numOfActive= 0, numOfInactive= 0;
	var footerTrue = lineNum.split(',')[14] == "true";
	if (footerTrue){
		for (i = 0; i < sortedArray.length; i++){
			var lineArray = sortedArray[i].split(',');
			if (parseInt(lineArray[7]) > 0){
				numOfActive++;				
			}
			if (parseFloat(lineArray[8]) > 0.0){
				numOfOwing++;
				sum+= parseFloat(lineArray[8]);
			}
		}
        var totalAmount = Number(sum).toLocaleString('en');
		numOfInactive = sortedArray.length - numOfActive;
		document.getElementById("footerBody").innerHTML = "Number Of Members Owing: " + numOfOwing + " Total Amount Owed: $" + totalAmount;
		document.getElementById("footerBody1").innerHTML = "Number of Active Members: " + numOfActive + " Number of Inactive Members: " + numOfInactive;
	}
	else{
		document.getElementById("tempFoot").outerHTML = "";
		delete document.getElementById('tempFoot'); 
	}

}
function toExcel(filePath){
	var lineNum = getLineNum();
	var dataArray = loadFromFile();
	var query = lineNum.split(',');
	var sortColumnNumber = parseInt(query[0]);
	var dataArraySorted = sortData(dataArray, sortColumnNumber);
	var filteredMembers = filterMembers(dataArraySorted, lineNum);
	var selectArray = gatherTableData(filteredMembers, lineNum);
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
function exportToReportTable(){
    $('#myTable tr').find('th:last-child, td:last-child').remove();
    var table = document.getElementById("myTable");
}




