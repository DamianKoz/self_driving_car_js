// Todos:
// - Fitness Function: Make them move on the lanes + Better if they pass more traffic
// - Create more and random traffic
// - Automatically restart if all cars are gone

const carCanvas = document.getElementById("carCanvas");
carCanvas.width = 200;

const networkCanvas = document.getElementById("networkCanvas");
networkCanvas.width = 300;

const carCtx = carCanvas.getContext("2d");
const networkCtx = networkCanvas.getContext("2d");
const road = new Road(carCanvas.width / 2, carCanvas.width * 0.9);

const carStartingPoint = road.getLaneCenter(Math.round(road.laneCount / 2 - 1));

const N = 100;
var cars = generateCars(N);

console.log(cars);

var traffic = generateTraffic();

let bestCar = cars[0];
if (localStorage.getItem("bestBrain")) {
  for (let i = 0; i < cars.length; i++) {
    cars[i].brain = JSON.parse(localStorage.getItem("bestBrain"));
    if (i != 0) {
      NeuralNetwork.mutate(cars[i].brain, 0.2);
    }
  }
}

animate();

function save() {
  localStorage.setItem("bestBrain", JSON.stringify(bestCar.brain));
  console.log(`Saved ${bestCar.brain}`);
}

function discard() {
  localStorage.removeItem("bestBrain");
}

function generateCars(N) {
  const cars = [];
  for (let i = 0; i <= N; i++) {
    cars.push(new Car(road.getLaneCenter(1), 100, 30, 50, "AI"));
  }
  return cars;
}

function generateTraffic(n = 8) {
  return [
    new Car(road.getLaneCenter(1), -100, 30, 50, "DUMMY", 2),
    new Car(road.getLaneCenter(0), -500, 30, 50, "DUMMY", 2),
    new Car(road.getLaneCenter(2), -500, 30, 50, "DUMMY", 2),
    new Car(road.getLaneCenter(1), -650, 30, 50, "DUMMY", 2),

    new Car(road.getLaneCenter(1), -900, 30, 50, "DUMMY", 2),
    new Car(road.getLaneCenter(0), -800, 30, 50, "DUMMY", 2),
    new Car(road.getLaneCenter(2), -1000, 30, 50, "DUMMY", 2),
    new Car(road.getLaneCenter(1), -1000, 30, 50, "DUMMY", 2),
  ];
}

function updateTraffic() {}

function animate() {
  for (let i = 0; i < traffic.length; i++) {
    traffic[i].update(road.borders, []);
  }

  for (let i = 0; i < cars.length; i++) {
    cars[i].update(road.borders, traffic);
  }

  bestCar = cars.find((c) => c.y == Math.min(...cars.map((c) => c.y)));

  carCanvas.height = window.innerHeight;
  networkCanvas.height = window.innerHeight;

  carCtx.save();
  carCtx.translate(0, -bestCar.y + carCanvas.height * 0.5);

  road.draw(carCtx);
  for (let i = 0; i < traffic.length; i++) {
    traffic[i].draw(carCtx);
  }

  carCtx.globalAlpha = 0.2;

  for (let i = 0; i < cars.length; i++) {
    cars[i].draw(carCtx, "blue");
  }

  carCtx.globalAlpha = 1;
  bestCar.draw(carCtx, "blue", true);

  carCtx.restore();

  Visualizer.drawNetwork(networkCtx, bestCar.brain);

  requestAnimationFrame(animate);
}
