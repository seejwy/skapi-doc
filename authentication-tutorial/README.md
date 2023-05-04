# Full Example: Implementing Authentication

The examples here show you how to build an authentication system for a website using the Skapi library. There are four separate files:

- create_account.html: a page for creating a new user account
- login.html: a page for logging in
- forgot_password.html: a page for resetting a forgotten password
- welcome.html: a page shown to the user after successfully logging in

## create_account.html

This page lets users create a new account on your service. It uses an HTML form to make a signup request to the Skapi server and redirects them to the login page upon success.

Besides the _required_ `email` and `password` fields, the form includes an optional `name` field and a `confirm_password` field to verify the user's password.

Upon account creation, users must confirm their email address by clicking the link in the confirmation email sent to them. 

```html
<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <script src="https://cdn.jsdelivr.net/npm/skapi-js@latest/dist/skapi.js"></script>
        <title>Create Account</title>
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
</html>
```

::: warning Note
Adding a `name` attribute to the `confirm_password` field will submit the field as a parameter and throw an error.
:::

## login.html

This page lets users log in to your website. Upon successful login, the users will be redirected to the welcome page.
There is also a link to the forgot password page, where users can reset their forgotten password.

```html
<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <script src="https://cdn.jsdelivr.net/npm/skapi-js@latest/dist/skapi.js"></script>
        <title>Login</title>
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
</html>
```

## forgot_password.html

This page lets users reset their forgotten password.
To reset their password, users must click the 'Request Code' button to receive a password reset code in their registered email.
Once their password has been successfully reset, they will be redirected to the login page.

```html
<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <script src="https://cdn.jsdelivr.net/npm/skapi-js@latest/dist/skapi.js"></script>
        <title>Forgot Password</title>
    </head>
    <body>
        <h1>Forgot Password</h1>
        <form action="login.html" onsubmit="skapi.resetPassword(event, { onerror: err => alert(err.message) })">
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
</html>
```

## welcome.html

The welcome page is where users are taken after logging in. Content restricted to users only should be placed here. The page contains a `form` for users to log out of their account and an `h1` and `p` tag with placeholder content for `name` and `email`, respectively. The `getProfile()` method retrieves their account information, such as their name and email. The placeholders are then replaced with the actual values. Users who are not logged in will be redirected to the login page.

```html
<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <script src="https://cdn.jsdelivr.net/npm/skapi-js@latest/dist/skapi.js"></script>
        <title>Welcome</title>
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
</html>
```

