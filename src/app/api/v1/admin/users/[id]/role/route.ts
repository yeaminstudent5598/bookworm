import { UserController } from '@/modules/user/user.controller';

export async function PATCH(
  req: Request, 
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  return UserController.updateUserRole(req, id);
}