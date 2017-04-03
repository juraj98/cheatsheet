function onLogin() {

	//On login is called from googleLogin.js
	$.post(baseDir + "/php/user/onLogin.php", {
			idToken: googleTokenId
		},
		function(_ajaxData) {
			if (_ajaxData['success']) {

				user = new User();
				user.downloadUser(function() {

					popoutInit();
					searchInit();

					if(user.classes.length == 0){
						//User have no classes
						addClassClick();
					} else {
						loadFromUrl();
						leftMenuInit();
						topMenuProfileInit();
						collapsedMenuInit();
						sideMenusListeners();
					}

					//Temp
					afterOnLoginTemp();
				});

			} else {
				popout(_ajaxData['error']['message']);
			}
		}
	);
}
	//
