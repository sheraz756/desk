module.exports = {
  //server database
  MONGODB_USERNAME: "", // YOUR_MONGODB_USERNAME
  MONGODB_PASSWORD: "", // YOUR_MONGODB_PASSWORD
  MONGODB_DB_NAME: "", // YOUR_DATABASE_NAME

  //port
  PORT: process.env.PORT || 5000,

  //secret key for API
  SECRET_KEY: "", // YOUR_APP_SECRET_KEY

  //gmail credentials for send email
  EMAIL: "", // YOUR_APP_EMAIL
  PASSWORD: "", // YOUR_APP_PASSWORD

  //secret key for jwt
  JWT_SECRET: "asdfsadfsdf", // ANY_RANDOM_KEY

  baseURL: "5000", // YOUR_APP_BASE_URL

  //firebase server key for notification
  SERVER_KEY: "AAAAGoCzyb8:APA91bF8I8kg8i3MJWVLC6MZbTyGCoUwa4OiJo2qnBqmS0nuQ-VsBwY1j80QsJBVQh8QxiGcc8Qol85R2kCiI1iN1HVe0mkotBIpx9kCAa-G7hJ1TI5TpSB3XLRAhxbibw3FCiEGF-sm", // YOUR_FIREBASE_SERVER_KEY
};
