describe('Game api', () => {
    context('GET /game', () => {
        it('should return an array with all games', () => {
            cy.request({
                method: 'GET',
                url: 'http://localhost:3000/api/v1/game'
            })
                .should((response) => {
                    cy.log(JSON.stringify(response.body))
                });
        });
    });
});