// Step: Simulate Sensor Data (Timed Hackathon Demo)
// Robust context retrieval with fallback logic for context keys and diagnostics
try {
  function safeGetContext(key, defaultValue) {
    try {
      let val = getContext(key)
      if (typeof val === "undefined") {
        console.warn("Context key", key, "undefined. Using fallback:", defaultValue)
        return defaultValue
      }
      return val
    } catch (e) {
      console.warn("Missing context key:", key, "; Using fallback:", defaultValue)
      return defaultValue
    }
  }

  let pressureHistory = safeGetContext("pressureHistory", [])
  let acousticHistory = safeGetContext("acousticHistory", [])
  let flowHistory = safeGetContext("flowHistory", [])
  let eventLog = safeGetContext("eventLog", [])
  let lastDataTime = safeGetContext("lastDataTime", Date.now())
  const sensorId = safeGetContext("sensorId", "NODE_001")
  const latitude = safeGetContext("latitude", 10.7905)
  const longitude = safeGetContext("longitude", 78.7047)
  let cycleCount = safeGetContext("cycleCount", 0)
  const maxCycles = safeGetContext("maxCycles", 12)

  // Print all acquired state for diagnostics
  console.log("[SimulateSensorData] Initial state:", {
    pressureHistory,
    acousticHistory,
    flowHistory,
    eventLog,
    lastDataTime,
    sensorId,
    latitude,
    longitude,
    cycleCount,
    maxCycles
  })

  // --- Core Simulation Logic ---
  // Function definitions and intervalId are now local only (NOT pushed to context)
  let intervalId = null
  // never store intervalId or any function or closure to context

  function simulateSensorCycle() {
    cycleCount++
    let pressure = Math.floor(Math.random() * (320 - 280 + 1)) + 280
    let acoustic = Math.floor(Math.random() * (55 - 35 + 1)) + 35
    let flow = Math.floor(Math.random() * (130 - 90 + 1)) + 90
    const timestamp = new Date().toISOString()

    // Force leak at cycles 5 and 9
    if (cycleCount === 5 || cycleCount === 9) {
      pressure = Math.floor(pressure * 0.75)
      acoustic += 20
      flow += 30
    }

    // Update last data time
    lastDataTime = Date.now()
    setContext("lastDataTime", lastDataTime)

    // Rolling window for histories
    pressureHistory.push(pressure)
    acousticHistory.push(acoustic)
    flowHistory.push(flow)
    if (pressureHistory.length > 5) pressureHistory.shift()
    if (acousticHistory.length > 5) acousticHistory.shift()
    if (flowHistory.length > 5) flowHistory.shift()
    setContext("pressureHistory", pressureHistory)
    setContext("acousticHistory", acousticHistory)
    setContext("flowHistory", flowHistory)

    // Save current simulated reading (only values, not functions)
    setContext("latestReading", { pressure, acoustic, flow, latitude, longitude, timestamp })
    setContext("cycleCount", cycleCount)

    // Stop after maxCycles
    if (cycleCount >= maxCycles) {
      if (intervalId) clearInterval(intervalId)
      setContext("intervalComplete", true)
      // End diagnostic (can be checked by downstream steps)
      console.log("Simulation interval complete at cycle", cycleCount)
    }
  }

  // Initial run, then fixed interval
  simulateSensorCycle()

  // Only use intervalId locally
  intervalId = setInterval(simulateSensorCycle, 5000)
  // Do NOT push intervalId or any function/closure to context
  console.log("Timed sensor simulation started (every 5 seconds for up to 12 cycles). Allow fallback state.")
} catch (err) {
  console.error("Error in Simulate Sensor Data step:", err)
  process.exit(1)
}
