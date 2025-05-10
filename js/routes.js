
var routes = [
  {
    path: '/',
    url: './pages/splash.html',
    name: 'splash'
  },
  {
    path: '/onboarding/',
    url: './pages/onboarding.html',
    name: 'onboarding'
  },
  {
    path: '/signup/',
    url: './pages/signup.html',
    name: 'sign-up'
  },
  {
    path: '/login/',
    url: './pages/login.html',
    name: 'login'
  },
  {
    path: '/home/',
    url: './pages/home.html',
    name: 'home'
  },
  {
    path: '/popular-venues/',
    url: './pages/popular-venues.html',
    name: 'popular-venues'
  },
  {
    path: '/venue/:id/:owner',
    componentUrl: './pages/venue-details.html',
    name: 'venue-details'
  },
  {
    path: '/create-venue/',
    url: './pages/create-venue.html',
    name: 'create-venue'
  },

  {
    path: '/edit-venue/:id/',
    componentUrl: './pages/edit-venue.html',
    name: 'edit-venue'
  },


  {
    path: '/all-events/',
    url: './pages/all-events.html',
    name: 'all-events'
  },
  {
    path: '/all-venue-events/:id/',
    componentUrl: './pages/all-venue-events.html',
    name: 'all-venue-events'
  },
  {
    path: '/create-event/:id',
    componentUrl: './pages/create-event.html',
    name: 'create-event'
  },


  {
    path: '/edit-profile/',
    componentUrl: './pages/edit-profile.html',
    name: 'edit-profile'
  },

  {
    path: '/dashboard/',
    url: './pages/dashboard.html',
    name: 'dashboard'
  },
  {
    path: '/notifications/',
    url: './pages/notifications.html',
    name: 'notifications'
  },









  {
    path: '/test-file/',
    url: './pages/test-file.html',
    name: 'test-file'
  },

  {
    path: '(.*)',
    url: './pages/404.html',
  },
  
];

