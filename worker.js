var amqp = require("amqplib/callback_api");

amqp.connect("amqp://localhost", function (err, conn) {
  if (err) {
    console.error(err);
    return;
  }
  conn.createChannel(function (err, ch) {
    if (err) {
      console.error(err);
      return;
    }
    var q = "task_queue";

    ch.assertQueue(q, { durable: true });

    ch.consume(
      q,
      (msg) => {
        var secs = msg.content.toString().split(".").length - 1;

        console.log(" [x] Received %s", msg.content.toString());

        setTimeout(function () {
          console.log(" [x] Done");
          ch.ack(msg);
        }, secs * 1000);
      },
      { noAck: false }
    );
  });
});
