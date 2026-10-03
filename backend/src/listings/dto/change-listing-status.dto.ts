import { IsEnum } from 'class-validator';

import { ListingStatus } from '../../generated/prisma/client.js';

export class ChangeListingStatusDto {
  @IsEnum(ListingStatus)
  status: ListingStatus;
}