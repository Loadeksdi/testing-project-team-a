import { Page } from '@playwright/test';

export class HomePage {
    readonly page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    async goto() {
        await this.page.goto('https://a.hr.dmerej.info');
    }

    async gotoEmployeeList() {
        await this.page.click('a[href="/employees"]');
    }

    async gotoEmployeeAddForm() {
        await this.page.click('a[href="/add_employee"]');
    }
}