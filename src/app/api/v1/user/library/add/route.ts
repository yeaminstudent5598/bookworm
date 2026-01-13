import { LibraryController } from "@/modules/library/library.controller";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  return LibraryController.addToLibrary(req);
}