const assert = require('assert');

class Car {

    park() {
        return 'stopped';
    }

    drive() {
        return 'vroom';
    }
}

let car;
beforeEach(() => {
    car = new Car();
});

// describe('Car', () => {
//     it('can park',() => {
//         assert.equal(car.park(), 'stopped');
//     });

//     it('can drive',() => {
//         const car = new Car();
//         assert.equal(car.drive(), 'vroom');
//     });
// });