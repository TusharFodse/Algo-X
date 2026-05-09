function calculateROI(initial, final) {
  return ((final - initial) / initial) * 100;
}

module.exports = { calculateROI };