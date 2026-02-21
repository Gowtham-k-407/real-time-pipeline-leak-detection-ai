// Step: Initialize Simulation Variables (Timed Hackathon Demo)
// Extends initialization for cycle stats, location, and sensor metadata
try {
  const pressureHistory = []
  const acousticHistory = []
  const flowHistory = []
  const eventLog = []
  const lastDataTime = Date.now()
  const sensorId = "NODE_001"
  const latitude = 10.7905
  const longitude = 78.7047
  let cycleCount = 0
  const maxCycles = 12 // Timed demo: will run 12 cycles (5s each)

  // Set all variables into context for downstream steps
  setContext("pressureHistory", pressureHistory)
  setContext("acousticHistory", acousticHistory)
  setContext("flowHistory", flowHistory)
  setContext("eventLog", eventLog)
  setContext("lastDataTime", lastDataTime)
  setContext("sensorId", sensorId)
  setContext("latitude", latitude)
  setContext("longitude", longitude)
  setContext("cycleCount", cycleCount)
  setContext("maxCycles", maxCycles)

  console.log("All simulation variables for timed hackathon demo initialized.")
} catch (err) {
  console.error("Error initializing simulation variables:", err)
  process.exit(1)
}
