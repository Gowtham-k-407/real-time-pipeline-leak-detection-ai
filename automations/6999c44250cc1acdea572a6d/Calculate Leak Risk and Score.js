// Step: Calculate Leak Risk and Score (Timed Hackathon Demo)
// Computes averages/scores/leak risk per cycle using rolling window
try {
  let pressureHistory = getContext("pressureHistory")
  let acousticHistory = getContext("acousticHistory")
  let flowHistory = getContext("flowHistory")
  const latest = getContext("latestReading")

  // Manual rolling averages
  const pressureAvg = pressureHistory.length
    ? pressureHistory.reduce(function (a, b) {
        return a + b
      }, 0) / pressureHistory.length
    : 0
  const acousticAvg = acousticHistory.length
    ? acousticHistory.reduce(function (a, b) {
        return a + b
      }, 0) / acousticHistory.length
    : 0
  const flowAvg = flowHistory.length
    ? flowHistory.reduce(function (a, b) {
        return a + b
      }, 0) / flowHistory.length
    : 0

  // Anomaly Scores
  var pressureScore = 0
  var acousticScore = 0
  var flowScore = 0
  if (latest) {
    if (latest.pressure < pressureAvg * 0.85) pressureScore = 100
    if (latest.acoustic > acousticAvg + 10) acousticScore = 100
    if (Math.abs(latest.flow - flowAvg) > 20) flowScore = 100
  }
  // Leak risk weights
  var part1 = pressureScore * 0.4
  var part2 = acousticScore * 0.35
  var part3 = flowScore * 0.25
  var leakRisk = part1 + part2 + part3
  setContext("riskOutput", {
    pressureAvg: pressureAvg,
    acousticAvg: acousticAvg,
    flowAvg: flowAvg,
    pressureScore: pressureScore,
    acousticScore: acousticScore,
    flowScore: flowScore,
    leakRisk: leakRisk
  })
  // Log progress
  console.log("Leak risk and scores calculated for cycle.")
} catch (err) {
  console.error("Error in Calculate Leak Risk and Score step:", err)
  process.exit(1)
}
