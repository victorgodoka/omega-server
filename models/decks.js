import mongoose from 'mongoose';

const DeckSchema = new mongoose.Schema({
  sqlid: { type: Number, required: true },
  duelist1: { type: String, required: true },
  duelist2: { type: String, required: true },
  result: { type: Number, required: true },
  deck1: { type: String, required: true },
  deck2: { type: String, required: true },
  start: { type: Date, required: true },
  end: { type: Date, required: true },
});

export default mongoose.model('Duels', DeckSchema);
