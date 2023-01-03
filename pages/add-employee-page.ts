import { Page } from '@playwright/test';

export class AddEmployeePage {
    readonly page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    async goto() {
        await this.page.goto('https://a.hr.dmerej.info/add_employee');
    }

    async fillEmployeeForm(employee) {
        await this.page.locator('input[id="id_name"]').fill(employee.name);
        await this.page.locator('input[id="id_email"]').fill(employee.email);
        await this.page.locator('input[id="id_address_line1"]').fill(employee.address);
        await this.page.locator('input[id="id_city"]').fill(employee.city);
        await this.page.locator('input[id="id_zip_code"]').fill(employee.zip);
        await this.page.locator('input[id="id_hiring_date"]').fill(employee.hiringDate);
        await this.page.locator('input[id="id_job_title"]').fill(employee.jobTitle);
        await this.page.locator('button').click();
    };
}