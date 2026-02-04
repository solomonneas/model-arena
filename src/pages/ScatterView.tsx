function ScatterView() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Scatter Plot View</h1>
        <p className="text-gray-600">Explore relationships between model characteristics</p>
      </div>

      <div className="card">
        <div className="text-center py-12">
          <svg className="w-24 h-24 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
          </svg>
          <h2 className="text-xl font-semibold text-gray-700 mb-2">Scatter Plot Coming Soon</h2>
          <p className="text-gray-500">
            Interactive D3.js scatter plot visualization will be implemented here
          </p>
        </div>
      </div>
    </div>
  )
}

export default ScatterView
