# FinMona-BE

## Setting up Project

In the project directory, to install all the dependencies you can run:
```
npm install
```

Create .env file. Example file:
```
PORT = 8080
ACCESS_TOKEN_KEY = "YOUR_ACCESS_TOKEN_KEY"
REFRESH_TOKEN_KEY = "YOUR_REFRESH_TOKEN_KEY"
ACCESS_TOKEN_EXPIRES_TIME="7d"
REFRESH_TOKEN_EXPIRES_TIME="30d"
MONGOOSE_URI="YOUR_MONGODB_URI"
```

Runs the app in the development mode:
```
npm start
```
