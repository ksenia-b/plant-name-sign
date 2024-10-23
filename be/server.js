import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { google } from "googleapis";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json()); // Middleware to parse JSON request bodies

const client = new google.auth.GoogleAuth({
    keyFile: "./credentials.json",
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
});

const addRowToSpreadsheet = async (formData) => {
    console.log("formData = ", formData);
    try {
        const rowData = [
            formData.phone,
            formData.contactMethod,
            formData.plantSorts.join(", "),
            formData.novaPoshtaCity,
            formData.novaPoshtaRegion,
            formData.novaPoshtaWarehouse,
            formData.recipientPhone,
            formData.recipientSurname,
            formData.totalCost,
        ];

        const authClient = await client.getClient();
        const sheets = google.sheets({ version: "v4", auth: authClient });

        const insertOptions = {
            spreadsheetId: "1xZkpw8DaRyLsVT6OTfeWIH7mhawRbdNujDKaRRRMoeo",
            range: "Sheet1!A1",
            valueInputOption: "RAW",
            resource: {
                values: [rowData],
            },
        };

        await sheets.spreadsheets.values.append(insertOptions);
        console.log('Row added successfully');
    } catch (error) {
        console.error('Error adding row to spreadsheet:', error.message);
        if (error.response) {
            console.error('Response data:', error.response.data);
        }
    }
};

app.post('/api/orders', async (req, res) => {
    const data = req.body;
    await addRowToSpreadsheet(data);
    res.status(200).send('Row added to spreadsheet');
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
