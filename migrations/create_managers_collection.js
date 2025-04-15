module.exports = {
  async up(db, client) {
    await db.createCollection("managers");

    await db.collection("managers").insertMany([
      {
        name: "Oleh",
        email: "oleh@example.com",
        position: "Project Manager",
        createdAt: new Date(),
      },
      {
        name: "Anna",
        email: "anna@example.com",
        position: "HR Manager",
        createdAt: new Date(),
      },
      {
        name: "Ivan",
        email: "ivan@example.com",
        position: "Sales Manager",
        createdAt: new Date(),
      },
    ]);

    console.log("Collection 'managers' was created!");
  },

  async down(db, client) {
    await db.collection("managers").drop();
    console.log("Collection 'managers' was removed!");
  },
};
