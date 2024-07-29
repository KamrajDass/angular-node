const MongoClient = require("mongodb").MongoClient;

const url = "mongodb://localhost:27017/";
const dbname = "testDB";
async function main() {
  const client = new MongoClient(url);

  try {
    // Connect to MongoDB
    await client.connect();
    console.log("Connected correctly to server");

    const db = client.db(dbname);
    const collection = db.collection("products");

    // Create (Insert) Operation
    const insertResult = await collection.insertOne({
      name: "Dell Laptop",
      price: 290,
    });
    console.log("Insert Result:", insertResult.insertedId);

    // Read (Find) Operation
    const documents = await collection.find({}).toArray();
    console.log("Found Documents:", documents);

    // Update Operation
    const updateResult = await collection.updateOne(
      { name: "Dell Laptop" },
      { $set: { price: 350 } }
    );
    console.log("Update Result:", updateResult);

    // Verify Update
    const updatedDocument = await collection.findOne({ name: "Dell Laptop" });
    console.log("Updated Document:", updatedDocument);

    // Delete Operation
    const deleteResult = await collection.deleteOne({ name: "Dell Laptop" });
    console.log("Delete Result:", deleteResult);

    // Verify Deletion
    const remainingDocuments = await collection.find({}).toArray();
    console.log("Remaining Documents:", remainingDocuments);
  } catch (err) {
    console.error(err);
  } finally {
    // Close the client connection
    await client.close();
  }
}

// Run the main function
main();
