function uploadPhotoInit() {

	$("#uploadButton").click(function () {
		$("#uArea").show();
	});
	$("#uArea").click(function (e) {
		if (e.target !== this) {
			return;
		}
		$(this).hide();
	});
	$("#uDropAreaLabel").click(function () {
		$("#uDropArea").trigger("click");
	});
	uploadDropzone = new Dropzone("#uDropArea", {
		url: "/php/set/setImage.php",
		maxFiles: 1,
		dictDefaultMessage: "Drop files here to upload",
		dictFallbackMessage: "Your browser does not support drag'n'drop file uploads.",
		acceptedFiles: "image/*"
	});

	$("#uCancelButton").click(function () {
		$("#uArea").hide();
	});
}
