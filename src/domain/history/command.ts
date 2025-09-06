export interface Command {
  do(): void;
  undo(): void;
  tittle: string;
}