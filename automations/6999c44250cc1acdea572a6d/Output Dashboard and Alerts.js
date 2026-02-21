// Step: Output Dashboard and Alerts (Timed Hackathon Demo, Unified Dashboard)
// Prints dashboard, alerts, and gives summary after all cycles, plus exports to HTML dashboard
try {
  const fs = require("fs")
  // Timed/interval simulation context
  var latest = getContext("latestReading")
  var riskOutput = getContext("riskOutput")
  var eventLog = getContext("eventLog")
  var cycleCount = getContext("cycleCount")
  var maxCycles = getContext("maxCycles")
  var intervalComplete = getContext("intervalComplete")
  // Simple Sequential Simulation context (use fallback if missing)
  var sequentialEventLog = []
  try {
    var maybeSequentialEventLog = getContext("sequentialEventLog")
    if (maybeSequentialEventLog && Array.isArray(maybeSequentialEventLog)) {
      sequentialEventLog = maybeSequentialEventLog
    } else {
      console.log("[Dashboard] No sequentialEventLog found in context, falling back to empty log.")
    }
  } catch (e) {
    console.log("[Dashboard] Could not get sequentialEventLog from context, using empty log. Error:", e.message)
    sequentialEventLog = []
  }
  if (!eventLog) eventLog = []

  // Helper: Write/update HTML dashboard (overwrites file each cycle)
  function writeHtmlDashboard() {
    // Timed (interval) simulation event rows
    let eventRows = eventLog.map((ev, i) => `<tr><td>${i + 1}</td><td>${ev.timestamp || ""}</td><td>${ev.latitude || "-"}</td><td>${ev.longitude || "-"}</td><td>${ev.pressure || "-"}</td><td>${ev.acoustic || "-"}</td><td>${ev.flow || "-"}</td><td>${ev.leakRisk || "-"}</td></tr>`).join("\n")
    // Sequential simulation event rows
    let sequentialRows = sequentialEventLog.map((ev, i) => `<tr><td>${i + 1}</td><td>${ev.timestamp || ""}</td><td>${ev.pressure || "-"}</td><td>${ev.acoustic || "-"}</td><td>${ev.flow || "-"}</td><td>${ev.leakRisk || "-"}</td></tr>`).join("\n")
    let alertsMessage = riskOutput && riskOutput.leakRisk >= 70 ? '<b style="color:red">*** HIGH RISK LEAK DETECTED ***</b>' : "Normal status. No leak detected."
    let html = `<!DOCTYPE html>
<html><head>
  <title>Leak Detection Dashboard</title>
  <meta charset=\"UTF-8\">
  <style>
    body { font-family: Arial; margin: 30px; background: #f9fcff; }
    .header { font-size: 1.3em; font-weight: bold; }
    table { border-collapse: collapse; min-width:90%; margin:20px 0; background: #fff; }
    td,th { border:1px solid #ccc; padding:6px 14px; }
    th { background: #e1edff; }
    .section { margin-bottom: 20px; }
    .seqHeader { background:#eff7e6; }
  </style>
</head><body>
  <div class='header'>Leak Detection Simulation — Cycle ${cycleCount || 0} of ${maxCycles || 0}</div>
  <div class='section'>
    <b>Timestamp:</b> ${latest ? latest.timestamp : "-"}<br>
    <b>Pressure:</b> ${latest ? latest.pressure : "-"}<br>
    <b>Acoustic:</b> ${latest ? latest.acoustic : "-"}<br>
    <b>Flow:</b> ${latest ? latest.flow : "-"}<br>
    <b>Leak Risk:</b> ${riskOutput ? riskOutput.leakRisk : "-"}<br>
    ${alertsMessage}<br>
  </div>
  <div class='section'>
    <b>Total Events Logged:</b> ${eventLog.length}
  </div>
  <div class='section'>
    <b>Timed Simulation – High Risk Event Log:</b>
    <table>
      <tr><th>#</th><th>Timestamp</th><th>Latitude</th><th>Longitude</th><th>Pressure</th><th>Acoustic</th><th>Flow</th><th>Leak Risk</th></tr>
      ${eventRows || '<tr><td colspan="8">No Events</td></tr>'}
    </table>
  </div>
  <div class='section'>
    <b>Simple Sequential Simulation – High Risk Event Log:</b>
    <table>
      <tr class="seqHeader"><th>#</th><th>Timestamp</th><th>Pressure</th><th>Acoustic</th><th>Flow</th><th>Leak Risk</th></tr>
      ${sequentialEventLog.length ? sequentialRows : '<tr><td colspan="6">No Events</td></tr>'}
    </table>
    <div><b>Total Sequential Events Logged:</b> ${sequentialEventLog.length}</div>
  </div>
  ${intervalComplete === true ? `<div style='font-weight:bold;color:#394;'>==== Simulation Complete ====</div>` : ""}
</body></html>`
    try {
      fs.writeFileSync("output-dashboard.html", html)
      // No error thrown, do nothing
    } catch (err) {
      console.error("Failed to write dashboard HTML file:", err)
    }
  }

  // Print summary for current cycle and log
  if (latest && riskOutput) {
    console.log("\n=========================")
    console.log("Cycle:", cycleCount, "of", maxCycles)
    console.log("Timestamp:", latest.timestamp)
    console.log("Pressure:", latest.pressure, "| Acoustic:", latest.acoustic, "| Flow:", latest.flow)
    console.log("Leak Risk:", riskOutput.leakRisk)

    // Alert logic for timed simulation
    if (riskOutput.leakRisk >= 70) {
      var event = {
        sensorId: "NODE_001",
        timestamp: latest.timestamp,
        latitude: latest.latitude,
        longitude: latest.longitude,
        pressure: latest.pressure,
        acoustic: latest.acoustic,
        flow: latest.flow,
        leakRisk: riskOutput.leakRisk
      }
      eventLog.push(event)
      setContext("eventLog", eventLog)
      console.log("*** HIGH RISK LEAK DETECTED ***")
      console.log("Sensor ID: NODE_001")
      console.log("Latitude:", latest.latitude, "Longitude:", latest.longitude)
    } else {
      console.log("Normal status. No leak detected.")
    }
    console.log("Total Events Logged:", eventLog.length)
    // Write dashboard file for this cycle, unified
    writeHtmlDashboard()
    console.log("Unified dashboard updated: output-dashboard.html (timed and sequential simulation events included)")
  }

  // Completion summary if finished
  if (intervalComplete === true) {
    console.log("\n==== Simulation Complete ====\n")
    console.log("Total HIGH RISK LEAK Events Detected:", eventLog.length)
    if (eventLog.length) {
      console.log("Events:")
      for (var i = 0; i < eventLog.length; i++) {
        var ev = eventLog[i]
        console.log(i + 1 + ".", ev.timestamp, " LeakRisk:", ev.leakRisk)
      }
    }
    if (sequentialEventLog.length) {
      console.log("Total Sequential Simulation HIGH RISK Events:", sequentialEventLog.length)
      for (var i = 0; i < sequentialEventLog.length; i++) {
        var seqEv = sequentialEventLog[i]
        console.log(i + 1 + ".", seqEv.timestamp, " LeakRisk:", seqEv.leakRisk)
      }
    } else {
      console.log("No Sequential Simulation events found (sequentialEventLog is empty).")
    }
    // Final dashboard refresh (unified)
    writeHtmlDashboard()
    process.exit(0)
  }
} catch (err) {
  console.error("Error in Output Dashboard and Alerts step:", err)
  process.exit(1)
}
