import { useSelector } from 'react-redux'
import { useMemo } from 'react'
import { format, parseISO } from 'date-fns'

const useFilteredApplications = () => {
  const ApplicationList = useSelector((state) => state.applications)

  return useMemo(() => {
    if (!ApplicationList || !Array.isArray(ApplicationList)) {
      console.warn('ApplicationList is undefined or not an array')
      return {
        forwarded: { dates: [], counts: [], growth: 0 },
        notForwarded: { dates: [], counts: [], growth: 0 }
      }
    }

    const forwardedCount = {}
    const notForwardedCount = {}

    ApplicationList.forEach((app) => {
      if (!app) return

      const dateField = app.forwardedtocm ? app.updatedAt : app.createdAt

      if (!dateField || typeof dateField !== 'string') {
        console.warn('Date field is missing or not a string', app)
        return
      }

      const dateKey = format(parseISO(dateField), 'yyyy-MM-dd')

      if (app.forwardedtocm) {
        forwardedCount[dateKey] = (forwardedCount[dateKey] || 0) + 1
      } else {
        notForwardedCount[dateKey] = (notForwardedCount[dateKey] || 0) + 1
      }
    })

    const getGrowthRate = (counts) => {
      if (counts.length < 2) return 0 // Not enough data to calculate growth
      const latest = counts[counts.length - 1] || 0
      const previous = counts[counts.length - 2] || 0
      return previous === 0 ? 0 : ((latest - previous) / previous) * 100
    }

    return {
      forwarded: {
        dates: Object.keys(forwardedCount).sort(),
        counts: Object.values(forwardedCount),
        growth: getGrowthRate(Object.values(forwardedCount))
      },
      notForwarded: {
        dates: Object.keys(notForwardedCount).sort(),
        counts: Object.values(notForwardedCount),
        growth: getGrowthRate(Object.values(notForwardedCount))
      }
    }
  }, [ApplicationList])
}

export default useFilteredApplications
