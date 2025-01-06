//Cash machine javascript
const prompt =require('prompt-sync')({sigint:true});
const fs = require('fs');                                                           //include the fs module for file o[perations]

      //user details loaded from json file user1 pin 1234 user2 pin5678
let users = JSON.parse(fs.readFileSync('users.json', 'utf-8'));      //to use data
let currentUser = null;
let loginAttempts = 0;

function saveUsers() {
    fstatSync.writeFileSync('users.json', JSON.stringify(users, null, 2), 'utf-8');
}

function login() {
    const pin = prompt("Enter your PIN:     ");  //pin in user details
   
    if (loginAttempts>= 3) {
        console.log("Your card will be held. Please contact your branch.");
        return resetLogin();
    }

    const userFound = Object.values(users). find(users => users.pin === pin);    //change to user

    if (userFound) {
        currentUser = userFound;
        console.log("login successful! Welcome!");
        loginAttempts = 0;              //reset attempts on successful login
        mainMenu();
    } else {
        loginAttempts++;
        console.log(`Invalid PIN. Attempts left: ${3 - loginAttempts}`);   //3 attempts card held
        login(); //prompt for pin again
    }
}

function mainMenu(){                    //menu options
    console.log("Main Menu:");
    console.log("1: Check Balance");
    console.log("2: Deposits");
    console.log("3: Withdraw");
    console.log("4: Pay Bill");
    console.log("5: Transfer Funds");
    console.log("6: Change PIN");
    console.log("7: Transaction History")
    console.log("8: Logout");

    const action = prompt('select an action:   ');

    switch (action) {
        case '1':
            checkBalance();
            break;
        case '2':
            deposit();
            break;
        case '3':
             withdraw();
             break;
        case '4':
            payBill();
            break;
        case '5':
            transfer();
            break;
        case '6':
            changePin();
            break;
        case '7':
            transactionHistory();
            break;
         case '8':   
            resetLogin();
            break;
        default:
            console.log("Invalid selection. Please try again.");     
            mainMenu();                     
    }
}

function checkBalance() {
    console.log(`Your balance is £${currentUser.balance}`);
    returnToMenu();
}

function saveTransaction(description) {
    const timestamp = new Date().toISOString();
    currentUser.transactions.push({description, timestamp});
}

function deposit() {
    let amount = getValidAmount('Enter the amount to deposit (must be divisible by 5): ', true);
    currentUser.balance += amount;
    saveTransaction(`Deposited £${amount}`);    //to save transactions
    saveUsers();  // **Call to save user data after deposit**
    console.log(`You have deposited £${amount}. New balance is £${currentUser.balance}.`);
    returnToMenu();
}

function withdraw() {
    let amount = getValidAmount('Enter the amount to withdraw (must be divisible by 5): ', false);
    if (amount > currentUser.balance) {      // **Check for insufficient funds**
        console.log("Insufficient funds.");
        return returnToMenu();  // Go back to the main menu
    }
    currentUser.balance -= amount;
    saveTransaction(`Withdrew £${amount}`);
    saveUsers();  // Save changes to user data
    console.log(`You have withdrawn £${amount}. New balance is £${currentUser.balance}.`);
    returnToMenu();
}

function getValidAmount(promptMessage, isDeposit) {
    let amount;
    while (true) {
        amount = parseFloat(prompt(promptMessage));
        if (amount > 0 && (isDeposit || (amount % 5 === 0))) {
            if (!isDeposit && amount > currentUser.balance) {
                console.log("Insufficient funds.");
            } else {
                return amount;
            }
        } else {
            console.log("Please enter a valid amount that is divisible by 5.");
        }
    }
}

function payBill() {
    const billType = prompt('Enter the type of bill (e.g. , electricity, water:   ');
    let amount;
    while (true) {
        amount = parseFloat(prompt('Enter the amount to pay:   '));
        if (amount > 0) {
            if (amount <= currentUser.balance) {
                break;   //valid amount and sufficient balance
            } else {
                console.log("Insufficient funds.");
            }
    }
}
    currentUser.balance -= amount;
    saveTransaction(`Paid £${amount} for ${billType}`);
    saveUsers();  //save user data after bill payment
    console.log(`You have paid your ${billType} bill of £${amount}. New balanceis £${currentUser.balance}.`);
    returnToMenu();
}

function transfer() {
    const transferUsername = prompt('Enter the username to transfer funds to (user1/user2): ');
    if (users[transferUsername]) {  // Check if the username exists
        let amount = getValidAmount('Enter the amount to transfer: ', false);
        if (amount > currentUser.balance) {      // **Check for insufficient funds
            console.log("Insufficient funds.");
            return returnToMenu();  // Go back to the main menu
        }
        currentUser.balance -= amount;
        users[transferUsername].balance += amount;
        saveTransaction(`Transferred £${amount} to ${tranferUser}`);
        saveUsers();  // Save changes to user data
        console.log(`You have transferred £${amount} to ${transferUsername}. New balance is £${currentUser.balance}.`);
    } else {
        console.log("User not found.");
    }
    returnToMenu();
}

function transactionHistory() {
    if (currentUser.transaction.length === 0) {
        console.log("No transaction History:");
    } else {
        console.log("Transaction History:");
        currentUser.transaction.forEach(transaction => {
            console.log(`[${transaction.timestamp}] - ${tansaction.description}`);
        });
    }
    returnToMenu();
}

function changePin() {
    const newPin = prompt("Enter your new PIN:   ");     //allow user to input a new pin
    console.log("Your PIN has been not changed.");        // the new pin will not be saved
    returnToMenu();
}

function resetLogin() {
    currentUser = null;
    loginAttempts = 0;
    console.log("You have been logged out.");
    login();
}

function returnToMenu() {            //new function to return to main menu
    const choice = prompt('Would you like to return to the main menu? (y/n:  ');
    if (choice.toLowerCase() === 'y') {
        mainMenu();
    } else {
         console.log("Thank you for using the ATM, Please remove your card.");
         process.exit();
    }
}

function saveUsers() {
    fs.writeFileSync('users.json', JSON.stringify(users, null, 2), 'utf-8');
}
login();   //start the application