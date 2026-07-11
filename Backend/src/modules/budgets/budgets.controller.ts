import { Controller, Post, Get, Patch, Delete, Body, Param, Query, UseGuards, Req } from '@nestjs/common';
import { BudgetsService } from './budgets.service';
import { CreateBudgetDto } from './dto/create-budget.dto';
import { UpdateBudgetDto } from './dto/update-budget.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('budgets')
export class BudgetsController {
  constructor(private budgetsService: BudgetsService) {}

  @Post('webhook')
  webhook(@Body() dto: CreateBudgetDto) {
    return this.budgetsService.create(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() dto: CreateBudgetDto, @Req() req: any) {
    dto.usuario_id = req.user.id;
    return this.budgetsService.create(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll(
    @Req() req: any,
    @Query('mes') mes?: string,
    @Query('anio') anio?: string,
  ) {
    return this.budgetsService.findAll(req.user.id, {
      mes: mes ? parseInt(mes) : undefined,
      anio: anio ? parseInt(anio) : undefined,
    });
  }

  @UseGuards(JwtAuthGuard)
  @Get('status')
  getStatus(@Req() req: any, @Query('categoria') categoria: string) {
    return this.budgetsService.getStatus(req.user.id, categoria);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateBudgetDto, @Req() req: any) {
    return this.budgetsService.update(id, req.user.id, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string, @Req() req: any) {
    return this.budgetsService.remove(id, req.user.id);
  }
}
