import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const filePath = path.join(__dirname, 'data.json');

const readData = () => {
    try {
        const data = fs.readFileSync(filePath, 'utf8');
        return JSON.parse(data);
    } catch (err) {
        console.error('Error reading file:', err);
        return null;
    }
};

const writeData = (data) => {
    try {
        fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
    } catch (err) {
        console.error('Error writing file:', err);
    }
};

export const getRecords = () => {
    return readData();
};

export const updateRecords = (newRecord) => {
    const data = readData();
    if (data) {
        data.records = [newRecord];
        writeData(data);
    }
};
