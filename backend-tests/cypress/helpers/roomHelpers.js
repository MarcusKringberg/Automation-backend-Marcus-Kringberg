const faker = require('faker')
const ENDPOINT_GET_ROOMS = 'http://localhost:3000/api/rooms'
const ENDPOINT_GET_ROOM  = 'http://localhost:3000/api/room/'
const ENDPOINT_POST_ROOM = 'http://localhost:3000/api/room/new'

function createRoomRequestAndDelete(cy){
    cy.authenticateSession().then((response =>{
        const fakeRoomPayload = {//The two variabels below random room types and room categories
        "category": faker.random.arrayElement(['double', 'single', 'twin']),
        "features": faker.random.arrayElement(['Balcony', 'Ensuite', 'Sea View', 'Penthouse']),
        "floor": faker.random.number(),
        "number": faker.random.number(),
        "price" : faker.random.number()
        }
        cy.request({
            method: "POST",
            url: ENDPOINT_POST_ROOM,
            headers: {
                'X-User-Auth': JSON.stringify(Cypress.env().loginToken),//Logindata to the endpoint 
                'Content-Type': 'application/json'
            },
            body: fakeRoomPayload
        }).then((response  =>{
            const responseAsString = JSON.stringify(response)
            expect(responseAsString).to.have.string(fakeRoomPayload.floor)
        }))
       
        cy.request({
            method: "GET",
            url: ENDPOINT_GET_ROOMS,
            headers:{
                'X-User-Auth': JSON.stringify(Cypress.env().loginToken),//Logindata to the endpoint. 
                'Content-Type': 'application/json'
            },
          }).then((response =>{
            let lastId = response.body[response.body.length -1].id
            cy.request({
                method: "DELETE",
                url: ENDPOINT_GET_ROOM+lastId,
                headers:{
                    'X-User-Auth': JSON.stringify(Cypress.env().loginToken),//Logindata to the endpoint. 
                    'Content-Type': 'application/json'
                }
            }).then((response =>{
                const responseAsString = JSON.stringify(response.body)
                expect(responseAsString).to.have.string('true')
            }))
          }))
    }))

}

module.exports = {
    createRoomRequestAndDelete
}