import { Module } from '@nestjs/common';
import { FinanceService } from './finance.service';
import { FinanceController } from './finance.controller';
import { AccountModule } from '../account/account.module';

@Module({
  imports: [AccountModule],
  controllers: [FinanceController],
  providers: [FinanceService],
  exports: [FinanceService],
})
export class FinanceModule {}
