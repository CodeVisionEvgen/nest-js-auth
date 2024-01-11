db.createUser({
  user: "admin",
  pwd: "1q2w3e4r",
  roles: [
    {
      role: "readWrite",
      db: "crud"
    }
  ]
});

// db.auth({"user": "Admin","pwd": "1q2w3e4r"})
