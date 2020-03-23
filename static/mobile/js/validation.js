function validateCardNumber(input) 
{
    var newValue = input.value.replace(/[^0-9]/g,"");		
    newValue = newValue.substring(0, Math.min(20, newValue.length));
    if(newValue != input.value){
		input.value = newValue;
    }
}


function validateMonth(input) 
{
    var newValue = input.value.replace(/[^0-9]/g,"");
    if(newValue > 12){
    	newValue = newValue.substring(0, newValue.length - 1);
    }
	if(newValue != input.value){
		input.value = newValue;
    }
	
	//focus next
    if(input.value.toString().length == 2){
	    var yearInput = document.getElementById('year');
	    yearInput && yearInput.focus();	
    }
}
function validateYear(input) 
{
    var newValue = input.value.replace(/[^0-9]/g,"");

    var newValue = input.value.substring(0, Math.min(2,  newValue.length));
    if(newValue != input.value){
		input.value = newValue;
    }
	
	//focus next
	if(input.value.toString().length == 2){
	 var cvvInput = document.getElementById('CVV');
	 cvvInput && cvvInput .focus();	
    }

}
function validateCVV(input) 
{
    var newValue = input.value.replace(/[^0-9]/g,"");
	newValue = newValue.substring(0, Math.min(4, newValue.length));
	if(newValue != input.value){
		input.value = newValue;
    }
}