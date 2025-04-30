
var $ = Dom7;
var app = new Framework7({
  name: 'venufy', // App name
  theme: 'auto', // Automatic theme detection


  el: '#app', // App root element

  // App store
  store: store,
  // App routes
  routes: routes,
  // Register service worker
  serviceWorker: {
    path: './service-worker.js',
  },

  panel: {
    closeOnEscape: true,
  },
  popup: {
    closeOnEscape: true,
  },
  sheet: {
    closeOnEscape: true,
  },
  popover: {
    closeOnEscape: true,
  },
  actions: {
    closeOnEscape: true,
  },
  // Add default language
});


/* show hide app loader */
// app.preloader.show();
// $(window).on('load', async function () {
//   app.preloader.hide();
// })



// Import statements
import {
  initDB, addUser, createUser, getUserByUsername, fetchAllVenues, createVenue,
  venueImage, fetchVenueById, fetchAllImages, addImage, deleteVenueById,
  updateVenue, createEvent, fetchAllEvents, fetchUserById, fetchEventsByVenueId,
  updateUser, fetchEventsByOrganizerId, deleteDB,
} from './db.js';


// All pages affected
let userID;
let currentUser;
let userData;
let userPhotoPath;
$(document).on('page:init', async function () {

  currentUser = JSON.parse(localStorage.getItem('currentUser'));
  userID = currentUser ? currentUser.userId : null;
  // Check if the user is logged in
  
  userData = await fetchUserById(userID);
  userPhotoPath = userData[0].photo.replace(/\\/g, '/');
  
  $('.logout-btn').on('click', function () {
    app.preloader.show();
    app.panel.close('.panel-left', true);
    localStorage.removeItem('logged-in');
    setTimeout(function () {
      app.views.main.router.navigate('/login/');
      app.preloader.hide();
    }, 3000);
  });

  $('.user-photo')[0].src = (userData[0].photo.length == 0) ? '/venufy/assets/me.jpg' : `/venufy/Backend-API/${userPhotoPath}`;
  $('.user-names')[0].innerHTML = `${userData[0].fname} ${userData[0].lname}`;
  $('.user-contact')[0].innerHTML = `${userData[0].contact}`;

});


// Listen for the splash screen initialization and navigate to onboarding after a delay
$(document).on('page:init', '.page[data-name="splash"]', function (e, page) {
  var splashEl = $(page.el);
  splashEl.addClass('splash-fade');

  setTimeout(function () {
    splashEl.addClass('visible');
  }, 2000);

  setTimeout(function () {
    splashEl.removeClass('visible'); // Fade out over 1 second

    setTimeout(function () {
      const loginStatus = localStorage.getItem('logged-in');
      const skipped = localStorage.getItem('skipped');

      if (loginStatus) { app.views.main.router.navigate('/home/'); }
      if (skipped) { app.views.main.router.navigate('/login/'); }

      app.views.main.router.navigate('/onboarding/', { animate: true });

    }, 1000);
  }, 2000);
});


// Onboarding screen
$(document).on('page:init', '.page[data-name="onboarding"]', function (e, page) {
  $('.skip-btn').on('click', function () {
    localStorage.setItem('skipped', true);
  });
});


// Handling user registration
$(document).on('page:init', '.page[data-name="signup"]', function (e, page) {
  $('.signup-btn').on('click', async function (e) {
    app.preloader.show();
    e.preventDefault();

    let Fname = $('#fname').val();
    let Lname = $('#lname').val();
    let Username = $('#userName').val();
    let Email = $('#email').val();
    let Password = $('#passWord').val();
    let Contact = parseInt($('#contact').val());

    let user = {
      username: Username,
      fname: Fname,
      lname: Lname,
      email: Email,
      password: Password,
      contact: Contact,
    };

    try {
      const result = await createUser(user);

      let newuser = {
        username: Username,
        password: Password,
        userId: result.userId
      };

      await initDB();
      await addUser(newuser);
      app.preloader.hide();
      app.dialog.alert('User data saved successfully!', 'Success', () => {
        app.views.main.router.navigate('/login/');
      });

    } catch (error) {
      app.preloader.hide();
      app.dialog.alert('Error saving data: ' + error, 'Error');
    }
  });
});



