import React, { Suspense, lazy } from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import ConfirmUser from './confirmUser';
import MyPosts from './myPosts';

const SignUp = lazy(() => import('./Signup'));
const Login = lazy(() => import('./Login.js'));
const Dashboard = lazy(() => import('./posts.js'));
const AddPost = lazy(() => import('./addPost.js'));

const Routing = () => {

  const allRoutes = [
    {
      exact: true,
      path: '/',
      component: <Login />,
      title: "Login"
    },
    {
      exact: true,
      path: '/signup',
      component: <SignUp />,
      title: "Registration Form"
    },
    {
      exact: true,
      path: '/login',
      component: <Login />,
      title: "Login"
    },
    {
      exact: true,
      path: '/verify',
      component: <ConfirmUser />,
      title: "Confirm User"
    },
  ].filter(cur => cur);

  const privateRoutes = [
    {
      exact: true,
      path: "/dashboard",
      component: <Dashboard />
    },
    {
      exact: true,
      path: "/addPost",
      component: <AddPost />
    },
    {
      exact: true,
      path: "/myPosts",
      component: <MyPosts />
    }
  ].filter(cur => cur);

  function PrivateRoute({ children, ...rest }) {
    return localStorage.getItem('jwt_token') ? children : <Navigate
      to={{
        pathname: '/login',
      }}
    />
  }

  function PublicRoute({ children, ...rest }) {
    return localStorage.getItem('jwt_token') ? <Navigate to={{
      pathname: '/dashboard'
    }}
    /> : children
  }

  return (
    //if we redirect from one to page, Suspense makes sure that the resources are properly loaded on the page.
    <Suspense>
      <Routes>
        {allRoutes.map(route => (
          <Route
            exact={route.exact !== false}
            key={route.path}
            path={route.path}
            element={
              <PublicRoute>
                {route.component}
              </PublicRoute>
            }
          />
        ))}
        {privateRoutes.map(route => (
          <Route
            exact={route.exact !== false}
            key={route.path}
            path={route.path}
            element={
              <PrivateRoute>
                {route.component}
              </PrivateRoute>
            }
          />
        ))}
      </Routes>
    </Suspense>
  );
};
export default Routing;
