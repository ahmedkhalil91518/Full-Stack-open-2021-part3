const mongoose = require("mongoose");

if (process.argv.length < 3) {
  console.log(
    "Please provide the password as an argument: node mongo.js <password>"
  );
  process.exit(1);
}

const password = process.argv[2];

const url = `mongodb+srv://ahmedkhalil91518:${password}@cluster0.qw6fi.mongodb.net/phoneNumbers?retryWrites=true&w=majority`;

mongoose.connect(url);

const phoneNumberSchema = new mongoose.Schema({
  name: String,
  number: String,
});

const PhoneNumber = mongoose.model("Phone Number", phoneNumberSchema);
if (process.argv.length < 4) {
  PhoneNumber.find({}).then((result) => {
    console.log("phonebook:");
    result.forEach((x) => {
      console.log(x.name, x.number);
    });
    mongoose.connection.close();
  });
} else {
  const phoneNumber = new PhoneNumber({
    name: process.argv[3],
    number: process.argv[4],
  });

  phoneNumber.save().then((result) => {
    console.log(`added ${process.argv[3]} number ${process.argv[4]} to the phonebook`);
    mongoose.connection.close();
  });
}
