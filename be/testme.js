import { google } from "googleapis";

// Create a new instance of GoogleAuth
const client = new google.auth.GoogleAuth({
    keyFile: "./credentials.json", // Path to your service account key file
    scopes: ["https://www.googleapis.com/auth/spreadsheets"], // Scopes for the API
});

// Use the authenticated client to get an authorized instance of the Google Sheets API
async function accessSpreadsheet() {
    try {
        const authClient = await client.getClient(); // Get the authenticated client
        const sheets = google.sheets({ version: "v4", auth: authClient }); // Create Sheets API instance

        // Example: Read data from a spreadsheet
        const response = await sheets.spreadsheets.values.get({
            spreadsheetId: "1xZkpw8DaRyLsVT6OTfeWIH7mhawRbdNujDKaRRRMoeo",
            range: "Sheet1!A1:B10",
        });

        console.log("Data from spreadsheet:", response.data.values);
    } catch (error) {
        console.error("Error accessing spreadsheet:", error);
    }
}

accessSpreadsheet();
