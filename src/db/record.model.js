import mongoose from "mongoose";

const Schema = mongoose.Schema;

const CurrencySchema = new Schema({
  name: { type: String, required: true, maxLength: 3 },
  value: { type: Number, required: true },
})

const RecordSchema = new Schema({
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  currencies: { type: [CurrencySchema], required: true },
})

export const Record = mongoose.model('Record', RecordSchema);
