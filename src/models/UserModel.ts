import mongoose from 'mongoose';
import { model, models } from 'mongoose';

 interface UserInterface{
  name: string;
  email: string;
  emailVerified: boolean;
  image: string;
  _id?: mongoose.Types.ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
}

const userSchema = new mongoose.Schema<UserInterface>({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    emailVerified: { type: Boolean, default: false },
    image: { type: String, default: '' },
}, 
{ timestamps: true,
   collection: "user", 
});

const User = models?.User || model<UserInterface>("User", userSchema);

export default User;
