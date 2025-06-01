import {images} from '../assets/images';

const getProfileImage = (url: string) => {
  return url ? {uri: url} : images.placeholderAvatar;
};

function formatDateTime(date: Date | string) {
  const givenDate = new Date(date);
  const now = new Date();
  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);

  // Format time (HH:MM AM/PM)
  const formatTime = () => {
    let hours = givenDate.getHours();
    let minutes = givenDate.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12; // Convert to 12-hour format
    return `${hours}:${minutes.toString().padStart(2, '0')} ${ampm}`;
  };

  // Check if it's today
  if (givenDate.toDateString() === now.toDateString()) {
    return formatTime(); // Return only time for today's dates
  }

  // Check if it was yesterday
  if (givenDate.toDateString() === yesterday.toDateString()) {
    return 'Yesterday';
  }

  // Format date as DD/MM/YY for older dates
  const day = givenDate.getDate().toString().padStart(2, '0');
  const month = (givenDate.getMonth() + 1).toString().padStart(2, '0');
  const year = givenDate.getFullYear().toString().slice(-2);
  return `${day}/${month}/${year}`;
}

function formatTime(date: Date) {
  const givenDate = new Date(date);
  const now = new Date();
  const yesterday = new Date();
  yesterday.setDate(now.getDate() - 1);

  // Format time (HH:MM AM/PM)
  let hours = givenDate.getHours();
  let minutes = givenDate.getMinutes();
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12 || 12; // Convert to 12-hour format
  minutes = minutes.toString().padStart(2, '0');

  const timeString = `${hours}:${minutes}${ampm}`;

  return timeString;
}

export {getProfileImage, formatDateTime, formatTime};
