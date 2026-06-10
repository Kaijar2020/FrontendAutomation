import { test, expect } from '@playwright/test';
import { MainPage } from '../pages/mainpage'; 

test.describe('Main Page Tests', () => {
  let mainPage: MainPage;
  test.beforeEach(async ({ page }) => {
    mainPage = new MainPage(page);
  });

  test('should have the correct title', async () => {
    await mainPage.navigateToMainPage();
    await expect(mainPage.page).toHaveTitle('Vite + React + TS');
  });

  test('should display no results message for non-existing document', async () => {
    await mainPage.navigateToMainPage();
    await mainPage.searchForDocument('@#$');
    const noResultsMessage = await mainPage.getNoResultsFoundMessage();
    expect(noResultsMessage).toContain('No documents found matching');
  });

  test('should display document list for existing document', async () => {
    await mainPage.navigateToMainPage();
    await mainPage.searchForDocument('Contract');
    const documentList = await mainPage.getDocumentList();
    expect(documentList.length).toBeGreaterThan(0);
  });

  test('should display no results message for empty search', async () => {
    await mainPage.navigateToMainPage();
    await mainPage.searchForDocument('  ');
    const noResultsMessage = await mainPage.getNoResultsFoundMessage();
    expect(noResultsMessage).toContain('No documents found matching');
  });

  test("Should search for a document with leading and trailing spaces and display results", async () => {
    await mainPage.navigateToMainPage();
    await mainPage.searchForDocument('  law  ');
    const documentList = await mainPage.getDocumentList();
    expect(documentList.length).toBeGreaterThan(0);
    expect(await mainPage.isResultRendered()).toBeTruthy();
  });


  test("Should search for a document with mixed case and display results", async () => {
    await mainPage.navigateToMainPage();
    await mainPage.searchForDocument('CoNTracT');
    const documentList = await mainPage.getDocumentList();
    expect(documentList.length).toBeGreaterThan(0);
  });

  test("Should search for a document with partial name and display results", async () => {
    await mainPage.navigateToMainPage();
    await mainPage.searchForDocument('ney');
    const documentList = await mainPage.getDocumentList();
    expect(documentList.length).toBeGreaterThan(0);
  });

  test("Should search for a document with non-existing name and display no results message", async () => {
    await mainPage.navigateToMainPage();
    await mainPage.searchForDocument('No Document');
    const noResultsMessage = await mainPage.getNoResultsFoundMessage();
    expect(noResultsMessage).toContain('No documents found matching');
  });

  test("Search with SQL injection should not break the application and display no results message", async () => {
    await mainPage.navigateToMainPage();
    await mainPage.searchForDocument("admin' --");
    const noResultsMessage = await mainPage.getNoResultsFoundMessage();
    expect(noResultsMessage).toContain('No documents found matching');
  });

  test("Search button is disabled until input is entered", async () => {
    await mainPage.navigateToMainPage();
    expect(await mainPage.searchButton.isDisabled()).toBeTruthy();
    await mainPage.searchForDocument('case');
    expect(await mainPage.searchButton.isDisabled()).toBeFalsy();
  });
   

});