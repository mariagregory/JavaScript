// JavaScript Document
// Checkout Page functions

function processOrder() {
// This function is called when user presses "Complete Payment" button on "checkout" page.
// The function reads values from all fields, checks if all required fields are filled, calculates the tax sum and a total sum to pay.
// Then it generates a receipt, stores its content in LS, and writes it in the receipt area of a "thankyou.html" page, where it redirects the user to
	var receipt = document.getElementById("receipt"); 
	var fullName = document.forms['checkout'].fullName.value;
	var firstName = document.getElementById('firstName').innerHTML;
	var grandTotal = document.getElementById("total");
		if(grandTotal) { grandTotal = parseFloat(grandTotal.innerHTML); }
		else { grandTotal = 0; }
	var taxRate = 8/100, tax;
	var phoneNo = document.forms["checkout"].phoneNo.value;
	var cardNo = document.forms["checkout"].cardNo.value;
	var goAheadWithReceipt = true; // a flag to indicate if it's ok to print a receipt. "True" by default	
	
	var getShipping = function() {
		var elements = document.forms["checkout"].shipping$;
		for(var i=0; i<elements.length; i++) {
			if(elements[i].checked) {
				return parseFloat(elements[i].value);
			} 
		} return -1; // This should never happen because I set 'checked' attribute to the 1st radio button, so at least 1 option is selected 
	};
	
	var address = {
		streetNo: document.forms["checkout"].streetNo.value,
		city: document.forms["checkout"].city.value,
		state: document.forms["checkout"].state.value,
		zip: document.forms["checkout"].zip.value,
		postCode: document.forms["checkout"].postCode.value,
		country: document.forms["checkout"].country.value,
		showAddress: function() {		
			return this.streetNo + ', ' + this.city + ' ' + this.state + ', ' + this.zip + ' ' + this.country;
		}
	};
	
	var getPayMethod = function() {
		var payMethods = document.forms["checkout"].payMethod;
		for(var i=0; i<payMethods.length; i++) {
			if(payMethods[i].selected) {
				return payMethods[i].value;
			} 
		} return 'cash';
	};
	// determine if it's OK to proceed with the receipt generation	
	goAheadWithReceipt = reqFieldsFilled(document.getElementsByClassName('required')) && isValidPhoneNo(phoneNo) && isValidCardNo(cardNo); 
			
	if(goAheadWithReceipt) {
		var receiptContents; // a local variable to store the receipt contents before writing it to 'receipt' innerHTML 
							//(so </p> tag is not inserted automatically between statements
		tax = grandTotal*taxRate;
		receiptContents = firstName + ", thank you for your business!<br/>" 
			+ "Your order will be shipped to the address: " + address.showAddress() +"<br/>"
			+ "Receiver: " + fullName + "<br/>"
			+ "Subtotal: $" + grandTotal.toFixed(2) + "<br/>"
			+ "Tax (" + taxRate*100 + "%): $" + tax.toFixed(2) + "<br/>"
			+ "Shipping: $" + getShipping().toFixed(2) + "<br/>"
			+ "Total Balance: $" + (grandTotal+tax+getShipping()).toFixed(2) + "<br/><br/>";
		if(!grandTotal) {
			receiptContents += "<br/><span class='notice'>*** Congratulation! You've just bought NOTHING for only " + getShipping() + " bucks!!! ***</span><br/><br/>";
		}
		receiptContents += "Thank you for paying with " + getPayMethod() + "!";	
		
		// copy the receipt contents to 'receipt' div area surrounding it with 'p' tags
		localStorage.setItem('receipt', receiptContents);
		window.location.href = "thankyou.html"; // redirect to "thankyou" page, where the receipt is to be displayed
	}
}
// check if all required fields are filled. If the first non-filled required field is found, it selects it and does NOT let to generate a receipt.
function reqFieldsFilled(reqFields) {
	for(var i=0; i<reqFields.length; i++) {
		if(!reqFields[i].value || reqFields[i].value.match('REQUIRED')) {
			reqFields[i].value = "REQUIRED!";
			reqFields[i].style.borderColor='red'; reqFields[i].select(); 
			return false;
		} else { reqFields[i].style.borderColor='';  }
	} return true;
}
// check if all the phone number entered is of acceptable format. If it's not, the field becomes selected, and the receipt is not generated.
function isValidPhoneNo(phoneNo) {	
	var phoneNoFormat1 = /^\d{3}-\d{3}-\d{4}$/; phoneNoFormat2 = /^[(]\d{3}[)] \d{3}-\d{4}$/; phoneNoFormat3 = /^\d{10}$/;
	if(!phoneNoFormat1.test(phoneNo) && !phoneNoFormat2.test(phoneNo) && !phoneNoFormat3.test(phoneNo) ) {
		document.getElementById("phoneHint").setAttribute("class", "notice");
		document.forms['checkout'].phoneNo.style.borderColor='red'; document.forms['checkout'].phoneNo.select(); 
		return false;
	}
	document.getElementById("phoneHint").removeAttribute("class");
	return true; 
}
// check if all the card number entered is of acceptable format. If it's not, the field becomes selected, and the receipt is not generated.
function isValidCardNo(cardNo) {
	var cardNoFormat = /^\d{16}$/;
	if(!cardNoFormat.test(cardNo)) { 
		document.getElementById("cardHint").setAttribute("class", "notice");
		document.forms['checkout'].cardNo.style.borderColor='red'; document.forms['checkout'].cardNo.select(); 
		return false; 
	} 
	document.getElementById("cardHint").removeAttribute("class");
	return true;
}
// This adds 10 <option> objects specifying 4-digit year values inside the <select> object.
function expandYears(name) { // 'name' parameter takes 'expYear' as an argument
	var selectYear = document.forms['checkout'].elements[name]; // targets 'select' object with name 'expYear'
	var startYear = 2016;
	for(var i=startYear; i<startYear+10; i++) {
		selectYear.innerHTML += "<option name=" + name + " value = " + i + ">" + i + "</option>";
	}
}