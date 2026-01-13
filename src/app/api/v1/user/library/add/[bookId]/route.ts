import { NextRequest } from "next/server";

export async function DELETE(
  req: NextRequest,
  { params }: { params: { bookId: string } }
) {
  return LibraryController.deleteFromLibrary(req, params);
}