function addClassInit() {
	$("#ccCreateClassButton").click(function() {
		console.log("click");
		var name = $("#ccName > input").val();
		var longName = $("#ccLongName > input").val();
		var school = $("#ccSchool > input").val();

		var data = {
			idToken: googleTokenId,
			nameShort: name,
		}

		if (longName) {
			data['name'] = longName;
		}
		if (longName) {
			data['school'] = school;
		}

		$.post(baseDir + "/php/create/createClass.php",
			data,
			function(_ajaxData) {

				if (_ajaxData.success) {
					popout("Success");
				} else {
					popout(_ajaxData.error.message);
				}
			}
		);

	});
	$("#ccJoinClassButton").click(function() {

		console.log("click");
		var token = $("#ccInviteToken > input").val();
		$.post(baseDir + "/php/user/joinClass.php", {
				idToken: googleTokenId,
				token: token
			},
			function(_ajaxData) {

				if (_ajaxData.success) {
					popout("Success");
				} else {
					popout(_ajaxData);
					popout(_ajaxData.error.message + " | " + _ajaxData.error.details);
				}
			}
		);
	});
}
