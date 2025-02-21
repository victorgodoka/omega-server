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
  duelRating: { type: Number },
  duelist1Rating: { type: Number },
  duelist2Rating: { type: Number } 
});

DeckSchema.index({ duelist1: 1 });
DeckSchema.index({ duelist2: 1 });
DeckSchema.index({ deck1: 1 });
DeckSchema.index({ deck2: 1 });
DeckSchema.index({ result: 1 });

export default mongoose.model('Duels', DeckSchema);
