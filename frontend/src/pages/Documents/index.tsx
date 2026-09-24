import { useEffect, useRef, useState, type ChangeEvent } from "react";
import Button from "../../components/atoms/Button";
import { BASE_URL } from "../../constants";
import { useApi } from "../../hooks/useApi";
import { dictionary } from "../../i18n";
import type { DocumentItem, UploadDocumentsResponse } from "../../types";
import { usePopup } from "../../utilities/Container";
import "./index.css";

const DOCUMENTS_URL = `${BASE_URL}/documents/`;

function Documents() {
  const { GET, POST } = useApi();
  const { showPopup } = usePopup();
  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const fileInput = useRef<HTMLInputElement>(null);

  useEffect(() => {
    GET<DocumentItem[]>({ url: DOCUMENTS_URL })
      .then(setDocuments)
      .catch((error) => {
        const message = error instanceof Error ? error.message : undefined;
        showPopup("dangerous", message);
      })
      .finally(() => setLoading(false));
  }, [GET, showPopup]);

  async function handleUpload(event: ChangeEvent<HTMLInputElement>) {
    const files = event.target.files;

    if (!files || files.length === 0) {
      return;
    }

    const body = new FormData();
    Array.from(files).forEach((file) => body.append("files", file));
    setUploading(true);

    try {
      const response = await POST<UploadDocumentsResponse>({
        url: DOCUMENTS_URL,
        body,
      });
      setDocuments((current) => [...current, ...response.documents]);
      showPopup("success", response.message);
    } catch (error) {
      const message = error instanceof Error ? error.message : undefined;
      showPopup("dangerous", message);
    } finally {
      setUploading(false);
      // permette di ricaricare lo stesso file
      event.target.value = "";
    }
  }

  return (
    <div className="documents-page">
      <section className="documents-list">
        {loading && <p className="documents-empty">{dictionary.documents.loading}</p>}
        {!loading && documents.length === 0 && (
          <p className="documents-empty">{dictionary.documents.empty}</p>
        )}
        {!loading && documents.length > 0 && (
          <ul>
            {documents.map((document) => (
              <li key={document.id} className="documents-item">
                <span className="documents-item-name">{document.filename}</span>
                <span className="documents-item-meta">
                  {document.page_count} {dictionary.documents.pages} ·{" "}
                  {new Date(document.upload_date).toLocaleDateString()}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>
      <section className="documents-upload">
        <input
          ref={fileInput}
          type="file"
          accept="application/pdf"
          multiple
          hidden
          onChange={handleUpload}
        />
        <Button
          className="documents-upload-button"
          onClick={() => fileInput.current?.click()}
          disabled={uploading}
        >
          {uploading ? dictionary.documents.uploading : dictionary.documents.upload}
        </Button>
      </section>
    </div>
  );
}

export default Documents;
