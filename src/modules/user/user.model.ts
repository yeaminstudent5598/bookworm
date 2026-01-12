import { Schema, model, models } from 'mongoose';
import { IUser } from './user.interface';
import bcrypt from 'bcryptjs';

const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, select: 0 },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
    isDeleted: { type: Boolean, default: false },
    preferences: [{ type: Schema.Types.ObjectId, ref: 'Genre' }],
  },
  { timestamps: true }
);

// Password hashing before saving
userSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password!, 12);
  }
//   next();
});

export const User = models.User || model<IUser>('User', userSchema);