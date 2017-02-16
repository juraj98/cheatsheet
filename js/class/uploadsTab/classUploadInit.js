function classUploadInit() {
	
	////TinyMCE
	tinymce.init({
		selector: '.classUploadTextarea',
		skin: 'cheatsheet',
		plugins: "advlist autolink autoresize charmap code textcolor colorpicker link image media hr table responsivefilemanager codesample fullscreen",
		statusbar: false,
		menu: {
			edit: {
				title: 'Edit',
				items: 'undo redo | cut copy paste pastetext | selectall'
			},
			insert: {
				title: 'Insert',
				items: 'link unlink image media | codesample charmap'
			},
			view: {
				title: 'View',
				items: 'visualaid | fullscreen | code'
			},
			format: {
				title: 'Format',
				items: 'bold italic underline strikethrough superscript subscript code | formats | removeformat'
			}
		},
		toolbar: [
						'undo redo | formatselect | bold italic underline strikethrough | superscript subscript | codesample charmap hr | link unlink responsivefilemanager image media | outdent indent | fullscreen code ',
						'alignleft aligncenter alignright alignjustify | bullist numlist  |  forecolor backcolor | fontsizeselect | table'
					],
		image_advtab: true,

		external_filemanager_path: "/cheatsheet%203.0/filemanager/",
		filemanager_title: "Responsive Filemanager",
		external_plugins: {
			"filemanager": baseDir + "/filemanager/plugin.min.js" // !!!! CHANGE PATH  
		}
	});
	////Content Upload
	$("#classUploadSubmit").on("click", function () {
		$("#classUploadForm").trigger("submit");
	});
	$("#classUploadForm").submit(function (e) {
		e.preventDefault();
		$('#classUploadSubjectOption')
			.attr('name', "classUploadSubjectOption")
			.attr('value', $("#classUploadSubject").attr("option"))
			.appendTo('#classUploadForm');
		console.log($('#classUploadForm').serialize());
		console.log(tinymce.get('classUploadTextarea').getContent());
	});

	////Collapsible
	$(".collapsible > li > .collapsibleHeader").on('click', function () {
		$(".active").children(".collapsibleComments").slideUp(200);
		if ($(this).parent().hasClass("active")) {
			$(this).parent().removeClass("active");
			$(this).parent().children(".collapsibleBody").slideUp(200);
			if ($(this).parent().children(".collapsibleComments").is(":visible")) {
				$(this).parent().children(".collapsibleComments").slideUp(200);
			}
		} else {
			$(".active").children(".collapsibleBody").slideUp(200);
			$(".collapsible > .active").removeClass("active");
			$(this).parent().toggleClass("active");
			$(".active").children(".collapsibleBody").slideDown(200);
		}
	}).on('click', 'i', function (e) {
		e.stopPropagation();
		switch ($(this).attr("id")) {
		case "collapsibleCommentButton":
			console.log("Comment Click");
			if ($(this).parent().parent().children(".collapsibleComments").is(":visible")) {
				$(this).parent().parent().children(".collapsibleComments").slideUp(200);
			} else {
				if ($(this).parent().parent().hasClass("active"))
					$(this).parent().parent().children(".collapsibleComments").slideDown(200);
				else {
					$(".active").children(".collapsibleBody").slideUp(200);
					$(".active").children(".collapsibleComments").slideUp(200);
					$(".collapsible > .active").removeClass("active");
					$(this).parent().parent().toggleClass("active");
					$(".active").children(".collapsibleBody").slideDown(200);
					$(this).parent().parent().children(".collapsibleComments").slideDown(200);
				}
			}
			break;
		case "collapsibleLikeButton":
			console.log("Like Click");
			break;
		case "collapsibleDislikeButton":
			console.log("Dislike Click");
			break;
		}
	});
}