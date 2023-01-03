export const fetchEmployees = async (page, url) => {
    await page.goto(url);
    return await page.$$eval('.table', (employees) => {
        return employees.map(employee => {
            const name = employee.querySelector('td:nth-child(1)');
            const mail = employee.querySelector('td:nth-child(2)');
            return {
                name: name.textContent.trim(),
                email: mail.textContent.trim()
            };
        });
    });
}

export const fillEmployeeForm = async (page, employee) => {
    await page.locator('input[id="id_name"]').fill(employee.name);
    await page.locator('input[id="id_email"]').fill(employee.email);
    await page.locator('input[id="id_address_line1"]').fill(employee.address);
    await page.locator('input[id="id_city"]').fill(employee.city);
    await page.locator('input[id="id_zip_code"]').fill(employee.zip);
    await page.locator('input[id="id_hiring_date"]').fill(employee.hiringDate);
    await page.locator('input[id="id_job_title"]').fill(employee.jobTitle);
    await page.locator('button').click();
};
