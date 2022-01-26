const faker = require('faker')
const ENDPOINT_GET_BILLS = 'http://localhost:3000/api/bills'
const ENDPOINT_GET_BILL  = 'http://localhost:3000/api/bill/'
const ENDPOINT_POST_BILL = 'http://localhost:3000/api/bill/new'

function createBillRequestAndDelete(cy){
    cy.authenticateSession().then((response =>{
        const fakeBillPayload = {
        "value": faker.random.number(),//The price for the bill is beeing randoomed 
        "paid": faker.random.boolean()
        }
        cy.request({
            method: "POST",
            url: ENDPOINT_POST_BILL,
            headers: {
                'X-User-Auth': JSON.stringify(Cypress.env().loginToken),
                'Content-Type': 'application/json'//Logindata to the endpoint. 
            },
            body: fakeBillPayload
        }).then((response  =>{
            const responseAsString = JSON.stringify(response)
            expect(responseAsString).to.have.string(fakeBillPayload.value)
        }))
       
        cy.request({
            method: "GET",
            url: ENDPOINT_GET_BILLS,
            headers:{
                'X-User-Auth': JSON.stringify(Cypress.env().loginToken),//Logindata to the endpoint
                'Content-Type': 'application/json'
            },
          }).then((response =>{
            let lastId = response.body[response.body.length -1].id//This variable stores the ID of the latest created bill.
            cy.request({
                method: "DELETE",
                url: ENDPOINT_GET_BILL+lastId,
                headers:{
                    'X-User-Auth': JSON.stringify(Cypress.env().loginToken),//Logindata to the endpoint. 
                    'Content-Type': 'application/json'
                }
            }).then((response =>{
                const responseAsString = JSON.stringify(response.body)
                expect(responseAsString).to.have.string('true')//This is a control of that the bill has been deleted correct 
            }))
          }))
    }))

}

module.exports = {
    createBillRequestAndDelete
}