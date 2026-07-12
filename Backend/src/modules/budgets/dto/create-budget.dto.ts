export class CreateBudgetDto {
  category: string;
  amount: number;
  month: number;
  year: number;
  threshold?: number;
}
