describe('CRUD Logs', () => {
    const mockLogs = {
        page: 1,
        totalPages: 1,
        totalLogs: 5,
        logs: [
            {
                id: 5,
                owner: 'Alex',
                text: 'New log entry',
                createdAt: '2025-10-03T00:26:12.093Z',
                updatedAt: '2025-10-03T00:26:12.093Z',
            },
            {
                id: 1,
                owner: 'John Smith',
                text: 'First log entry',
                createdAt: '2025-10-03T00:22:20.873Z',
                updatedAt: '2025-10-03T00:22:20.873Z',
            },
            {
                id: 2,
                owner: 'Mary Johnson',
                text: 'Second log entry',
                createdAt: '2025-10-03T00:22:20.873Z',
                updatedAt: '2025-10-03T00:22:20.873Z',
            },
            {
                id: 3,
                owner: 'Peter Brown',
                text: 'Third log entry',
                createdAt: '2025-10-03T00:22:20.873Z',
                updatedAt: '2025-10-03T00:22:20.873Z',
            },
            {
                id: 4,
                owner: 'Anna Davis',
                text: 'Fourth log entry',
                createdAt: '2025-10-03T00:22:20.873Z',
                updatedAt: '2025-10-03T00:22:20.873Z',
            },
        ],
    };

    beforeEach(() => {
        cy.intercept('GET', '**/logs*', {
            statusCode: 200,
            body: mockLogs,
        }).as('getLogs');

        cy.visit('/');
        cy.wait('@getLogs');
        cy.get('[data-cy=user-table]', { timeout: 8000 }).should('be.visible');
    });

    describe('GetAllTable', () => {
        it('Loads and displays all logs on initial render', () => {
            cy.log('Expecting GET /logs and checking table');

            cy.get('[data-cy=user-table]', { timeout: 8000 })
                .should('be.visible')
                .and('contain', 'Alex')
                .and('contain', 'John Smith')
                .and('contain', 'Mary Johnson')
                .and('contain', 'Peter Brown')
                .and('contain', 'Anna Davis');

            // Check number of rows
            cy.get('[data-cy=user-table] tr').should('have.length.at.least', 5);
        });
    });

    describe('Delete Log', () => {
        beforeEach(() => {
            cy.intercept('DELETE', '**/logs/*', {
                statusCode: 200,
                body: {},
            }).as('deleteLog');
        });

        it('Deletes a log from the table', () => {
            cy.log('Check table contains the log before deletion');
            cy.get('[data-cy=user-table]').should('contain', 'New log entry');

            cy.log('Click delete button');
            cy.get('[data-cy=delete-row-button]').first().click();

            cy.log('Confirm deletion');
            cy.get('[data-cy=delete-alert-button]', { timeout: 5000 })
                .should('be.visible')
                .click();

            cy.wait('@deleteLog').its('response.statusCode').should('eq', 200);

            cy.log('Mock updated list after deletion');
            cy.intercept('GET', '**/logs*', {
                statusCode: 200,
                body: {
                    ...mockLogs,
                    logs: mockLogs.logs.filter((log) => log.id !== 5),
                },
            }).as('getLogsAfterDelete');

            cy.reload();
            cy.wait('@getLogsAfterDelete');

            cy.get('[data-cy=user-table]').should(
                'not.contain',
                'New log entry',
            );
        });
    });

    describe('Create Log', () => {
        beforeEach(() => {
            cy.intercept('POST', '**/logs', (req) => {
                req.reply({
                    statusCode: 201,
                    body: {
                        id: 6,
                        owner: 'Alice',
                        text: 'This is a new log',
                        createdAt: new Date().toISOString(),
                        updatedAt: new Date().toISOString(),
                    },
                });
            }).as('createLog');
        });

        it('Creates a new log', () => {
            cy.log('Open create form');
            cy.get('[data-cy=create-form-open-btn]').click();

            cy.log('Fill in the form');
            cy.get('[data-cy=owner-create-input]')
                .should('be.visible')
                .type('Alice')
                .should('have.value', 'Alice');

            cy.get('[data-cy=text-create-input]')
                .should('be.visible')
                .type('This is a new log')
                .should('have.value', 'This is a new log');

            cy.log('Mock updated list after creation');
            cy.intercept('GET', '**/logs*', {
                statusCode: 200,
                body: {
                    ...mockLogs,
                    logs: [
                        ...mockLogs.logs,
                        {
                            id: 6,
                            owner: 'Alice',
                            text: 'This is a new log',
                            createdAt: new Date().toISOString(),
                            updatedAt: new Date().toISOString(),
                        },
                    ],
                },
            }).as('getLogsAfterCreate');

            cy.log('Submit form');
            cy.get('[data-cy=create-submit-button]').click();

            cy.wait('@createLog').its('response.statusCode').should('eq', 201);
            cy.wait('@getLogsAfterCreate');

            cy.log('Verify new log appears in the table');
            cy.get('[data-cy=user-table]')
                .should('contain', 'Alice')
                .and('contain', 'This is a new log');
        });
    });

    describe('Update Log', () => {
        const updatedLog = {
            id: 5,
            owner: 'Alice',
            text: 'This is a new log',
            createdAt: '2025-10-03T00:26:12.093Z',
            updatedAt: new Date().toISOString(),
        };

        it('Edits a log and updates the table', () => {
            cy.intercept('PUT', '**/logs/5', {
                statusCode: 200,
                body: updatedLog,
            }).as('updateLog');

            cy.intercept('GET', '**/logs*', {
                statusCode: 200,
                body: {
                    page: 1,
                    totalPages: 1,
                    totalLogs: mockLogs.totalLogs,
                    logs: mockLogs.logs.map((log) =>
                        log.id === 5 ? updatedLog : log,
                    ),
                },
            }).as('getLogsAfterUpdate');

            cy.get('[data-cy=edit-mode-btn]').first().click();

            cy.get('[data-cy=owner-edit-input]')
                .should('be.visible')
                .clear()
                .type(updatedLog.owner)
                .should('have.value', updatedLog.owner);
            cy.get('[data-cy=text-edit-input]')
                .should('be.visible')
                .clear()
                .type(updatedLog.text)
                .should('have.value', updatedLog.text);

            cy.get('[data-cy=edit-mode-submit-btn]').click();

            cy.wait('@updateLog').its('response.statusCode').should('eq', 200);

            cy.wait('@getLogsAfterUpdate');

            cy.get('[data-cy=user-table]')
                .should('contain', updatedLog.owner)
                .and('contain', updatedLog.text);
        });
    });
});
