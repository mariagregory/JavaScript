// JavaScript Document

function showCart()	{
// Display 1 row of cart information for each product that is in the cart: quantity, name and short description of product, price, total cost, and a checkbox to enable changes
// This information is being written into the page in the "cart table" area.
// This function is called from 2 pages: "cart" and "checkout"
	var cartTable = document.getElementById("cartTable");
	var prodsOrdered = 0; // how many DIFFERENT products are ordered
	var grandTotal = 0;
	
	if(!products) { // 'products' array is accessible only in "cart.html" page, this function is also called from "checkout.html" page, in which case use LS version
		var products = JSON.parse(localStorage.getItem('productsTemplate'));
	}

	var userNo = localStorage.getItem('userNo'); // determine, if the current user is a registered user
	if(userNo!='-1') { // userNo '-1' is for Guest
		var userAcc = JSON.parse(localStorage.getItem('userAccounts'));
		for(var i=0; i</*userAcc[userNo].*/products.length; i++) {
			if(userAcc[userNo].quantities[i] > 0) {
				products[i].quantity = userAcc[userNo].quantities[i];
			}
		}
	} else { // part for Guest user
		for(var i=0; i<products.length; i++) {
			products[i].quantity = parseInt( JSON.parse( localStorage.getItem(products[i].id) ) );
		}	
	}
			 
	for(var i=0; i<products.length; i++) {	// calculate all values to be displayed in "cartTable"
		if( products[i].quantity > 0 ) { 
			prodsOrdered++;
			products[i].subtotal = products[i].quantity * products[i].price;
			grandTotal += products[i].subtotal;
			products[i].img = "product" + (i+1) + ".jpg";
			if(prodsOrdered==1) { // when the 1st product is encountered, display a table's header
				cartTable.innerHTML = "<tr><th colspan='2'>Product</th><th>Price</th><th>Quantity</th><th>Subtotal</th><th>Change?</th></tr>";
			} //  display row(s) with item(s)
			cartTable.innerHTML += displayRow(products[i], i);
		}
	} cartTable.innerHTML += "<tr><th colspan='5'>Grand Total (before tax)</th><th id='total'>" + grandTotal.toFixed(2) + "</th></tr>";
	
	if(!prodsOrdered) {
		cartTable.innerHTML = "<fieldset><p>Your shopping cart is now empty!</p><p>We recommend you to go straight to <a href='shop.html'>Shopping page</a> and fill it out.</p></fieldset>";
	}
	
	// After the cart is displayed, delete the temporary properties of the original 'products' array
	for(var i=0; i<products.length; i++) {	
		delete products[i].quantity;
	}
}

function displayRow(rowData, index) {
// Compose and return a row of the table showing the shopping cart including the product image, name and short description, price, quantity, cost, and a checkbox to modify the qantity
	var row = "<tr>"
		+ "<td><img src=" + rowData.img  + " /></td>"
		+ "<td>" + rowData.name + "<br/>" + rowData.description + "</td>"
		+ "<td>" + rowData.price + "</td>"
		+ "<td><input type='number' id='" + rowData.id + "inCart' value=" + rowData.quantity + " min=\"0\" max=\"1000\" disabled /></td>"
		+ "<td id='sub" + index + "'>" + rowData.subtotal.toFixed(2) + "</td>"
		+ "<td><input type='checkbox' onclick='modifyCart(" + index + ", this);'/></td>" 
		// assign this checkbox a function "modifyCart()" called if it's checked, and the quantity is to be changed
		+ "</tr>";
	return row;
}

