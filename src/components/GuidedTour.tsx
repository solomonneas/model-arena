import { useEffect, useCallback, useState } from 'react'

/**
 * driver.js loaded via CDN (IIFE build) exposes itself on the window object.
 * The IIFE build creates `window.driver` with a nested `js` namespace.
 */
declare global {
  interface Window {
    driver?: {
      js: {
        driver: (config: DriverConfig) => DriverInstance
      }
    }
  }
}

interface DriverStep {
  element?: string
  popover: {
    title: string
    description: string
    side?: 'top' | 'bottom' | 'left' | 'right'
    align?: 'start' | 'center' | 'end'
  }
}

interface DriverConfig {
  showProgress?: boolean
  showButtons?: string[]
  steps: DriverStep[]
  animate?: boolean
  overlayOpacity?: number
  stagePadding?: number
  stageRadius?: number
  onDestroyed?: () => void
}

interface DriverInstance {
  drive: () => void
  destroy: () => void
}

const STORAGE_KEY = 'model-arena-tour-complete'

const tourSteps: DriverStep[] = [
  {
    element: '[data-tour="model-cards"]',
    popover: {
      title: 'Model Cards Overview',
      description:
        'This is the home view showing all tracked LLM models. Each card displays key stats including benchmark scores, pricing, and capabilities.',
      side: 'bottom',
      align: 'center',
    },
  },
  {
    element: '[data-tour="chart-nav"]',
    popover: {
      title: 'Chart Navigation',
      description:
        'Use these links to switch between different visualization types. Each chart offers a unique perspective on model performance.',
      side: 'bottom',
      align: 'center',
    },
  },
  {
    element: '[data-tour="bar-chart"]',
    popover: {
      title: 'Bar Chart Comparison',
      description:
        'The bar chart lets you compare models across specific benchmarks with grouped bars. Sort and filter to focus on what matters.',
      side: 'bottom',
      align: 'center',
    },
  },
  {
    element: '[data-tour="radar-chart"]',
    popover: {
      title: 'Radar Chart',
      description:
        'Radar charts plot all benchmark dimensions at once. The shape reveals each model\'s strengths and weaknesses at a glance.',
      side: 'bottom',
      align: 'center',
    },
  },
  {
    element: '[data-tour="scatter-plot"]',
    popover: {
      title: 'Scatter Plot',
      description:
        'Scatter plots map performance vs. cost to help you find the best value models. Look for models in the upper-left (high performance, low cost).',
      side: 'bottom',
      align: 'center',
    },
  },
  {
    element: '[data-tour="comparison-table"]',
    popover: {
      title: 'Comparison Table',
      description:
        'The full data table shows all models and benchmark scores. Click headers to sort and use search to filter.',
      side: 'bottom',
      align: 'center',
    },
  },
  {
    element: '[data-tour="variant-picker"]',
    popover: {
      title: 'Variant Picker',
      description:
        'Model Arena features 5 distinct visual themes. Use this link to go back to the variant picker and explore different designs.',
      side: 'bottom',
      align: 'center',
    },
  },
]

/**
 * Try to get the driver constructor from the window object.
 * The IIFE build may expose it as `window.driver.js.driver` or directly.
 */
function getDriverConstructor(): ((config: DriverConfig) => DriverInstance) | null {
  if (window.driver?.js?.driver) {
    return window.driver.js.driver
  }
  return null
}

function GuidedTour() {
  const [driverReady, setDriverReady] = useState(false)

  useEffect(() => {
    const checkDriver = () => {
      if (getDriverConstructor()) {
        setDriverReady(true)
        return true
      }
      return false
    }

    if (checkDriver()) return

    // Poll for driver.js availability (loaded via CDN with defer)
    const interval = setInterval(() => {
      if (checkDriver()) {
        clearInterval(interval)
      }
    }, 200)

    // Stop checking after 10 seconds
    const timeout = setTimeout(() => clearInterval(interval), 10000)

    return () => {
      clearInterval(interval)
      clearTimeout(timeout)
    }
  }, [])

  const startTour = useCallback(() => {
    const createDriver = getDriverConstructor()
    if (!createDriver) return

    const driverInstance = createDriver({
      showProgress: true,
      showButtons: ['next', 'previous', 'close'],
      animate: true,
      overlayOpacity: 0.6,
      stagePadding: 8,
      stageRadius: 8,
      steps: tourSteps,
      onDestroyed: () => {
        localStorage.setItem(STORAGE_KEY, 'true')
      },
    })

    driverInstance.drive()
  }, [])

  // Auto-start on first visit
  useEffect(() => {
    if (!driverReady) return

    const tourComplete = localStorage.getItem(STORAGE_KEY)
    if (!tourComplete) {
      // Small delay to ensure DOM is rendered with data-tour attributes
      const timeout = setTimeout(startTour, 800)
      return () => clearTimeout(timeout)
    }
  }, [driverReady, startTour])

  if (!driverReady) return null

  return (
    <button
      onClick={startTour}
      data-tour="take-tour"
      className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-2 rounded-full shadow-lg text-sm font-medium transition-all duration-200 hover:scale-105 active:scale-95"
      style={{
        backgroundColor: '#3b82f6',
        color: '#ffffff',
        border: 'none',
        cursor: 'pointer',
      }}
      title="Take a guided tour of Model Arena"
    >
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="12" cy="12" r="10" />
        <path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3" />
        <line x1="12" y1="17" x2="12.01" y2="17" />
      </svg>
      Take Tour
    </button>
  )
}

export default GuidedTour