// Handling user login
$(document).on('page:init', '.page[data-name="login"]', function (e, page) {

  $('.login-btn').on('click', async function (e) {
    app.preloader.show();
    e.preventDefault(); // Prevent form submission refresh

    let Username = $('#username').val();
    let Password = $('#password').val();

    try {
      await initDB();
      const user = await getUserByUsername(Username);

      if (user && user.password === Password) {

        localStorage.setItem('currentUser', JSON.stringify(user));
        localStorage.setItem('logged-in', true);

        app.preloader.hide();
        app.views.main.router.navigate('/home/', {
          clearPreviousHistory: true
        });
      } else {
        app.preloader.hide();
        app.dialog.alert('Invalid username or password! <br> Kindly try again', 'Error');
      }

    } catch (error) {
      console.error('Error during login:', error);
      app.dialog.close();
      app.dialog.alert('An error occurred during login. Please try again.', 'Error');
      $('.login-form')[0].reset();
    }
  });
});


// Home page for venue listing
$(document).on('page:init', '.page[data-name="home"]', async function (e, page) {
  app.dialog.preloader();

  const allVenues = $('.all-venues');
  const popularVenues = $('.popular-venues');
  const noItemBlock2 = $('.no-item-popular');
  let venueList;

  function displayVenues(venues) {
    // Loop through venues and create list items
    venues.forEach(venue => {
      venueList = (venue.status == 1) ? popularVenues : allVenues;
      if (venueList === popularVenues) {
        noItemBlock2[0].style.display = "none";
      }

      // Create a list item for each venue
      const listItem = document.createElement('div');
      listItem.innerHTML = `<a href="/venue/${venue.id}/${venue.owner}">
                              <div style="padding:5px; border-left: 1px solid #333; border-right: 1px solid #333; border-radius: 10px; background-color: #f0efef; color:#333; display:flex; gap:5px;">
                                <img src="/venufy/Backend-API/${venue.image}" alt="${venue.name}" width="80" height="80" />
                                <div class="item-inner">
                                  <div class="item-title-row align-items-center">
                                    <div>
                                      <div class="item-title">${venue.name}</div>
                                      <div class="item-subtitle">${venue.address}</div>
                                      <div class="item-after text-color-green">${venue.pricing} XAF</div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </a>`;
      listItem.setAttribute('class', 'block');
      listItem.setAttribute('style', 'margin:0px 0px 7px 0px;');
      venueList[0].appendChild(listItem);
    });
  }

  try {

    let venues = await fetchAllVenues();

    // Display all venues normally
    displayVenues(venues);

    $('#filter-category').on('change', () => {
      const userPreference = $('#filter-category').val();
      if (userPreference === 'by-location') { $('.apply-filters-btn')[0].style.display = 'block'; $('.by-location')[0].style.display = 'block'; }
      if (userPreference === 'by-capacity') { $('.apply-filters-btn')[0].style.display = 'block'; $('.by-capacity')[0].style.display = 'block'; }
      if (userPreference === 'by-pricing') { $('.apply-filters-btn')[0].style.display = 'block'; $('.by-pricing')[0].style.display = 'block'; }
    });

    $('.apply-filters-btn').on('click', async () => {
      app.dialog.preloader();

      // Disable inputs and buttons
      $('.apply-filters-btn')[0].style.display = 'none';
      $('.by-location')[0].style.display = 'none';
      $('.by-capacity')[0].style.display = 'none';
      $('.by-pricing')[0].style.display = 'none';

      // Get user's preferences
      const locationFilter = $('#filter-location').val().trim();
      const minCapacity = parseInt($('#filter-capacity').val(), 10);
      const maxPrice = parseFloat($('#filter-price').val());

      // Build filters object
      const filters = {
        location: locationFilter,
        capacity: isNaN(minCapacity) ? null : minCapacity,
        price: isNaN(maxPrice) ? null : maxPrice,
      };

      // Perform venue filtering
      const filteredVenues = venues.filter(venue => {
        return Object.keys(filters).every(key => {
          const value = filters[key];
          if (value === null || value === '') return true;

          if (key === 'location') {
            return venue.address
              .toLowerCase()
              .includes(value.toLowerCase());
          }
          if (key === 'capacity') {
            return venue.capacity >= value;
          }
          if (key === 'price') {
            return venue.pricing <= value;
          }
          return venue[key] === value;
        });
      });

      // Display filtered venues
      allVenues.empty();
      displayVenues(filteredVenues);
      app.popover.close('.popover-venue-filter', true);
      setTimeout(() => {
        app.dialog.close();
      }, 2000);
    });

    // Close the preloader after a short delay
    setTimeout(() => {
      app.dialog.close();
    }, 2000);

  } catch (error) {
    app.dialog.close();
    app.dialog.alert('Error retrieving venues: ' + error, 'Error');
  }
});


