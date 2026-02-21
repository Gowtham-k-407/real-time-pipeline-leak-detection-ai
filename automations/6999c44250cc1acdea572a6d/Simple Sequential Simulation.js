// Step: Simple Sequential Simulation (NodeJS)
// Runs 6 cycles in a for loop with local histories and no context or interval usage.
try {
  var pressureHistory = []
  var acousticHistory = []
  var flowHistory = []
  var eventLog = []

  for (var i = 1; i <= 6; i++) {
    var pressure = Math.floor(Math.random() * (320 - 280 + 1)) + 280
    var acoustic = Math.floor(Math.random() * (55 - 35 + 1)) + 35
    var flow = Math.floor(Math.random() * (130 - 90 + 1)) + 90
    var timestamp = new Date().toISOString()

    // Force a leak on cycle 3
    if (i === 3) {
      pressure = Math.floor(pressure * 0.75)
      acoustic += 20
      flow += 30
    }

    // Rolling window for histories
    pressureHistory.push(pressure)
    acousticHistory.push(acoustic)
    flowHistory.push(flow)
    if (pressureHistory.length > 5) pressureHistory.shift()
    if (acousticHistory.length > 5) acousticHistory.shift()
    if (flowHistory.length > 5) flowHistory.shift()

    // Compute averages using reduce()
    var pressureAvg =
      pressureHistory.reduce(function (a, b) {
        return a + b
      }, 0) / pressureHistory.length
    var acousticAvg =
      acousticHistory.reduce(function (a, b) {
        return a + b
      }, 0) / acousticHistory.length
    var flowAvg =
      flowHistory.reduce(function (a, b) {
        return a + b
      }, 0) / flowHistory.length

    // Calculate scores
    var pressureScore = pressure < pressureAvg * 0.85 ? 100 : 0
    var acousticScore = acoustic > acousticAvg + 10 ? 100 : 0
    var flowScore = Math.abs(flow - flowAvg) > 20 ? 100 : 0

    // Calculate leakRisk
    var leakRisk = pressureScore * 0.4 + acousticScore * 0.35 + flowScore * 0.25

    // Print dashboard
    console.log("\n=========================")
    console.log("Cycle:", i, "of 6")
    console.log("Timestamp:", timestamp)
    console.log("Pressure:", pressure, "| Acoustic:", acoustic, "| Flow:", flow)
    console.log("Leak Risk:", leakRisk)

    if (leakRisk >= 70) {
      console.log("*** HIGH RISK LEAK DETECTED ***")
      var event = {
        cycle: i,
        timestamp: timestamp,
        pressure: pressure,
        acoustic: acoustic,
        flow: flow,
        leakRisk: leakRisk
      }
      eventLog.push(event)
    } else {
      console.log("Normal status. No leak detected.")
    }
    console.log("Total Events Logged:", eventLog.length)
  }

  // After loop completes
  console.log("\n==== Simulation Complete ====")
  console.log("Total HIGH RISK LEAK Events Detected:", eventLog.length)
  if (eventLog.length) {
    console.log("Events:")
    for (var j = 0; j < eventLog.length; j++) {
      var ev = eventLog[j]
      console.log(j + 1 + ".", ev.timestamp, " LeakRisk:", ev.leakRisk)
    }
  }
  // --- Dashboard Aggregation Addition ---
  // Always set eventLog to context as 'sequentialEventLog', even if empty
  setContext("sequentialEventLog", eventLog)
  if (eventLog.length === 0) {
    console.log("Simple Sequential Simulation: No high risk events detected. Persisted empty sequentialEventLog to context.")
  } else {
    console.log("Simple Sequential Simulation: eventLog persisted to context as sequentialEventLog.")
  }
  process.exit(0)
} catch (err) {
  console.error("Error in Simple Sequential Simulation step:", err)
  // Always set empty log to context on error to ensure downstream steps do not break
  setContext("sequentialEventLog", [])
  process.exit(1)
}
