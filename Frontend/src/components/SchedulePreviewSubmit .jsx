import { useDispatch, useSelector } from "react-redux";
import { setField, resetForm } from "../redux/formSlice";
import DatePicker from "react-datepicker";
import { useState } from "react";
import { supabase } from "../supabase/client";

export default function SchedulePreviewSubmit() {
  const dispatch = useDispatch();
  const { title, body, recipients, scheduleTime, attachments } = useSelector(
    (state) => state.form
  );
  const [error, setError] = useState("");
  const [showPreview, setShowPreview] = useState(false);
  const [mobileView, setMobileView] = useState(false);
  const [uploading, setUploading] = useState(false);

  const handleDateChange = (date) => {
    const now = new Date();
    const oneHourLater = new Date(now.getTime() + 60 * 60 * 1000);

    if (date < oneHourLater) {
      setError("Select a time at least 1 hour from now.");
    } else {
      setError("");
      dispatch(setField({ field: "scheduleTime", value: date.toISOString() }));
    }
  };

  const handleSchedule = async () => {
    if (!title || !body || recipients.length === 0 || !scheduleTime) {
      setError('Please fill in all required fields.')
      return
    }

    setUploading(true)
    const uploadedAttachments = []

    for (const file of attachments) {
      const fileName = `${Date.now()}-${file.name}`
      const { data, error } = await supabase.storage.from('attachments').upload(fileName, file)

      if (error) {
        console.error('Upload failed:', error)
        setUploading(false)
        alert('File upload failed. Try again.')
        return
      }

      const { data: urlData } = supabase.storage.from('attachments').getPublicUrl(fileName)

      uploadedAttachments.push({
        name: file.name,
        size: file.size,
        url: urlData.publicUrl,
      })
    }

    try {
      const response = await fetch('http://localhost:5000/api/schedule', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          body,
          recipients,
          scheduleTime,
          attachments: uploadedAttachments,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        alert('✅ Email scheduled successfully!')
        dispatch(resetForm())
        setShowPreview(false)
      } else {
        alert(`❌ Error: ${data.error || 'Something went wrong'}`)
      }
    } catch (err) {
      console.error('API Error:', err)
      alert('❌ Could not connect to server')
    } finally {
      setUploading(false)
    }
  }

  const isFormValid = () => {
    if (!title.trim()) return false;
    if (!body.trim()) return false;
    if (!recipients.length) return false;
    if (!scheduleTime) return false;

    const now = new Date();
    const scheduledDate = new Date(scheduleTime);
    return scheduledDate - now >= 60 * 60 * 1000;
  };

  return (
    <div className="bg-blue-50 border border-blue-200 rounded p-4">
      <div className="flex items-center mb-3">
        <div className="w-2 h-2 bg-orange-500 rounded-full mr-2" />
        <h2 className="text-lg font-semibold">Schedule Send</h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-3">
        <div>
          <label className="block text-sm font-medium mb-1">Select Date</label>
          <DatePicker
            selected={scheduleTime ? new Date(scheduleTime) : null}
            onChange={handleDateChange}
            className="w-full border rounded p-2"
            minDate={new Date()}
            dateFormat="P"
            placeholderText="Pick a date"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Select Time</label>
          <DatePicker
            selected={scheduleTime ? new Date(scheduleTime) : null}
            onChange={handleDateChange}
            showTimeSelect
            showTimeSelectOnly
            timeIntervals={15}
            timeCaption="Time"
            dateFormat="p"
            className="w-full border rounded p-2"
            placeholderText="--:--"
          />
        </div>
      </div>

      <div className="bg-blue-100 p-3 rounded text-sm">
        <p className="font-semibold text-blue-900">Scheduled for:</p>
        <p className="text-blue-800">
          {scheduleTime
            ? new Date(scheduleTime).toLocaleString()
            : "Select date and time"}
        </p>
        <p className="text-xs text-blue-600">
          * Minimum scheduling time is 1 hour from now
        </p>
      </div>

      {error && (
        <div className="bg-red-500 text-white p-2 mt-3 rounded font-medium">
          Validation Error: {error}
        </div>
      )}

      <div className="mt-4 flex gap-3 justify-end">
        <button
          onClick={() => setShowPreview(true)}
          className={`px-4 py-2 rounded transition-colors ${
            isFormValid()
              ? "bg-gray-200 hover:bg-gray-300 text-black cursor-pointer"
              : "bg-gray-100 text-gray-400 cursor-not-allowed"
          }`}
          disabled={!isFormValid()}
        >
          Preview Email
        </button>

        <button
          onClick={handleSchedule}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 cursor-pointer"
        >
          Schedule Email
        </button>
      </div>

      {showPreview && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-[90%] max-w-3xl shadow-2xl relative border border-gray-200">
            <button
              onClick={() => setShowPreview(false)}
              className="absolute top-2 right-3 text-gray-500 hover:text-black text-lg"
            >
              ✕
            </button>
            <h3 className="text-xl font-semibold mb-4 text-gray-800">📩 Email Preview</h3>
            <div className="mb-4 flex gap-3 justify-center">
              <button
                onClick={() => setMobileView(false)}
                className={`px-4 py-1 rounded-full border text-sm font-medium ${
                  !mobileView
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-700"
                }`}
              >
                Desktop View
              </button>
              <button
                onClick={() => setMobileView(true)}
                className={`px-4 py-1 rounded-full border text-sm font-medium ${
                  mobileView
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-700"
                }`}
              >
                Mobile View
              </button>
            </div>

            <div
              className={`border-2 border-dashed border-gray-300 p-4 rounded-lg bg-gray-50 ${
                mobileView ? "max-w-xs mx-auto" : ""
              }`}
            >
              <div className="text-xs text-gray-500 flex flex-wrap gap-3 mb-2">
                <span>👥 {recipients.length} recipients</span>
                <span>📎 {attachments.length} attachments</span>
                <span>🕒 {scheduleTime ? new Date(scheduleTime).toLocaleString() : "--"}</span>
              </div>
              <div className="border rounded p-4 bg-white shadow-sm">
                <p className="text-sm text-gray-600 mb-1">
                  From: your-email@example.com
                </p>
                <h4 className="text-lg font-bold mb-2 text-gray-800">
                  {title || "(No Subject)"}
                </h4>
                <p className="text-sm text-gray-500 mb-4">
                  To: {recipients.length} recipients
                </p>
                <div
                  className="text-sm prose max-w-full"
                  dangerouslySetInnerHTML={{ __html: body }}
                />
              </div>
            </div>

            <div className="mt-4 text-center">
              <button
                onClick={() => setShowPreview(false)}
                className="text-sm text-blue-600 hover:underline"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
