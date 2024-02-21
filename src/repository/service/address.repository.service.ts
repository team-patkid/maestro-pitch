import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AddressEntity } from '../entity/address.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AddressRepositoryService {
  constructor(
    @InjectRepository(AddressEntity)
    private readonly addressRepository: Repository<AddressEntity>,
  ) {}

  async bulkInsertAddressInfo(dto: AddressEntity[]) {
    await this.addressRepository.insert(dto);
  }
}
