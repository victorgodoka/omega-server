import mongoose from 'mongoose';

const DeckSchema = new mongoose.Schema({
  duelist1: { type: String, required: true },
  duelist2: { type: String, required: true },
  result: { type: Number, required: true },
  deck1: { type: String, required: true },
  deck2: { type: String, required: true },
  start: { type: Date, required: true },
  end: { type: Date, required: true },
});

DeckSchema.index({ deck1: 1, deck2: 1 }, { unique: true });

export default mongoose.model('Decks', DeckSchema);
