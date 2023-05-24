# Full Example: User profile page
The examples here show you how to build a user's profile page where users can retrieve or edit their profiles.
There are four separate files:

- profile.html: a page for viewing the user's profile.
- edit_profile.html: a page for editing the user's profile.
- change_password.html: a page for changing the user's password.
- bye.html: a page shown when users disable their account.


## profile.html

This page will retrieve and display users' profiles.

In the `<body>` section, there is a `<div>` element with an id of `user_profile` that is used to display the user's profile information.
<!-- There are also links to the edit user profile page and the change password page. -->

The `<script>` block at the bottom of the page is where the we generate the user's profile.

1. A new instance of the `skapi` class is instantiated by passing in the service ID and service owner ID. Note `autologin` is set to `true`. Refer to [Initializing the skapi library](/getting-started/#initializing-the-skapi-library) 
2. The `getProfile()` method is then called to retrieve the user's account information.
3. For each profile key in the `array`, if the user object has it, is inserted into the page using innerHtml.

For more information on [User Profile](/api-reference/data-types/#user-profile)

``` html
<!DOCTYPE html>
<script src="https://cdn.jsdelivr.net/npm/skapi-js@latest/dist/skapi.js"></script>
<h1>User Profile</h1>
<div id="user_profile"></div>
<a href='edit_profile.html'>Edit user profile</a>
<br>
<br>
<a href='change_password.html'>Change password</a>
<script>
    let skapi = new Skapi('service_id', 'owners_id', { autoLogin: true });

    skapi.getProfile().then(user => {
        let profileKeys = [
            'locale',
            'email',
            'email_verified',
            'name'
        ];

        for (let k of profileKeys) {
            if (user.hasOwnProperty(k)) {
                user_profile.innerHTML += `<p>${k}: ${user[k]}</p>`;
            }
        }
    });
</script>
```


## edit_profile.html

This page is for editing user's account profile and e-mail verification.

The `updateProfile()` method accepts a `SubmitEvent` so we could use `<input>` fields with the `name` attribute to update a user's profile. The `getProfile()` method retrieves the user's profile information and the result is looped to prefill the value of existing fields.

```html
<!DOCTYPE html>
<script src="https://cdn.jsdelivr.net/npm/skapi-js@latest/dist/skapi.js"></script>
<h1>Edit Profile</h1>
<form onsubmit='skapi.updateProfile(event, { onerror:(err)=>alert(err) })' action="profile.html">
    <label>Name
        <br>
        <input name="name">
    </label>
    <br>
    <label>E-mail
        <br>
        <input type="email" name="email">
    </label>
    <br>
    <button onclick="emailVerification();">Verify your E-Mail</button>
    <br>
    <label>
        <input type="checkbox" name="email_public">
        Make E-Mail public
    </label>
    <br>
    <label>
        <input type="checkbox" name="email_subscription">
        Subscribe to newsletters
    </label>
    <br>
    <br>
    <input type="submit">
</form>
<script>
    let skapi = new Skapi('service_id', 'owners_id', { autoLogin: true });

    skapi.getProfile().then(user => {
        for (const [key, value] of Object.entries(user)) {
            let el = document.querySelector(`[name=${key}`);
            if(el) {
                el.value = value;
            }
        }
    });

    async function emailVerification() {
        // Send verification code to user's E-Mail
        await skapi.verifyEmail();
        let code = prompt('Enter the verification code:');
        await skapi.verifyEmail({ code });
        alert('Your E-Mail is verified!');
    }
</script>
```


## change_password.html

This is an example of a web page that allows a user to change their password. 
The `changePassword()` method accepts a `SubmitEvent` so we could make use of `<input>` fields with the `name` attribute to update their password.

```html
<!DOCTYPE html>
<script src="https://cdn.jsdelivr.net/npm/skapi-js@latest/dist/skapi.js"></script>
<h1>Change Password</h1>
<form onsubmit='skapi.changePassword(event, { onerror:(err)=>alert(err) })' action="profile.html">
    <label for="current_password">Current password</label>
    <br>
    <input id='current_password' type="password" name="current_password">
    <br>
    <br>
    <label for="new_password">New password</label>
    <br>
    <input id="new_password" type="password" name="new_password">
    <br>
    <br>
    <input type="submit">
</form>
<script>
    let skapi = new Skapi('service_id', 'owners_id', { autoLogin: true });

    skapi.getProfile().then(user => {
        if (user === null) {
            // user is not logged in!
            // redirect to login page.
            return window.location.replace("login.html");
        }
    });
</script>
```