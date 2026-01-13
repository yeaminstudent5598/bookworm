import { RecommendationController } from '@/modules/book/recommendation.controller';

export async function GET(req: Request) {
  return RecommendationController.getPersonalizedRecommendations(req);
}