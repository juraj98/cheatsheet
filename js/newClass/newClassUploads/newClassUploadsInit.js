function newClassUploadsInit(_id) {
	console.info("%cFunction run:\t" + "%cnewClassUploadsInit(_id)", "color: #303F9F; font-weight:700", "color: #303F9F");

	////TinyMCE
	tinymce.init({
		selector: '#cNewUploadContent',
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

		external_filemanager_path: "/filemanager/",
		filemanager_title: "Responsive Filemanager",
		external_plugins: {
			"filemanager": "/filemanager/plugin.min.js"
		}
	});

	materialFormInit();

	$(".rightOption").off().on("click", function() {
		$("#cNewUpload").slideToggle(300);
	});

	$("#cNewUploadButton").off().on("click", function() {

		//TODO: Add new post to posts

		$.post(baseDir + "/php/create/createPost.php", {
			idToken: googleTokenId,
			classId: _id,
			header: $("#cNewUploadHeader > input").val(),
			subject: $("#cNewUploadSubject > input").val(),
			content: tinyMCE.activeEditor.getContent(),
			tags: JSON.stringify($("#cNewUploadTags").attr("result").split(","))
		}, function(_ajaxData) {
			if (_ajaxData.success) {
				 popout("Success");
			} else {
				popout(_ajaxData.error.message);
			}
		});
	});

	$.post(baseDir + "/php/get/getPosts.php", {
		idToken: googleTokenId,
		classId: _id
	}, function(_ajaxData) {

		if (_ajaxData.success) {

			for (var i = 0; i < _ajaxData.data.posts.length; i++) {

				var newPost = new Post(JSON.stringify(_ajaxData.data.posts[i]));

				$("#cUploadsCollapsible").append(newPost.toElement());
				if (i == 0) {
					newPost.element.addClass("firstItem");
				} else if (i + 1 == _ajaxData.data.posts.length) {
					newPost.element.addClass("lastItem");
				}
				newPost.setupListeners();
			}

		} else {
			popout(_ajaxData.error.message);
		}
	});



}
