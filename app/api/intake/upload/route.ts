import { NextResponse } from "next/server";
import intakePrisma from "@/lib/intake-prisma";
import { uploadIntakeFile, validateIntakeFile } from "@/lib/bunny-intake";

interface UploadedFile {
  name: string;
  url: string;
  storagePath: string;
  size: number;
  type: string;
  uploadedAt: string;
}

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const token = formData.get("token");
    const file = formData.get("file");

    if (typeof token !== "string" || !token) {
      return NextResponse.json({ error: "Missing upload token" }, { status: 400 });
    }
    if (!(file instanceof File)) {
      return NextResponse.json({ error: "Missing file" }, { status: 400 });
    }

    const submission = await intakePrisma.intakeSubmission.findUnique({
      where: { uploadToken: token, uploadEnabled: true },
    });

    if (!submission) {
      return NextResponse.json({ error: "Invalid or expired upload link" }, { status: 403 });
    }

    // Validate file type & size
    const mimeType = file.type || "application/octet-stream";
    const validationError = validateIntakeFile(mimeType, file.size);
    if (validationError) {
      return NextResponse.json({ error: validationError }, { status: 422 });
    }

    // Check file count limit
    const existing = ((submission.uploadedFiles as unknown) as UploadedFile[]) ?? [];
    if (existing.length >= 10) {
      return NextResponse.json({ error: "Maximum 10 files allowed per submission" }, { status: 422 });
    }

    // Upload to Bunny CDN
    const buffer = Buffer.from(await file.arrayBuffer());
    const { url, storagePath } = await uploadIntakeFile(
      buffer,
      submission.id,
      file.name,
      mimeType
    );

    const newFile: UploadedFile = {
      name: file.name,
      url,
      storagePath,
      size: file.size,
      type: mimeType,
      uploadedAt: new Date().toISOString(),
    };

    await intakePrisma.intakeSubmission.update({
      where: { id: submission.id },
      data: {
        uploadedFiles: JSON.parse(JSON.stringify([...existing, newFile])),
      },
    });

    return NextResponse.json({ success: true, file: newFile }, { status: 201 });
  } catch (error) {
    console.error("[INTAKE_UPLOAD]", error);
    return NextResponse.json({ error: "Upload failed. Please try again." }, { status: 500 });
  }
}
