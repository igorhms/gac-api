import { BadRequestException, HttpStatus, Injectable } from '@nestjs/common';
import { AccountService } from '../account/account.service';
import { AccountDocument } from '../account/schemas/account.schema';
import { sys_default_msg } from 'src/utils/system-messages';
import { TransactionType } from 'src/utils/enums/transaction-type.enum';

@Injectable()
export class FinanceService {
  constructor(private readonly accountService: AccountService) {}

  async deposit(userId: string, amount: number): Promise<any> {
    if (amount <= 0)
      throw new BadRequestException('Valor para depósito inválido');
    await this.accountService.deposit(userId, amount);

    return {
      message: sys_default_msg.FINANCE_SUCCESS_TRANSACTION,
      status: HttpStatus.CREATED,
    };
  }

  async transfer(userId: string, toUserId: string, amount: number) {
    if (amount <= 0)
      throw new BadRequestException('Valor para transferência inválido');
    const fromAccount = await this.accountService.getAccountByUserId(userId);
    if (fromAccount.balance < amount)
      throw new BadRequestException('Saldo insuficiente');

    await this.accountService.transfer(userId, toUserId, amount);
    return {
      message: sys_default_msg.FINANCE_SUCCESS_TRANSACTION,
      status: HttpStatus.CREATED,
    };
  }

  async reverseOperation(userId: string): Promise<any> {
    const account = await this.accountService.getAccountByUserId(userId);

    if (account.transactions.length === 0) {
      throw new BadRequestException('Nenhuma transação para reverter.');
    }

    const lastTransaction =
      account.transactions[account.transactions.length - 1];

    switch (lastTransaction.type) {
      case TransactionType.DEPOSIT:
        if (account.balance < lastTransaction.amount) {
          throw new BadRequestException(
            'Saldo insuficiente para reverter o depósito.',
          );
        }
        account.balance -= lastTransaction.amount;
        break;

      case TransactionType.TRANSFER:
        const receiverAccount = await this.accountService.getAccountByUserId(
          lastTransaction.receiverUserId,
        );
        if (receiverAccount.balance < lastTransaction.amount) {
          throw new BadRequestException(
            'O destinatário não possui saldo suficiente para reverter a transferência.',
          );
        }
        account.balance += lastTransaction.amount;
        receiverAccount.balance -= lastTransaction.amount;

        await receiverAccount.save();
        break;

      default:
        throw new BadRequestException(
          'Tipo de transação inválido para reversão.',
        );
    }

    account.transactions.pop();
    await account.save();

    return {
      message: sys_default_msg.FINANCE_REVERT_TRANSACTION,
      status: HttpStatus.OK,
    };
  }
}
