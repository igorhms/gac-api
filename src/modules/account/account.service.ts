import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Account, AccountDocument } from './schemas/account.schema';
import { TransactionType } from 'src/utils/enums/transaction-type.enum';
import { sys_default_msg } from 'src/utils/system-messages';

@Injectable()
export class AccountService {
  constructor(
    @InjectModel(Account.name)
    private readonly accountModel: Model<AccountDocument>,
  ) {}

  async getAll(): Promise<AccountDocument[]> {
    try {
      return this.accountModel.find();
    } catch (error) {
      throw new BadRequestException(sys_default_msg.default_error);
    }
  }

  async createAccount(
    userId: string,
    initialBalance: number,
  ): Promise<AccountDocument> {
    const existingAccount = await this.accountModel.findOne({ userId });
    if (existingAccount) {
      throw new BadRequestException(
        'Já existe uma conta vinculada a este usuário.',
      );
    }

    const account = new this.accountModel({ userId, balance: initialBalance });
    return account.save();
  }

  async getAccountByUserId(userId: string): Promise<AccountDocument> {
    const account = await this.accountModel.findOne({ userId });
    if (!account) {
      throw new NotFoundException(
        'Conta não encontrada para o usuário informado.',
      );
    }
    return account;
  }

  async deposit(userId: string, amount: number): Promise<AccountDocument> {
    if (amount <= 0) {
      throw new BadRequestException(
        'O valor do depósito deve ser maior que zero.',
      );
    }

    const account = await this.getAccountByUserId(userId);
    account.balance += amount;
    account.transactions.push({
      amount,
      type: TransactionType.DEPOSIT,
      date: new Date(),
    });

    return account.save();
  }

  async transfer(
    senderUserId: string,
    receiverUserId: string,
    amount: number,
  ): Promise<{ sender: Account; receiver: Account }> {
    if (senderUserId === receiverUserId) {
      throw new BadRequestException(
        'O usuário remetente e destinatário não podem ser o mesmo.',
      );
    }

    if (amount <= 0) {
      throw new BadRequestException(
        'O valor da transferência deve ser maior que zero.',
      );
    }

    const sender = await this.getAccountByUserId(senderUserId);
    if (sender.balance < amount) {
      throw new BadRequestException(
        'Saldo insuficiente para realizar a transferência.',
      );
    }

    const receiver = await this.getAccountByUserId(receiverUserId);

    sender.balance -= amount;
    sender.transactions.push({
      amount,
      type: TransactionType.TRANSFER,
      date: new Date(),
      receiverUserId,
    });

    receiver.balance += amount;
    receiver.transactions.push({
      amount,
      type: TransactionType.TRANSFER,
      date: new Date(),
      receiverUserId: senderUserId,
    });

    await sender.save();
    await receiver.save();

    return { sender, receiver };
  }

  async saveTransaction(
    userId: string,
    transactionData: {
      amount: number;
      type: TransactionType;
      date: Date;
      receiverUserId?: string;
    },
  ): Promise<AccountDocument> {
    const account = await this.getAccountByUserId(userId);
    account.transactions.push(transactionData);
    return account.save();
  }

  async getTransactions(userId: string): Promise<any[]> {
    const account = await this.getAccountByUserId(userId);
    return account.transactions;
  }
}
