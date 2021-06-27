# Import Wise.com debits and credits into Google Sheets
This is a Google Sheets Script that imports Wise.com user debits and credits.
There are currently four inputs:
* API key (once per document)
* From date
* To date
* Currency
* Debits / Credits

Each output is sprayed vertically onto the sheet in three columns:
* Transaction date
* Amount
* Description

On the first execution the add-on prompts the user for an Wise API key with Read Permissions that is later saved into the document properties.
___
Feel free to fork and update this script with more features. For example selection of Personal / Business account, or more detailed transaction descriptions.
