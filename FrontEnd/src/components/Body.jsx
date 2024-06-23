import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Home from './Home';
import Login from './Login'
import Feed from './Feed';
import Profile from './Profile';
import Bookmark from './Bookmark';
import EditProfile from './EditProfile'

const appRouter = createBrowserRouter([
    {
        path: "/",
        element: <Home />,
        children: [
            {
                path: "",
                element: <Feed />
            },
            {
                path: "/profile/:id",
                element: <Profile />
            }
        ]
    },
    {
        path: "/login",
        element: <Login />
    },
    {
        path: "/bookmark",
        element: <Bookmark />
    },
    {
        path: "/edit-profile",
        element: <EditProfile />
    }
]);

function Body() {
    return (
        <RouterProvider router={appRouter} />
    );
}

export default Body;
