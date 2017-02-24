function searchInit(){
	var previousSearch;
	$("#searchBox > input").on("change keyup paste", function() {
		console.log("searchbox");

		var value = $.trim($(this).val());

		//easter egg
		if(value == "eastereggmusic"){
			easterEggMusic();
			return;
		}

		if (value != "" && value != " " && value != previousSearch) {
			previousSearch = value.split(" ");

			$.post(baseDir + "/php/search/search.php", {
				idToken: googleTokenId,
				searchString: JSON.stringify(previousSearch)
			}, function(_ajaxData) {
				if (_ajaxData.success) {

				} else {
					popout(_ajaxData.error.message);
				}
			});

		}

	});
}
