
let db;
const base_URL = 'http://localhost:3000';


export function initDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('venufyDB', 1);

    request.onupgradeneeded = function (event) {
      db = event.target.result;

      // Create 'users' object store with 'id' as the key path
      if (!db.objectStoreNames.contains('users_store')) {
        const userObjectStore = db.createObjectStore('users_store', { keyPath: 'id', autoIncrement: true });
        userObjectStore.createIndex('username', 'username', { unique: true });
      }

    };

    request.onsuccess = function (event) {
      db = event.target.result;
      resolve();
    };

    request.onerror = function (event) {
      console.error('Database error:', event.target.errorCode);
      reject(event.target.errorCode);
    };
  });
}


// add user into the 'users' object store
export function addUser(user) {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(['users_store'], 'readwrite');
    const objectStore = transaction.objectStore('users_store');
    const request = objectStore.add(user);

    request.onsuccess = function () { resolve(); };

    request.onerror = function (event) {
      console.error('Add user error:', event.target.errorCode);
      reject(event.target.errorCode);
    };
  });
}

// Register a new user
export async function createUser(userData) {
  try {
    const response = await fetch(`${base_URL}/users/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });
    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error creating venue:', error);
    throw error;
  }
}


// Update a venue
export async function updateUser(userId, userData) {
  try {
    const response = await fetch(`${base_URL}/users/update/${userId}/`, {
      method: 'PUT',
      // Do not set Content-Type when sending FormData
      body: userData, // userData is expected to be a FormData object
    });
    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error updating user:', error);
    throw error;
  }
}


// Get a user by their username
export function getUserByUsername(username) {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(['users_store'], 'readonly');
    const objectStore = transaction.objectStore('users_store');
    const index = objectStore.index('username');
    const request = index.get(username);

    request.onsuccess = function (event) {
      resolve(event.target.result);
    };

    request.onerror = function (event) {
      console.error('Get user by username error:', event.target.errorCode);
      reject(event.target.errorCode);
    };
  });
}


// Fetching user by userId
export async function fetchUserById(userId) {
  try {
    const response = await fetch(`${base_URL}/users/${userId}`);
    if (!response.ok) {
      // Extract error message from the response body
      const errorData = await response.json();
      throw new Error(errorData.error || 'Network response was not ok');
    }
    const user = await response.json();
    return user;
  } catch (error) {
    console.error('There was a problem with the fetch operation:', error);
    // Optionally, rethrow the error or return a default value
    throw error;
  }
}


// Creating a venue using FormData
export async function createVenue(venueData) {
  try {
    const response = await fetch(`${base_URL}/venues/create`, {
      method: 'POST',
      // Do not set Content-Type when sending FormData
      body: venueData, // venueData is expected to be a FormData object
    });
    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error creating venue:', error);
    throw error;
  }
}


// Getting all the venues
export async function fetchAllVenues() {
  try {
    const response = await fetch(`${base_URL}/venues/all-venues`);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const venues = await response.json();
    return venues;
  } catch (error) {
    console.error('There was a problem with the fetch operation:', error);
  }
}


// Fetching venue by venueId
export async function fetchVenueById(venueId) {
  try {
    const response = await fetch(`${base_URL}/venues/${venueId}`);
    if (!response.ok) {
      // Extract error message from the response body
      const errorData = await response.json();
      throw new Error(errorData.error || 'Network response was not ok');
    }
    const venue = await response.json();
    return venue;
  } catch (error) {
    console.error('There was a problem with the fetch operation:', error);
    // Optionally, rethrow the error or return a default value
    throw error;
  }
}


// Fetching venues by a userId
export async function fetchVenuesByOwnerId(userId) {
  try {
    const response = await fetch(`${base_URL}/venues/user-venues/${userId}`);
    if (!response.ok) {
      // Extract error message from the response body
      const errorData = await response.json();
      throw new Error(errorData.error || 'Network response was not ok');
    }
    const venues = await response.json();
    return venues;
  } catch (error) {
    console.error('There was a problem with the fetch operation:', error);
    // Optionally, rethrow the error or return a default value
    throw error;
  }
}


// Update a venue
export async function updateVenue(venueId, venueData) {
  try {
    const response = await fetch(`${base_URL}/venues/update/${venueId}/`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(venueData),
    });
    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error creating venue:', error);
    throw error;
  }
}


// Deleting venue by venueId
export async function deleteVenueById(venueId) { 
  try {
    const response = await fetch(`${base_URL}/venues/delete/${venueId}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to delete venue");
    }
    const result = await response.json();
    return result;
  } catch (error) {
    console.error("There was a problem with the delete operation:", error);
    throw error;
  }
}


// Adding an image for a venue
export async function venueImage(image) {
  try {
    const response = await fetch(`${base_URL}/images/venue-image`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(image),
    });
    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error adding image:', error);
    throw error;
  }
}


// Adding an image for a venue using FormData
export async function addImage(imageData) {
  try {
    const response = await fetch(`${base_URL}/images/add-image`, {
      method: 'POST',
      // Do not set Content-Type when sending FormData
      body: imageData, // imageData is expected to be a FormData object
    });
    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error adding image:', error);
    throw error;
  }
}


