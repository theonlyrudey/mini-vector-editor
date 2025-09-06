import { type Command } from "./command.ts";

export class History {
  private undoStack: Command[] = [];
  private redoStack: Command[] = [];

  execute(cmd: Command): void {
    cmd.do();
    this.undoStack.push(cmd);
    this.redoStack.length = 0;
  }

  undo(): void {
    const c = this.undoStack.pop();
    if (!c) return;
    c.undo();
    this.redoStack.push(c);
  }

  redo(): void {
    const c = this.redoStack.pop();
    if (!c) return;
    c.do();
    this.undoStack.push(c);
  }
}