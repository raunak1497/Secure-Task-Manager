export class CreateTaskDto {
  title!: string;
  description?: string;
  category?: string; // e.g. "Work", "Personal"
}