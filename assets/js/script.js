// Assignment Code
var generateBtn = document.querySelector("#generate");

// Write password to the #password input
function writePassword() {
  var password = generatePassword();
  var passwordText = document.querySelector("#password");

  passwordText.value = password;

}

// Add event listener to generate button
generateBtn.addEventListener("click", writePassword);

function generatePassword() {
  console.log("It's working!");

  var generatedPassword = "TempPassword";

  var lowercase = confirm("Would you like to include lowercase characters in your password?");
  var uppercase = confirm("Would you like to include uppercase characters in your password?");
  var numeric = confirm("Would you like to include numeric characters in your password?");
  var special = confirm("Would you like to include special characters in your password?");

  var desiredPasswordLength = prompt("How long would you like your password to be? (8 - 128 characters)");
  // while (desiredPasswordLength < 8 || desiredPasswordLength > 128) {
  //   desiredPasswordLength = prompt("How long would you like your password to be? (8 - 128 characters)");
  // }

  console.log(`Lowercase: ${lowercase}, Uppercase: ${uppercase}, Numeric: ${numeric}, Special: ${special}`);
  console.log(`Password Length: ${desiredPasswordLength}`);

  return generatedPassword;
}