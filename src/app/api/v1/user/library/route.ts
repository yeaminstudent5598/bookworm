import { LibraryController } from "@/modules/library/library.controller";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  return LibraryController.getMyLibrary(req);
}

export async function PATCH(req: NextRequest) {
  return LibraryController.updateLibraryStatus(req);
}