# Full Example: Implementing Authentication
This example demonstrates how to build an authentication system for a website using the Skapi library. It includes four separate files:

- create_account.html: a page for creating a new user account
- login.html: a page for logging in
- forgot_password.html: a page for resetting a forgotten password
- welcome.html: a page shown to the user after successfully logging in

## create_account.html

This page allows users to create a new account for your service. It uses an HTML form to make a signup request to the Skapi server, and redirects the user to the login page upon success.

Upon account creation, the user is required to confirm their email address by following the link in the confirmation email that is sent to them. Additionally, the user has the option to set their name property when creating an account.

The form also includes a confirm_password field to allow the user to confirm their password before creating the account.

``` html
<!DOCTYPE html>
<head>
    <script src="https://cdn.jsdelivr.net/npm/skapi-js@latest/dist/skapi.js"></script>
</head>
<body>
    <h1>Create Account</h1>
    <form onsubmit="skapi.signup(event, { onerror: err => alert(err.message) })" action="login.html">
        <input type="email" name="email" placeholder="E-Mail" required>
        <br>
        <input id="password" type="password" name="password" placeholder="Password" required>
        <br>
        <input id="confirm_password" type="password" placeholder="Confirm Password" required
            onchange="validatePassword()">
        <br>
        <input name="name" placeholder="Your name">
        <br>
        <input type="submit" value="Create Account">
    </form>
</body>
<script>
    let skapi = new Skapi('service_id', 'owners_id');
    function validatePassword() {
        if (password.value != confirm_password.value) {
            confirm_password.setCustomValidity("Passwords don't match");
        }
        else {
            confirm_password.setCustomValidity('');
        }
    }
</script>
```


## login.html

This page allows users to log in to your website. Upon successful login, the user will be redirected to the welcome page.
There is also a link to the forgot password page, where users can reset their forgotten password.

``` html
<!DOCTYPE html>

<head>
    <script src="https://cdn.jsdelivr.net/npm/skapi-js@latest/dist/skapi.js"></script>
</head>

<body>
    <h1>Login</h1>
    <form onsubmit="skapi.login(event, { onerror: handleError });" action="welcome.html">
        <input type="email" name="email" required placeholder="E-Mail">
        <br>
        <input id="password" type="password" name="password" required placeholder="Password">
        <br>
        <input type="submit" value="Login">
    </form>
    <a href="forgot_password.html">Forgot Password?</a>
    <div id="recovery" style="display: none;">
        <p>This account is disabled.</p>
        <button onclick="skapi.recoverAccount('http://mywebsite.com/welcome-back').then(r => alert(r))">Send Recovery E-Mail</button>
    </div>
</body>
<script>
    let skapi = new Skapi('service_id', 'owners_id');
    function handleError(err) {
        if(err?.code === 'USER_IS_DISABLED') {
            recovery.style.display = 'block';
        }
        else {
            alert(err.message);
        }
    }
</script>
```


## forgot_password.html

This page allows users to reset their forgotten password.
To reset their password, the user should click the 'Request Code' button to receive a reset password code via email.
Once the password has been successfully reset, the user will be redirected to the login page.

``` html
<!DOCTYPE html>
<head>
    <script src="https://cdn.jsdelivr.net/npm/skapi-js@latest/dist/skapi.js"></script>
</head>
<body>
    <h1>Forgot Password</h1>
    <form id='formChangePassword' action="login.html"
        onsubmit="skapi.resetPassword(event, { onerror: err => alert(err.message) })">
        <input id='email' type='email' name="email" placeholder="E-Mail">
        <br>
        <input name="code" placeholder="Code" required>
        <span onclick="requestCode()" style="cursor: pointer; text-decoration: underline;">Request Code</span>
        <br>
        <input name="new_password" type='password' placeholder="New Password" required>
        <br>
        <input type="submit" value="Change Password">
    </form>
</body>
<script>
    let skapi = new Skapi('service_id', 'owners_id');
    async function requestCode() {
        try {
            let response = await skapi.forgotPassword({ email: email.value });
            alert(response); // "SUCCESS: Verification code has been sent."
        }
        catch (err) {
            alert(err.message);
        }
    }
</script>
```

## welcome.html

This file is for the welcome page that is displayed to a user once they have successfully logged in. The page includes a form for the user to log out of their account and a heading and paragraph displaying the user's name and email, respectively. The skapi.getProfile() method is used to retrieve the user's account data, including their name and email, and this data is then displayed on the page. If the user is not logged in, they are redirected to the login page.

``` html
<!DOCTYPE html>

<head>
    <script src="https://cdn.jsdelivr.net/npm/skapi-js@latest/dist/skapi.js"></script>
</head>

<body>
    <h1 id="welcome">Welcome #name</h1>
    <p id="your_email">Your e-mail is: #email</p>
    <form onsubmit="skapi.logout()" action="login.html">
        <input type="submit" value="Logout">
    </form>
</body>
<script>
    let skapi = new Skapi('service_id', 'owners_id', {autoLogin: true});
    skapi.getProfile().then(account => {
        if (account) {
            welcome.textContent = welcome.textContent.replace('#name', account.name || '');
            your_email.textContent = your_email.textContent.replace('#email', account.email);
        }
        else {
            // redirect user to login page
            let redirect = new URL('login.html');
            window.location.href = redirect.href;
        }
    });
</script>
```