/* global i */
// Set a global var to hold filesystem utility object
var fs = require('fs');

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
	fs.appendFile("data/users.txt", memNumber + "," + fName + "," + lName + "," + school + "," + state + "," + email + "," + year + "," + code + "," + amountOwed + "\r\n", function(e){alert("Data Saved")});
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
	fs.writeFile("data/users.txt", document1Array.join("\r\n"), function(err){console.log("error")});
	alert("Successfully Deleted User");
	document.location="homepage.html";
}
function updateUser() {
	var documentArray = loadFromFile();
	var lineNum = getLineNum();
	var document1Array = documentArray;
	document1Array[lineNum] = document.getElementById("memNumber").value + "," + document.getElementById("firstName").value + "," + document.getElementById("lastName").value + "," + document.getElementById("school").value + "," + document.getElementById("state").value + "," + document.getElementById("email").value + "," + document.getElementById("year").value + "," + document.getElementById("code").value + "," + document.getElementById("amountOwed").value
	fs.writeFile("data/users.txt", document1Array.join("\r\n"), function(err){console.log("error")});
	alert("Successfully Updated User");
	document.location = "homepage.html";	  
}
function createTable(array, table){
	var allRows = "";
	for (i = 0; i < array.length; i++){
		var array2 = array[i].toString().split(",");
		allRows += "<tr> <td>" + array2[0] + "</td> <td>" + array2[1] + "</td> <td>" + array2[2] + "</td> <td> " + "<a href = \"selectedUser.html?" + i + "\" >" + "<span class ='glyphicon glyphicon-new-window' aria-hidden = 'true'></span>" + "</a> </td> <tr>";
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
	$(document).ready(function(){
            $("#search").keyup(function(){
            _this = this;
            // Only show the tr you are looking for
            $.each($("#myTable tbody").find("tr"), function() {
                if($(this).text().toLowerCase().indexOf($(_this).val().toLowerCase()) == -1)
                $(this).hide();
                else
                    $(this).show();                
            });
        }); 
      });
}
function createReport () {
	var choiceElement = document.getElementById('sortChoices');
	var sortChoice = choiceElement.options[choiceElement.selectedIndex].value;
	var owes = $("#optionOwes").is(':checked');
	var owesNot = $("#optionOwesNot").is(':checked');
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
	document.location = "realReport.html?" + sortChoice + ',' + owes + ',' +  owesNot + ',' + frosh + ',' + soph + ',' + junior + ',' + senior+ ',' +  memNum + ',' + fullName + ',' +state + "," + email + ',' + year + ','+ grade + ',' + amountOwed; 
}
function processData(){
	var lineNum = getLineNum();
	var dataArray = loadFromFile();
	var query = lineNum.split(',');
	var sortColumnNumber = parseInt(query[0]);
	var dataArraySorted = sortData(dataArray, sortColumnNumber);
	var filteredMembers = filterMembers(dataArraySorted, lineNum);
	var selectArray = gatherTableData(filteredMembers, lineNum);
	createReportHeaders(selectArray);
	console.log(filteredMembers);
	createReportBody(filteredMembers, selectArray);
}
function sortData(dataArray,sortColumnNumber){
	if (sortColumnNumber === 0){
		return dataArray;
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
	var frosh = lineNum.split(',')[3] == "true";
	var soph = lineNum.split(',')[4] == "true";
	var junior = lineNum.split(',')[5] == "true";
	var senior = lineNum.split(',')[6] == "true";
	var filteredMembers = sortedDataArray.filter(function(o){
		var thisGuyOwes = parseInt(o.split(',')[8]) > 0;
		var freshmen = parseInt(o.split(',')[6]) === 2015;
		var sophmore = parseInt(o.split(',')[6]) === 2014;
		var juniors = parseInt(o.split(',')[6]) === 2013;
		var seniors = parseInt(o.split(',')[6]) === 2012;
		if ((owes && thisGuyOwes || owesNot && !thisGuyOwes) && (frosh && freshmen || soph && sophmore || junior && juniors || senior && seniors)){
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
	var selectArray = [memNum,fullName, fullName, false, state, email, year, false, amountOwed, grade];
	return selectArray;
}

function createReportBody(filteredMembers, selectArray) {	// 10th element is grade
	var table = document.getElementById("tableBody");
	var rows = "";
	var gradeArray = [[2015, "Freshman"], [2014, "Sophmore"], [2013, "Junior"], [2012 ,"Senior"]]
	for (i = 0; i < filteredMembers.length; i++){
		var lineArray = filteredMembers[i].toString().split(',');
		rows+= "<tr>";
		for (var j = 0; j < 10; j++){
			if (selectArray[j]){
				if (j === 9){
					for (var p = 0; p < 4; p++){
						if (lineArray[6] == gradeArray[p][0]){
							rows+= "<td>" + gradeArray[p][1] + "</td>";
						}
					}
				}
				else if (j == 1){
					rows+= "<td>" + lineArray[j] + " " + lineArray[j+1] + "</td>";
				}
				else if (j == 2){
					continue;
				}
				else{
					rows+= "<td>" + lineArray[j] + "</td>"; 
				}

			}
		}
		rows+= "</tr>"
	}
	table.innerHTML = rows;
}
function createReportHeaders(selectArray){
		var headerArray = ["Membership Number", "Name", "",null,"State","Email","Year Joined",null,"Amount Owed", "Grade"];
		var table = document.getElementById("tableHead");
		var head = "<tr>";
		for (i = 0; i < 10; i++){
			if (selectArray[i]){
				if (i == 2){continue;}
				head+= "<th>" + headerArray[i]+ "</th>";
			}
		}
		head+= "</tr>";
		table.innerHTML = head;
		
}



// Set handler for button click
document.getElementById('btnSaveFile').addEventListener('click', function (e) {
	saveToFile();
});

