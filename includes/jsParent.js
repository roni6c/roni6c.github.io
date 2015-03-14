var data = [];

$(document).ready(function() {
	//first entry to parentPage
	$.getJSON("includes/data.json", function(d) {
		$.each(d, function(key, val) {
			data.push(val);
		});
		parent();
	});

	$("#phone").click(function(e) {
		window.open("phone.html", "_self");
	});

	$("#mobileGallery").click(function(e) {
		window.open("mobileGallery.html", "_self");
	});

	$("#contactPage").click(function(e) {
		window.open("contactPage.html", "_self");
	});

	$("#backToParent").click(function(e) {
		window.open("parentHP.html", "_self");
	});

	//mobileGallery JQ
	if ($('#lightGallery').length != 0) {
		$('#lightGallery').lightGallery({
			showThumbByDefault : true,
			addClass : 'showThumbByDefault'
		});
	}
});
//in-case we want to connect from parent to nanny - we need to enter password
$(document).ready(function() {
	$('#prompt').click(function(e) {
		e.preventDefault();
		modal({
			type : 'prompt',
			title : 'כניסה',
			text : 'אנא הכנס סיסמה:',
			callback : function(result) {
				//if the reasult was of the NANNY current
				if (result == '1') {
					window.open("nannyHP.html", "_self");
				}//the password was incorrect!
				else if (result != '1') {
					modal({
						type : 'error',
						title : 'סיסמה שגויה',
						text : 'אנא נסה שוב',
					})
				}
			}
		});
	});
});

//////////////////////////////////////////////////// PARENT HOME PAGE/////////////////////////////////////////////////
function parent() {
	//i picked here some specific child and later im going to bring all his data dynamicly from DB and Json
	$child = 3;
	var i = 1;
	//appending first child profile.
	$('#profileParentBox').append("<br><h3>" + data[$child].name + "</h3><br><h5>הורים: " + data[$child].parents + "</h5><br><h5>גיל: " + data[$child].age + "</h5><br><h5>פורמולה: " + data[$child].formula + "</h5><br>");
	$('#profileParentBox').append("<img class='childPictureProfile' src='" + data[$child].picture + "'>");
	$.each(data, function(key, val) {
		$('#childrenPictures').append("<img id='childernPicParent' src='" + val.picture + "'>");
		i++;
	});

	//bring all the data of the specific child
	$.get("db.php", {
		parentChildPage : 'דנה לוי'
	}, function(data) {
		$('#foodfromDB').html(data);
	});

	//parent list of food button
	$(document).on('click', '#listParentFood', function(e) {
		e.preventDefault();
		$('body').empty().load('parentList.html #wrapper', function() {
			$("#datepicker").datepicker();
			$('#profileParentBox').append("<img class='childPictureProfile' id='proPic' src='" + data[$child].picture + "'><br><h1>" + data[$child].name + "</h1><br><br>");
			console.clear();
			//console.log("i cleard the console because the CALENDER JQ made a lot of logs....");
			$.get("db.php", {
				parentChildPage : 'דנה לוי'
			}, function(data) {
				$('#foodfromDB2').html(data);
			});
		});
	});
};