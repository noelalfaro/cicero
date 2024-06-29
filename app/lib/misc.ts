import { init, Applications } from '@kinde/management-api-js';

export const getConnections = async () => {
  init();
  const { connections } = await Applications.getApplicationConnections({
    applicationId: '492c20f7b1b04427ab72b6b08eb6c763',
  });

  return connections;
  // try {
  //   const response = await fetch('YOUR_API_ENDPOINT');
  //   const text = await response.text(); // Get the raw response text
  //   console.log('Raw API Response:', text); // Log the raw response

  //   try {
  //     const data = JSON.parse(text); // Try to parse as JSON
  //     return data;
  //   } catch (parseError) {
  //     console.error('Failed to parse JSON:', parseError);
  //     console.log('Received non-JSON response:', text);
  //     return null;
  //   }
  // } catch (error) {
  //   console.error('API request failed:', error);
  //   return null;
  // }
};
