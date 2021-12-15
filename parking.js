import util from 'util'

export class Parking {

    constructor () {
        this.MAX_COLS = 8
        this.MAX_ROWS = 5

        // Initialize our parking slots
        this.PARK = new Array(this.MAX_ROWS).fill(null).map( () => new Array(this.MAX_COLS).fill(null) )

        // Initialize our parking spaces with random data
        this.initSpaces()

        // Let's define our entrance points
        this.ENTRANCE = [
            {name: 'A', row: 0, col: 2},
            {name: 'B', row: 0, col: 6},
            {name: 'C', row: this.MAX_ROWS, col: 3}
        ]


    }
    //
    viewMap() {
        console.log ( util.inspect(this.PARK, {
            showHidden: false,
            colors: true,
            compact: true,
            depth: null
        }) )
    }

    // Check if parking slot is available
    park(size, ent) {

        let entrance = this.ENTRANCE.find(o => o.name === ent.toUpperCase() )
        let nrow = -1, ncol = -1
        let distance = 9999

        // Search for the nearest parking space
        for ( let i=0; i<this.MAX_ROWS; i++ ) {
            for ( let j=0; j<this.MAX_COLS; j++ ) {
                if ( !this.isGateway(i,j) ) {
                    let p = this.PARK[i][j]
                    if ( size <= p.psize.value ) { // Check if vehicle fits in parking slot
                        let computedDistance = Math.abs( entrance.row - p.row ) + Math.abs ( entrance.col - p.col )
                        if ( distance > computedDistance && !p.occupied ) {
                            distance = computedDistance
                            nrow = i
                            ncol = j
                        }
                    }
                }
            }
        }

        if ( nrow == -1 ) { // No parking slot found
            console.log ( 'No parking slot found' )
            return false
        } else {

            Object.assign( this.PARK[nrow][ncol], {
                occupied: true,
                vsize: {
                    value: parseInt(size),
                    desc: this.getVehicleDesc(size)
                },
                row: nrow,
                col: ncol,
                start: new Date()
            } )

            return this.PARK[nrow][ncol]
        }

    }

    getVehicleDesc(size) {

        switch ( parseInt(size) ) {
            case 0:
                return 'S'
                break
            case 1:
                return 'M'
                break
            case 2:
                return 'L'
                break
            default:
                return ''

        }

    }

    unpark(row, col) {

        let p = this.PARK[row][col]
        let diff = ( new Date() ) - p.start

        let totalPayable = this.compute ( p.psize.value, diff )

        console.log ( `Total charges: P ${totalPayable}`)
        // Reset parking slot
        Object.assign(this.PARK[row][col], {
            occupied: false,
            vsize: null,
            start: null
        })
    }

    // Compute total charges based on parking size and total time parked
    compute ( size, totalTime ) {

        let remainingTime = totalTime
        let t24 = 1000 * 60 * 24
        let t1h = 1000 * 60
        let charges = 0

        var hourlyCharge = 0

        if ( size == 0 ) {
            hourlyCharge = 20
        } else if ( size == 1 ) {
            hourlyCharge = 60
        } else if ( size == 2 ) {
            hourlyCharge = 100
        }

        // For parking that exceeds 24 hours, every full 24 hour chunk is charged 5,000 pesos regardless of parking slot.
        if ( remainingTime > t24 ) {
            let n24 = parseInt(totalTime / t24)
            charges += n24 * 5000
            remainingTime -= ( n24 * t24 )
        }

        // First 3 hours has a flat rate of 40
        if ( remainingTime > ( t1h * 3 ) ) {
            remainingTime -= ( t1h * 3 )
            charges += 40
        }

        // The exceeding hourly rate beyond the initial three (3) hours will be charged as follows:
        // - 20/hour for vehicles parked in SP;
        // - 60/hour for vehicles parked in MP; and
        // - 100/hour for vehicles parked in LP
        if ( remainingTime > 0 ) {
            let remainingHours = Math.ceil ( remainingTime / t1h )
            charges += remainingHours * hourlyCharge
        }

        // return total charges
        return charges

    }

    initSpaces () {

        for ( let i=0; i<this.MAX_ROWS; i++ ) {
            for ( let j=0; j<this.MAX_COLS; j++ ) {
                if ( !this.isGateway(i,j) ) {
                    this.PARK[i][j] = {
                        occupied: false,
                        psize: this.getRandomSize(),
                        row: i,
                        col: j
                    }

                }
            }
        }

    }

    isGateway ( row, col ) {

        if ( col == 0 || row == 0 || row == this.MAX_ROWS - 1 || col == this.MAX_COLS - 1 ) {
            return true
        } else { 
            return false
        }

        }

    isValidSize(size) {

        if ( size >= 0 && size <= 2)
            return true
        else
            return false

    }

    getRandomSize() {
        // SP = 0, MP = 1, LP = 2
        
        const max = 2
        const min = 0
        const descriptors = ['SP', 'MP', 'LP']
        const size = Math.round(Math.random() * (max - min) + min)
        const desc = descriptors[size]
        return  {
            value: size,
            desc: desc
        }
    }
        
}