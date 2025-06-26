import { Editor } from "@tinymce/tinymce-react";
import { useRef } from "react";
import { useDispatch } from "react-redux";
import { setField } from "../redux/formSlice";
import { supabase } from "../supabase/client";

export default function EmailEditor() {
  const dispatch = useDispatch();
  const editorRef = useRef(null);

  const handleEditorChange = (content, editor) => {
    dispatch(setField({ field: "body", value: content }));
  };

  const imagesUploadHandler = async (blobInfo, success, failure) => {
    try {
      const file = blobInfo.blob();
      const fileName = `${Date.now()}-${blobInfo.filename()}`;

      const { data, error } = await supabase.storage
        .from("attachments")
        .upload(fileName, file);

      if (error) throw error;

      const { data: urlData } = supabase.storage
        .from("attachments")
        .getPublicUrl(fileName);

      success(urlData.publicUrl);
    } catch (err) {
      console.error("Image upload failed:", err);
      failure("Upload failed");
    }
  };

  return (
    <div className="mb-6">
      <label className="block text-sm font-medium mb-2 text-gray-700">
        Email Content <span className="text-red-500">*</span>
      </label>
      <div className="border rounded-lg shadow-sm overflow-hidden ring-1 ring-gray-300 focus-within:ring-2 focus-within:ring-blue-500">
        <Editor
          apiKey="7x93sg7iikxxab1hdz1tqofok3ayhrtqxyd2o3grxadtvw17"
          onInit={(evt, editor) => (editorRef.current = editor)}
          init={{
            height: 350,
            menubar: true,
            plugins: [
              "advlist autolink lists link image charmap preview anchor",
              "searchreplace visualblocks code fullscreen",
              "insertdatetime media table code help wordcount",
            ],
            toolbar:
              "undo redo | formatselect | bold italic underline strikethrough blockquote | " +
              "forecolor backcolor | alignleft aligncenter alignright alignjustify | " +
              "bullist numlist outdent indent | link image | removeformat | help",
            placeholder: "Write your email content here...",
            branding: false,
            automatic_uploads: true,
            file_picker_types: "image",
            images_upload_handler: imagesUploadHandler,
            content_style:
              "body { font-family:Inter,Helvetica,Arial,sans-serif; font-size:14px; padding:10px }",
          }}
          onEditorChange={handleEditorChange}
        />
      </div>
    </div>
  );
}
