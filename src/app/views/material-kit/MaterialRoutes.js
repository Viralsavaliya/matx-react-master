import { lazy } from 'react';
import Loadable from 'app/components/Loadable';
import Postcreate from 'app/components/Postcraete';
import ViewAllPost from 'app/components/ViewAllPost';
import Follow from 'app/components/Follow';
import AllFollowingshow from 'app/components/AllFollowingshow';



const materialRoutes = [
  { path: "/createpost", element: <Postcreate /> },
  { path: "/allpost", element: <ViewAllPost /> }, 
  { path: "/follow", element: <Follow /> }, 
  { path: "/allfollowingshow", element: <AllFollowingshow /> }, 

];

export default materialRoutes;
