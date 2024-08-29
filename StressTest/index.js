// import http from "k6/http";
// import { check, sleep } from "k6";

// export let options = {
//   stages: [
//     { duration: "30s", target: 5 },
//     { duration: "30s", target: 10 },
//   ],
// };

// export default function() {
//   let res = http.get("http://localhost:8081/stocks/history");

//   check(res, {
//     "status is 200": (r) => r.status === 200,
//     "get historical stock successful": (r) => JSON.parse(r.body).success === true,
//   });

//   sleep(1);
// }

const autocannon = require('autocannon');

const instance = autocannon({
  url: 'http://localhost:8081/stocks/history?startDate=2024-08-21 15:00:00&endDate=2024-08-22 21:00:00&ticker=BTD',
  connections: 1000, //default
  pipelining: 50, // default
  duration: 60 // default
}, console.log)

instance.on('done', (result) => {
  console.log('Test completed.');
  console.log('Requests per second: ', result.requests.average);
  console.log('Latency average: ', result.throughput.average);
  console.log('Latency max: ', result.throughput.max);
});