// Create venue
$(document).on('page:init', '.page[data-name="create-venue"]', function (e, page) {

  let imageFile = null;

  // Listen for changes on the file input field to capture the image file and display a preview
  $('.venue-image').on('change', function (e) {
    const file = e.target.files[0];
    if (file) {
      imageFile = file;
      // Display a preview of the image
      const reader = new FileReader();
      reader.onload = function (event) {
        $('.venue-image-preview')[0].style.display = 'block';
        $('.image-tag')[0].src = event.target.result;
      };
      reader.readAsDataURL(file);
    }
  });

  $('.venue-form').on('submit', async function (e) {
    e.preventDefault();
    app.preloader.show();

    // Retrieve form field values
    const venueName = $('.venue-name').val();
    const venueAddress = $('.venue-address').val();
    const venueCapacity = $('.venue-capacity').val();
    const venuePricing = $('.venue-pricing').val();
    const venueDescription = $('.venue-description').val();

    // Create a FormData object and append all fields including the image file
    const formDataForVenue = new FormData();

    formDataForVenue.append('name', venueName);
    formDataForVenue.append('address', venueAddress);
    formDataForVenue.append('capacity', venueCapacity);
    formDataForVenue.append('pricing', venuePricing);
    formDataForVenue.append('description', venueDescription);
    formDataForVenue.append('owner', userID);
    if (imageFile) {
      formDataForVenue.append('image', imageFile);
    }

    try {
      // Pass the FormData object to createVenue which should use fetch with the multipart/form-data body
      const result = await createVenue(formDataForVenue);
      const imageData = { venueId: result.venueId };
      await venueImage(imageData);
      app.preloader.hide();
      app.dialog.alert('Venue data saved successfully!', 'Success', () => {

        app.notification.create({
          icon: '<i class="icon f7-icons">bell</i>',
          title: 'Success!',
          text: 'Your venue has been added.',
          closeButton: true,
          closeTimeout: 5000,
        }).open();
        app.views.main.router.navigate('/home/');
      });
    } catch (error) {
      app.preloader.hide();
      app.dialog.alert('Error saving data: ' + error, 'Error', () => {
        imageFile = null;
        $('.venue-image-preview')[0].style.display = 'none';
      });
    }
  });

});


