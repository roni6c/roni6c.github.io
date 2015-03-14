window.onload = function() {
	$('#prompt').click('click', function(e) {
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
						title : 'ורד - סיסמה שגויה',
						text : 'אנא נסי שוב :)',
					})
				}
			}
		});
	});
	$('#parentHP').click('click', function(e) {
		e.preventDefault();
		modal({
			type : 'prompt',
			title : 'כניסה',
			text : 'אנא הכנס סיסמה:',
			callback : function(result) {
				//if the reasult was of the PARENT current
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

	$("#mobileSubmit").submit(function(e) {
		e.preventDefault();
		var name = $('#user').val();
		var pass = $('#pass').val();
		if (pass == '2') {
			window.open("parentHP.html", "_self");
		} else
			modal({
				type : 'error',
				title : name + ' - סיסמה שגויה ',
				text : 'אנא נסה שוב',
			})
	});
}
