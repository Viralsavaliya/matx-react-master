
export const navigations = [
  { name: 'Dashboard', path: '/dashboard/default', icon: 'dashboard' },
  { label: 'PAGES', type: 'label' },
  {
    name: 'Session/Auth',
    icon: 'security',
    children: [
      { name: 'Sign in', iconText: 'SI', path: '/session/signin' },
      { name: 'Sign up', iconText: 'SU', path: '/session/signup' },
      { name: 'Forgot Password', iconText: 'FP', path: '/session/forgot-password' },
      { name: 'Error', iconText: '404', path: '/session/404' }
    ]
  },
  { label: 'Components', type: 'label' },
  {
    name: 'Components',
    icon: 'favorite',
    children: [

   
      
      { name: 'craete post', path: '/createpost', icon: 'addtophotosicon' },
      { name: 'All post', path: '/allpost', icon: 'vrpano' },
      { name: 'Follow', path: '/follow', icon: 'personadd' },
      { name: 'All User', path: '/alluser', icon: 'people' },
    ]
  }
];
