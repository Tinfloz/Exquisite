import fs from "fs";
import path from "path";
import data from "./constants.json"

// const data = JSON.parse(fs.readFileSync(path.join(__dirname, "constants.json"), 'utf-8'));

export const getTaxes = (price: number): number => {
    return price * data.taxRate;
};