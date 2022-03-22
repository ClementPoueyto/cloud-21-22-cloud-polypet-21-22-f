export class DiscountDto {
    
    percentage: number;
    priceAfterReduction: number;
    end : Date


    constructor(percentage : number, priceAfterReduction : number, end : Date){
        this.percentage = percentage
        this.priceAfterReduction = priceAfterReduction
        this.end = end;
    }
}