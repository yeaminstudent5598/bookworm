import { StatsController } from '@/modules/stats/stats.controller';

export async function GET() {
  return StatsController.getAdminStats();
}