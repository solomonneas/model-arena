import Timeline from '@/components/Timeline'
import modelsData from '../../data/models.json'

function TimelineView() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Timeline View</h1>
        <p className="text-gray-600">Track model releases and performance over time</p>
      </div>

      <div className="card p-6">
        <Timeline models={modelsData.models} />
      </div>
    </div>
  )
}

export default TimelineView
