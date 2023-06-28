import { QueueWorker, QueueWorkerRawMessage, QueueWorkerProcess } from "@anchan828/nest-cloud-run-queue-worker";

@QueueWorker("tasks")
export class TasksWorker {
  @QueueWorkerProcess()
  public async process(message: string, raw: QueueWorkerRawMessage): Promise<void> {
    console.log("[ワーカープロセス] タスクを受け取りました");
    console.log("tasks", message, raw);
  }
}

@QueueWorker("tasks2")
export class TasksWorker2 {
  @QueueWorkerProcess()
  public async process(message: string, raw: QueueWorkerRawMessage): Promise<void> {
    console.log("[ワーカープロセス2] タスクを受け取りました");
    console.log("tasks2", message, raw);
  }
}
