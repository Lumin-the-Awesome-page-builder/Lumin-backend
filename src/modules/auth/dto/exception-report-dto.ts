export default class ExceptionReportDto {
  constructor(
    public errorType: string,
    public message: string,
    public errorCode: string,
    public userAgent: string,
    public url: string,
    public stack: string,
  ) {}
}
