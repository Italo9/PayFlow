import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CompanySettingService } from './company-setting.service';
import { CreateCompanySettingDto } from './dto/create-company-setting.dto';
import { UpdateCompanySettingDto } from './dto/update-company-setting.dto';

@Controller('company-setting')
export class CompanySettingController {
  constructor(private readonly companySettingService: CompanySettingService) {}

  @Post()
  create(@Body() createCompanySettingDto: CreateCompanySettingDto) {
    return this.companySettingService.create(createCompanySettingDto);
  }

  @Get()
  findAll() {
    return this.companySettingService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.companySettingService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCompanySettingDto: UpdateCompanySettingDto) {
    return this.companySettingService.update(+id, updateCompanySettingDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.companySettingService.remove(+id);
  }
}
