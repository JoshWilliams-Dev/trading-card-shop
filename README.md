# Trading Card Shop

This is a skills exercise to demonstrate backend and frontend development, containerization, and database management.

## _Containerized Web Application Exercise_

**Build a trading card shop in which users can create and sell their own custom trading cards.**

Build a dockerized React or Python (Flask/Django) application and an accompanying docker-compose.yaml or Kubernetes deployment file. Provide all source code, Dockerfile, and docker-compose.yaml or Kubernetes deployment file to us via public Git repo.

- Add a user registration form containing email and password.
- Build a form that a logged-in user can submit to create a card by uploading an image, providing a text description, and price. All user-submitted cards shall be displayed on a separate card listing page. Feel free to demonstrate your creativity by expanding on the visual presentation of the form, etc.
- Build a page that only displays cards submitted by the currently logged-in user account; cards created by other users will not be visible on this page. This page is only viewable when logged in.
- Create a cart that allows users to add a card object to it. Provide the user with a way to update the quantity of cards and remove card(s) completely from cart. Signed-in users will not have access to other users’ cart contents.