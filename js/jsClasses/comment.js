class Commnet{

	/*
		this.author
		this.text
		this.element
	*/

	constructor(_json, _author = null, _text = null){
		if(_json) {
			this.updateViaJSON(_json);
		} else {
			this.updateViaParams(_author, _text);
		}
	}

	updateViaJSON(_json){
		_json = JSON.parse(_json);

		this.author = _json["author"];
		this.text = _json["text"];
	}

	updateViaParams(_author, _text){
		this.author = _author;
		this.text = _text;
	}

	toElement(){

	}
}

/*
	<div class="comment">
		<img class="card-1" src="images/profilePicPlaceholder.png">
		<div style="width: 1003px;">
			<h1>Name Surname</h1>
			<p>Comment Comment Comment</p>
		</div>
	</div>
*/
