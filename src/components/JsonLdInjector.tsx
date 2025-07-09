import React, { useEffect } from 'react';

interface JsonLdInjectorProps {
  jsonData: object | null; // Pass null to remove the script
  scriptId: string; // To identify the script tag for removal
}

const JsonLdInjector: React.FC<JsonLdInjectorProps> = ({ jsonData, scriptId }) => {
  useEffect(() => {
    let scriptElement = document.getElementById(scriptId) as HTMLScriptElement | null;

    // Remove existing script if jsonData is null or component unmounts with old script
    if (!jsonData) {
      if (scriptElement) {
        scriptElement.remove();
      }
      return;
    }

    // If script doesn't exist, create it
    if (!scriptElement) {
      scriptElement = document.createElement('script');
      scriptElement.type = 'application/ld+json';
      scriptElement.id = scriptId;
      document.head.appendChild(scriptElement);
    }

    // Update its content
    scriptElement.textContent = JSON.stringify(jsonData);

    // Cleanup function to remove the script when the component unmounts
    // or when jsonData becomes null in the next render.
    return () => {
      const elToRemove = document.getElementById(scriptId);
      if (elToRemove) {
        elToRemove.remove();
      }
    };
  }, [jsonData, scriptId]); // Re-run effect if jsonData or scriptId changes

  return null; // This component does not render anything visible
};

export default JsonLdInjector;
