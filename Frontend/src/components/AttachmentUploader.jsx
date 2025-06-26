import { useDispatch, useSelector } from "react-redux";
import { setField } from "../redux/formSlice";
import { useState } from "react";


export default function AttachmentUploader() {
  const dispatch = useDispatch();
  const attachments = useSelector((state) => state.form.attachments);
  const [uploading, setUploading] = useState(false);
  const maxFiles = 5;

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file || uploading) return;
    if (file.size > 5 * 1024 * 1024) {
      alert("File too large (max 5MB)");
      return;
    }
    if (attachments.length >= maxFiles) {
      alert("Maximum 5 files allowed");
      return;
    }

    const newList = [...attachments, file]; // 👈 store file object
    dispatch(setField({ field: "attachments", value: newList }));
  };

  const handleRemove = (name) => {
    const updated = attachments.filter((f) => f.name !== name);
    dispatch(setField({ field: "attachments", value: updated }));
  };

  return (
    <div className="mb-6">
      <div className="flex items-center mb-2">
        <div className="w-2 h-2 bg-green-600 rounded-full mr-2" />
        <h2 className="text-lg font-semibold">Attachments</h2>
      </div>

      <p className="text-sm text-gray-600 mb-3">
        Upload Files (Max 5 files, 5MB each)
      </p>

      <div className="border-2 border-dashed border-gray-300 p-6 rounded flex flex-col items-center text-center cursor-pointer bg-white hover:bg-gray-50">
        <label htmlFor="file-upload" className="cursor-pointer">
          <div className="text-3xl mb-2">⬆️</div>
          <div className="font-medium">Choose Files</div>
          <p className="text-sm text-gray-500">
            Drag and drop files here or click to browse
          </p>
          <input
            id="file-upload"
            type="file"
            className="hidden"
            onChange={handleFileChange}
          />
        </label>
      </div>

      {attachments.length > 0 && (
        <div className="mt-4">
          <p className="text-sm font-medium mb-2">
            Attached Files ({attachments.length}/{maxFiles})
          </p>
          <ul className="space-y-2">
            {attachments.map((file, index) => (
              <li
                key={index}
                className="flex items-center justify-between bg-gray-50 border p-2 rounded"
              >
                <div className="flex items-center gap-2">
                  <span className="text-gray-600">📄</span>
                  <div className="text-sm">
                    <p>{file.name}</p>
                    <p className="text-gray-500 text-xs">
                      {(file.size / 1024).toFixed(2)} KB
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => handleRemove(file.name)}
                  className="text-red-500 hover:text-red-700 text-xl"
                >
                  &times;
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
