// Assignment Code
var generateBtn = document.querySelector("#generate");
let passwordDetails;

// Write password to the #password input
function writePassword() {
  var password = generatePassword();
  var passwordText = document.querySelector("#password");

  // Only set the new password if one was actually generated. Otherwise, keep the previous password on the screen.
  if (passwordText !== "") {
    passwordText.value = password;
  }
}

// Add event listener to generate button
generateBtn.addEventListener("click", writePassword);

// Main function for generating a new password.
// Returns the password that was generated, or "" if no password was generated.
function generatePassword() {
  let password = "";

  // Reset the passwordDetails object to a "clean slate" for the current password generation attempt.
  initializePasswordDetails();
  console.log(passwordDetails.datasets);

  // Gather user input, including criteria and desired password length.
  if (getUserInput()) {
    // If we have valid criteria and desired password length, construct the new password one character at a time.
    while (passwordDetails.desiredPasswordLength > 0) {
      password += getNextPasswordCharacter();
      passwordDetails.desiredPasswordLength--;
    }
  }

  // Return the new password.
  return password;
}

// (Re)Initializes the password details object for a new password generation. This will clear out criteria from the previous generation attempt.
function initializePasswordDetails() {
  passwordDetails = {
    datasets: [
      // Using a single alpha dataset here to save on space. We can just call String#toUpperCase if the customer included uppercase in their criteria.
      ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"],
      [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
      [" ", "!", "\"", "#", "$", "%", "&", "'", "(", ")", "*", "+", ",", "-", ".", "/", ":", ";", "<", "=", ">", "?", "@", "[", "\\", "]", "^", "_", "`", "{", "|", "}", "~"]
    ],
    criteria: {
      includeLowercase: false,
      includeUppercase: false,
      includeNumeric: false,
      includeSpecial: false,
      isCriteriaValid: function () {
        return this.includeLowercase || this.includeUppercase || this.includeNumeric || this.includeSpecial;
      }
    }
  };
}

// Obtains user input to configure the password generation criteria and desired password length.
// Returns true if at least one criteria was selected AND the desired password length is between 8 and 128 (inclusive). 
function getUserInput() {
  let retry;
  let validPasswordLength;

  // Ask the user for the password length. Validate to ensure they entered a valid number between 8-128.
  do {
    retry = validPasswordLength = false;
    let inputValue = prompt("How long would you like your password to be? (8-128 characters)", "8");

    if (inputValue) {
      let error = parsePasswordLengthInput(inputValue);
      validPasswordLength = error === "";

      if (!validPasswordLength) {
        retry = confirm(`${error} Click 'OK to enter a different length or click 'Cancel' to exit.`);
      }
    }
  } while (retry);
  console.log(`Password Length: ${passwordDetails.desiredPasswordLength}`);

  // As long as a valid password length was obtained, ask for the password criteria.
  if (validPasswordLength) {
    do {
      // Attempt to gather password criteria from the customer.
      retry = false;
      passwordDetails.criteria.includeLowercase = confirm("Would you like to include lowercase characters in your password?");
      passwordDetails.criteria.includeUppercase = confirm("Would you like to include uppercase characters in your password?");
      passwordDetails.criteria.includeNumeric = confirm("Would you like to include numeric characters in your password?");
      passwordDetails.criteria.includeSpecial = confirm("Would you like to include special characters in your password?");
      console.log(`Criteria:\nincludeLowercase: ${passwordDetails.criteria.includeLowercase}\nincludeUppercase: ${passwordDetails.criteria.includeUppercase}\nincludeNumeric: ${passwordDetails.criteria.includeNumeric}\nincludeSpecial: ${passwordDetails.criteria.includeSpecial}\nisCriteriaValid: ${passwordDetails.criteria.isCriteriaValid()}`);

      // If they didn't select at least one criteria to include, ask them to retry.
      if (!passwordDetails.criteria.isCriteriaValid()) {
        retry = confirm("At least one password criteria must be included. Click 'OK' to reselect criteria or click 'Cancel' to exit.");
      }
    } while (!passwordDetails.criteria.isCriteriaValid() && retry);
  }

  // Input was successfully gathered only if the password length was valid AND valid criteria were selected.
  return validPasswordLength && passwordDetails.criteria.isCriteriaValid();
}

function parsePasswordLengthInput(inputValue) {
  let number = parseInt(inputValue);
  let error = "";

  if (isNaN(number)) {
    error = "A valid number must be entered.";
  }
  else {
    if (number < 8 || number > 128) {
      error = "Password length must be between 8-128 characters.";
    }
    else {
      passwordDetails.desiredPasswordLength = number;
    }
  }

  return error;
}

// This function generates a single random password character at at time. Looping this method will generate a password of the desired length.
// Returns a single random password character.
function getNextPasswordCharacter() {
  // Local variables
  let criteriaSelection;
  let datasetIndex;
  let tryAnotherDataset;
  let datasetValueIndex;
  let passwordCharacter;

  do {
    tryAnotherDataset = false;

    // Select a random criteria for the password character [0-3 represent the 4 selection criteria].
    criteriaSelection = getRandomIntInclusive(0, passwordDetails.datasets.length);

    // If the customer did not include that criteria, repeat to find an included criteria.
    switch (criteriaSelection) {
      case 0:
        tryAnotherDataset = !passwordDetails.criteria.includeLowercase;
        break;
      case 1:
        tryAnotherDataset = !passwordDetails.criteria.includeUppercase;
        break;
      case 2:
        tryAnotherDataset = !passwordDetails.criteria.includeNumeric;
        break;
      case 3:
        tryAnotherDataset = !passwordDetails.criteria.includeSpecial;
        break;
    }
  } while (tryAnotherDataset);

  // Since there are only three datasets covering four criteria (alpha dataset is used for both upper and lower), datasetIndex needs to be one-less.
  datasetIndex = Math.max(0, criteriaSelection - 1);
  datasetValueIndex = getRandomIntInclusive(0, Math.max(0, passwordDetails.datasets[datasetIndex].length - 1));

  // datasetIndex 0 represents both uppercase and lowercase, so we need to also examine the criteriaSelection.
  if (datasetIndex === 0) {
    passwordCharacter = passwordDetails.datasets[0][datasetValueIndex];

    // If the randomly chosen critera was uppercase, simply use String#toUpperCase.
    if (criteriaSelection === 1) {
      passwordCharacter = passwordCharacter.toUpperCase();
    }
  }
  else {
    // If we're here, we're using either numeric or special.
    passwordCharacter = passwordDetails.datasets[datasetIndex][datasetValueIndex];
  }
  console.log(`datasets[${datasetIndex}.${criteriaSelection}, ${datasetValueIndex}], PasswordCharacter: ${passwordCharacter}`);

  return passwordCharacter;
}

// Credit: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random
function getRandomIntInclusive(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1) + min); //The maximum is inclusive and the minimum is inclusive
}