// Fetching all images for a specific venue
export async function fetchAllImages(venueId) {
  try {
    const response = await fetch(`${base_URL}/venue-images/${venueId}`);
    if (!response.ok) {
      // Extract error message from the response body
      const errorData = await response.json();
      throw new Error(errorData.error || 'Network response was not ok');
    }
    const images = await response.json();
    return images;
  } catch (error) {
    console.error('There was a problem with the fetch operation:', error);
    // Optionally, rethrow the error or return a default value
    throw error;
  }
}


// Add Event into the MySQL database
export async function createEvent(event) {
  try {
    const response = await fetch(`${base_URL}/events/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(event),
    });
    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error creating event:', error);
    throw error;
  }
}


// Fetching all events
export async function fetchAllEvents() {
  try {
    const response = await fetch(`${base_URL}/events`);
    if (!response.ok) {
      // Extract error message from the response body
      const errorData = await response.json();
      throw new Error(errorData.error || 'Network response was not ok');
    }
    const events = await response.json();
    return events;
  } catch (error) {
    console.error('There was a problem with the fetch operation:', error);
    // Optionally, rethrow the error or return a default value
    throw error;
  }
}


// Fetching all events for a specific venue
export async function fetchEventsByVenueId(venueId) {
  try {
    const response = await fetch(`${base_URL}/events/${venueId}`);
    if (!response.ok) {
      // Extract error message from the response body
      const errorData = await response.json();
      throw new Error(errorData.error || 'Network response was not ok');
    }
    const events = await response.json();
    return events;
  } catch (error) {
    console.error('There was a problem with the fetch operation:', error);
    // Optionally, rethrow the error or return a default value
    throw error;
  }
}


// Fetching all events for a specific venue
export async function fetchEventById(eventId) {
  try {
    const response = await fetch(`${base_URL}/events/event/${eventId}`);
    if (!response.ok) {
      // Extract error message from the response body
      const errorData = await response.json();
      throw new Error(errorData.error || 'Network response was not ok');
    }
    const events = await response.json();
    return events;
  } catch (error) {
    console.error('There was a problem with the fetch operation:', error);
    // Optionally, rethrow the error or return a default value
    throw error;
  }
}


// Fetching all events for a specific user
export async function fetchEventsByOrganizerId(userId) {
  try {
    const response = await fetch(`${base_URL}/events/user-events/${userId}`);
    if (!response.ok) {
      // Extract error message from the response body
      const errorData = await response.json();
      throw new Error(errorData.error || 'Network response was not ok');
    }
    const events = await response.json();
    return events;
  } catch (error) {
    console.error('There was a problem with the fetch operation:', error);
    // Optionally, rethrow the error or return a default value
    throw error;
  }
}


// Deleting event by eventId
export async function deleteEventById(eventId) { 
  try {
    const response = await fetch(`${base_URL}/events/delete/${eventId}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to delete event");
    }
    const result = await response.json();
    return result;
  } catch (error) {
    console.error("There was a problem with the delete operation:", error);
    throw error;
  }
}


// Create notifications
export async function createNotification(notification) {
  try {
    const response = await fetch(`${base_URL}/notifications/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(notification),
    });
    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error creating notification:', error);
    throw error;
  }
}


// Get user's notifications
export async function getUserNotifications(userId) {
  try {
    const response = await fetch(`${base_URL}/notifications/${userId}`);
    if (!response.ok) {
      // Extract error message from the response body
      const errorData = await response.json();
      throw new Error(errorData.error || 'Network response was not ok');
    }
    const notifications = await response.json();
    return notifications;
  } catch (error) {
    console.error('There was a problem with the fetch operation:', error);
    // Optionally, rethrow the error or return a default value
    throw error;
  }
}


// Get user's unread notifications
export async function getUnreadNotifications(userId) {
  try {
    const response = await fetch(`${base_URL}/notifications/unread/${userId}`);
    if (!response.ok) {
      // Extract error message from the response body
      const errorData = await response.json();
      throw new Error(errorData.error || 'Network response was not ok');
    }
    const notifications = await response.json();
    return notifications;
  } catch (error) {
    console.error('There was a problem with the fetch operation:', error);
    // Optionally, rethrow the error or return a default value
    throw error;
  }
}


// Mark notification as read
export async function markNotificationAsRead(notificationId) {
  try {
    const response = await fetch(`${base_URL}/notifications/mark-read/${notificationId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error marking notification as read:', error);
    throw error;
  }
}







// Prompting user to make payment
export async function promptingUserToPay(paymentData) { 
  try {
    const response = await fetch(`${base_URL}/payment/prompt-user-to-pay`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(paymentData),
    });
    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error prompting payment:', error);
    throw error;
  }
}













//IndexedDB Database delete function
export function deleteDB() {
  const deleteRequest = indexedDB.deleteDatabase('venufyDB');

  deleteRequest.onsuccess = function (event) {
    console.log("Database deleted successfully.");
  };

  deleteRequest.onerror = function (event) {
    console.error("Error deleting database:", event.target.error);
  };

  deleteRequest.onblocked = function (event) {
    console.log("Database deletion is blocked. Please close all open connections.");
  };

}
