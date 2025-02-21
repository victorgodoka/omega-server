import mongoose from 'mongoose';

const UsersSchema = new mongoose.Schema({
  id: { type: String, required: true }, 
  username: { type: String, required: true }, 
  displayname: { type: String, required: true }, 
  tcgrating: { type: Number, required: true }, 
  ocgrating: { type: Number, required: true }, 
  lastlogin: { type: Date, required: true },
});

UsersSchema.index({ id: 1 });
export default mongoose.model('Users', UsersSchema);
