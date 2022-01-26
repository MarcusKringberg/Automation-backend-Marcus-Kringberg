//All the functions that I need to perform the testcases is beeing imported in the four lines below. 
import * as billsHelpers from '../helpers/BillHelpers'
import * as clientHelpers from '../helpers/clientHelpers'
import * as roomsHelpers from '../helpers/roomHelpers'
import * as reservationHelpers from '../helpers/ReservationsHelpers'

describe('test suite 1', function(){

    it ('Get all clients', function(){
        clientHelpers.getAllClientsRequest(cy)
    })

    it ('Create a client and delete it', function(){
        clientHelpers.createClientRequestAndDelete(cy)
    })

    it ('Create a bill and delete it', function(){
        billsHelpers.createBillRequestAndDelete(cy)
    })

    it ('Create a room and delete it', function(){
        roomsHelpers.createRoomRequestAndDelete(cy)
    })

    it ('Create a reservation and delete it', function(){
        reservationHelpers.createReservationRequestAndDelete(cy)
    })
})