import readline from 'readline'
import { Parking } from './parking.js'
let parking = new Parking()

// let parking = new Parking(2, 2)
console.log ( "Parking system created...\n" )

let prompt = 'Select action [ p - park, u - unpark, m - map, x - exit ]:'
// let prompt = 'Select action [ p - park, u - unpark, m - map, x - exit ]:'
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt
})

rl.prompt()

rl.on('line', (line) => {
    switch (line.trim()) {
      case 'x':
        rl.close()
        break
      case 'p':

        rl.question('Vehicle size [ 0-S, 1-M, 2-L ]: ', function ( v ) {
            let strEntrance = parking.ENTRANCE.map( (e) => e.name).join(',')
            rl.question(`Entrance [${strEntrance}]: `, function (entrance) {
                parking.park(v, entrance)
                rl.prompt()
            })

        })

        break

      case 'u':
        rl.question('Location of vehicle to unpark. Seperate by a space [row column]: ', function (loc) {
            let strLoc = loc.trim().split(' ')

            if ( strLoc.length >= 2 ) {
                let row = strLoc[0]
                let col = strLoc[1]
                parking.unpark(row, col)
                console.log('Vehicle unparked!')
            }
        })
        break
      case 'm':
        parking.viewMap()
        break
      default:
        break;
    }
    rl.prompt();

  }).on('close', () => {

    console.log('Have a great day!');
    process.exit(0);

  });

rl.on("close", function () {
    console.log("\nThank you! We are pleased to serve you.")
    process.exit(0)
})