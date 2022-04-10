import { Organizer } from '../model/Organizer';
import { OrganizerRepository } from '../repository/OrganizerRepository';

export class OrganizerService {
  constructor(private organizerRepository: OrganizerRepository) {}

  public async save(organizer: Organizer): Promise<Organizer> {
    return this.organizerRepository.save(organizer).then(() => organizer);
  }
}
