export class EmailDataDto {
  fromAddress: string;
  toAddress: string;
  ccAddress?: string;
  bccAddress?: string;
  subject?: string;
  content: string;
  mailFormat?: 'html' | 'plaintext';
  askReceipt?: 'yes' | 'no';
  encoding?: string;
  isSchedule?: boolean;
  scheduleType?: 1 | 2 | 3 | 4 | 5 | 6;
  timeZone?: string;
  scheduleTime?: string;
}