// Venue details page
$(document).on('page:init', '.page[data-name="venue-details"]', async function (e, page) {
  app.dialog.preloader();

  let { id, owner } = page.route.params;  // id is venue's id
  let imageFile = null;

  if (!currentUser) { app.views.main.router.navigate('/login/'); }

  let allEventBtn = $('.all-venue-events');
  let addEventBtn = $('.add-event');
  let editVenueBtn = $('.edit-venue');
  let deleteVenueBtn = $('.delete-venue');
  let addImageBtn = $('.add-image');
  let bellIcon = $('.bell-icon');

  try {
    const venue = await fetchVenueById(id);
    const images = await fetchAllImages(id);
    const userEvents = await fetchEventsByOrganizerId(userID);

    if (owner == userID) {
      addEventBtn[0].style.display = "none";
      bellIcon[0].style.display = "none";
      addImageBtn[0].style.display = "block";
      editVenueBtn[0].style.display = "block";
      deleteVenueBtn[0].style.display = "block";
      editVenueBtn[0].setAttribute("href", `/edit-venue/${id}/`);
    }
        
    if (userEvents.length == 2) {
      addEventBtn[0].onclick = function () {
        app.dialog.alert('You have reached the maximum of two events! Consider subscribing to premium in order to create more events', 'Alert !!');
      }
    }else{
      addEventBtn[0].setAttribute("href", `/create-event/${id}`);
    }

    allEventBtn[0].setAttribute("href", `/all-venue-events/${id}/`);
    

    const swipperEl = document.getElementsByClassName('demo-swiper-multiple');

    document.getElementsByClassName('venue-description')[0].innerHTML = venue[0].description;
    document.getElementsByClassName('venue-capacity')[0].innerHTML = `<strong>${venue[0].name}</strong> can conviniently host up to <strong>${venue[0].capacity} people.</strong>`;
    document.getElementsByClassName('venue-pricing')[0].innerHTML = `<strong>Pricing:  <span style="color: green;">${venue[0].pricing} XAF</span></strong> for a day`;

    // Create a list item for each venue image
    images.forEach(image => {
      const venueImagePath = image.image.replace(/\\/g, '/');
      const listItem = document.createElement('swiper-slide');
      listItem.style.height = '350px';
      listItem.innerHTML = ` <img src = '/venufy/Backend-API/${venueImagePath}' width='100%' height='100%' alt='Venue image'>`;

      swipperEl[0].appendChild(listItem);
    });
    setTimeout(() => {
      app.dialog.close();
    }, 2000);
  } catch (error) {
    app.dialog.close();
    app.dialog.alert('Error retrieving venue details: ' + error, 'Error');
  }

  // Listen for changes on the file input to preview the selected image
  $('#imageFile').on('change', function (e) {
    const file = e.target.files[0];
    if (file) {
      imageFile = file;
      const reader = new FileReader();
      reader.onload = function (event) {
        const preview = document.getElementById('imagePreview');
        preview.src = event.target.result;
        preview.style.display = 'block';
      };
      reader.readAsDataURL(file);
    }
  });

  // Handle the image upload form submission
  $('#imageUploadForm').on('submit', async function (e) {
    e.preventDefault();
    app.preloader.show();

    const formData = new FormData();
    formData.append('venueId', id);
    if (imageFile) {
      formData.append('image', imageFile);
    }

    try {
      const images = await fetchAllImages(id);
      if (images.length < 3) {
        await addImage(formData);
        app.preloader.hide();
        // app.views.main.router.refreshPage();
        app.views.main.router.navigate(
          app.views.main.router.currentRoute.url,
          { reloadCurrent: true, ignoreCache: true }
        );

      } else {
        app.preloader.hide();
        app.dialog.alert('You have reached the maximum of three images! Consider subscribing to premium in order to upload more images and videos', 'Alert !!');
      }

    } catch (error) {
      app.preloader.hide();
      app.dialog.alert('Error uploading image: ' + error, 'Error');
    }
  });

  $('.delete-venue').on('click', async function (e) {
    try {
      app.dialog.confirm(
        'Deleting a venue also deletes all its events and related assets!',
        '<p style="color:red">Warning !!</p>',
        async () => {
          app.preloader.show();

          try {
            await deleteVenueById(id);
            app.preloader.hide();
            app.dialog.alert('Venue deleted successfully', 'Success !!', () => {
              app.views.main.router.navigate('/home/');
            });
          } catch (error) {
            app.preloader.hide();
            app.dialog.alert('Error deleting venue: ' + error, 'Error');
          }
        }
      );
    } catch (error) {
      app.preloader.hide();
      app.dialog.alert('Error deleting venue: ' + error, 'Error');
    }
  });

});


// Edit a venue's detail
$(document).on('page:init', '.page[data-name="edit-venue"]', async function (e, page) {
  app.dialog.preloader();

  let { id } = page.route.params;  // id is the venue's id

  const venue = await fetchVenueById(id);

  $('.name').val(venue[0].name);
  $('.address').val(venue[0].address);
  $('.capacity').val(venue[0].capacity);
  $('.pricing').val(venue[0].pricing);
  $('.description').val(venue[0].description);

  app.dialog.close();

  $('.venue-edit-form').on('submit', async function (e) {
    e.preventDefault();
    app.dialog.preloader();

    // Retrieve form field values
    const venueName = $('.name').val();
    const venueAddress = $('.address').val();
    const venueCapacity = $('.capacity').val();
    const venuePricing = $('.pricing').val();
    const venueDescription = $('.description').val();

    const venue = {
      name: venueName,
      address: venueAddress,
      capacity: venueCapacity,
      pricing: venuePricing,
      description: venueDescription,
    };

    try {
      await updateVenue(id, venue);
      app.dialog.close();
      app.dialog.alert('Venue data updated successfully!', 'Success', () => {
        app.views.main.router.navigate('/home/');
      });
    } catch (error) {
      app.dialog.alert('Error saving data: ' + error, 'Error', () => {
        app.dialog.close();
        app.views.main.router.navigate('/home/');
      });
    }
  });
});


