import { Kafka } from "kafkajs";

const kafka = new Kafka({
  clientId: "api",
  brokers: ["localhost:29092"],
});

const producer = kafka.producer();

export async function publish(topic: string, data: any) {
  await producer.connect();
  const r = await producer.send({
    topic,
    messages: [
      {
        value: JSON.stringify(data),
      },
    ],
  });
  console.log(
    `Sent to ${topic}: ${JSON.stringify(data)}, ${JSON.stringify(r)}`
  );
}
