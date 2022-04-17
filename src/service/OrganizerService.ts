import Organizer from '../model/Organizer';
import { OrganizerRepository } from '../repository/OrganizerRepository';

export default class OrganizerService {
  constructor(private organizerRepository: OrganizerRepository) {}

  public async save(organizer: Organizer): Promise<Organizer> {
    await this.organizerRepository.save(organizer);
    return organizer;
  }
  public async findById(id: string): Promise<Organizer | undefined> {
    return this.organizerRepository.findById(id);
  }
}
