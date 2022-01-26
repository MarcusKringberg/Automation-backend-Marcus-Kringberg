const faker = require('faker')
const ENDPOINT_GET_RESERVATIONS = 'http://localhost:3000/api/reservations'
const ENDPOINT_GET_RESERVATION = 'http://localhost:3000/api/reservation/'
const ENDPOINT_POST_RESERVATION = 'http://localhost:3000/api/reservation/new'

function createReservationRequestAndDelete(cy) {
    cy.authenticateSession().then((response => {
        const testReservationPayload = {
            "start": '2022-02-02',
            "end": '2022-02-24',
            "client": faker.random.arrayElement([1, 2])/*The costumers which you can choose between  are beeing randomed*/,
            "room": faker.random.arrayElement([1, 2])/*The rooms which you can choose between are beeing randomed*/,
            "bill": faker.random.arrayElement([1])/*The bills are beeing randoomed*/
        }
        cy.request({
            method: "POST",
            url: ENDPOINT_POST_RESERVATION,
            headers: {
                'X-User-Auth': JSON.stringify(Cypress.env().loginToken),
                'Content-Type': 'application/json'//Logindata to the endpoint. 
            },
            body: testReservationPayload
        }).then((response => {
            const responseAsString = JSON.stringify(response)
            expect(responseAsString).to.have.string(testReservationPayload.room)
        }))

        cy.request({
            method: "GET",
            url: ENDPOINT_GET_RESERVATIONS,
            headers: {
                'X-User-Auth': JSON.stringify(Cypress.env().loginToken),
                'Content-Type': 'application/json'/*Logindata to the endpoint*/
            },
        }).then((response => {
            let lastId = response.body[response.body.length - 1].id//This variable stores the ID of the latest done reservation. 
            cy.request({
                method: "DELETE",
                url: ENDPOINT_GET_RESERVATION + lastId,
                headers: {
                    'X-User-Auth': JSON.stringify(Cypress.env().loginToken),
                    'Content-Type': 'application/json'/*Logindata to the endpoint*/
                }
            }).then((response => {
                const responseAsString = JSON.stringify(response.body)
                expect(responseAsString).to.have.string('true')/*This control checks so that the object has been deleted correct*/
            }))
        }))
    }))

}

module.exports = {
    createReservationRequestAndDelete
}