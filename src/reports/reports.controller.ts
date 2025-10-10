import { Body, Controller, Post, UseGuards } from '@nestjs/common';

import { ReportsService } from './reports.service';

import { CreateReportDto } from './dtos/create-report.dto';
import { ReportDto } from './dtos/report.dto';

import { AuthGuard } from '../guards/auth.guard';

import { Serialize } from '../interceptors/serialize.interceptor';

import { CurrentUser } from '../users/decorators/current-user.decorator';
import { User } from '../users/user.entity';
@Controller('reports')
export class ReportsController {
  constructor(private reportsService: ReportsService) {}

  @Post()
  @UseGuards(AuthGuard)
  @Serialize(ReportDto)
  createReport(@Body() body: CreateReportDto, @CurrentUser() user: User) {
    return this.reportsService.create(body, user);
  }
}
