import { useDispatch } from 'react-redux'
import { setField } from '../redux/formSlice'

export default function TitleInput() {
  const dispatch = useDispatch()

  const handleChange = (e) => {
    dispatch(setField({ field: 'title', value: e.target.value }))
  }

  return (
    <div className="mb-6">
      <label className="block text-sm font-medium mb-1">Email Subject</label>
      <input
        type="text"
        placeholder="Enter subject..."
        onChange={handleChange}
        className="w-full border rounded p-2 shadow-sm"
      />
    </div>
  )
}
