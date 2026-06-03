# Simple Blog App

Users can register/login, create posts, view post details, and delete their own posts. Admin users can be added to the database to perform admin actions (if implemented).

## Sample credentials
Use these test accounts for development and testing. You can create them with the register form in the app or insert them directly into your MongoDB if you prefer.

- Regular user
	- username: Sample1
	- email: sample@mail.com
	- password: sample123

- Admin user
	- username: admin1
	- email: admin@mail.com
	- password: admin123

Note: passwords shown here are plaintext for convenience — in production use stronger passwords and secure secrets.

## Environment variables
Create a `.env` file in the `server` folder with values like:

```
PORT=4000
MONGODB_STRING=mongodb://localhost:27017/blogdb
JWT_SECRET_KEY=your_jwt_secret_here
```

On the client side, set the API base URL in a Vite env file (e.g. `.env` or `.env.local` in the `client` folder):

```
VITE_BLOG_API=http://localhost:4000
```

## Run (development)
From the project root, open two terminals.

1) Start the backend:
```bash
cd server
npm install
# start with node or nodemon
node index.js
```

2) Start the frontend:
```bash
cd client
npm install
npm run dev
```
