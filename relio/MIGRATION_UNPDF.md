# Migration to unpdf Library

## Summary
Successfully migrated from `pdf-parse` to `unpdf` library for PDF text and URL extraction. The unpdf library is a modern, serverless-friendly alternative with better performance and additional features.

## Changes Made

### 1. Dependencies
- **Removed**: `pdf-parse` (v1.1.1)
- **Added**: `unpdf` (v1.3.2)

### 2. Code Changes

#### `/src/app/api/upload/route.ts`
- Replaced `pdfParse` import with `getDocumentProxy`, `extractText` and `extractLinks` from `unpdf`
- Added URL extraction functionality for PDFs
- Updated PDF processing to use unpdf's modern API:
  ```typescript
  const arrayBuffer = await file.arrayBuffer()
  const uint8Array = new Uint8Array(arrayBuffer)
  // Get document proxy first to prevent worker issues in Node.js/Next.js
  const pdf = await getDocumentProxy(uint8Array)
  const { text, totalPages } = await extractText(pdf, { mergePages: true })
  const { links } = await extractLinks(pdf)
  ```
- **Important**: 
  - unpdf requires `Uint8Array` instead of `Buffer`
  - Must use `getDocumentProxy()` first to avoid DataCloneError in Next.js server environment
  - Pass the PDF proxy to `extractText()` and `extractLinks()` instead of raw data
- For DOCX files, convert back to Buffer as mammoth still requires it
- Enhanced logging to show extracted URLs

#### `/src/lib/ai.ts`
- Updated `parseResumeToPortfolio` function signature to accept optional URLs array:
  ```typescript
  export async function parseResumeToPortfolio(
    resumeText: string,
    urls: string[] = []
  ): Promise<PortfolioConfig>
  ```
- Enhanced AI prompt to include URLs found in the PDF for better context:
  - URLs are now passed to the AI model
  - AI can use URLs to populate website, LinkedIn, GitHub, and project links

#### `/next.config.ts`
- Removed `pdf-parse` from `serverComponentsExternalPackages` as unpdf doesn't require it

#### `/src/types/modules.d.ts`
- Removed TypeScript declarations for `pdf-parse`
- unpdf has built-in TypeScript support

## Benefits

1. **Better URL Extraction**: Automatically extracts hyperlinks from PDFs
2. **Serverless Optimized**: unpdf is designed for edge/serverless environments
3. **Modern API**: Cleaner, promise-based API with TypeScript support
4. **Enhanced AI Context**: URLs are now included in the AI prompt for better portfolio generation
5. **Better Maintained**: unpdf is actively maintained (last update 3 days ago)
6. **Zero Dependencies**: unpdf ships with a serverless build of PDF.js

## Features Added

### URL Extraction
PDFs now have their embedded URLs automatically extracted and passed to the AI:
- LinkedIn profiles
- GitHub repositories
- Personal websites
- Project links
- Any other HTTP/HTTPS URLs

The AI model now receives these URLs and can intelligently assign them to the appropriate fields in the portfolio configuration.

## Testing Recommendations

1. Test PDF upload with embedded URLs (LinkedIn, GitHub, website)
2. Test PDF without URLs to ensure backward compatibility
3. Test DOCX files to ensure they still work (no changes to DOCX processing)
4. Verify that extracted URLs appear correctly in the generated portfolio

## Common Issues & Solutions

### DataCloneError: Cannot transfer object of unsupported type
**Problem**: This error occurs when unpdf tries to use web workers in Next.js server environment.

**Solution**: Always use `getDocumentProxy()` first, then pass the proxy to `extractText()` and `extractLinks()`:
```typescript
const pdf = await getDocumentProxy(uint8Array)
const { text } = await extractText(pdf, { mergePages: true })
```

Do NOT pass raw `Uint8Array` directly to `extractText()` in Next.js server routes.

## Notes

- The `unpdf` library uses Mozilla's PDF.js under the hood
- It includes a serverless-optimized build that works in Node.js, browsers, and edge environments
- URL extraction only works for PDFs (DOCX files continue to work as before, but without URL extraction)
