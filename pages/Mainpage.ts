import{Locator,Page} from "@playwright/test";

export class MainPage{
    readonly page:Page;
    readonly searchInput:Locator;
    readonly searchButton:Locator;
    readonly noResultsFoundMessage:Locator;
    readonly documentList:Locator;
    readonly resultRendered:Locator;

    constructor(page:Page){
        this.page=page;
        this.searchInput=page.getByRole('searchbox', { name: 'Search for legal documents...' });
        this.searchButton=page.getByRole('button', { name: 'Search' });
        this.noResultsFoundMessage=page.locator("//div[contains(@class,'mt-8 p-8')]");
        this.documentList=page.locator("div.mt-6.p-4");
        this.resultRendered=page.locator("input[type='search']");
    }

    async navigateToMainPage(){
        await this.page.goto('http://localhost:3001/');
    }   

    async searchForDocument(documentName:string){
        await this.searchInput.fill(documentName);
        await this.searchButton.click();
    }
    async getNoResultsFoundMessage(){
        return await this.noResultsFoundMessage.textContent();
    }
    async getDocumentList(){
        return await this.documentList.allTextContents();
    }  
    
    async isResultRendered(){
        return await this.resultRendered.isVisible();
    }
}