const setPlates = (difference, plates, neededPlates) => {
    const highest = plate =>  plate <= difference;
    const heaviest = R.find(highest, plates);
    // Add heaviest plate to the needed plates
    const platesNeeded = neededPlates.concat(heaviest);

    // Remove heaviest plate from available plates because it's no longer availabe for use
    plates.splice(plates.indexOf(heaviest), 1)

    // Adjust difference
    const neededWeight = difference - heaviest
    // If there is still weight to add to meet the total then run the function again
    if (neededWeight) {
      return setPlates(neededWeight, plates, platesNeeded)
    }

    return platesNeeded
}

const plateMath = (total, options = {}) => {
  // Total available plates for one side of the bar,
  // there should be an equal amount for the other side
  const defaults = {
    platesAvailable: [45, 45, 35, 25, 10, 5, 5, 2.5],
    barWeight: 45
  }
  const model = R.mergeDeepRight(defaults, options);

  // Multiply by two because there are weights for both sides of the bar
  const doubleWeight = (accu, w) => accu += w * 2;
  const maxAmountOfWeight = model.platesAvailable.reduce(doubleWeight, 0);

  // Functions to check if an outcome is possible
  const gtBarWeight = t => t > model.barWeight;
  const lteTotalWeights = t => t <= maxAmountOfWeight;
  const isDivisible = t => t % 2.5 === 0 && t % 5 === 0;
  if (R.allPass([ gtBarWeight, lteTotalWeights, isDivisible])([total])) {
    return setPlates((total - model.barWeight) / 2, model.platesAvailable, [])
  }

  // No Possible Solution
  return []
}

const result = document.getElementById('result');
const model = document.getElementById('model');
model.addEventListener('input', e => {
	const val = Number(e.target.value);
	result.innerHTML = plateMath(val);
})
