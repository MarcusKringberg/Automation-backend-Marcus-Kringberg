


const faker = require('faker')

const ENDPOINT_GET_CLIENTS = 'http://localhost:3000/api/clients'
const ENDPOINT_POST_CLIENT = 'http://localhost:3000/api/client/new'
const ENDPOINT_GET_CLIENT  = 'http://localhost:3000/api/client/'


function createRandomClientPayload(){
    //The variabels at the three lines below pick up information from the forms which you fill in to get clients at the hotel application 
    const fakeName = faker.name.firstName()
    const fakeEmail = faker.internet.email()
    const fakePhone = faker.phone.phoneNumber()

    const payload = {
        "name": fakeName,
        "email": fakeEmail,
        "telephone": fakePhone
    }

    return payload
}

function getRequestAllClientsWithAssertion(cy, name, email, telephone){
    // GET request to fetch all clients
    cy.request({
        method: "GET",
        url: ENDPOINT_GET_CLIENTS,
        headers:{
            'X-User-Auth': JSON.stringify(Cypress.env().loginToken),
            'Content-Type': 'application/json'
        },
      }).then((response =>{
          //these lines of code are use to transform the JSON-data to a string.
        const responseAsString = JSON.stringify(response)
        expect(responseAsString).to.have.string(name)
        expect(responseAsString).to.have.string(email)
        expect(responseAsString).to.have.string(telephone)
      }))

}

function getAllClientsRequest(cy){
    cy.authenticateSession().then((response =>{
    cy.request({
        method: "GET",
        url: ENDPOINT_GET_CLIENTS,
        headers:{
            'X-User-Auth': JSON.stringify(Cypress.env().loginToken),//Logindata to the endpoint
            'Content-Type': 'application/json'
        },
      }).then((response =>{
        const responseAsString = JSON.stringify(response)//This variable transforms the JSON-data to a string. 
        cy.log(responseAsString)
      }))
}))
}

function deleteRequestAfterGet(cy){
    // GET request to fetch all clients
    cy.request({
        method: "GET",
        url: ENDPOINT_GET_CLIENTS,
        headers:{
            'X-User-Auth': JSON.stringify(Cypress.env().loginToken),
            'Content-Type': 'application/json'
        },
      }).then((response =>{
        let lastId = response.body[response.body.length -1].id
        //Delete request for the last client that was created.
        cy.request({
            method: "DELETE",
            url: ENDPOINT_GET_CLIENT+lastId,
            headers:{
                'X-User-Auth': JSON.stringify(Cypress.env().loginToken)/*Login-data to the endpoint*/,
                'Content-Type': 'application/json'
            }
        }).then((response =>{
            const responseAsString = JSON.stringify(response.body)
            expect(responseAsString).to.have.string('true')//This thing shows that the object has been deleted correctly. 
        }))
      }))

}


function createClientRequest(cy){
    cy.authenticateSession().then((response =>{
        let fakeClientPayload = createRandomClientPayload()
        cy.request({
            method: "POST",
            url: ENDPOINT_POST_CLIENT,
            headers: {
                'X-User-Auth': JSON.stringify(Cypress.env().loginToken),
                'Content-Type': 'application/json'
            },
            body: fakeClientPayload
        }).then((response  =>{
            const responseAsString = JSON.stringify(response)
            expect(responseAsString).to.have.string(fakeClientPayload.name)
        }))
       
        getRequestAllClientsWithAssertion(cy, fakeClientPayload.name, fakeClientPayload.email, fakeClientPayload.telephone)
    }))
}

function createClientRequestAndDelete(cy){
    cy.authenticateSession().then((response =>{
        let fakeClientPayload = createRandomClientPayload()
        cy.request({
            method: "POST",
            url: ENDPOINT_POST_CLIENT,
            headers: {
                'X-User-Auth': JSON.stringify(Cypress.env().loginToken)/*Logindata to the endpoint*/,
                'Content-Type': 'application/json'
            },
            body: fakeClientPayload
        }).then((response  =>{
            const responseAsString = JSON.stringify(response)
            expect(responseAsString).to.have.string(fakeClientPayload.name)
        }))
       
        deleteRequestAfterGet(cy)
    }))
}

module.exports = {
    createRandomClientPayload,
    createClientRequest,
    getAllClientsRequest,
    createClientRequestAndDelete
}

    