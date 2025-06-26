import { useDispatch, useSelector } from "react-redux";
import { setField } from "../redux/formSlice";
import Papa from "papaparse";
import * as XLSX from "xlsx";
import { useState } from "react";

export default function RecipientInput() {
  const dispatch = useDispatch();
  const recipients = useSelector((state) => state.form.recipients);
  const [input, setInput] = useState("");
  const [uploadedFileName, setUploadedFileName] = useState("");
  const maxLimit = 1000;

  const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());

  const addEmail = (email) => {
    const trimmed = email.trim();
    if (
      isValidEmail(trimmed) &&
      !recipients.includes(trimmed) &&
      recipients.length < maxLimit
    ) {
      dispatch(setField({ field: "recipients", value: [...recipients, trimmed] }));
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addEmail(input);
      setInput("");
    }
  };

  const handleAddClick = () => {
    addEmail(input);
    setInput("");
  };

  const updateRecipientList = (newEmails) => {
    const merged = [...recipients, ...newEmails];
    const unique = Array.from(new Set(merged)).slice(0, maxLimit);
    dispatch(setField({ field: "recipients", value: unique }));
  };

  const handleCSVUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadedFileName(file.name);
    const reader = new FileReader();

    reader.onload = (event) => {
      let emails = [];
      if (file.name.endsWith(".csv")) {
        Papa.parse(event.target.result, {
          complete: (result) => {
            emails = result.data.flat().filter((email) => isValidEmail(email));
            updateRecipientList(emails);
          },
        });
      } else if (file.name.endsWith(".xlsx")) {
        const workbook = XLSX.read(event.target.result, { type: "binary" });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const data = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
        emails = data.flat().filter((email) => isValidEmail(email));
        updateRecipientList(emails);
      } else {
        alert("Unsupported file format. Please upload .csv or .xlsx");
      }
    };

    if (file.name.endsWith(".xlsx")) {
      reader.readAsBinaryString(file);
    } else {
      reader.readAsText(file);
    }
  };

  const handleRemove = (email) => {
    dispatch(setField({ field: "recipients", value: recipients.filter((e) => e !== email) }));
  };

  const handleClear = () => {
    dispatch(setField({ field: "recipients", value: [] }));
    setUploadedFileName("");
  };

  return (
    <div className="mb-6">
      <div className="flex items-center mb-2">
        <div className="w-2 h-2 bg-purple-600 rounded-full mr-2" />
        <h2 className="text-lg font-semibold">Recipients</h2>
      </div>

      <p className="text-sm mb-2 text-gray-600">
        Add Recipients ({recipients.length}/{maxLimit})
      </p>

      <div className="flex gap-2 mb-3">
        <input
          type="text"
          placeholder="Enter email address and press Enter or comma"
          className="flex-1 border rounded p-2 text-sm"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <button
          onClick={handleAddClick}
          className="bg-gray-200 px-4 rounded text-sm hover:bg-gray-300"
        >
          Add
        </button>
      </div>

      <div className="flex gap-2 mb-4">
        <label className="bg-gray-100 border px-4 py-1 rounded cursor-pointer text-sm hover:bg-gray-200">
          <span>📤 Import CSV or Excel</span>
          <input
            type="file"
            accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
            onChange={handleCSVUpload}
            className="hidden"
          />
        </label>
        <button
          onClick={handleClear}
          disabled={recipients.length === 0}
          className={`mt-2 text-sm font-medium px-3 py-1 rounded transition-colors ${
            recipients.length === 0
              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
              : "bg-red-100 hover:bg-red-200 text-red-600 cursor-pointer"
          }`}
        >
          Clear All
        </button>
      </div>

      {recipients.length > 0 && uploadedFileName && (
        <div className="text-sm text-gray-600 italic mt-2">
          ✅ {recipients.length} recipients loaded from <strong>{uploadedFileName}</strong>
        </div>
      )}
    </div>
  );
}
