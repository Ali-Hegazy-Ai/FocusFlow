/**
 * Formats seconds into MM:SS format
 * @param {number} seconds - The time in seconds to format
 * @returns {string} - The formatted time string
 */
export const formatTime = (seconds) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  
  return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
};