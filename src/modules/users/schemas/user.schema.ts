import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as bcrypt from 'bcrypt';

@Schema({ timestamps: true })
export class User extends Document {
  @Prop({ required: true, unique: true })
  username: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true })
  email: string;
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.set('toJSON', {
  transform: (_, ret) => {
    delete ret.password;
    return ret;
  },
});

UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  try {
    const hashedPassword = await bcrypt.hash(this.password, 10);
    this.password = hashedPassword;
    console.log(this);
    next();
  } catch (err) {
    next(err);
  }
});
