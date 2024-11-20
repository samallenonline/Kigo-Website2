// ignore warnings - do not affect functionality in a significant way
const express = require('express');
const dotenv = require('dotenv');
dotenv.config();
const { spawn } = require('child_process');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// define path to the integrated JAR file
const jarPath = path.join(__dirname, 'libs', 'Kigo-0.0.1-SNAPSHOT.jar');

// define path to the lyrics folder
const lyricsFolder = path.join(__dirname, '../KigoLibrary/lyrics');

// root route
app.get('/', (req, res) => {
  res.send('Welcome to the Kigo Node.js app!');
});

// route to start Spotify authorization
app.get('/login', (req, res) => {
  console.log('[DEBUG] Initiating login flow');

  // command to execute the JAR's login flow
  const command = `java -jar ${jarPath} login`;

  const loginProcess = spawn('java', ['-jar', jarPath, 'login']);
  let stdout = '';
  let stderr = '';

  // capture stdout and stderr
  loginProcess.stdout.on('data', (data) => {
    stdout += data.toString();
  });

  loginProcess.stderr.on('data', (data) => {
    stderr += data.toString();
  });

  loginProcess.on('close', (code) => {
    if (code !== 0) {
      console.error(`[DEBUG] JAR exited with code ${code}. STDERR: ${stderr}`);
      return res.status(500).send('Failed to initiate login flow.');
    }

    console.log(`[DEBUG] JAR STDOUT: ${stdout}`);
    
    // extract the authorization URL
    const match = stdout.match(/https:\/\/accounts\.spotify\.com\S+/);
    if (match) {
      const authorizeURL = match[0].trim();
      console.log(`[DEBUG] Redirecting user to: ${authorizeURL}`);

      // automatically redirect the user to the authorization URL
      res.redirect(authorizeURL);
    } else {
      console.error('[DEBUG] Authorization URL not found in JAR output.');
      res.status(500).send('Failed to generate authorization URL.');
    }
  });
});

// callback route after Spotify redirects back with the code
app.get('/callback', (req, res) => {
  const { code } = req.query;

  if (!code) {
    console.error(`[DEBUG] Missing authorization code`);
    return res.status(400).send('Missing authorization code.');
  }

  console.log(`[DEBUG] Received authorization code: ${code}`);

  // spawn process to execute the JAR's callback flow
  const jarProcess = spawn('java', ['-jar', jarPath, 'callback', code]);

  let output = '';
  jarProcess.stdout.on('data', (data) => {
    console.log(`[DEBUG] JAR STDOUT: ${data}`);
    output += data.toString();
  });

  jarProcess.stderr.on('data', (data) => {
    console.error(`[DEBUG] JAR STDERR: ${data}`);
  });

  jarProcess.on('close', (exitCode) => {
    if (exitCode !== 0) {
      console.error(`[DEBUG] JAR exited with code ${exitCode}`);
      res.status(500).send(`Failed to process authorization code. Exit code: ${exitCode}`);
      return;
    }

    console.log(`[DEBUG] Authentication successful. JAR Output: ${output.trim()}`);
    res.send('Authentication successful! User data processed.');
  });
});


// route to fetch lyrics using the JAR file
app.get('/fetch-lyrics', (req, res) => {
  const { songTitle, artistName } = req.query;

  if (!songTitle || !artistName) {
    console.error(`[DEBUG] Missing query parameters: songTitle=${songTitle}, artistName=${artistName}`);
    return res.status(400).send('Missing songTitle or artistName query parameters.');
  }

  console.log(`[DEBUG] Fetching lyrics for Song: ${songTitle}, Artist: ${artistName}`);

  // spawn process to execute the JAR for lyrics fetching
  const jarProcess = spawn('java', ['-jar', jarPath, 'lyrics', songTitle, artistName]);

  let output = '';
  let error = '';

  jarProcess.stdout.on('data', (data) => {
    console.log(`[DEBUG] JAR STDOUT: ${data}`);
    output += data.toString();
  });

  jarProcess.stderr.on('data', (data) => {
    console.error(`[DEBUG] JAR STDERR: ${data}`);
    error += data.toString();
  });

  jarProcess.on('close', (code) => {
    if (code !== 0) {
      console.error(`[DEBUG] JAR exited with code ${code}`);
      res.status(500).send('Failed to fetch lyrics.');
      return;
    }
    console.log(`[DEBUG] Lyrics fetched: ${output.trim()}`);
    res.send(output.trim());
  });
});

// route to generate haikus using the JAR file
app.get('/generate-haiku', (req, res) => {
  console.log(`[DEBUG] Generating haikus from lyrics folder: ${lyricsFolder}`);

  // spawn process to execute the JAR for haiku generation
  const jarProcess = spawn('java', ['-jar', jarPath, 'haiku', lyricsFolder]);

  let output = '';
  let error = '';

  jarProcess.stdout.on('data', (data) => {
    console.log(`[DEBUG] JAR STDOUT: ${data}`);
    output += data.toString();
  });

  jarProcess.stderr.on('data', (data) => {
    console.error(`[DEBUG] JAR STDERR: ${data}`);
    error += data.toString();
  });

  jarProcess.on('close', (code) => {
    if (code !== 0) {
      console.error(`[DEBUG] JAR exited with code ${code}`);
      res.status(500).send('Failed to generate haikus.');
      return;
    }
    console.log(`[DEBUG] Haikus generated: ${output.trim()}`);
    res.send(`<pre>${output.trim()}</pre>`);
  });
});

// start the server
app.listen(PORT, () => {
  console.log(`[DEBUG] Server running on http://localhost:${PORT}`);
});