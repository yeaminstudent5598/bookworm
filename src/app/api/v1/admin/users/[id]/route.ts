import { UserController } from '@/modules/user/user.controller';

export async function DELETE(
  req: Request, 
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  return UserController.deleteUser(id);
}