
	<!DOCTYPE html>
	<html>

	<head>
		<meta charset="utf-8">
		<title>Cheatsheet - Index</title>
		<link rel="stylesheet" type="text/css" href="css/style.css">
		<link href='https://fonts.googleapis.com/css?family=Roboto:400,300,700' rel='stylesheet' type='text/css'>
		<script src="https://ajax.googleapis.com/ajax/libs/jquery/2.2.0/jquery.min.js"></script>

		<!-- Google Credentials API -->
		<script src="https://apis.google.com/js/platform.js" async defer></script>
		<meta name="google-signin-client_id" content="823958943773-avq5f2qst0q7t0l8u1eddhv3rtr73c5h.apps.googleusercontent.com">
		<script>
				window.location.replace("/cheatsheet.html");
			function onSignIn(googleUser) {
				var profile = googleUser.getBasicProfile();
				var id_token = googleUser.getAuthResponse().id_token;
				console.log('ID token: ' + id_token);
				console.log('Email: ' + profile.getEmail());
				console.log('Name: ' + profile.getGivenName());
				console.log('Surname: ' + profile.getFamilyName());
				console.log('Image: ' + profile.getImageUrl());

				$.post("php/googleLogin/googleToDatabaseIdHandle.php", {
					idToken: id_token,
					email: profile.getEmail(),
					name: profile.getGivenName(),
					surname: profile.getFamilyName(),
					image: profile.getImageUrl()
				}, function (data) {
					if (data.charAt(0) == "e") {
						alert("Error : " + data);
					} else {
						console.log("Logged successfully: " + data);
					}
				});
			}
		</script>
		<!--    <script type="text/javascript" src="js/main.js"></script>-->

		<script type="text/javascript">
			$(document).ready(function () {
				$("#registerForm").submit(function (e) {
					e.preventDefault();
					var rName = $('input[name=name]', '#registerForm').val(),
						rSurname = $('input[name=surname]', '#registerForm').val(),
						rUsername = $('input[name=username]', '#registerForm').val(),
						rMail = $('input[name=mail]', '#registerForm').val(),
						rPassword = $('input[name=password]', '#registerForm').val(),
						rGender = $('input[name=gender]:checked', '#registerForm').val();

					$.post("php/register.php", {
						name: rName,
						surname: rSurname,
						username: rUsername,
						mail: rMail,
						password: rPassword,
						gender: rGender
					}, function (data) {
						if (data == 0) {
							alert("Reg ok");
						} else {
							alert("Reg Nope. Code: " + data);
						}
					});
				});
				$("#loginForm").submit(function (e) {
					e.preventDefault();
					var lNoe = $('input[name=noe]', '#loginForm').val(),
						lPassword = $('input[name=password]', '#loginForm').val();
					console.log(lNoe + ", " + lPassword);

					$.post("php/login.php", {
						usernameOrMail: lNoe,
						password: lPassword
					}, function (data) {
						if (data == 0) {
							window.location.replace("cheatsheet.php");
						} else {
							alert("Logint Nope. Code: " + data);
						}
					});
				});
			});
		</script>
	</head>

	<body>
		<h1>Register</h1>
		<form id="registerForm">
			<input type="text" maxlength="50" placeholder="Name" name="name">
			<br>
			<input type="text" maxlength="50" placeholder="Surname" name="surname">
			<br>
			<input type="text" maxlength="25" placeholder="Username" name="username">
			<br>
			<input type="email" max="100" placeholder="E-mail" name="mail">
			<br>
			<input type="password" max="255" placeholder="Password" name="password">
			<br>
			<input name="gender" type="radio" value="M" />Male
			<br>
			<input name="gender" type="radio" value="W" />Female
			<br>
			<input name="gender" type="radio" value="O" />Other
			<br>
			<input type="submit" value="Register">
		</form>
		<h1>Login</h1>
		<form id="loginForm">
			<input type="text" maxlength="100" placeholder="Name or E-mail" name="noe">
			<br>
			<input type="password" max="255" placeholder="Password" name="password">
			<br>
			<input type="submit" value="Log In">
		</form>
		<div class="g-signin2" data-onsuccess="onSignIn"></div>
	</body>

	</html>