// Creating event under a chosen venue
$(document).on('page:init', '.page[data-name="create-event"]', async function (e, page) {
  app.preloader.show();
  setTimeout(() => {
    app.preloader.hide();
  },2000);

  let { id } = page.route.params;  // Venue's id

  // Get current venue
  let venue = await fetchVenueById(id);
  let organizerData = await fetchUserById(userID);
  let ownerData = await fetchUserById(venue[0].owner);

  const organizerName = organizerData[0].fname + ' ' + organizerData[0].lname;
  const venueName = venue[0].name;

  $(page.el)
    .find('.form-title')
    .html(`Adding a new event under <strong>${venue[0].name}, ${venue[0].address}</strong>`);

  // Create the Calendar instance
  let calendar = app.calendar.create({
    inputEl: '#date-picker',
    openIn: 'popover',
    dateFormat: 'yyyy/mm/dd',
    closeOnSelect: true
  });

  // Open calendar when clicking the calendar icon
  $("#open-calendar").on("click", () => {
    calendar.open();
  });


  // Use the form's submit event to handle the upload
  $('.create-event-form').on('submit', async function (e) {
    e.preventDefault();
    app.preloader.show();

    // Retrieve form field values
    const eventTitle = $('.event-title').val();
    const eventDescription = $('.event-description').val();
    const eventDate = $('.event-date').val();

    const event = {
      venueId: id,
      organizer: userID,
      title: eventTitle,
      description: eventDescription,
      date: eventDate,
      venueName: venueName,
      ownerEmail: ownerData[0].email,
      organizerName: organizerName,
    };

    try {
      await createEvent(event);
      app.preloader.hide();
      app.dialog.alert('Event data saved successfully!', 'Success', () => {

        app.notification.create({
          icon: '<i class="icon f7-icons">bell</i>',
          title: 'Success!',
          text: `Event added. Complete payment on the 'Pending Events' page to finalize registration.`,
          closeButton: true,
          closeTimeout: 5000,
        }).open();
        app.views.main.router.navigate('/home/');
      });
    } catch (error) {
      app.preloader.hide();
      app.dialog.alert('Error saving data: ' + error, 'Error');
    }
  });
});


async function displayEvents(events){
  
  const allEvents = $('#all-events');
  const pendingEvents = $('#pending-events');
  const pastEvents = $('#past-events');
  const noItemBlock1 = $('.no-item-all');
  const noItemBlock2 = $('.no-item-pending');
  const noItemBlock3 = $('.no-item-past');

  let eventList;

  for (const event of events) {
    if (event.status == 0) { eventList = pendingEvents; }
    else if (event.status == 1) { eventList = allEvents }
    else { eventList = pastEvents }

    if (eventList == pendingEvents) { noItemBlock2[0].style.display = 'none'; }
    if (eventList == pastEvents) { noItemBlock3[0].style.display = 'none'; }
    if (eventList == allEvents) { noItemBlock1[0].style.display = 'none'; }

    // Retrieve the event organizer's information
    const organizer = await fetchUserById(event.organizer);
    const venue = await fetchVenueById(event.venueId);

    // Create a unique popover element for each event
    const popover = document.createElement('div');
    popover.className = 'popover event-details';
    popover.id = `popover-${event.id}`; // Assign a unique ID

    // Set the inner HTML for the popover
    if (userID == organizer[0].id){
      popover.innerHTML = `
        <div class="popover-inner">
            <div class="block">
                <p class="text-align-center">${event.title}</p>
                <button href="/events-update/${event.id}" class="button button-raised button-tonal" style="margin-top: 15px;"><i class="icon f7-icons size-30">pencil</i>Reschedule</button>
                <button class="button button-raised delete-event" style="margin-top: 15px;"><i class="icon f7-icons">trash</i> Delete Event</button>
            </div>
        </div>
    `;
    }else{
      popover.innerHTML = `
        <div class="popover-inner">
            <div class="block">
                <h3 style="margin:0px;">Event description: </h3>
                <p style="margin:0px;">${event.description}</p>
                <a href="#" class="link popover-close" style="float:right; margin:10px 30px 10px 0px; font-weight:bold;">Got it!</a>
            </div>
        </div>
    `;
    }

    // Append the popover to the event list or another appropriate parent element
    eventList[0].appendChild(popover);

    // Create the event list item
    const listItem = document.createElement('div');
    listItem.innerHTML = `<a href="#" data-popover="#${popover.id}" class="link popover-open flex" style="width:100%; margin-bottom: 10px; background-color:rgb(243, 243, 243); color:#333;">
                                <div class="flex" style="flex-direction:column; align-items:start; width:100%; height:auto;">
                                  <h4 style="margin:1px;">${event.title}</h4>
                                  <p style="margin:1px;">Event Date:  ${new Date(event.date).toLocaleDateString("en-GB")}</p>
                                  <p style="margin:1px;">Event Organizer:  ${organizer[0].fname} ${organizer[0].lname}</p>
                                  <p style="margin:1px;">Event Location:  ${venue[0].name}, at ${venue[0].address}</p>
                                </div>                     
                              </a>`;

    listItem.setAttribute('class', 'block');
    listItem.setAttribute('style', 'margin:0px 0px 7px 0px;');
    eventList[0].appendChild(listItem);

    // Initialize the popover using Framework7's API
    app.popover.create({
      el: `#${popover.id}`,
      targetEl: listItem.querySelector('.popover-open'),
    });
  }
  app.dialog.close();

}


