function onLogin() {

	//On login is called from googleLogin.js
	$.post(baseDir + "/php/user/onLogin.php", {
			idToken: googleTokenId
		},
		function(_ajaxData) {
			if (_ajaxData['success']) {

				user = new User();
				user.downloadUser(function() {

					leftMenuInit();
					topMenuProfileInit();
					collapsedMenuInit();
					sideMenusListeners();
					popoutInit();
					searchInit();

					loadFromUrl();
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
