import React, { useState } from 'react';
import './App.css';
import spotifyLogo from './/visuals/spotify_kigo.png'

function App() {
  const [step, setStep] = useState(0); // Track the current step
  const [age, setAge] = useState(''); // Store the user's age
  const [showAgeInput, setShowAgeInput] = useState(false); // Control age input visibility
  const [showWelcomeText, setShowWelcomeText] = useState(true); // Control visibility of welcome text

  const handleOkClick = () => {
    if (step === 0) {
      setStep(1); // Show age input
      setShowAgeInput(true);
      setShowWelcomeText(false); // Clear the welcome text
    } else if (step === 1) {
      setStep(2); // Show confirmation message
      setShowAgeInput(false);
    } else {
      // Here, you can add logic to connect to Spotify if needed
      alert("Now you can connect your Spotify account!");
    }
  };

  const handleAgeChange = (e) => {
    setAge(e.target.value);
  };

  const handleAboutClick = () => {
    setShowWelcomeText(true); // Show the welcome text again
    setShowAgeInput(false); // Hide the age input
    setStep(0); // Reset the step to show the welcome text
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Kigo</h1> {/* Main title */}
      </header>
      <main>
        <div className="box-container">
          <div className="box-group">
            <div className="box box1">
              <div className="inner-box">
                <div className="title">
                  {showWelcomeText && (
                    <p>.𖥔 ݁ ˖๋ ࣭ ⭑ <b>Welcome to Kigo!</b> .𖥔 ݁ ˖๋ ࣭ ⭑</p>
                  )}
                </div>
                {showWelcomeText && (
                  <div className="text-block1">
                    <p>Kigo is a haiku generator that creates haikus from your most-listened songs. All you have to do is sign in with your Spotify account!</p>
                  </div>
                )}
                {showWelcomeText && (
                  <div className="text-block2">
                    <p><b>How does it work?</b></p>
                  </div>
                )}
                {showWelcomeText && (
                  <div className="text-block3">
                    <p>After you sign into your Spotify account, Kigo will use the Spotify API to gather information from your listening history and identify your most-listened songs. The Genius API is then used to gather lyrical content from these songs. From there, Kigo uses several algorithms to parse these lyrics and generate a fun and personalized haiku!</p>
                  </div>
                )}
				{showWelcomeText && (
			 	  <div className="text-block4">
				  	<p>★・・・・・・・・・・・・・・・・・・・・・・・・・・★</p>
				  	<p>At the moment, Kigo is only compatible with Spotify. Our team may consider integrating functionality with other music streaming services such as SoundCloud and Apple Music sometime in the future.</p>
				  </div>
				)}
				{showWelcomeText && (
				  <div className="text-block5">
				  	<p>If you have suggestions for improvement, you are welcome to create an issue within our current GitHub repository. For the link to our repository as well other methods to contact us, please click the <b>"Contact Us"</b> button down below!</p>
				  </div>
				)}
                {showAgeInput && (
                  <div className="age-input">
                    <p><b>Please enter your age:</b></p>
					<p>Kigo requires that you enter you age so that we can manage explicit content. If you are under 18, lyrics that contains explicit content will not be used in haiku generation. Otherwise, you will be allowed to toggle the "Allow explicit content" setting in the <b>"Preferences"</b> menu.</p>
                    <input
                      type="number"
                      value={age}
                      onChange={handleAgeChange}
                      min="1"
                      max="120"
                    />
                  </div>
                )}
                {step === 2 && (
                  <div className="confirmation-message">
                    <p>Thank you for entering your age!</p>
					<img src={spotifyLogo} alt="Connect Spotify" className="spotify-image" />
                  </div>
                )}
                {step === 0 && showWelcomeText && (
                  <button className="ok-button" onClick={handleOkClick}>OK</button>
                )}
                {(showAgeInput || step === 2) && (
                  <button className="ok-button" onClick={handleOkClick}>
                    {step === 1 ? 'Submit Age' : 'Connect Spotify'}
                  </button>
                )}
              </div>
            </div>
            <div className="smallbox">
              <button className="small-button1" onClick={handleAboutClick}>About</button>
              <button className="small-button2">Contact Us</button>
            </div>
          </div>
          <div className="box box2">
            <button className="big-button1">Preferences ⭑.ᐟ</button>
            <button className="big-button2">Account ⭑.ᐟ</button>
            <button className="big-button3">Other ⭑.ᐟ</button>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
