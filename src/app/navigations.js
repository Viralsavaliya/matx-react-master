import Postcreate from "./components/Postcraete";
import Profile from "./components/Profile";

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
    // badge: { value: '30+', color: 'secondary' },
    children: [

      // {name:'profile', path:<Profile />},
      // {name:'create post', path:<Postcreate />}
      
      { name: 'craete post', path: '/createpost', iconText: 'post' },
      // { name: 'Auto Complete', path: '/material/autocomplete', iconText: 'A' },
    ]
  }
];
