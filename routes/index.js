const router = require('express').Router();

const inquirer = require('inquirer');

// Define your list of choices
const choices = [
  "Choice 1",
  "Choice 2",
  "Choice 3",
];

// Prompt the user to select an item
inquirer.prompt([
  {
    type: 'list',
    name: 'selection',
    message: 'Select an item:',
    choices: choices,
  },
  {
    type: 'input', // This prompt will be conditional
    name: 'additionalInfo',
    message: 'Enter some additional information:',
    when: (answers) => answers.selection === 'Choice 1', // Show only for Choice 1
  }
])
.then((answers) => {
  const selected = answers.selection;
  console.log(`You selected: ${selected}`);
  if (selected === 'Choice 1') {
    console.log(`Additional information: ${answers.additionalInfo}`);
  }
  // You can perform actions based on the selected item here
})
.catch((error) => {
  console.error(error);
});

router.use((req, res) => {
  res.send("<h1>Wrong Route!</h1>")
});

module.exports = router;