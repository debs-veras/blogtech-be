import { ActivityRepository } from "repositories/activity.repository";

export class ActivityService {
  static async getRecentActivities(limit = 10, authorId?: string) {
    return ActivityRepository.findRecent(limit, authorId);
  }

  static buildDescription(
    userName: string,
    action: string,
    entity: string,
    title?: string,
  ) {
    const actions: any = {
      create: "criou",
      update: "atualizou",
      delete: "deletou",
      publish: "publicou ou despublicou",
    };

    return `${userName} ${actions[action]} o ${entity} "${title}"`;
  }
}
