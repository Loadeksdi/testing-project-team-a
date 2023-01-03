import { Page } from '@playwright/test';

export class EmployeesPage {
    readonly page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    async goto() {
        await this.page.goto('https://a.hr.dmerej.info/employees');
    }

    async fetchEmployees() {
        return await this.page.$$eval('.table', (employees) => {
            return employees.map(employee => {
                const name = employee.querySelector('td:nth-child(1)');
                const mail = employee.querySelector('td:nth-child(2)');
                return {
                    name: name?.textContent?.trim(),
                    email: mail?.textContent?.trim()
                };
            });
        });
    }
}