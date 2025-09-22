import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { SupplierController } from './controllers/supplier.controller';
import { supplierProvider } from './providers';

@Module({
  imports: [CqrsModule],
  controllers: [SupplierController],
  providers: [...supplierProvider],
  exports: [...supplierProvider],
})
export class SupplierModule {}
