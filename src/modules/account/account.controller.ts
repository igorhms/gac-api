import { Controller, Post, Get, Body, Param } from '@nestjs/common';
import { AccountService } from './account.service';

@Controller('account')
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  @Post('create')
  async createAccount(
    @Body()
    { userId, initialBalance }: { userId: string; initialBalance?: number },
  ) {
    return this.accountService.createAccount(userId, initialBalance || 0);
  }

  @Get()
  async getAll() {
    return this.accountService.getAll();
  }

  @Get(':userId')
  async getAccountByUserId(@Param('userId') userId: string) {
    return this.accountService.getAccountByUserId(userId);
  }

  @Get('transactions/:userId')
  getTransactionsByAccount(@Param('userId') userId: string) {
    return this.accountService.getTransactions(userId);
  }
}
