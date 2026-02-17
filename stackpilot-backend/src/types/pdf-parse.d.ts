declare module 'pdf-parse' {
  interface PdfParseInfo {
    PDFFormatVersion: string;
    IsAcroFormPresent: boolean;
    IsXFAPresent: boolean;
    [key: string]: unknown;
  }

  interface PdfParseMetadata {
    [key: string]: unknown;
  }

  interface PdfParseResult {
    text: string;
    numpages: number;
    info: PdfParseInfo;
    metadata: PdfParseMetadata;
    version: string;
  }

  interface PdfParseOptions {
    pagerender?: (pageData: unknown) => string;
    max?: number;
  }

  function pdfParse(
    dataBuffer: Buffer,
    options?: PdfParseOptions,
  ): Promise<PdfParseResult>;

  export = pdfParse;
}
