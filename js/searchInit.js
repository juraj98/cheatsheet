function searchInit() {

	$("#searchBox > input").on("focusin", function() {
		$("#searchBox, #searchResults").addClass("active");
	});
	$("#searchBox > input").on("focusout", function() {
		$("#searchBox, #searchResults").removeClass("active");
	});

	var previousSearch;
	$("#searchBox > input").on("change keyup paste", function() {
		console.log("searchbox");

		var value = $.trim($(this).val());

		if (value != "" && value != " " && value != previousSearch) {
			previousSearch = value.split(" ");

			$.post(baseDir + "/php/search/search.php", {
				idToken: googleTokenId,
				searchString: JSON.stringify(previousSearch)
			}, function(_ajaxData) {
				if (_ajaxData.success) {
					//Classes
					var classGroup = $('<div class="srGroups"><h1>Classes:</h1></div>');
					if (_ajaxData.data.classes.length == 0) {
						classGroup.append($('<span class="nothing">No classes found</span>'));
					} else {
						_ajaxData.data.classes.forEach(function(item, index) {
							var classElement = $('<span class="srClass">' + item.nameShort + '</span>').data("classId", item.classId);
							classElement.click(function(){
								newClassClick($(this).data("classId"));
							});
							classGroup.append(classElement);
						});
					}
					//Users
					var usersGroup = $('<div class="srGroups"><h1>Users:</h1></div>');
					if (_ajaxData.data.users.length == 0) {
						usersGroup.append($('<span class="nothing">No users found</span>'));
					} else {
						_ajaxData.data.users.forEach(function(item, index) {
							usersGroup.append($('<span class="srClass">' + item.name + " " + item.surname + '</span>').data("userId", item.id))
						});
					}
					$("#searchResults").html("").append(classGroup).append(usersGroup);
				} else {
					popout(_ajaxData.error.message);
				}
			});

		} else if(value == ""){
			$("#searchResults").html("");
		}

	});
}
