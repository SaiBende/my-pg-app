import mongoose from 'mongoose';
import { model, models } from 'mongoose';

enum UserRole {
  user = 'user',
  admin = 'admin',
  superAdmin = 'superAdmin',
}

 interface UserInterface{
  name: string;
  email: string;
  emailVerified: boolean;
  image: string;
  role: UserRole;
  _id?: mongoose.Types.ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
}

const userSchema = new mongoose.Schema<UserInterface>({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    role: { type: String, enum: Object.values(UserRole), default: UserRole.user }, // Default role is 'user'
    emailVerified: { type: Boolean, default: false },
    image: { type: String, default: '' },
}, 
{ timestamps: true,
   collection: "user", 
});

const User = models?.User || model<UserInterface>("User", userSchema);

export default User;
