// declair variables
const $chosenDesign = $('#design');
const $availableColor = $('#color option');
const $otherTitleInput = $('#other-title');
const $activities = $('.activities');
const $totalCostText = $("<label>Total: 0</label>");
const $checkboxes = $('.activities input');
const $selePayment = $('#payment');
const $creditCardDiv = $('#credit-card');
const $paypalDiv = $creditCardDiv.next();
const $bitcoinDiv = $paypalDiv.next();
const $nameError = $("<label class='error'>Please enter your name.</label>");
const $emailError = $("<label class='error'>Please enter a valid email.</label>")
const $activityError = $("<label class='error'>Please select at least one activity.</label>");
const $cardNumError = $("<label class='error'>Please enter a valid credit card number.</label>")
const $zipError = $("<label class='error'>Please enter a valid zip code.</label>");
const $cvvError = $("<label class='error'>Please enter a valid cvv.</label>");
const $otherJobError = $("<label class='error'>Please enter your job role.</label>");

// to track the total cost of activities
let totalCost = 0;

function initialSetUp() {
    
    // focus on first text field by default
    $('#name').focus();
    
    // add totalCostText to $activities and hide at default;
    $activities.append($totalCostText); 
    $totalCostText.hide();
    
    // add placeholder for othertitleinput and hide it at default
    $otherTitleInput.attr('placeholder', 'Your Job Role')
    $otherTitleInput.hide();
    
    // add change() to userTitle to check if the user chooses 'other'
    let $userTitle = $('#title');
    $userTitle.change(function (e) { 
        if ($(e.target).val() === 'other') {
            $otherTitleInput.show();
        } else {
            $otherTitleInput.hide();
        }  
    });

    // add change() to determine what colors available for selected shirt
    $chosenDesign.change(function (e) { 
        if ($(e.target).val() === 'js puns') {
            showJsPuns();
        } else if ($(e.target).val() === 'heart js') {
            showHeartJs();
        } else {
            showAllColors();
            $("#color").val("cornflowerblue");
        }
    });

    $("#color").change(function (e) {
        if ($(e.target).val() === "cornflowerblue" || 
            $(e.target).val() === "darkslategrey" || 
            $(e.target).val() === "gold") {
            $chosenDesign.val("js puns");
        } else {
            $chosenDesign.val("heart js");
        }
    });

    // make default  to credit card and remove 'select_payment'
    $('#payment').find('option:first').remove();
    
    $paypalDiv.hide();
    $bitcoinDiv.hide();
}

// function used to only show colors available for js puns
function showJsPuns(){
    
    $availableColor.filter(function() {
        // use regular expression to find out all matched options 
        if (/JS Puns shirt only\)$/.test($(this).text())){
            $(this).show()
            $("#color").val("cornflowerblue");
        } else {
            $(this).hide();
        }
    });
}

// function used to only show colors available for heart js
function showHeartJs(){
    $availableColor.filter(function() {
        // use regular expression to find out all matched options 
        if (/JS shirt only\)$/.test($(this).text())){
            $(this).show();
            $("#color").val("tomato");
        } else {
            $(this).hide();
        }
    });
}

// function used to show all colors when user chooses 'select theme'
function showAllColors(){ 
    $availableColor.each(function() { 
         $(this).show();
    });
}

// loop through each checkboxes 
// add change() to calculate the total cost of activities
// and to disable the overlaped activities.
function checkBoxManipulation(){
    // to record what activities are selected
    let strArray = [];
    $checkboxes.change( function (e){
        // get the text of the activity just selected
        let str = $(e.target).parent().text();
        // to make str = the day and time e.g. "Tuesday 1pm-4pm,"
        let indexOfDash = (str.indexOf('—') ) + 2;
        let indexOfDollar = (str.indexOf('$'));
        str = str.slice(indexOfDash, indexOfDollar);

        // to record the cost of the activity just selected
        let cost = parseInt($(e.target).parent().text().slice(-3));

        // if the checkbox is checked, add cost to totalCost
        if ($(e.target).is(':checked')) {
            totalCost += cost;
            $totalCostText.show();
            // and add day and time info to strArray
            if (strArray.indexOf(str) === -1){
                strArray.push(str); 
            }
        } 
        // if the checkbox is checked, subtract cost from totalCost
        else {
            totalCost -= cost;
            // remove day and time info from strArray
            let i = strArray.indexOf(str);
            strArray.splice(i, 1); 
            if (totalCost == 0) {
                // hide totalCost display if total cost is 0
                $totalCostText.hide();
            }
        } 
        // loop through all checkboxes to disable the overlaped activities
        $checkboxes.each( function (index, obj){
            let element = $(this);
            let eleStr = element.parent().text();
            let eleDash = (eleStr.indexOf('—') ) + 2;
            let eleDollar = (eleStr.indexOf('$'));
            // get the day and time info of each activity
            eleStr = eleStr.slice(eleDash, eleDollar);
            
            // if activity is not selected
            if (element.is(':checked') === false){
                // and if it's not disabled
                if (element.is(':disabled') === false){
                    // check if activity info is already in strArray, then disable it 
                    if (strArray.indexOf(eleStr) > -1){
                        element.attr('disabled', 'true');
                    }
                }
                // if it's already disabled 
                else {
                    // and if the activity info is not in strArray
                    if (strArray.indexOf(eleStr) === -1){
                        // then remove the disabled attribute
                        element.removeAttr('disabled');
                    }
                }
            }
        });
        // display the total cost at the bottom of textfield
        $totalCostText.html("<label>Total: $" + totalCost.toString() + "</label>");
    });
}

