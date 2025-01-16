import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { TransactionType } from 'src/utils/enums/transaction-type.enum';

export type AccountDocument = Account & Document;

@Schema({ timestamps: true })
export class Account {
  @Prop({ required: true, unique: true })
  userId: string;

  @Prop({ required: true, default: 0 })
  balance: number;

  @Prop({
    type: [
      {
        amount: Number,
        type: { type: String, enum: Object.values(TransactionType) },
        date: Date,
        receiverUserId: { type: String, required: false },
      },
    ],
    default: [],
  })
  transactions: {
    amount: number;
    type: TransactionType;
    date: Date;
    receiverUserId?: string;
  }[];
}

export const AccountSchema = SchemaFactory.createForClass(Account);
