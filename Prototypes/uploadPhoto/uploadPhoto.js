function uploadPhotoInit() {

	console.log("++++++++++++++++++++uploadPhotoInit");

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

	console.log("uploadDropzoneInit");
	uploadDropzone = new Dropzone("#uDropArea", {
		url: "/php/set/setImage.php",
		maxFiles: 1,
		dictDefaultMessage: "Drop files here to upload",
		dictFallbackMessage: "Your browser does not support drag'n'drop file uploads.",
		acceptedFiles: "image/*"
	});
	uploadDropzone.on("sending", function (file, xhr, formData) {
		formData.append("idToken", googleTokenId);
		formData.append("classId", googleTokenId);
	});
	uploadDropzone.on("success", function (params) {
		console.log("Success");
		console.log(params.xhr.response);
	});
	$("#uCancelButton").click(function () {
		$("#uArea").hide();
	});
}
