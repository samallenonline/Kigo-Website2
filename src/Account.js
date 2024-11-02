import React, { useEffect, useState } from 'react';

const Account = ({ age }) => {
  const [allowExplicitContent, setAllowExplicitContent] = useState(false);

  useEffect(() => {
    const savedPreference = localStorage.getItem('allowExplicitContent');
    if (savedPreference) {
      setAllowExplicitContent(JSON.parse(savedPreference));
    }
  }, []);

  const handleToggle = () => {
    setAllowExplicitContent(prevState => {
      const newState = !prevState;
      localStorage.setItem('allowExplicitContent', newState);
      return newState;
    });
  };

  return (
    <div>
      <p><b>Account Preferences</b></p>
      <p>★・・・・・・・・・・・・・・・・・・・・・・・・・・★</p>
      <div className="toggle-explicit">
        <label>
          <input
            type="checkbox"
            checked={allowExplicitContent}
            onChange={handleToggle}
            disabled={age < 18}
            style={{ opacity: age < 18 ? 0.5 : 1 }}
            aria-label="Allow Explicit Content"
          />
          Allow Explicit Content
        </label>
      </div>
    </div>
  );
};

export default Account;


