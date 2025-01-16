import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { FinanceService } from './finance.service';

@Controller('finance')
export class FinanceController {
  constructor(private readonly financeService: FinanceService) {}

  @Post('deposit')
  deposit(@Body() { userId, amount }: { userId: string; amount: number }) {
    return this.financeService.deposit(userId, amount);
  }

  @Post('transfer')
  transfer(
    @Body()
    {
      userId,
      toUserId,
      amount,
    }: {
      userId: string;
      toUserId: string;
      amount: number;
    },
  ) {
    return this.financeService.transfer(userId, toUserId, amount);
  }

  @Post('reverseLastTransaction')
  reverse(@Body() { userId }: { userId: string; amount: number }) {
    return this.financeService.reverseOperation(userId);
  }
}
