import { useEffect, useRef, useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
import { dictionary } from "../../../i18n";
import type { PdfViewerProps } from "../../../types";
import { usePopup } from "../../../utilities/Container";
import "./index.css";

// il worker va configurato nello stesso modulo che usa i componenti di react-pdf
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url,
).toString();

// rects_in è [x, y, w, h] in pollici dall'angolo in alto a sinistra; 1 pollice = 72 punti PDF
const POINTS_PER_INCH = 72;

// l'endpoint dei file richiede il cookie di sessione; oggetto costante per evitare ricaricamenti
const PDF_OPTIONS = { withCredentials: true };

function PdfViewer({ url, pageNumber = 1, highlights = [] }: PdfViewerProps) {
  const { showPopup } = usePopup();
  const container = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState<number>();
  const [numPages, setNumPages] = useState(0);
  const [page, setPage] = useState(pageNumber);
  const [error, setError] = useState(false);
  const [pageSize, setPageSize] = useState<{ width: number; height: number }>();
  const firstHighlight = useRef<HTMLDivElement>(null);

  const rects = highlights
    .filter((region) => region.page_number === page)
    .flatMap((region) => region.rects_in)
    .filter((rect) => rect.length === 4);

  // la pagina si adatta alla larghezza del contenitore
  useEffect(() => {
    const element = container.current;

    if (!element) {
      return;
    }

    const observer = new ResizeObserver(([entry]) => {
      setWidth(entry.contentRect.width);
    });
    observer.observe(element);

    return () => observer.disconnect();
  }, []);

  function handleLoadSuccess({ numPages: total }: { numPages: number }) {
    setNumPages(total);
    setPage((current) => Math.min(Math.max(current, 1), total));
  }

  function handlePageLoad({
    originalWidth,
    originalHeight,
  }: {
    originalWidth: number;
    originalHeight: number;
  }) {
    setPageSize({ width: originalWidth, height: originalHeight });
  }

  // porta in vista la prima parte evidenziata
  function handlePageRender() {
    firstHighlight.current?.scrollIntoView({ block: "center" });
  }

  function handleLoadError() {
    setError(true);
    showPopup("dangerous", dictionary.pdf.error);
  }

  return (
    <div className="pdf-viewer">
      {!error && numPages > 0 && (
        <div className="pdf-viewer-toolbar">
          <button
            type="button"
            className="pdf-viewer-nav"
            onClick={() => setPage((current) => current - 1)}
            disabled={page <= 1}
            aria-label={dictionary.pdf.previous}
          >
            ‹
          </button>
          <span className="pdf-viewer-pages">
            {page} / {numPages}
          </span>
          <button
            type="button"
            className="pdf-viewer-nav"
            onClick={() => setPage((current) => current + 1)}
            disabled={page >= numPages}
            aria-label={dictionary.pdf.next}
          >
            ›
          </button>
        </div>
      )}
      <div ref={container} className="pdf-viewer-content">
        <Document
          file={url}
          options={PDF_OPTIONS}
          suspense={false}
          onLoadSuccess={handleLoadSuccess}
          onLoadError={handleLoadError}
          loading={
            <p className="pdf-viewer-message">{dictionary.pdf.loading}</p>
          }
          error={
            <p className="pdf-viewer-message pdf-viewer-message--error">
              {dictionary.pdf.error}
            </p>
          }
        >
          {numPages > 0 && (
            <Page
              pageNumber={page}
              width={width}
              onLoadSuccess={handlePageLoad}
              onRenderSuccess={handlePageRender}
            >
              {pageSize &&
                rects.map(([x, y, w, h], index) => (
                  <div
                    key={`${page}-${index}`}
                    ref={index === 0 ? firstHighlight : undefined}
                    className="pdf-viewer-highlight"
                    style={{
                      left: `${((x * POINTS_PER_INCH) / pageSize.width) * 100}%`,
                      top: `${((y * POINTS_PER_INCH) / pageSize.height) * 100}%`,
                      width: `${((w * POINTS_PER_INCH) / pageSize.width) * 100}%`,
                      height: `${((h * POINTS_PER_INCH) / pageSize.height) * 100}%`,
                    }}
                  />
                ))}
            </Page>
          )}
        </Document>
      </div>
    </div>
  );
}

export default PdfViewer;
