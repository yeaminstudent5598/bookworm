import { LibraryController } from "@/modules/library/library.controller";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  return LibraryController.getMyLibrary(req);
}

// PATCH /api/v1/user/library
export async function PATCH(req: NextRequest) {
  return LibraryController.updateLibraryStatus(req);
}