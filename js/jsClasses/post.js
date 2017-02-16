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
		this.element = $('<li><div class="collapsibleHeader"><div class="icon unselectable card-1" unselectable="on"><i class="">' + this.subject.charAt(0).toUpperCase() + '</i></div><div><h1 class="unselectable" unselectable="on">' + this.name + '</h1><h2 class="unselectable" unselectable="on">' + this.author.name + ' ' + this.author.surname + '</h2> </div><i hidden class="material-icons unselectable" class="collapsibleCommentButton" unselectable="on">comment</i><i class="material-icons unselectable" class="collapsibleDislikeButton" unselectable="on">thumb_down</i><i class="material-icons unselectable" class="collapsibleLikeButton" unselectable="on">thumb_up</i><h3 class="unselectable" unselectable="on">' + this.created + '</h3></div></li>');

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
		if (!this.element) {
			console.error("Element is not generated");
			return;
		}

		$(this.element).children(".collapsibleHeader").on('click', function () {
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

}

/*
;<li class="firstItem">
;	<div class="collapsibleHeader">
;		<div class="icon unselectable card-1" unselectable="on"><i class="">' + this.subject.charAt(0).toUpperCase() + '</i></div>
;		<div>
;			<h1 class="unselectable" unselectable="on">' + this.name + '</h1>
;			<h2 class="unselectable" unselectable="on">' + this.author + '</h2>
;		</div>
;		<i hidden class="material-icons unselectable" id="collapsibleCommentButton" unselectable="on">comment</i>
;		<i class="material-icons unselectable" id="collapsibleDislikeButton" unselectable="on">thumb_down</i>
;		<i class="material-icons unselectable" id="collapsibleLikeButton" unselectable="on">thumb_up</i>
;		<h3 class="unselectable" unselectable="on">12:34 01.05.2016</h3>
;	</div>
;	<div class="collapsibleBody">
;		<div class="collapsibleTags">
			<div class="collapsibleTag">Tag 1</div>
;		</div>
		<div class="collapsibleContent">

		</div>
;	</div>
;</li>
*/