function updateCartTotal() { 
// Add "Your cart currently contains (N) items" below the Sign-in/Sign-out area on the left side of the page (in the 'nav' area)
// First, check if the current user has an account. If yes, retrieve his/her cart and show its summary
// If we deal with Guest, try to retrieve q# variables (such as q1, q2, etc.) from LS and read their values to create a summary
// In Guest case: To know how many products are in the store, read 'prodsCount' from LS, which is set in "shop" page
	var prodsOrdered = 0; // how many DIFFERENT products are ordered
	var itemsTotal = 0; // how many items of all products together are ordered
	var currentCart;
	var cartMessage = document.getElementById("cartMessage");
		
	if(!cartMessage) {
		document.getElementsByTagName("nav")[0].innerHTML += "<div id='cartMessage'>&nbsp;</div>";
		// there is only 1 nav block, so [0] element is exactly what we need
		cartMessage = document.getElementById("cartMessage");
	}
	// Check if the current user is a registered one. If yes, retrieve his/her cart
	var userNo = JSON.parse(localStorage.getItem('userNo'));
	if(userNo!='-1') {
		var currentCart = JSON.parse(localStorage.getItem('userAccounts'));
		for(var i=0; i<currentCart[userNo].products.length; i++) {	
			if(currentCart[userNo].quantities[i]>0) {
				prodsOrdered++; 
				itemsTotal += parseInt(currentCart[userNo].quantities[i]);
			}			
		}
	} else { 
		var prodsCount = parseInt(localStorage.getItem('prodsCount')); // holds # of products for sale. Set to LS on "shop.html" document
		var thisProdQ;
		
		for(var i=1; i<=prodsCount; i++) {	// Now we go through all products and see which ones are in the Guest's cart
			thisProdQ = localStorage.getItem('q' + i); // if Guest added anything, q# variable will be in LS
			if(thisProdQ) {
				prodsOrdered++; 
				itemsTotal += parseInt(JSON.parse(thisProdQ));
			}
		}
	} 
	// Write the cart summary in "cartMessage" area below the Sign-in/Sign-out area
	cartMessage.innerHTML = "Your shopping cart";
	if(!itemsTotal) cartMessage.innerHTML += " is empty!";
	else {
		cartMessage.innerHTML += " currently contains ";
		if(itemsTotal==1) cartMessage.innerHTML += "<b><span id='itemsInCart'>" + itemsTotal + "</span></b> item!";
		else {
			cartMessage.innerHTML += "<b><span id='itemsInCart'>" + itemsTotal + "</span></b> items of <b>" + prodsOrdered + "</b> products!";
		}
	}
}

function modifyCart(prodIndex, checkBox) {
// This is called from 2 places: "cart.html" and "checkout.html".
// If user clicks the checkbox to the right from a product in order to change its quantity, 
// allow changes and immediately display all dependent variables' values (subtotal, grand total, and the cart summary in 'nav' area) on the page
	if(!products) { // if the function is called NOT from "cart.html" page, there is no straight access to 'product' array, so retrieve its copy from LS
		var products = JSON.parse(localStorage.getItem('productsTemplate'));
	}
	var inputQ = document.getElementById(products[prodIndex].id + 'inCart'); // ex. 'q1inCart' textbox in the "cartTable" area
	if(checkBox.checked) {
		inputQ.removeAttribute('disabled'); 
		inputQ.onchange = function() {	
			var userNo = JSON.parse(localStorage.getItem('userNo'));
			if(userNo!='-1') { // if a registered user is active, retrieve his cart and make changes
				var userAcc = JSON.parse(localStorage.getItem('userAccounts')); 
				userAcc[userNo].quantities[prodIndex] = inputQ.value;
				localStorage.setItem('userAccounts', JSON.stringify(userAcc));
			} else { // if the Guest is active, save q# variable in LS for Guest
				localStorage.setItem(products[prodIndex].id, JSON.stringify(inputQ.value));
			} 	
			var newSubtotal = inputQ.value * products[prodIndex].price; // update values of both subtotal and grandTotal
			var oldSubtotal = document.getElementById("sub" + prodIndex).innerHTML;
			var newTotal = document.getElementById("total").innerHTML - oldSubtotal + newSubtotal;
						
			document.getElementById("sub" + prodIndex).innerHTML = newSubtotal.toFixed(2);
			document.getElementById("total").innerHTML = newTotal.toFixed(2);
			
			updateCartTotal(); // reflect changes in "cartMessage" area
		}
	} else {
		inputQ.setAttribute('disabled', 'true');
	}
}

function clearGuestCart() {
// This is called from 3 places:
//		1. updateName() function in "guest-function.js", 
//		2. clearCart() function in "shop" page, 
//		3. "thankyou" page, after the Guest paid for his order
// Go through variables of 'q#' format in LS and delete all of them
	var prodsCount = parseInt(localStorage.getItem('prodsCount')); 	
	for (var i=0; i<prodsCount; i++) {
		localStorage.removeItem('q' + (i+1));
	}
}

function clearUserCart(userCart, userNo) {
// This function is called from 2 places: 
//	1. "thankyou" page: When a registered user paid for items in his cart, so we nullify his quantities
//	2. clearCart() function in "shop" page: When a registered user empties his cart from 'shop' page
	for(var i=0; i<userCart[userNo].products.length; i++) {
		userCart[userNo].quantities[i] = 0;
	}
}