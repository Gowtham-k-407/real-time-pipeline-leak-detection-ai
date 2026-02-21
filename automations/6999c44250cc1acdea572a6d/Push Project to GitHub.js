const simpleGit = require("simple-git")
const path = require("path")

;(async () => {
  try {
    const GITHUB_TOKEN = process.env.GITHUB_TOKEN
    const GITHUB_REPO = process.env.GITHUB_REPO
    const GITHUB_USERNAME = process.env.GITHUB_USERNAME

    if (!GITHUB_TOKEN || !GITHUB_REPO || !GITHUB_USERNAME) {
      throw new Error("Missing required environment variables: GITHUB_TOKEN, GITHUB_REPO, GITHUB_USERNAME")
    }

    console.log("Preparing to push project to GitHub...")

    // Initialize simple-git in the project directory
    const git = simpleGit(process.cwd())

    // Check if it's already a git repo; if not, initialize one
    const isRepo = await git.checkIsRepo()
    if (!isRepo) {
      await git.init()
      console.log("Initialized new git repository.")
    }

    // Set remote origin, overwrite if exists
    const remoteUrl = `https://${GITHUB_USERNAME}:${GITHUB_TOKEN}@github.com/${GITHUB_REPO}.git`
    const remotes = await git.getRemotes(true)
    const hasOrigin = remotes.some(r => r.name === "origin")
    if (hasOrigin) {
      await git.remote(["set-url", "origin", remoteUrl])
      console.log("Updated existing origin remote.")
    } else {
      await git.addRemote("origin", remoteUrl)
      console.log("Added origin remote.")
    }

    // Stage all files except those in .gitignore
    await git.add("./*")
    console.log("Staged all files.")

    // Commit changes
    const commitMessage = "Automated commit: dashboard and workflow update"
    try {
      await git.commit(commitMessage)
      console.log("Committed changes.")
    } catch (error) {
      if (error && error.message && error.message.includes("nothing to commit")) {
        console.log("No changes to commit.")
      } else {
        throw error
      }
    }

    // Push to main (or master) branch
    try {
      await git.push("origin", "main")
      console.log("Pushed to origin/main.")
    } catch (pushMainErr) {
      console.log("Failed to push to main, trying master...")
      await git.push("origin", "master")
      console.log("Pushed to origin/master.")
    }

    console.log("Successfully pushed project to GitHub repository.")
  } catch (e) {
    console.error("❌ GitHub Push failed:", e.message || e)
    process.exit(1)
  }
})()