function displayPaymentMethod() {
    $selePayment.change(function (e) {
        if ($(e.target).val() === 'paypal') {
            $paypalDiv.show();
            $creditCardDiv.hide();
            $bitcoinDiv.hide();
        } else if ($(e.target).val() === 'bitcoin') {
            $paypalDiv.hide();
            $creditCardDiv.hide();
            $bitcoinDiv.show();
        } else {
            $paypalDiv.hide();
            $creditCardDiv.show();
            $bitcoinDiv.hide();
        }
    })
}

function setUpValidationMessage() {
    const $nameInput = $('#name');
    const $emailInput = $('#mail');
    const $lastActivity = $('.activities label').last();

    $nameInput.after($nameError);
    $emailInput.after($emailError);
    $lastActivity.after($activityError);
    $creditCardDiv.append($cardNumError);
    $creditCardDiv.append($zipError);
    $creditCardDiv.append($cvvError);
    $otherTitleInput.after($otherJobError);

    $nameError.hide();
    $emailError.hide();
    $activityError.hide();
    $cardNumError.hide();
    $zipError.hide();
    $cvvError.hide(); 
    $otherJobError.hide();
}

function nameValidation() {
    let $name = $('#name');
    if ($name.val().length > 0) {
        $nameError.hide();
        return true;
    } else {
        $nameError.show();
        return false;  
    }
}

function emailValidation() {
    const emailReg = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9]+\.com$/;
    let $email = $('#mail');
    if (emailReg.test($email.val()) === false){
        $emailError.show();
        return false;
    } else {
        $emailError.hide();
        return true;
    }
}

function otherJobValidation() {
    if ($otherTitleInput.is(":visible")){
        if ($otherTitleInput.val().length > 0) {
            $otherJobError.hide();
            return true;
        } else {
            $otherJobError.show();
            return false;  
        }
    } else {
        return true;
    }
}

function activityValidation() {
    
    if ($checkboxes.filter(':checked').length < 1){
        $activityError.show();
        return false;
    } else {
        $activityError.hide();
        return true;
    }
    
}

function creditCardValidation() {
    const ccNumReg = /^\d{13,16}$/;
    const zipReg = /^\d{5}$/;
    const cvvReg = /^\d{3}$/;
    let $ccNumber = $('#cc-num');
    let $zipCode = $('#zip');
    let $cvvnumber = $('#cvv');

    if ($selePayment.val() === 'credit card'){
        if (ccNumReg.test($ccNumber.val()) === false){
            $cardNumError.show();
            return false;
        }
        if (ccNumReg.test($ccNumber.val()) === true){
            $cardNumError.hide();
        }
        if (zipReg.test($zipCode.val()) === false){
            $zipError.show();
            return false;
        }
        if (zipReg.test($zipCode.val()) === true){
            $zipError.hide();
        }
        if (cvvReg.test($cvvnumber.val()) === false){
            $cvvError.show();
            return false;
        }
        if (cvvReg.test($ccNumber.val()) === true){
            $cvvError.hide();
        }
    } else {
        return true;
    }
}

$(document).ready(function(){
    initialSetUp();
    setUpValidationMessage();
    displayPaymentMethod();
    checkBoxManipulation();
    $("form").submit(function(e){
        let valid = nameValidation() && emailValidation() && 
                    otherJobValidation() && activityValidation() && 
                    creditCardValidation();

        if (valid == false) {
            e.preventDefault();
        }  
    });
});


