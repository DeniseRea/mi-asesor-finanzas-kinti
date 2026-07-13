import {
  Controller,
  Post,
  Get,
  Delete,
  Body,
  Query,
  Param,
  UseGuards,
  Req,
  Headers,
  UnauthorizedException,
} from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { ImportCsvDto } from './dto/import-csv.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('transactions')
export class TransactionsController {
  constructor(private transactionsService: TransactionsService) {}

  @Post('webhook')
  webhook(
    @Body() dto: CreateTransactionDto,
    @Headers('x-kinti-secret') secret?: string,
  ) {
    if (
      !process.env.N8N_WEBHOOK_SECRET ||
      secret !== process.env.N8N_WEBHOOK_SECRET
    )
      throw new UnauthorizedException('Secret de webhook inválido');
    return this.transactionsService.create(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() dto: CreateTransactionDto, @Req() req: any) {
    dto.usuario_id = req.user.id;
    return this.transactionsService.create(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll(
    @Req() req: any,
    @Query('type') type?: string,
    @Query('category') category?: string,
    @Query('from') from?: string,
    @Query('to') to?: string,
  ) {
    return this.transactionsService.findAll(req.user.id, {
      type,
      category,
      from,
      to,
    });
  }

  @UseGuards(JwtAuthGuard)
  @Get('summary')
  getSummary(@Req() req: any) {
    return this.transactionsService.getSummary(req.user.id);
  }

  @Post('csv')
  @UseGuards(JwtAuthGuard)
  parseCsv(@Body() body: { csv: string }) {
    return this.transactionsService.parseCsv(body.csv);
  }

  @UseGuards(JwtAuthGuard)
  @Post('csv/confirm')
  importCsv(@Body() dto: ImportCsvDto, @Req() req: any) {
    return this.transactionsService.importCsv(req.user.id, dto.transactions);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string, @Req() req: any) {
    return this.transactionsService.remove(id, req.user.id);
  }
}
