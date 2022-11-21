/** @format */

const faker = require("faker");

const { MongoClient, ServerApiVersion } = require("mongodb");
const uri =
	"mongodb+srv://admin:Password196@cluster0.dapnt0m.mongodb.net/?retryWrites=true&w=majority";

const client = new MongoClient(uri, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
	serverApi: ServerApiVersion.v1,
});

function randomIntFromInterval(min, max) {
	// min and max included
	return Math.floor(Math.random() * (max - min + 1) + min);
}

async function seedDB() {
	console.log("Seeding....");
	try {
		await client.connect();

		console.log("Connected to the server correctly!!!", client);

		const collection = client.db("payments_db1").collection("payments1");

		// collection.drop();

		// const sleepPosition = ["back", "side-left", "side-right", "chest"];
		let seedNumber = 0;

		const payment_method_type = [
			"card",
			"bacs_debit",
			"sepa_debit",
			"wallet",
			"bank_transfer",
		];

		const batch = 50;

		for (let j = 0; j < batch; j++) {
			let payment_data = [];
			for (let i = 0; i < 20000; i++) {
				const firstName = faker.name.firstName();
				const lastName = faker.name.lastName();

				let newPayment = {
					payment_id: faker.random.alphaNumeric(),
					payment_timeStamp: new Date(
						faker.date.between(
							"2022-11-01T00:00:00.000Z",
							"2022-11-16T00:00:00.000Z",
						),
					),
					payment_method: payment_method_type[randomIntFromInterval(0, 4)],
					currency: "gbp",
					amount: randomIntFromInterval(50, 350),
					customer_email: faker.internet.email(firstName, lastName),
					customer_name: firstName + " " + lastName,
				};

				payment_data.push(newPayment);

				seedNumber += 1;
			}

			console.log(`Batch ${j + 1} done!!!`);
			await collection.insertMany(payment_data);
		}

		// Inserting all the time series data at once

		console.log(`Database seeded with ${seedNumber * batch} records! :)`);
		client.close();
	} catch (err) {
		console.log(err);
	}
}

seedDB();
