export interface DrtpsConfig {

    logo ?: File[]|string,
    validityTimeInMonths: number,
    processingTimeInDays: number,
    header: string,
    footer: string
  }
  export interface AjeConfig{

   logo?:File[]|string,
  validityTimeInMonthsForLiquidation?: number,
  validityTimeInMonthsForSoumission?: number,
  header?:string,
  footer?:string,
  processingTimeInDaysForLiquidation?:number,
  processingTimeInDaysForSoumission?:number
}