// JavaScript Document

// using localstorage methods: setItem(), getItem(), removeItem(0, lsCache() - more session based
function updateName()	{
// Set the new customer's name into local storage and redisplay the guest area using "set Guest" function
// Also, delete all Guest cart items
	localStorage.setItem("lsName", document.forms["sign-in"].name.value.trim());
	clearGuestCart(); // As soon as a named user signs is, delete everything from Guest's cart
	setGuest();
	window.location.href="cart.html";
	console.log("All items from Guest cart should be deleted!");
}

function clearName()	{	
 // reset the customer's name to nothing and redisplay the guest area using "set Guest" function
	localStorage.removeItem("lsName");
	setGuest();
	window.location.reload();
	console.log("User just signed out!");
}

function setGuest()	{		
	// If the customer has not signed in, then call them "Guest" and give him/her a text box and button to sign in with.
	// If the customer already signed in, welcome him by name and give him a buttom to sign out with. 	
	// Place all of these items in the given "guest area" div.
	var guestArea = document.getElementById("divGuestArea");
	var textBox = "";
				// ******** Specially for Google Chrome ***************
				if(typeof localStorage["lsName"] !== "undefined" && localStorage["lsName"] !== "undefined")
				// ********** http://stackoverflow.com/questions/23221642/unexpected-token-u-json-parse-issue
				// ****** I had the same problem with JSON.parse, in Chrome only! ***********
	var userName = localStorage.getItem("lsName");
	
		if(!userName) {
			userName="Guest";
			textBox = "<label>Enter your name: <input type='text' name='name' id='name' /></label>";
			localStorage.setItem('userNo', '-1'); // I could not figure out how to separate reqistered users from guests...
			
		} else {
			var newUser = true; // flag
			var userNo; // will store the index of the user's account in userAccounts array 
				// ******** Specially for Google Chrome ***************
				if(typeof localStorage["userAccounts"] !== "undefined" && localStorage["userAccounts"] !== "undefined")
			var userAccounts = localStorage.getItem('userAccounts'); 
			
			if(!userAccounts) { // if userAccounts array has not yet been stored in localStorage, ...
				userAccounts = []; // just create a new one
			} else {
				userAccounts = JSON.parse(userAccounts); // If it exist in LS, retrieve it and assign to local namesake variable
				for(var i=0; i<userAccounts.length; i++) {
					if(userName == userAccounts[i].name && userName!="Guest") { 
						userNo = i;
						newUser = false;
						break;
					}
				}
			} 
			if(newUser) {
				var user = { name: userName, products: ['q1','q2','q3','q4'], quantities: [0,0,0,0] };
				userAccounts.push( user );
				userNo = userAccounts.length-1; // as soon as we added a new element in array, its new length equals to length-1
				localStorage.setItem('userAccounts', JSON.stringify(userAccounts)); // create or update userAccounts array
			}
			localStorage.setItem('userNo', JSON.stringify(userNo)); // store a current user index in LS
		}
	var firstName = userName.split(" ")[0];  
		// transform firstName's 1st char-r to its uppercase equivalent, then append the rest
		firstName = firstName[0].toUpperCase() + firstName.slice(1); 
	var signInButton = "<input type='submit' value='Sign-In' onclick='updateName()' />";
	var signOutButton = "<input type='submit' value='Sign-Out' onclick='clearName()' />";
	
	var formContents = "<form name='sign-in'>" + textBox + "<br/>";
		formContents += userName=="Guest" ? signInButton : signOutButton;
		formContents += "</form>";
	
	guestArea.innerHTML = "<p>Welcome <span id='firstName'>" + firstName + "</span>!</p>" + formContents;
}