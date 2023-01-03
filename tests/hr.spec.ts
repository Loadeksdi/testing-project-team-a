import { test, expect } from '@playwright/test';
import { fetchEmployees, fillEmployeeForm } from '../helpers';
import { HomePage } from '../pages/home-page';
import { EmployeesPage } from '../pages/employees-page';
import { AddEmployeePage } from '../pages/add-employee-page';


const baseUrl = 'https://a.hr.dmerej.info';

const johnDoe = {
  name: 'John Doe',
  email: 'john.doe@domain.tld',
  address: '30 avenue de la république',
  city: 'Villejuif',
  zip: '94800',
  hiringDate: new Date().toISOString().slice(0, 10),
  jobTitle: 'Developer'
};

test.beforeEach(async ({ page }) => {
  await page.goto(`${baseUrl}/reset_db`);
  await page.getByText("Proceed").click();
});

test('home link navigate to home page', async ({ page }) => {
  const home = new HomePage(page);
  await home.goto();

  const homeLink = page.getByRole('link', { name: 'Home' });

  await expect(homeLink).toHaveAttribute('href', '/');

  await homeLink.click();

  await expect(page).toHaveURL(baseUrl);
});

test('initial employee list is empty', async ({ page }) => {
  const home = new HomePage(page);
  await home.gotoEmployeeList();

  const employeesTable = await new EmployeesPage(page).fetchEmployees()

  await expect(employeesTable).toMatchObject({});
});

test('adding an employee, add it to the list too', async ({ page }) => {
  const home = new HomePage(page);
  await home.gotoEmployeeAddForm();

  await new AddEmployeePage(page).fillEmployeeForm(johnDoe);

  await home.gotoEmployeeList();

  const employees = await new EmployeesPage(page).fetchEmployees()
  await expect(employees).toEqual([{ name: johnDoe.name, email: johnDoe.email }]);
});

const properties = ['name', 'email', 'address', 'city', 'zip', 'hiringDate', 'jobTitle'];
for (const prop of properties) {
  test(`adding an employee with missing ${prop} data`, async ({ page }) => {
    await page.goto(`${baseUrl}/add_employee`);

    johnDoe[prop] = '';
    await fillEmployeeForm(page, johnDoe);

    const employees = await fetchEmployees(page, `${baseUrl}/employees`);
    await expect(employees).toEqual([]);
  });
}

test('adding an employee with long zipcode', async ({ page }) => {
  await page.goto(`${baseUrl}/add_employee`);

  johnDoe.zip = '999999999999999999999999999999999999999';
  await fillEmployeeForm(page, johnDoe);

  const employees = await fetchEmployees(page, `${baseUrl}/employees`);
  await expect(employees).toEqual([]);
});

test('adding an employee with invalid email', async ({ page }) => {
  await page.goto(`${baseUrl}/add_employee`);

  johnDoe.email = 'john.doe';
  await fillEmployeeForm(page, johnDoe);

  const employees = await fetchEmployees(page, `${baseUrl}/employees`);
  await expect(employees).toEqual([]);
});

test('deleting an employee should display their information and remove from the list', async ({ page }) => {
  await page.goto(`${baseUrl}/add_employee`);
  await fillEmployeeForm(page, johnDoe);

  await page.goto(`${baseUrl}/employees`);
  const deleteButton = page.getByRole('link', { name: 'Delete' });
  await deleteButton.click();

  const texts = await page.locator('br').allInnerTexts();
  expect(texts[0]).toEqual(`name: ${johnDoe.name}`);
  expect(texts[1]).toEqual(`email: ${johnDoe.email}`);

  await page.getByRole('link', { name: 'Proceed' }).click();

  const employees = await fetchEmployees(page, `${baseUrl}/employees`);
  await expect(employees).toEqual([]);
});
