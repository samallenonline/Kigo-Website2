import React, { useEffect, useState } from 'react';

const Account = ({ age }) => {
  // state to manage preference for explicit content 
  const [allowExplicitContent, setAllowExplicitContent] = useState(false);

  // load user's preferences from local storage 
  useEffect(() => {
    const savedPreference = localStorage.getItem('allowExplicitContent');
    if (savedPreference) {
	  // parse user's preference if exists 
      setAllowExplicitContent(JSON.parse(savedPreference));
    }
  }, []);

  // handles toggle checkbox for explicit content preference 
  const handleToggle = () => {
    setAllowExplicitContent(prevState => {
      const newState = !prevState;
      localStorage.setItem('allowExplicitContent', newState);
      return newState;
    });
  };

  // user's account and preferences page 
  return (
    <div>
      <p><b>Account Preferences</b></p>
      <p>★・・・・・・・・・・・・・・・・・・・・・・・・・・★</p>
      <div className="toggle-explicit">
        <label>
          <input
		    // display explicit content preference, which can be toggled if the entered age is 18+
            type="checkbox"
            checked={allowExplicitContent}
            onChange={handleToggle}
            disabled={age < 18} // by default, explicit content is not used if the user is under 18
            style={{ opacity: age < 18 ? 0.5 : 1 }} // gray out toggle box if under 18 
            aria-label="Allow Explicit Content"
          />
          Allow Explicit Content
        </label>
      </div>
    </div>
  );
};

export default Account;


