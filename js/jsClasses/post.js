class Post {

	constructor(_json, _id = null, _name = null, _author = null, _subject = null, _content = null, _tags = null, _created = null) {
		if (_json) {
			this.updateViaJSON(_json);
		} else {
			this.updateViaParams(_id, _name, _author, _subject, _content, _tags, _created);
		}
	}

	updateViaJSON(_json) {
		_json = JSON.parse(_json);

		this.id = _json["id"];
		this.name = _json["name"];
		this.author = _json["author"];
		this.subject = _json["subject"];
		this.content = _json["content"];
		this.tags = _json["tags"];
		this.created = _json["created"];
	}

	updateViaParams(_id, _name, _author, _subject, _content, _tags, _created) {
		this.id = _id;
		this.name = _name;
		this.author = _author;
		this.subject = _subject;
		this.content = _content;
		this.tags = JSON.parse(_tags);
		this.created = _created;
	}

	toElement() {
		this.element = $('<li><div class="collapsibleHeader"><div class="icon unselectable card-1" unselectable="on"><i class="">' + this.subject.charAt(0).toUpperCase() + '</i></div><div><h1 class="unselectable" unselectable="on">' + this.name + '</h1><h2 class="unselectable" unselectable="on">' + this.author.name + ' ' + this.author.surname + '</h2> </div><i hidden class="material-icons unselectable collapsibleCommentButton" unselectable="on">comment</i><i class="material-icons unselectable collapsibleDislikeButton" unselectable="on">thumb_down</i><i class="material-icons unselectable collapsibleLikeButton" unselectable="on">thumb_up</i><h3 class="unselectable" unselectable="on">' + this.created + '</h3></div></li>');

		var body = $('<div class="collapsibleBody"></div>');
		var tags = $('<div class="collapsibleTags"></div>')

		for (var i = 0; i < this.tags.length; i++) {
			$(tags).append('<div class="collapsibleTag">' + this.tags[i] + '</div>');
		}
		$(body).append(tags);
		$(body).append('<div class="collapsibleContent">' + this.content + '</div>');

		(this.element).append(body);

		return $(this.element).data("Post", this);
	}

	setupListeners() {
		var that = this;

		if (!this.element) {
			console.error("Element is not generated");
			return;
		}

		$(this.element).children(".collapsibleHeader").on('click', function() {
			$(".active").children(".collapsibleComments").slideUp(200);
			if ($(this).parent().hasClass("active")) {
				$(this).parent().removeClass("active");
				$(this).parent().children(".collapsibleBody").slideUp(200);
				if ($(this).parent().children(".collapsibleComments").is(":visible")) {
					$(this).parent().children(".collapsibleComments").slideUp(200);
				}
			} else {
				$(".active > .collapsibleBody").slideUp(200);
				$(".collapsible > .active").removeClass("active");
				$(this).parent().addClass("active");
				$(".active").children(".collapsibleBody").slideDown(200);
			}
		}).on('click', 'i', function(e) {
			e.stopPropagation();
			console.log("TEST");
			if ($(this).hasClass("collapsibleCommentButton")) {
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
			} else if ($(this).hasClass("collapsibleLikeButton")) {
				that.opinionChange("like");
				$(".collapsibleDislikeButton").removeClass("active");
				$(this).toggleClass("active");
			} else if ($(this).hasClass("collapsibleDislikeButton")) {
				that.opinionChange("dislike");
				$(".collapsibleLikeButton").removeClass("active");
				$(this).toggleClass("active");
			}
		});
	}

	opinionChange(_opinion) {
		if (_opinion == "like") {
			if ($(this.element).find(".collapsibleLikeButton").hasClass("active")) {
				opinion = "none";
			} else {
				opinion = "like";
			}
		} else if (_opinion == "dislike") {
			var opinion;
			if ($(this.element).find(".collapsibleDislikeButton").hasClass("active")) {
				opinion = "none";
			} else {
				opinion = "dislike";
			}
		}
		$.post(baseDir + "/php/user/postOpinion.php", {
			idToken: googleTokenId,
			postId: this.id,
			opinion: opinion
		}, function (_ajaxData) {
			if (!_ajaxData.success) {
				popout(_ajaxData.error.message);
			}
		});
	}
}