// All events page
$(document).on('page:init', '.page[data-name="all-events"]', async function (e, page) {
  app.dialog.preloader();
  try {

    const events = await fetchAllEvents();
    displayEvents(events);
  } catch (error) {
    app.dialog.close();
    app.dialog.alert('Error retrieving events: ' + error, 'Error');
  }
});


// All events page
$(document).on('page:init', '.page[data-name="all-venue-events"]', async function (e, page) {
  app.dialog.preloader();

  let { id } = page.route.params;

  try {
    const events = await fetchEventsByVenueId(id);
    displayEvents(events);
  } catch (error) {
    app.dialog.close();
    app.dialog.alert('Error retrieving events: ' + error, 'Error');
  }
});


// Edit profile page
$(document).on('page:init', '.page[data-name="edit-profile"]', function (e, page) {
  app.panel.close('.panel-left', true);
  app.preloader.show();

  let userPhoto = null;

  // When a new file is chosen, read & preview it
  $('#profilePic').on('change', function (e) {
    let file = e.target.files[0];
    if (file) {
      userPhoto = file;
      const reader = new FileReader();
      reader.onload = (evt) => {
        $('.user-photo')[0].src = evt.target.result;
      };
      reader.readAsDataURL(file);
    }

  });

  $('#fname').val(userData[0].fname);
  $('#lname').val(userData[0].lname);
  $('#email').val(userData[0].email);
  $('#contact').val(userData[0].contact);

  setTimeout(() =>{
    app.preloader.hide();
  },2000);

  $('.edit-profile-form').on('submit', async (e) => {
    e.preventDefault();
    app.preloader.show();

    let Fname = $('#fname').val();
    let Lname = $('#lname').val();
    let Email = $('#email').val();
    let Contact = $('#contact').val();

    // Create a FormData object and append all fields including the image file
    const userFormData = new FormData();

    userFormData.append('fname', Fname);
    userFormData.append('lname', Lname);
    userFormData.append('email', Email);
    userFormData.append('contact', Contact);
    if (userPhoto) {
      userFormData.append('photo', userPhoto);
    }

    try {
      await updateUser(userID, userFormData);
      setTimeout(function () {
        app.preloader.hide();
        app.dialog.alert('Your data was saved successfully!', 'Success', () => {
          app.views.main.router.navigate('/home/');
        }
        );
        // Update the user data in local storage
      }, 2500);
    } catch (error) {
      app.preloader.hide();
      app.dialog.alert('An error occured while saving your data. Please try again: ' + error, 'Error');
    }

  });

});











$(document).on('page:init', '.page[data-name="page-name"]', function (e, page) { });
