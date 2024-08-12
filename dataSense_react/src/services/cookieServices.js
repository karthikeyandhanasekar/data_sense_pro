/**
 * Sets a cookie with the provided name, value, and expiration time.
 *
 * @param {Object} options - An object with the following properties:
 *   - `name`: The name of the cookie.
 *   - `value`: The value of the cookie.
 *   - `time`: The time until the cookie expires (optional).
 *   - `unit`: The unit of time (optional, one of "s", "m", "h", or "d").
 *
 * @example
 * setCookie({ name: 'yCookie', value: 'hello', time: 1, unit: 'h' });
 */
function setCookie({ name, value, time, unit }) {
  // Initialize an empty string to store the expiration time
  var expires = "";

  // Check if time and unit are provided
  if (time && unit) {
    // Create a new Date object
    var date = new Date();

    // Switch based on the unit provided
    switch (unit) {
      // If unit is seconds, add the time in milliseconds to the current time
      case "s":
        date.setTime(date.getTime() + time * 1000);
        break;
      // If unit is minutes, add the time in milliseconds to the current time
      case "m":
        date.setTime(date.getTime() + time * 60 * 1000);
        break;
      // If unit is hours, add the time in milliseconds to the current time
      case "h":
        date.setTime(date.getTime() + time * 60 * 60 * 1000);
        break;
      // If unit is days, add the time in milliseconds to the current time
      case "d":
        date.setTime(date.getTime() + time * 24 * 60 * 60 * 1000);
        break;
      default:
        break;
    }

    // Set the expiration time
    expires = "; expires=" + date.toUTCString();
  }

  // Set the cookie with the provided name, value, and expiration time
  document.cookie = name + "=" + JSON.stringify(value) + expires + "; path=/";
}

/**
 * Gets a cookie with the provided name.
 *
 * @param {string} name - The name of the cookie.
 *
 * @returns {any} The value of the cookie, or null if not found.
 *
 * @example
 * const cookieValue = getCookie('myCookie');
 * console.log(cookieValue); // Output: "hello"
 */
const getCookie = (name) => {
  // Initialize a string to store the name and equals sign
  let nameEQ = name + "=";

  // Split the document cookie into an array of individual cookies
  let cookies = document.cookie.split(";");

  // Iterate over the cookies
  for (var i = 0; i < cookies.length; i++) {
    var cookie = cookies[i];

    // Remove leading spaces from the cookie
    while (cookie.charAt(0) === " ") {
      cookie = cookie.substring(1, cookie.length);
    }

    // Check if the cookie matches the provided name
    if (cookie.indexOf(nameEQ) === 0) {
      // Return the parsed value of the cookie
      return JSON.parse(cookie.substring(nameEQ.length, cookie.length));
    }
  }

  // Return null if no matching cookie is found
  return null;
};

const deleteCookie = (name) => {
  document.cookie = name + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
};

const clearCookies = () => {
  document.cookie.split(";").forEach((cookie) => {
    const eqPos = cookie.indexOf("=");
    const name = eqPos > -1 ? cookie.substring(0, eqPos) : cookie;
    document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
  });
};

export { setCookie, getCookie, deleteCookie, clearCookies };
