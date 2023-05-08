# Full Example: User profile page
The examples here show you how to build a user's profile page where users can retrieve or edit their profiles.
There are four separate files:

- profile.html: a page for viewing the user's profile.
- edit_profile.html: a page for editing the user's profile.
- change_password.html: a page for changing the user's password.
- bye.html: a page shown when users disable their account.


## profile.html

This page will retrieve and display users' profiles.

In the &lt;body&gt; section, there is a &lt;div&gt; element with an id of "user_profile" that will be used to display the user's profile information.
There are also two hyperlinks, one to "Edit user profile" and the other to "Change password".

The &lt;script&gt; block at the bottom of the HTML is where the code that retrieves and displays the user's profile information is located.
A new instance of the Skapi class is created, passing in three arguments: the service ID, service owner ID and an options object with autoLogin: true.
We are using autoLogin to true so if the user revisits the page, they will be automatically logged in.

The getProfile() method is then called on the skapi object, which retrieves the user's account information.
If the user is not logged in, the script redirects the user to the login page.

Otherwise, it declares an array of keys that will be used to display the user's profile information.
It then iterates through the array of keys and uses the innerHTML property to append the key-value pairs to the "user_profile" &lt;div&gt; element.

(profile.html)
``` html
<!DOCTYPE html>

<head>
    <script src="https://cdn.jsdelivr.net/npm/skapi-js@latest/dist/skapi.js"></script>
</head>

<body>
    <h1>User Profile</h1>
    <div id="user_profile"></div>
    <a href='edit_profile.html'>Edit user profile</a>
    <br>
    <br>
    <a href='change_password.html'>Change password</a>
</body>
<script>
    let skapi = new Skapi('service_id', 'owners_id', { autoLogin: true });

    skapi.getProfile().then(user => {
        if (user === null) {
            // user is not logged in!
            // redirect to login page.
            return window.location.replace("login.html");
        }

        let profileKeys = [
            'locale',// The country code of the user's location when they signed up.

            /**
            The user's email address.
            This should be a maximum of 64 characters and is only visible to others if the email_public option is set to true.
            The email will be unverified if it is changed.
            */
            'email',
            'email_verified', // Set to true if the user has verified their email.
            'email_subscription', // The user has subscribed to the service's email if this is set to true. The email should be verified.
            'email_public', // The user's email is public if this is set to true. The email should be verified.

            /**
            The user's phone number.
            This should be in the format "+0012341234" and is only visible to others if the phone_number_public option is set to true.
            The phone number will be unverified if it is changed.
            */
            'phone_number',
            'phone_number_public', // The user's phone number is public if this is set to true. The phone number should be verified.

            'name', // The user's name.
            'address', // The user's address.
            'gender', // The user's gender. Can be "female" or "male", or other values if neither of these are applicable.
            'birthdate', // The user's birthdate in the format "YYYY-MM-DD".

            'address_public', // The user's address is public if this is set to true.
            'gender_public', // The user's gender is public if this is set to true.
            'birthdate_public', // The user's birthdate is public if this is set to true.
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

(edit_profile.html)
```html
<!DOCTYPE html>

<head>
    <script src="https://cdn.jsdelivr.net/npm/skapi-js@latest/dist/skapi.js"></script>
</head>

<body>
    <h1>Edit Profile</h1>
    <form onsubmit='skapi.updateProfile(event, { onerror:(err)=>alert(err) })' action="profile.html">
        <label>E-mail
            <br>
            <input type="email" name="email">
        </label>
        <br>
        <br>
        <label>Make E-Mail public
            <br>
            <input type="checkbox" name="email_public">
        </label>
        <br>
        <br>
        <label>Name
            <br>
            <input name="name">
        </label>
        <br>
        <br>
        <label>Address
            <br>
            <input name="address">
        </label>
        <br>
        <br>
        <label>Make address public
            <br>
            <input type="checkbox" name="address_public">
        </label>
        <br>
        <br>
        <label>Gender
            <br>
            <input name="gender">
        </label>
        <br>
        <br>
        <label>Make gender public
            <br>
            <input type="checkbox" name="gender_public">
        </label>
        <br>
        <br>
        <label>birthdate
            <br>
            <input type="date" name="birthdate">
        </label>
        <br>
        <br>
        <label>Make birthdate public
            <input type="checkbox" name="birthdate_public">
        </label>
        <br>
        <br>
        <label>Subscribe to newsletters
            <input type="checkbox" name="email_subscription">
        </label>
        <br>
        <br>
        <input type="submit">
    </form>
    <br>
    <button onsubmit='emailVerification();'>Verify your E-Mail</h1>
</body>
<script>
    // email: (v: string) => validateEmail(v),
    // name: 'string',
    // address: 'string',
    // gender: 'string',
    // birthdate: (v: string) => validateBirthdate(v),
    // phone_number: (v: string) => validatePhoneNumber(v),
    // email_public: 'boolean',
    // phone_number_public: 'boolean',
    // address_public: 'boolean',
    // gender_public: 'boolean',
    // birthdate_public: 'boolean',
    // email_subscription: 'boolean'
    let skapi = new Skapi('service_id', 'owners_id', { autoLogin: true });

    skapi.getProfile().then(user => {
        if (user === null) {
            // user is not logged in!
            // redirect to login page.
            return window.location.replace("login.html");
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

This is an example of a web page that allows a user to change their password. The page includes a form that prompts the user to enter their current password, their new password, and to confirm the new password.

(change_password.html)
```html
<!DOCTYPE html>

<head>
    <script src="https://cdn.jsdelivr.net/npm/skapi-js@latest/dist/skapi.js"></script>
</head>

<body>
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
</body>
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

The form in the body of the page has an onsubmit attribute that calls the skapi.changePassword(event, { onerror:(err)=>alert(err) }) function when the form is submitted.
This function attempts to change the user's password using the values entered in the form fields.

The function takes two arguments, first one is the event object and the second one is an object that contains a callback function onerror to handle an error in case the password change is not successful.

The form also includes two input fields:

- current_password:
  the current password of the user
- new_password:
  the new password that the user wants to change to

When the user submits the form, the skapi.changePassword function is called, which sends a request to the service to change the user's password.
If the request is successful, the service returns a success response, and the user's password is updated. If the request is not successful, an alert message is displayed on the page.