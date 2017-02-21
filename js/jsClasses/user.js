class User {

	saveUser() {
		$.post(baseDir + "/php/user/saveUser.php", {
				idToken: googleTokenId,
				userId: this.id,
				username: this.username,
				mail: this.mail,
				name: this.name,
				surname: this.surname,
				gender: this.gender,
				image: this.image
			},
			function(_ajaxData) {
				if (_ajaxData['success']) {
					return true;
				} else {
					popout(_ajaxData['error']['message']);
				}
			}
		);
	}

	downloadUser(_callback = null, _userId = null) {
		var that = this;
		var userIdSet = (_userId == true);
		var data;

		if (userIdSet) {
			data = {
				idToken: googleTokenId,
				userId: _userId
			}
		} else {
			data = {
				idToken: googleTokenId
			}
		}

		$.post(baseDir + "/php/user/getUser.php",
			data,
			function(_ajaxData) {

			if (_ajaxData['success']) {
					that.id = _ajaxData['data']['userData']['id'];
					that.username = _ajaxData['data']['userData']['username'];
					that.name = _ajaxData['data']['userData']['name'];
					that.surname = _ajaxData['data']['userData']['surname'];
					that.gender = _ajaxData['data']['userData']['gender'];
					that.image = _ajaxData['data']['userData']['image'];
					that.cheatpoints = _ajaxData['data']['userData']['cheatpoints'];

					if(!userIdSet){
						that.mail = _ajaxData['data']['userData']['mail'];
						that.classes = _ajaxData['data']['userData']['classes'];
					}

					_callback();
				} else {
					popout(_ajaxData['error']['message']);
				}

			}
		);
	}

}
