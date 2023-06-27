import { QueueWorker, QueueWorkerRawMessage, QueueWorkerProcess } from "@anchan828/nest-cloud-run-queue-worker";

@QueueWorker("tasks")
export class TasksWorker {
  @QueueWorkerProcess()
  public async process(message: string, raw: QueueWorkerRawMessage): Promise<void> {
    console.log("タスクを受け取りました。");
    console.log("tasks", message, raw);
  }
}
