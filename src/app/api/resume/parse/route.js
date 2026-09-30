import {
  MAX_UPLOAD_BYTES,
  extractResumeText,
  getResumeFileKind,
  parseResumeText,
} from "@/lib/resume-parser";

export async function POST(request) {
  let formData;
  try {
    formData = await request.formData();
  } catch {
    return Response.json({ error: "Invalid upload." }, { status: 400 });
  }

  const file = formData.get("file");
  if (!file || typeof file === "string") {
    return Response.json({ error: "No file was uploaded." }, { status: 400 });
  }

  if (file.size > MAX_UPLOAD_BYTES) {
    return Response.json({ error: "File is larger than 10 MB." }, { status: 413 });
  }

  const kind = getResumeFileKind(file);
  if (!kind) {
    return Response.json(
      { error: "Only PDF and Word (.docx) files are supported." },
      { status: 415 }
    );
  }

  try {
    const text = await extractResumeText(await file.arrayBuffer(), kind);
    if (!text.trim()) {
      return Response.json(
        { error: "We couldn't find any text in this file. Scanned resumes aren't supported yet." },
        { status: 422 }
      );
    }
    return Response.json({ data: parseResumeText(text), fileName: file.name });
  } catch (error) {
    console.error("Resume parse failed:", error);
    return Response.json(
      { error: "We couldn't read this file. Please try another one." },
      { status: 500 }
    );
  }
}
