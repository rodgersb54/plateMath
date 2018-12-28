import { extend, max } from 'underscore'

export default function plateMath(total, options) {
  const defaults = {
    platesAvailable: [45, 45, 35, 25, 10, 5, 5, 2.5],
    barWeight: 45
  }

  const model = extend(defaults, options)
  let killCount = 0

  const setPlates = (difference, plates, neededPlates) => {

    // Attempt to find a solution at most 50 times
    killCount++
    if (killCount > 50) {
      return false
    }

    // Search thru the plates that are available to find all the weights that are lower or equal to the difference
    const eligiblePlates = plates.filter( plate => {
      return plate <= difference ? plate : false
    })

    // Find the heaviest plate
    const heaviest = max(eligiblePlates)

    // Add heaviest plate to the needed plates
    const platesNeeded = neededPlates.concat(heaviest)

    // Remove heaviest plate from available plates because it's no longer availabe for use
    plates.splice(plates.indexOf(heaviest), 1)

    // Adjust difference
    const newDiff = difference - heaviest

    // If there is still weight to add to meet the total then run the function again
    if (newDiff) {
      return setPlates(newDiff, plates, platesNeeded)
    }

    return platesNeeded
  }

  return setPlates((total - model.barWeight) / 2, model.platesAvailable, [])
}
