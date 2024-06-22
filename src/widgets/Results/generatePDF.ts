import { Doc } from "../../../convex/_generated/dataModel";
import { PDFDocument, rgb } from "pdf-lib";

export async function generatePDF(
  groups: Doc<"Groups">[],
  answers: Doc<"Answers">[]
) {
  // create new pdf document
  const pdfDoc = await PDFDocument.create();

  // add a blank page to the document
  const page = pdfDoc.addPage();

  // set some text content on the page
  const { width, height } = page.getSize();
  const fontSize = 20;
  const margin = 50;
  let yPosition = height - margin;

  groups.map((group) =>
    answers
      .filter((e) => e.groupId === group.groupId)
      .forEach((answer) =>
        page.drawText(`Name: ${group.likes}`, {
          x: margin,
          y: yPosition,
          size: fontSize,
          color: rgb(0, 0, 0),
        })
      )
  );

  const pdfBytes = await pdfDoc.save();
  return pdfBytes;
}
