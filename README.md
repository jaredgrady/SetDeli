# SetDeli
The SetDeli Tampermonkey script creates a new dropdown menu on the import page of Pokemon Showdown's teambuilder which leverages the SetDeli API to automatically retrieive all Smogon Dex sets for a particular mon.

## Installation

### TamperMonkey
To use the client script, first install Tampermonkey which is available as a Chrome and FireFox Extension. Then within Tampermonkey, create a new script and copy the contents of client/setdeli.client.js into the newly created script and save it. Refresh any open tabs of Pokemon Showdown and you can get started!

### Chrome Extension
SetDeli is now available as a Google Chrome Extension. It can be installed by navigating to https://chrome.google.com/webstore/detail/setdeli/imdlnijaodbcfjojococibigmokjpjjg in Chrome. 

## Usage
Whether you are using the Chrome extension or TamperMonkey, the script should automatically run on Showdown's main server. When teambuilding, click the Import/Export button next to a Pokemon to import a set and select a set from the dropdown menu that appears. Keep in mind that the dropdown menu may take a few moments to appear given the server load at the time. The only sets that appear are those that match the generation and metagame of your team. For example, no sets will appear for Entei if your team is a Gen 7 OU team, but sets will appear if your team is a Gen 7 UU team. Selecting a set from the dropdown menu will import that set into the textbox. Click "Save" to save your changes, or "Back" to discard them.


## API
This project uses an externally hosted API that scrapes Smogon sets. If you are interested in using the API for another project, feel free to use it by sending GET requests to https://setdeli.herokuapp.com/.
