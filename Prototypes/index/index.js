
$(document).ready(function (){

	var auth2; // The Sign-In object.
	var googleUser; // The current user.

	/**
	 * Calls startAuth after Sign in V2 finishes setting up.
	 */
	var appStart = function() {
		gapi.load('auth2', initSigninV2);
	};

	/**
	 * Initializes Signin v2 and sets up listeners.
	 */
	var initSigninV2 = function() {
		auth2 = gapi.auth2.init({
			client_id: '67374956220-8icaiq0lhb7p0cbnc2qfhhrmomc0drcr.apps.googleusercontent.com',
			fetch_basic_profile: true,
			scope: 'profile'
		});
//		console.log("initSigninV2");
		// Listen for sign-in state changes.
		auth2.isSignedIn.listen(signinChanged);
		// Listen for changes to current user.
		auth2.currentUser.listen(userChanged);
		// Sign in the user if they are currently signed in.
		if (auth2.isSignedIn.get() == true) {
			auth2.signIn();
		}
		// Start with the current live values.
		refreshValues();
	};
	/**
	 * Listener method for sign-out live value.
	 *
	 * @param {boolean} val the updated signed out state.
	 */
	var signinChanged = function(val) {
//		console.log('Signin state changed to ', val);
	};
	/**
	 * Listener method for when the user changes.
	 *
	 * @param {GoogleUser} user the updated user.
	 */
	var firstTimeLaod = true;
	var userChanged = function(user) {
//		console.log('User now: ', user);
		googleUser = user;
		updateGoogleUser();

		googleProfile = auth2.currentUser.get().getBasicProfile();
		googleTokenId = auth2.currentUser.get().getAuthResponse().id_token;

		if (googleProfile) {
      console.log("Redirect");
			window.location.replace("/cheatsheet.html");
		}
	};
	/**
	 * Updates the properties in the Google User table using the current user.
	 */
	var updateGoogleUser = function() {
		if (googleUser) {

		} else {

		}
	};

	/**
	 * Retrieves the current user and signed in states from the GoogleAuth
	 * object.
	 */
	var refreshValues = function() {
		if (auth2) {
			googleUser = auth2.currentUser.get();
			updateGoogleUser();
		}
	}

	appStart();

});
