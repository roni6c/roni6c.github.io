var data = [], foodSelectedCheckBoxes = [], childShareFood = [];
var child, childName;

$(document).ready(function() {
	var i = 1;
	$.getJSON("includes/data.json", function(d) {
		$.each(d, function(key, val) {
			data.push(val);
			//add the children buttons to nanny DYNAMICLY from Json
			$('#butterflyBox > section').append("<button id='p" + i + "' class='childBox'><p class='idChild' id='p" + i + "'>" + val.name + "</p><input type='image' src=' " + val.picture + "'class='picChild' id='p" + i + "'></button>");
			i++;
		});
		nannyHP();
	});
});
//in-case we want to connect from nanny to parent
$(document).ready(function() {
	$('#parentHP').click(function(e) {
		e.preventDefault();
		modal({
			type : 'prompt',
			title : 'כניסה',
			text : 'אנא הכנס סיסמה:',
			callback : function(result) {
				//if the reasult was of the NANNY current
				if (result == '2') {
					window.open("parentHP.html", "_self");
				}//the password was incorrect!
				else if (result != '2') {
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
//////////////////////////////////////////////////// NANNY HOME PAGE/////////////////////////////////////////////////

function nannyHP() {
	//click on specific child
	$(document).on('click', '.childBox', function(e) {
		var idClicked = e.target.id;
		//adding child details to "other" dynamicly page (without refreshing)
		$('body').empty().load('profiles.html #wrapper', function() {
			profiles(idClicked, data);
			/////////////////////////////////////////////click on the "accept meal" button////////////////////////////////////////////
			$('#db').on('submit', function(e) {
				e.preventDefault();
				$note = $("#note").val();
				$other = $("#otherFoodSelect").val();
				// the v image
				//check if ALL the inputs are empty
				if (!$('#note').val() && !$('#otherFoodSelect').val() && $(".foodTypes :checkbox:checked").length == 0 && $("#shareMeal :checkbox:checked").length == 0)
					return false;
				else {
					$('#board').append("<img src='images/v.png'> ");
					$("#foodTypes input[type=checkbox]:checked").each(function() {
						foodSelectedCheckBoxes.push($(this).val());
					});
					//the food that the nanny chose
					var i = 0;
					for ( i = 0; i < foodSelectedCheckBoxes.length; i++) {
						$('#board').append(foodSelectedCheckBoxes[i] + " ");
					}
					//get the share childrens
					$("#shareMeal input[type=checkbox]:checked").each(function() {
						childShareFood.push($(this).val());
					});
					i = 0;
					if (childShareFood.length > 0)
						$('#board').append("<b>בשיתוף: </b>");
					for ( i = 0; i < childShareFood.length; i++) {
						$('#board').append(childShareFood[i] + " ");
					}
					//the text areas
					if ($("#otherFoodSelect").val())
						$('#board').append("<b>אחר: </b>" + $("#otherFoodSelect").val() + " ");
					if ($("#note").val())
						$('#board').append("<b>הערות: </b>" + $("#note").val());

					//send the data without refresh!!!
					$.ajax({
						type : 'post',
						url : 'db.php',
						data : {
							//left=name in php, right= name here
							childName : childName,
							other : $other,
							notee : $note,
							childShareFood : childShareFood,
							foodSelected : foodSelectedCheckBoxes
						},
						success : function() {
							modal({
								type : 'confirm',
								title : 'הארוחה אושרה!',
								text : 'הפעולה בוצעה בהצלחה :)',
								callback : function(result) {
									if (result == false) {
										//false = return to kids page , true = stay on this page
										window.open("nannyHP.html", "_self");
									}
								}
							});
						}
					});
					$('#board').append("<br>");
				}
				//clean the food selction
				foodSelectedCheckBoxes.length = 0;
				//clean the array
				childShareFood.length = 0;
				//clean the textarea
				$("#note").val('');
				$("#otherFoodSelect").val('');
				$('input:checkbox').removeAttr('checked');
			});
		});
	});
}

function profiles(idClicked, data) {
	var lastChar = idClicked.substr(idClicked.length - 1);
	// give me the last char id. example: from P2 -=> 2
	child = data[lastChar - 1];
	childName = child.name;

	//check who is the child and bring all the data from DB

	$.get("db.php", {
		childDetails : childName
	}, function(data) {
		$('#board').html(data);
	});

	//append dynamicly child profile
	$('#profileBox').append("<h3>" + child.name + "</h3><h5>הורים: " + child.parents + "<br><br>גיל: " + child.age + "<br><br>פורמולה: " + child.formula + "</h5><br>");
	$('#profileBox').append("<img class='childPictureProfile' id='profilePicChild' src='" + child.picture + "'>");

	//append dynamicly food tabs (from another html)
	$("#foodTypes").load("nannyFood.html" + " #formula");
	$('#formula').attr('class', 'foodSelected');

	//make the formula to be the first page!
	$lastIdSelected = ('formula');

	//clicking on the food-Types tabs
	$('#foodBox a').on('click', function(event) {//clicking on the foodTypes
		event.preventDefault();
		$foodId = event.target.id;
		$("#foodTypes").empty();
		$("#foodTypes").load("nannyFood.html" + " #" + $foodId);
		$('#' + $lastIdSelected).removeClass("foodSelected");
		$('#' + $foodId).attr('class', 'foodSelected');
		$lastIdSelected = $foodId;
	});

	//appending dynamicly other kids in the gaurden, with chicking that the "clicked child" is not there.
	$.each(data, function(key, val) {
		if (lastChar - '1' != key) {
			$('#shareMeal').append("<img class='childs' src=" + val.picture + "><input type='checkbox' name='childShareFood[]' value=" + val.name + "></input><br><br>");
		}
	});
	$('#analog-clock').clock({
		offset : '+2',
		type : 'analog'
	});
}
