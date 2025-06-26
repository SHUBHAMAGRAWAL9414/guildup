import Header from './components/Header'
import TitleInput from './components/TitleInput'
import EmailEditor from './components/EmailEditor'
import AttachmentUploader from './components/AttachmentUploader'
import RecipientInput from './components/RecipientInput'
import SchedulePreviewSubmit from './components/SchedulePreviewSubmit .jsx'

function App() {
  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <div className="max-w-3xl mx-auto p-4">
        <TitleInput />
        <EmailEditor />
        <AttachmentUploader />
        <RecipientInput />
        <SchedulePreviewSubmit />
      </div>
    </div>
  )
}

export default App
